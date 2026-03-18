import React, { useState } from 'react';
import useGameStore from '../store/gameStore';
import AudioPlayer from '../components/game/AudioPlayer';
import CurrentCard from '../components/game/CurrentCard';
import Timeline from '../components/game/Timeline';
import TurnBanner from '../components/game/TurnBanner';
import FeedbackOverlay from '../components/game/FeedbackOverlay';

export default function GamePage() {
  const {
    playerId, players, currentCard, currentTurnPlayerId,
    lastResult, deckSize, error, clearError,
  } = useGameStore();

  const [feedbackResult, setFeedbackResult] = useState(null);

  const isMyTurn = playerId === currentTurnPlayerId;
  const me = players.find(p => p.id === playerId);
  const myTimeline = me?.timeline ?? [];
  const currentPlayer = players.find(p => p.id === currentTurnPlayerId);

  // Capture lastResult into local state so FeedbackOverlay shows for its full duration
  React.useEffect(() => {
    if (lastResult) setFeedbackResult(lastResult);
  }, [lastResult]);

  const otherPlayers = players.filter(p => p.id !== playerId);

  return (
    <div className="min-h-screen flex flex-col p-4 gap-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Hitster
        </h1>
        <span className="text-sm text-gray-500">{deckSize} cartes restantes</span>
      </div>

      {/* Turn banner */}
      <TurnBanner isMyTurn={isMyTurn} currentPlayerName={currentPlayer?.name} />

      {/* Current card + audio */}
      {currentCard && (
        <div className="space-y-3">
          <CurrentCard card={currentCard} />
          <AudioPlayer previewUrl={currentCard.previewUrl} />
        </div>
      )}

      {/* My timeline */}
      <div className="bg-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm text-gray-400">
            Ta timeline — {myTimeline.length} carte{myTimeline.length !== 1 ? 's' : ''}
          </h2>
          <span className="text-xs font-bold text-yellow-400">{me?.score ?? 0}/10</span>
        </div>
        <Timeline timeline={myTimeline} isMyTurn={isMyTurn} />
      </div>

      {/* Other players' timelines */}
      {otherPlayers.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm text-gray-400 uppercase tracking-wide">Timelines des autres</h2>
          {otherPlayers.map(p => (
            <div
              key={p.id}
              className={`bg-gray-800 rounded-xl p-3 ${p.id === currentTurnPlayerId ? 'ring-1 ring-purple-500' : ''}`}
            >
              <div className="flex items-center gap-2 mb-2">
                {p.id === currentTurnPlayerId && <span className="text-purple-400 text-xs">▶</span>}
                <span className="text-sm font-semibold text-white">{p.name}</span>
                <span className="text-xs text-yellow-400 font-bold ml-auto">{p.score}/10</span>
              </div>
              {p.timeline.length === 0 ? (
                <p className="text-xs text-gray-600 italic px-2">Aucune carte encore</p>
              ) : (
                <Timeline timeline={p.timeline} isMyTurn={false} compact />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Server error */}
      {error && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-800 text-white px-4 py-2 rounded-xl text-sm z-40 flex items-center gap-3">
          {error}
          <button onClick={clearError} className="ml-2 font-bold text-white/70 hover:text-white">✕</button>
        </div>
      )}

      {/* Feedback overlay */}
      {feedbackResult && (
        <FeedbackOverlay result={feedbackResult} onDone={() => setFeedbackResult(null)} />
      )}
    </div>
  );
}
