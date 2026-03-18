import React from 'react';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';

export default function AudioPlayer({ previewUrl }) {
  const { isPlaying, progress, duration, toggle } = useAudioPlayer(previewUrl);

  if (!previewUrl) {
    return (
      <div className="bg-gray-700 rounded-xl p-4 text-center text-gray-400 text-sm">
        Aucun aperçu disponible — place la carte selon le titre et l'artiste
      </div>
    );
  }

  const pct = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="bg-gray-700 rounded-xl p-4">
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className="w-12 h-12 flex items-center justify-center bg-purple-600 hover:bg-purple-500 rounded-full text-xl transition-colors flex-shrink-0"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <div className="flex-1">
          <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-400 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{Math.floor(progress)}s</span>
            <span>{Math.floor(duration)}s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
