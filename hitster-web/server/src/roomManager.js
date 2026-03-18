const { generateCode } = require('./utils/codeGenerator');

const rooms = new Map(); // code -> room

function createRoom(hostId, hostName) {
  const code = generateCode(new Set(rooms.keys()));
  const room = {
    code,
    hostId,
    status: 'lobby',
    players: new Map([[hostId, { id: hostId, name: hostName, isHost: true, score: 0, timeline: [] }]]),
    deck: [],
    currentPlayerIndex: 0,
    currentCard: null,
    playerOrder: [hostId],
    lastActivity: Date.now(),
  };
  rooms.set(code, room);
  return room;
}

function getRoom(code) {
  return rooms.get(code.toUpperCase()) || null;
}

function joinRoom(code, playerId, playerName) {
  const room = getRoom(code);
  if (!room) return { error: 'Salle introuvable.' };
  if (room.status !== 'lobby') return { error: 'La partie a déjà commencé.' };
  if (room.players.size >= 8) return { error: 'La salle est pleine (max 8 joueurs).' };
  if (room.players.has(playerId)) return { room }; // reconnect

  room.players.set(playerId, { id: playerId, name: playerName, isHost: false, score: 0, timeline: [] });
  room.playerOrder.push(playerId);
  room.lastActivity = Date.now();
  return { room };
}

function removePlayer(code, playerId) {
  const room = getRoom(code);
  if (!room) return null;

  room.players.delete(playerId);
  room.playerOrder = room.playerOrder.filter(id => id !== playerId);

  if (room.players.size === 0) {
    rooms.delete(code);
    return null;
  }

  // Promote new host if needed
  let newHostId = null;
  if (room.hostId === playerId) {
    newHostId = room.playerOrder[0];
    room.hostId = newHostId;
    room.players.get(newHostId).isHost = true;
  }

  // Fix currentPlayerIndex bounds
  if (room.playerOrder.length > 0) {
    room.currentPlayerIndex = room.currentPlayerIndex % room.playerOrder.length;
  }

  room.lastActivity = Date.now();
  return { room, newHostId };
}

function getPlayers(room) {
  return Array.from(room.players.values());
}

// Clean up idle rooms every 5 minutes
setInterval(() => {
  const THIRTY_MIN = 30 * 60 * 1000;
  const now = Date.now();
  for (const [code, room] of rooms) {
    if (now - room.lastActivity > THIRTY_MIN) {
      rooms.delete(code);
    }
  }
}, 5 * 60 * 1000);

module.exports = { createRoom, getRoom, joinRoom, removePlayer, getPlayers };
