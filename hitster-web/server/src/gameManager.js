const { shuffle } = require('./utils/shuffle');
const songsData = require('../data/songs.json');
const { getPreviewUrl } = require('./previewCache');

const WIN_SCORE = 10;

function isPlacementCorrect(timeline, card, position) {
  // position = index where the card is inserted
  // timeline is sorted ascending by year
  const before = timeline[position - 1];
  const after = timeline[position];

  if (before && card.year < before.year) return false;
  if (after && card.year > after.year) return false;
  return true;
}

function startGame(room) {
  const genres = new Set(room.genres);
  const deck = shuffle(
    songsData
      .filter(song => genres.has(song.genre))
      .filter(song => getPreviewUrl(song.deezerId) !== null)
      .map(song => ({
        id: song.deezerId,
        title: song.title,
        artist: song.artist,
        year: song.year,
        previewUrl: `/api/preview/${song.deezerId}`,
      }))
  );

  room.deck = deck;
  room.status = 'playing';
  room.currentPlayerIndex = 0;
  room.lastActivity = Date.now();

  // Reset player state
  for (const player of room.players.values()) {
    player.score = 0;
    player.timeline = [];
  }

  room.currentCard = room.deck.shift();
  return room.currentCard;
}

function placeCard(room, playerId, position) {
  const player = room.players.get(playerId);
  if (!player) return { error: 'Joueur introuvable.' };

  const currentPlayerId = room.playerOrder[room.currentPlayerIndex];
  if (playerId !== currentPlayerId) return { error: "Ce n'est pas ton tour." };

  const card = room.currentCard;
  if (!card) return { error: 'Aucune carte en cours.' };

  const correct = isPlacementCorrect(player.timeline, card, position);

  if (correct) {
    // Insert card into timeline at position
    player.timeline.splice(position, 0, card);
    player.score += 1;
  }
  // If wrong, card goes back to bottom of deck (shuffle it back)
  else {
    const insertAt = Math.floor(Math.random() * (room.deck.length + 1));
    room.deck.splice(insertAt, 0, card);
  }

  room.currentCard = null;

  // Check win
  const winner = player.score >= WIN_SCORE ? player : null;

  if (!winner) {
    // Advance turn
    room.currentPlayerIndex = (room.currentPlayerIndex + 1) % room.playerOrder.length;
    // Draw next card
    if (room.deck.length > 0) {
      room.currentCard = room.deck.shift();
    }
  } else {
    room.status = 'finished';
  }

  room.lastActivity = Date.now();

  return {
    correct,
    year: card.year,
    title: card.title,
    artist: card.artist,
    winner,
    nextPlayerId: winner ? null : room.playerOrder[room.currentPlayerIndex],
    nextCard: room.currentCard,
  };
}

function getPublicCard(card) {
  if (!card) return null;
  const { year: _year, ...rest } = card; // strip year
  return rest;
}

function getGameState(room) {
  return {
    roomCode: room.code,
    status: room.status,
    players: Array.from(room.players.values()),
    currentPlayerId: room.playerOrder[room.currentPlayerIndex],
    deckSize: room.deck.length,
    currentTurn: room.currentCard
      ? { card: getPublicCard(room.currentCard), playerId: room.playerOrder[room.currentPlayerIndex] }
      : null,
  };
}

module.exports = { startGame, placeCard, getPublicCard, getGameState };
