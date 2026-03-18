const axios = require('axios');

let cachedToken = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;

  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error('SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set in .env');
  }

  const credentials = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    { headers: { Authorization: `Basic ${credentials}`, 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  cachedToken = response.data.access_token;
  tokenExpiresAt = Date.now() + response.data.expires_in * 1000 - 60_000; // 1min buffer
  return cachedToken;
}

/**
 * Fetch preview URLs for a list of Spotify track IDs.
 * Returns a Map<trackId, previewUrl|null>
 */
async function fetchPreviewUrls(trackIds) {
  const token = await getAccessToken();
  const result = new Map();
  const BATCH_SIZE = 50;

  for (let i = 0; i < trackIds.length; i += BATCH_SIZE) {
    const batch = trackIds.slice(i, i + BATCH_SIZE);
    try {
      const response = await axios.get('https://api.spotify.com/v1/tracks', {
        headers: { Authorization: `Bearer ${token}` },
        params: { ids: batch.join(',') },
      });
      for (const track of response.data.tracks) {
        if (track) result.set(track.id, track.preview_url || null);
      }
    } catch (err) {
      // If token expired mid-game, clear cache and retry once
      if (err.response?.status === 401) {
        cachedToken = null;
        const freshToken = await getAccessToken();
        const retry = await axios.get('https://api.spotify.com/v1/tracks', {
          headers: { Authorization: `Bearer ${freshToken}` },
          params: { ids: batch.join(',') },
        });
        for (const track of retry.data.tracks) {
          if (track) result.set(track.id, track.preview_url || null);
        }
      } else {
        console.error('Spotify batch fetch error:', err.message);
        for (const id of batch) result.set(id, null);
      }
    }
  }

  return result;
}

module.exports = { fetchPreviewUrls };
