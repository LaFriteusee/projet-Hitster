import React, { useState } from 'react';
import socket from '../socket';
import useGameStore from '../store/gameStore';

const GENRE_OPTIONS = [
  { id: 'rock',     label: '🎸 Rock' },
  { id: 'pop',      label: '🎤 Pop' },
  { id: 'hiphop',   label: '🎧 Hip-Hop' },
  { id: 'electro',  label: '🎹 Électro' },
  { id: 'rnb',      label: '🎷 R&B / Soul' },
  { id: 'francais', label: '🇫🇷 Français' },
];

export default function HomePage() {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [tab, setTab] = useState('create'); // 'create' | 'join'
  const [selectedGenres, setSelectedGenres] = useState(GENRE_OPTIONS.map(g => g.id));
  const { error, clearError, setIdentity } = useGameStore();

  const toggleGenre = (id) => {
    setSelectedGenres(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim() || selectedGenres.length === 0) return;
    clearError();
    setIdentity(null, name.trim());
    socket.emit('room:create', { playerName: name.trim(), genres: selectedGenres });
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;
    clearError();
    setIdentity(null, name.trim());
    socket.emit('room:join', { roomCode: code.trim().toUpperCase(), playerName: name.trim() });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-5xl font-black text-center mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Hitster
        </h1>
        <p className="text-center text-gray-400 mb-8">Classe les hits dans le bon ordre !</p>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-300 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="flex rounded-lg overflow-hidden mb-6 border border-gray-700">
          <button
            onClick={() => setTab('create')}
            className={`flex-1 py-3 font-semibold transition-colors ${tab === 'create' ? 'bg-purple-700 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
          >
            Créer une partie
          </button>
          <button
            onClick={() => setTab('join')}
            className={`flex-1 py-3 font-semibold transition-colors ${tab === 'join' ? 'bg-purple-700 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
          >
            Rejoindre
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Ton prénom</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={20}
              placeholder="ex: Alex"
              className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {tab === 'create' && (
            <div className="mb-5">
              <label className="block text-sm text-gray-400 mb-2">Genres musicaux</label>
              <div className="grid grid-cols-2 gap-2">
                {GENRE_OPTIONS.map(g => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => toggleGenre(g.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                      selectedGenres.includes(g.id)
                        ? 'bg-purple-700 text-white'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
              {selectedGenres.length === 0 && (
                <p className="text-red-400 text-xs mt-2">Sélectionne au moins un genre.</p>
              )}
            </div>
          )}

          {tab === 'join' && (
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">Code de la salle</label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                maxLength={4}
                placeholder="ex: ABCD"
                className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 uppercase tracking-widest text-lg font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}

          {tab === 'create' ? (
            <button
              onClick={handleCreate}
              disabled={!name.trim() || selectedGenres.length === 0}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
            >
              Créer la partie
            </button>
          ) : (
            <button
              onClick={handleJoin}
              disabled={!name.trim() || !code.trim()}
              className="w-full py-3 bg-pink-600 hover:bg-pink-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
            >
              Rejoindre
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
