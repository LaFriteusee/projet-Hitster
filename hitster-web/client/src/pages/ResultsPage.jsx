import React from 'react';
import { useNavigate } from 'react-router-dom';
import useGameStore from '../store/gameStore';

export default function ResultsPage() {
  const { winner, finalScores, reset } = useGameStore();
  const navigate = useNavigate();

  const handlePlayAgain = () => {
    reset();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
            {winner?.name} gagne !
          </h1>
          <p className="text-gray-400">avec {winner?.score} carte{winner?.score > 1 ? 's' : ''} placée{winner?.score > 1 ? 's' : ''}</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 mb-6 shadow-xl">
          <h2 className="text-sm text-gray-400 mb-3">Scores finaux</h2>
          <ul className="space-y-2">
            {finalScores.map((p, i) => (
              <li key={p.id} className="flex items-center gap-3 bg-gray-700 rounded-lg px-4 py-3">
                <span className="text-xl w-8 text-center">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}</span>
                <span className="font-semibold flex-1">{p.name}</span>
                <span className="font-bold text-yellow-400">{p.score} pt{p.score > 1 ? 's' : ''}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handlePlayAgain}
          className="w-full py-4 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-lg transition-colors"
        >
          Rejouer
        </button>
      </div>
    </div>
  );
}
