require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, PORT = 3001 } = process.env;
if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
  console.error('❌  Manque SPOTIFY_CLIENT_ID ou SPOTIFY_CLIENT_SECRET dans .env');
  process.exit(1);
}

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const registerHandlers = require('./socketHandlers');

const app = express();
const corsOrigin = /^http:\/\/localhost:\d+$/;
app.use(cors({ origin: corsOrigin }));
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: corsOrigin, methods: ['GET', 'POST'] },
});

registerHandlers(io);

httpServer.listen(PORT, () => {
  console.log(`✅  Serveur Hitster lancé sur http://localhost:${PORT}`);
});
