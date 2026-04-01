import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradientColors, radius } from '../theme';
import { TrackCard } from '../components/TrackCard';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://178.104.40.37:25593';

export const Home = () => {
  const [trending, setTrending] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const { playTrack } = usePlayer();
  const { user } = useAuth();

  useEffect(() => {
    fetch(`${API_BASE}/api/soundcloud/trending?limit=15`)
      .then(r => r.json())
      .then(d => { if (d.success) setTrending(d.results); });
  }, []);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{getGreeting()}{user?.username ? `, ${user.username}!` : ''}</Text>
        <Text style={styles.subtitle}>Listen to your favorite music</Text>
      </View>

      {trending.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {trending.map((track: any, i: number) => (
              <TrackCard key={track.id} track={track} variant="compact" onPress={() => playTrack(track, trending, i)} />
            ))}
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  content: { paddingBottom: 160 },
  header: { padding: 20, paddingTop: 60 },
  greeting: { fontSize: 28, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  section: { marginTop: 24, paddingLeft: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
});
