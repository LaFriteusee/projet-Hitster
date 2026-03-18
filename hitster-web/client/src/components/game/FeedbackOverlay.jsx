import React, { useEffect, useState } from 'react';

export default function FeedbackOverlay({ result, onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!result) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, 1800);
    return () => clearTimeout(t);
  }, [result]);

  if (!result || !visible) return null;

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center z-50 transition-opacity duration-300 ${result.correct ? 'bg-green-900/90' : 'bg-red-900/90'}`}
    >
      <div className="text-7xl mb-4">{result.correct ? '✅' : '❌'}</div>
      <div className="text-3xl font-black mb-2">{result.correct ? 'Bien joué !' : 'Raté !'}</div>
      <div className="text-xl text-white/80 mb-1">
        C'était <span className="font-bold text-white">{result.year}</span>
      </div>
      <div className="text-lg font-bold text-white mt-2">{result.title}</div>
      <div className="text-sm text-white/70">{result.artist}</div>
    </div>
  );
}
