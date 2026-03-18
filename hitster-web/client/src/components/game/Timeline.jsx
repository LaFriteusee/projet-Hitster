import React from 'react';
import socket from '../../socket';

function TimelineCard({ card }) {
  return (
    <div className="flex-shrink-0 w-28 bg-gray-700 rounded-lg p-2 text-center shadow">
      <div className="text-yellow-400 font-bold text-sm">{card.year}</div>
      <div className="text-xs text-white font-semibold mt-1 leading-tight line-clamp-2">{card.title}</div>
      <div className="text-xs text-gray-400 mt-1 line-clamp-1">{card.artist}</div>
    </div>
  );
}

function TimelineSlot({ position, isMyTurn }) {
  const handleClick = () => {
    if (!isMyTurn) return;
    socket.emit('turn:place_card', { position });
  };

  if (!isMyTurn) {
    return <div className="w-2 flex-shrink-0" />;
  }

  return (
    <button
      onClick={handleClick}
      className="flex-shrink-0 w-8 flex items-center justify-center group"
      title={`Placer ici (position ${position})`}
    >
      <div className="w-1 h-16 bg-gray-600 group-hover:bg-yellow-400 group-hover:w-2 rounded-full transition-all duration-150" />
    </button>
  );
}

export default function Timeline({ timeline, isMyTurn }) {
  // Alternating: slot, card, slot, card, ..., slot
  // positions: 0 = before first card, 1 = after first card, etc.

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center min-w-max gap-1 px-2">
        {timeline.length === 0 ? (
          <TimelineSlot position={0} isMyTurn={isMyTurn} />
        ) : (
          <>
            <TimelineSlot position={0} isMyTurn={isMyTurn} />
            {timeline.map((card, i) => (
              <React.Fragment key={card.id + i}>
                <TimelineCard card={card} />
                <TimelineSlot position={i + 1} isMyTurn={isMyTurn} />
              </React.Fragment>
            ))}
          </>
        )}
      </div>
      {timeline.length === 0 && isMyTurn && (
        <p className="text-center text-gray-500 text-xs mt-2">
          Clique sur le trait pour placer ta première carte
        </p>
      )}
    </div>
  );
}
