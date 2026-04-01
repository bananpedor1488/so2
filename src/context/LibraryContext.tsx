import React, { createContext, useCallback, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
}

interface Playlist {
  id: number;
  name: string;
  description?: string;
  tracks: Track[];
}

interface LibraryContextType {
  likedSongs: Track[];
  playlists: Playlist[];
  recentlyPlayed: Track[];
  isLiked: (id: string) => boolean;
  toggleLikeSong: (track: Track) => void;
  createPlaylist: (name: string, desc?: string) => void;
  deletePlaylist: (id: number) => void;
}

const LibraryContext = createContext<LibraryContextType>({} as LibraryContextType);

export const LibraryProvider = ({ children }: { children: React.ReactNode }) => {
  const [likedSongs, setLikedSongs] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([]);

  const isLiked = useCallback((id: string) => likedSongs.some(t => t.id === id), [likedSongs]);

  const toggleLikeSong = useCallback((track: Track) => {
    setLikedSongs(prev => {
      const exists = prev.some(t => t.id === track.id);
      const next = exists ? prev.filter(t => t.id !== track.id) : [track, ...prev];
      AsyncStorage.setItem('liked-songs', JSON.stringify(next));
      return next;
    });
  }, []);

  const createPlaylist = useCallback((name: string, desc?: string) => {
    setPlaylists(prev => {
      const next = [...prev, { id: Date.now(), name, description: desc, tracks: [] }];
      AsyncStorage.setItem('playlists', JSON.stringify(next));
      return next;
    });
  }, []);

  const deletePlaylist = useCallback((id: number) => {
    setPlaylists(prev => {
      const next = prev.filter(p => p.id !== id);
      AsyncStorage.setItem('playlists', JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <LibraryContext.Provider value={{ likedSongs, playlists, recentlyPlayed, isLiked, toggleLikeSong, createPlaylist, deletePlaylist }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => useContext(LibraryContext);
