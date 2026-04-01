import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';

const API_BASE = 'https://wekky-server.onrender.com';

interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration?: number;
  type?: string;
}

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: { current: number; duration: number; percentage: number };
  queue: Track[];
  currentIndex: number;
  shuffle: boolean;
  repeat: boolean;
  playTrack: (track: Track, tracks?: Track[], index?: number) => void;
  play: () => void;
  pause: () => void;
  skipToNext: () => void;
  skipToPrevious: () => void;
  seek: (seconds: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  removeFromQueue: (index: number) => void;
}

const PlayerContext = createContext<PlayerContextType>({} as PlayerContextType);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState({ current: 0, duration: 0, percentage: 0 });
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: true });
  }, []);

  const playTrack = useCallback(async (track: Track, tracks?: Track[], index?: number) => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    setCurrentTrack(track);
    setQueue(tracks || [track]);
    setCurrentIndex(index ?? 0);

    try {
      const streamUrl = `${API_BASE}/api/soundcloud/stream/${track.id}`;
      const { sound } = await Audio.Sound.createAsync({ uri: streamUrl }, { shouldPlay: true });
      soundRef.current = sound;
      setIsPlaying(true);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setProgress({
            current: (status.positionMillis || 0) / 1000,
            duration: (status.durationMillis || 0) / 1000,
            percentage: status.durationMillis ? ((status.positionMillis || 0) / status.durationMillis) * 100 : 0,
          });
          if (status.didJustFinish && !status.isLooping) {
            skipToNext();
          }
        }
      });
    } catch (e) {
      console.error('Play error:', e);
    }
  }, []);

  const play = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.playAsync();
      setIsPlaying(true);
    }
  }, []);

  const pause = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    }
  }, []);

  const skipToNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % queue.length;
    if (queue[nextIndex]) playTrack(queue[nextIndex], queue, nextIndex);
  }, [currentIndex, queue, playTrack]);

  const skipToPrevious = useCallback(() => {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
    if (queue[prevIndex]) playTrack(queue[prevIndex], queue, prevIndex);
  }, [currentIndex, queue, playTrack]);

  const seek = useCallback(async (seconds: number) => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(seconds * 1000);
    }
  }, []);

  const toggleShuffle = useCallback(() => setShuffle(s => !s), []);
  const toggleRepeat = useCallback(() => setRepeat(r => !r), []);
  const removeFromQueue = useCallback((index: number) => {
    setQueue(q => q.filter((_, i) => i !== index));
  }, []);

  return (
    <PlayerContext.Provider value={{
      currentTrack, isPlaying, progress, queue, currentIndex, shuffle, repeat,
      playTrack, play, pause, skipToNext, skipToPrevious, seek, toggleShuffle, toggleRepeat, removeFromQueue,
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
