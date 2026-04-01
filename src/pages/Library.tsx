import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius } from '../theme';
import { TrackCard } from '../components/TrackCard';
import { useLibrary } from '../context/LibraryContext';
import { usePlayer } from '../context/PlayerContext';

export const Library = () => {
  const [activeTab, setActiveTab] = useState<'playlists' | 'liked' | 'recent'>('liked');
  const { likedSongs, playlists, recentlyPlayed } = useLibrary();
  const { playTrack } = usePlayer();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Library</Text>
      </View>
      <View style={styles.tabs}>
        {[
          { id: 'playlists', label: 'Playlists', count: playlists.length },
          { id: 'liked', label: 'Liked', count: likedSongs.length },
          { id: 'recent', label: 'Recent', count: recentlyPlayed.length },
        ].map(tab => (
          <TouchableOpacity key={tab.id} style={[styles.tab, activeTab === tab.id && styles.tabActive]} onPress={() => setActiveTab(tab.id as any)}>
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>{tab.label} ({tab.count})</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === 'liked' && likedSongs.map((track, i) => (
          <TrackCard key={track.id} track={track} variant="list" onPress={() => playTrack(track, likedSongs, i)} />
        ))}
        {activeTab === 'recent' && recentlyPlayed.map((track, i) => (
          <TrackCard key={track.id} track={track} variant="list" onPress={() => playTrack(track, recentlyPlayed, i)} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  title: { fontSize: 32, fontWeight: '800', color: colors.textPrimary },
  tabs: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 16 },
  tab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: radius.md, backgroundColor: colors.bgSecondary },
  tabActive: { backgroundColor: colors.accentPink },
  tabText: { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  content: { paddingHorizontal: 20, paddingBottom: 160 },
});
