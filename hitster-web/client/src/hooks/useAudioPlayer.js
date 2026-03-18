import { useEffect, useRef, useState } from 'react';

export function useAudioPlayer(previewUrl) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!previewUrl) return;
    const audio = new Audio(previewUrl);
    audioRef.current = audio;

    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
    audio.addEventListener('timeupdate', () => setProgress(audio.currentTime));
    audio.addEventListener('ended', () => setIsPlaying(false));

    // No autoplay — browser blocks it; user clicks play button

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
      setIsPlaying(false);
      setProgress(0);
      setDuration(0);
    };
  }, [previewUrl]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return { isPlaying, progress, duration, toggle };
}
