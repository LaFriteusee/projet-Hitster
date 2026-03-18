const axios = require('axios');

/**
 * Fetch preview URLs for a list of Deezer track IDs.
 * Returns a Map<deezerId, previewUrl|null>
 */
async function fetchPreviewUrls(deezerIds) {
  const result = new Map();
  const BATCH_SIZE = 10;

  for (let i = 0; i < deezerIds.length; i += BATCH_SIZE) {
    const batch = deezerIds.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(async (id) => {
      try {
        const res = await axios.get(`https://api.deezer.com/track/${id}`);
        result.set(id, res.data.preview || null);
      } catch {
        result.set(id, null);
      }
    }));
    // Small delay between batches to respect rate limit
    if (i + BATCH_SIZE < deezerIds.length) {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  return result;
}

module.exports = { fetchPreviewUrls };
