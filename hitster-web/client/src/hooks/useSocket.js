import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';
import useGameStore from '../store/gameStore';

export function useSocketListeners() {
  const navigate = useNavigate();
  const {
    setIdentity, setRoom, setPlayers, setGameState,
    setTurnStarted, applyTurnResult, setGameOver, setError,
  } = useGameStore();

  useEffect(() => {
    socket.connect();

    socket.on('room:created', ({ roomCode, playerId, playerName, genres }) => {
      setIdentity(playerId, playerName);
      setRoom(roomCode, genres);
      navigate(`/lobby/${roomCode}`);
    });

    socket.on('room:joined', ({ roomCode, playerId, players, genres }) => {
      const me = players.find(p => p.id === playerId);
      setIdentity(playerId, me?.name ?? '');
      setRoom(roomCode, genres);
      setPlayers(players);
      navigate(`/lobby/${roomCode}`);
    });

    socket.on('room:updated', ({ players }) => setPlayers(players));

    socket.on('room:error', ({ message }) => setError(message));

    socket.on('game:started', ({ gameState }) => {
      setGameState(gameState);
      navigate(`/game/${gameState.roomCode}`);
    });

    socket.on('turn:started', ({ card, playerId }) => setTurnStarted(card, playerId));

    socket.on('turn:result', (result) => applyTurnResult(result));

    socket.on('game:over', ({ winner, finalScores }) => {
      setGameOver(winner, finalScores);
      navigate(`/results`);
    });

    return () => {
      socket.off('room:created');
      socket.off('room:joined');
      socket.off('room:updated');
      socket.off('room:error');
      socket.off('game:started');
      socket.off('turn:started');
      socket.off('turn:result');
      socket.off('game:over');
      socket.disconnect();
    };
  }, []);
}
