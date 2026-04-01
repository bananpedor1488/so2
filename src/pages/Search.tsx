import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme';
import { TrackCard } from '../components/TrackCard';
import { usePlayer } from '../context/PlayerContext';

const API_BASE = 'http://178.104.40.37:25593';

export const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const { playTrack } = usePlayer();

  const doSearch = async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    const r = await fetch(`${API_BASE}/api/soundcloud/search?q=${encodeURIComponent(q)}&type=tracks&limit=20`);
    const d = await r.json();
    if (d.success) setResults(d.results);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.input}
            placeholder="What do you want to listen to?"
            placeholderTextColor={colors.textTertiary}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => doSearch(query)}
            autoCapitalize="none"
          />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {results.map((track: any, i: number) => (
          <TrackCard key={track.id} track={track} variant="list" onPress={() => playTrack(track, results, i)} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgSecondary, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 12, gap: 10 },
  input: { flex: 1, color: colors.textPrimary, fontSize: 15 },
  content: { paddingHorizontal: 20, paddingBottom: 160 },
});
