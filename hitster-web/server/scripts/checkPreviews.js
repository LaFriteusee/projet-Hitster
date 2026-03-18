require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

async function getToken() {
  const creds = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
  const res = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
    headers: { Authorization: `Basic ${creds}`, 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return res.data.access_token;
}

async function fetchTracks(ids, token) {
  const res = await axios.get('https://api.spotify.com/v1/tracks', {
    headers: { Authorization: `Bearer ${token}` },
    params: { ids: ids.join(',') },
  });
  return res.data.tracks;
}

// Search Spotify for a song and return first result with a preview
async function searchWithPreview(query, token) {
  const res = await axios.get('https://api.spotify.com/v1/search', {
    headers: { Authorization: `Bearer ${token}` },
    params: { q: query, type: 'track', limit: 10 },
  });
  const tracks = res.data.tracks.items;
  return tracks.find(t => t.preview_url) || null;
}

async function main() {
  const token = await getToken();
  const songs = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/songs.json'), 'utf-8'));

  console.log(`Vérification de ${songs.length} chansons...\n`);

  const withPreview = [];
  const without = [];

  // Batch fetch current songs
  const BATCH = 50;
  for (let i = 0; i < songs.length; i += BATCH) {
    const batch = songs.slice(i, i + BATCH);
    const ids = batch.map(s => s.spotifyTrackId);
    const tracks = await fetchTracks(ids, token);
    for (let j = 0; j < batch.length; j++) {
      const track = tracks[j];
      if (track && track.preview_url) {
        withPreview.push({ ...batch[j], spotifyTrackId: track.id });
        process.stdout.write(`✅ ${batch[j].title} — ${batch[j].artist}\n`);
      } else {
        without.push(batch[j]);
        process.stdout.write(`❌ ${batch[j].title} — ${batch[j].artist}\n`);
      }
    }
  }

  console.log(`\n✅ Avec preview: ${withPreview.length}`);
  console.log(`❌ Sans preview: ${without.length}`);

  // Try to find replacement for songs without preview
  console.log('\nRecherche de remplaçants...');
  for (const song of without) {
    const query = `${song.title} ${song.artist}`;
    try {
      const found = await searchWithPreview(query, token);
      if (found) {
        const year = found.album.release_date ? parseInt(found.album.release_date.slice(0, 4)) : song.year;
        withPreview.push({
          spotifyTrackId: found.id,
          title: found.name,
          artist: found.artists.map(a => a.name).join(', '),
          year: song.year, // keep original year
        });
        console.log(`🔄 Remplacé: ${song.title} → ${found.name} (${found.artists[0].name})`);
      } else {
        console.log(`⚠️  Pas de remplaçant trouvé pour: ${song.title}`);
      }
    } catch (e) {
      console.log(`⚠️  Erreur pour ${song.title}: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 200)); // rate limit
  }

  // Remove duplicates by spotifyTrackId
  const unique = [];
  const seen = new Set();
  for (const s of withPreview) {
    if (!seen.has(s.spotifyTrackId)) {
      seen.add(s.spotifyTrackId);
      unique.push(s);
    }
  }

  const output = path.join(__dirname, '../data/songs.json');
  fs.writeFileSync(output, JSON.stringify(unique, null, 2));
  console.log(`\n✅ songs.json mis à jour avec ${unique.length} chansons (toutes avec preview)`);
}

main().catch(console.error);
