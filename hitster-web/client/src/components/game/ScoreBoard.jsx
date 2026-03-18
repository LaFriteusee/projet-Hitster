import React from 'react';

export default function ScoreBoard({ players, currentPlayerId }) {
  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-gray-800 rounded-xl p-3 shadow">
      <h3 className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Scores</h3>
      <ul className="space-y-1">
        {sorted.map(p => (
          <li
            key={p.id}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${p.id === currentPlayerId ? 'bg-purple-900/50 border border-purple-700/50' : 'bg-gray-700/50'}`}
          >
            <span className="font-medium truncate max-w-[120px]">{p.name}</span>
            <span className="font-bold text-yellow-400 ml-2">{p.score}/10</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
