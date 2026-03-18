import React, { useState, useEffect } from 'react';

export default function CurrentCard({ card }) {
  const [revealed, setRevealed] = useState(false);

  // Reset when a new card arrives
  useEffect(() => {
    setRevealed(false);
  }, [card?.id]);

  if (!card) return null;

  return (
    <div className="bg-gradient-to-br from-purple-800 to-pink-800 rounded-2xl p-6 text-center shadow-2xl">
      <div className="text-4xl mb-3">🎵</div>

      {revealed ? (
        <>
          <h2 className="text-2xl font-black mb-1">{card.title}</h2>
          <p className="text-purple-200 text-lg">{card.artist}</p>
          <p className="text-purple-300/60 text-sm mt-3">Quelle année ?</p>
        </>
      ) : (
        <>
          <p className="text-purple-300/70 text-sm mb-3">Écoute la chanson, puis retourne la carte</p>
          <button
            onClick={() => setRevealed(true)}
            className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-full font-semibold transition-colors text-sm"
          >
            Retourner la carte
          </button>
        </>
      )}
    </div>
  );
}
