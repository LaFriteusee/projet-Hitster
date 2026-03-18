const { createRoom, getRoom, joinRoom, removePlayer, getPlayers } = require('./roomManager');
const { startGame, placeCard, getPublicCard, getGameState } = require('./gameManager');

module.exports = function registerHandlers(io) {
  io.on('connection', (socket) => {
    let currentRoomCode = null;

    socket.on('room:create', ({ playerName, genres }) => {
      if (!playerName?.trim()) return socket.emit('room:error', { message: 'Nom invalide.' });
      const room = createRoom(socket.id, playerName.trim(), genres);
      currentRoomCode = room.code;
      socket.join(room.code);
      socket.emit('room:created', { roomCode: room.code, playerId: socket.id, playerName: playerName.trim(), genres: room.genres });
    });

    socket.on('room:join', ({ roomCode, playerName }) => {
      if (!playerName?.trim() || !roomCode?.trim()) return socket.emit('room:error', { message: 'Données invalides.' });
      const result = joinRoom(roomCode.trim(), socket.id, playerName.trim());
      if (result.error) return socket.emit('room:error', { message: result.error });

      const { room } = result;
      currentRoomCode = room.code;
      socket.join(room.code);

      const players = getPlayers(room);
      socket.emit('room:joined', { roomCode: room.code, playerId: socket.id, players, genres: room.genres });
      socket.to(room.code).emit('room:updated', { players });
    });

    socket.on('game:start', () => {
      const room = getRoom(currentRoomCode);
      if (!room) return socket.emit('room:error', { message: 'Salle introuvable.' });
      if (room.hostId !== socket.id) return socket.emit('room:error', { message: 'Seul le créateur peut démarrer.' });
      if (room.status !== 'lobby') return socket.emit('room:error', { message: 'Partie déjà démarrée.' });
      if (room.players.size < 1) return socket.emit('room:error', { message: 'Pas assez de joueurs.' });

      startGame(room);
      const gameState = getGameState(room);
      io.to(room.code).emit('game:started', { gameState });
      io.to(room.code).emit('turn:started', {
        card: getPublicCard(room.currentCard),
        playerId: room.playerOrder[room.currentPlayerIndex],
      });
    });

    socket.on('turn:place_card', ({ position }) => {
      const room = getRoom(currentRoomCode);
      if (!room) return socket.emit('room:error', { message: 'Salle introuvable.' });
      if (room.status !== 'playing') return socket.emit('room:error', { message: 'La partie n\'est pas en cours.' });

      const result = placeCard(room, socket.id, position);
      if (result.error) return socket.emit('room:error', { message: result.error });

      const { correct, year, title, artist, winner, nextPlayerId, nextCard } = result;
      const updatedPlayers = getPlayers(room);

      io.to(room.code).emit('turn:result', { correct, year, title, artist, updatedPlayers, nextPlayerId });

      if (winner) {
        io.to(room.code).emit('game:over', {
          winner,
          finalScores: updatedPlayers.sort((a, b) => b.score - a.score),
        });
      } else if (nextCard) {
        io.to(room.code).emit('turn:started', {
          card: getPublicCard(nextCard),
          playerId: nextPlayerId,
        });
      }
    });

    socket.on('disconnect', () => {
      if (!currentRoomCode) return;
      const result = removePlayer(currentRoomCode, socket.id);
      if (!result) return;

      const { room, newHostId } = result;
      const players = getPlayers(room);

      if (newHostId) {
        io.to(room.code).emit('room:host_changed', { newHostId });
      }
      io.to(room.code).emit('room:updated', { players });
    });
  });
};
