import { create } from 'zustand';

const useGameStore = create((set) => ({
  // Identity
  playerId: null,
  playerName: null,

  // Room
  roomCode: null,
  players: [],
  genres: [],

  // Game
  status: 'idle', // idle | lobby | playing | finished
  currentPlayerId: null,
  deckSize: 0,

  // Current turn
  currentCard: null,   // { id, title, artist, previewUrl }
  currentTurnPlayerId: null,

  // End of turn feedback
  lastResult: null,    // { correct, year } — cleared on next turn

  // End of game
  winner: null,
  finalScores: [],

  // Error
  error: null,

  // Actions
  setIdentity: (playerId, playerName) => set({ playerId, playerName }),
  setRoom: (roomCode, genres) => set({ roomCode, genres: genres ?? [], status: 'lobby', error: null }),
  setPlayers: (players) => set({ players }),
  setGameState: (gameState) => set({
    status: gameState.status,
    players: gameState.players,
    currentPlayerId: gameState.currentPlayerId,
    deckSize: gameState.deckSize,
  }),
  setTurnStarted: (card, playerId) => set({
    currentCard: card,
    currentTurnPlayerId: playerId,
    lastResult: null,
  }),
  applyTurnResult: (result) => set((state) => {
    const { correct, year, title, artist, updatedPlayers, nextPlayerId } = result;
    const myPlayer = updatedPlayers.find(p => p.id === state.playerId);
    return {
      players: updatedPlayers,
      lastResult: { correct, year, title, artist },
      currentPlayerId: nextPlayerId,
      deckSize: state.deckSize - (correct ? 0 : 0), // server tracks this
      // Update my timeline locally from server data
      myTimeline: myPlayer?.timeline ?? state.myTimeline,
    };
  }),
  setGameOver: (winner, finalScores) => set({ status: 'finished', winner, finalScores }),
  setError: (message) => set({ error: message }),
  clearError: () => set({ error: null }),
  reset: () => set({
    roomCode: null, players: [], status: 'idle', currentPlayerId: null,
    deckSize: 0, currentCard: null, currentTurnPlayerId: null,
    lastResult: null, winner: null, finalScores: [], error: null,
  }),
}));

export default useGameStore;
