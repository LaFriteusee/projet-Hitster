import React from 'react';
import socket from '../socket';
import useGameStore from '../store/gameStore';

const GENRE_LABELS = {
  rock:     '🎸 Rock',
  pop:      '🎤 Pop',
  hiphop:   '🎧 Hip-Hop',
  electro:  '🎹 Électro',
  rnb:      '🎷 R&B / Soul',
  francais: '🇫🇷 Français',
};

export default function LobbyPage() {
  const { roomCode, players, playerId, genres, error } = useGameStore();
  const me = players.find(p => p.id === playerId);
  const isHost = me?.isHost;

  const handleStart = () => {
    socket.emit('game:start');
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode || '').catch(() => {});
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-black text-center mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Hitster
        </h1>

        {/* Room code */}
        <div className="bg-gray-800 rounded-xl p-6 mb-4 text-center shadow-xl">
          <p className="text-gray-400 text-sm mb-2">Code de la salle</p>
          <button
            onClick={copyCode}
            className="text-5xl font-black tracking-widest font-mono text-yellow-400 hover:text-yellow-300 transition-colors"
            title="Cliquer pour copier"
          >
            {roomCode}
          </button>
          <p className="text-gray-500 text-xs mt-2">Partage ce code avec tes amis</p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-300 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Genres */}
        {genres && genres.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-4 mb-4 shadow-xl">
            <h2 className="text-sm text-gray-400 mb-3">Genres sélectionnés</h2>
            <div className="flex flex-wrap gap-2">
              {genres.map(g => (
                <span key={g} className="px-3 py-1 bg-purple-700/60 text-purple-200 rounded-full text-sm font-medium">
                  {GENRE_LABELS[g] ?? g}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Player list */}
        <div className="bg-gray-800 rounded-xl p-4 mb-4 shadow-xl">
          <h2 className="text-sm text-gray-400 mb-3">Joueurs ({players.length})</h2>
          <ul className="space-y-2">
            {players.map(p => (
              <li key={p.id} className="flex items-center gap-3 bg-gray-700 rounded-lg px-4 py-3">
                <span className="text-2xl">{p.isHost ? '👑' : '🎵'}</span>
                <span className="font-semibold">{p.name}</span>
                {p.id === playerId && <span className="ml-auto text-xs text-gray-400">(toi)</span>}
              </li>
            ))}
          </ul>
        </div>

        {isHost ? (
          <button
            onClick={handleStart}
            disabled={players.length < 1}
            className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-bold text-lg transition-colors"
          >
            Lancer la partie !
          </button>
        ) : (
          <div className="text-center text-gray-500 animate-pulse">
            En attente que le créateur lance la partie...
          </div>
        )}
      </div>
    </div>
  );
}
