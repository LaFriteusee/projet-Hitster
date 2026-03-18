import React from 'react';

export default function TurnBanner({ isMyTurn, currentPlayerName }) {
  if (isMyTurn) {
    return (
      <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl px-4 py-3 text-center">
        <p className="text-yellow-300 font-bold text-lg">C'est ton tour !</p>
        <p className="text-yellow-400/70 text-sm">Écoute la chanson et place-la sur ta timeline</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-700/50 rounded-xl px-4 py-3 text-center">
      <p className="text-gray-300 font-semibold">
        <span className="text-purple-400">{currentPlayerName}</span> joue...
      </p>
    </div>
  );
}
