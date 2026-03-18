// Preview URLs are stored directly in songs.json (built by buildSongsFromDeezer.js).
// Re-run the build script when URLs expire (~1 week).

const songsData = require('../data/songs.json');

const previewMap = new Map(songsData.map(s => [s.deezerId, s.previewUrl || null]));

function initPreviewCache() {
  const count = [...previewMap.values()].filter(Boolean).length;
  console.log(`🎵  Preview cache: ${count}/${previewMap.size} URLs disponibles`);
  return Promise.resolve();
}

function getPreviewUrl(deezerId) {
  return previewMap.get(deezerId) || null;
}

module.exports = { initPreviewCache, getPreviewUrl };
