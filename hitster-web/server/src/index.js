require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const { PORT = 3003 } = process.env;

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const registerHandlers = require('./socketHandlers');
const { initPreviewCache } = require('./previewCache');

const app = express();
const corsOrigin = /^http:\/\/localhost:\d+$/;
app.use(cors({ origin: corsOrigin }));
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

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
