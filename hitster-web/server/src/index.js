require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const { PORT = 3003 } = process.env;

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const registerHandlers = require('./socketHandlers');
const { initPreviewCache, getPreviewUrl } = require('./previewCache');
const axios = require('axios');

const path = require('path');

const app = express();
const corsOrigin = (origin, cb) => cb(null, true); // localhost + ngrok
app.use(cors({ origin: corsOrigin }));
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Proxy audio Deezer (évite les problèmes CORS/CDN pour les clients ngrok)
app.get('/api/preview/:deezerId', async (req, res) => {
  const url = getPreviewUrl(Number(req.params.deezerId));
  if (!url) return res.status(404).end();
  try {
    const response = await axios.get(url, { responseType: 'stream', timeout: 10000 });
    res.setHeader('Content-Type', response.headers['content-type'] || 'audio/mpeg');
    if (response.headers['content-length']) {
      res.setHeader('Content-Length', response.headers['content-length']);
    }
    response.data.pipe(res);
  } catch {
    res.status(502).end();
  }
});

// Servir le client buildé (pour ngrok / prod)
const clientDist = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDist));
app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: corsOrigin, methods: ['GET', 'POST'] },
});

registerHandlers(io);

console.log('🎵  Chargement des previews Deezer...');
initPreviewCache().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`✅  Serveur Hitster lancé sur http://localhost:${PORT}`);
  });
});
