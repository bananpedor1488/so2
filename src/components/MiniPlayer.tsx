import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, gradientColors, radius } from '../theme';
import { usePlayer } from '../context/PlayerContext';
import { useLibrary } from '../context/LibraryContext';

export const MiniPlayer = ({ onExpand }: { onExpand: () => void }) => {
  const { currentTrack, isPlaying, play, pause, skipToNext, progress } = usePlayer();
  const { isLiked, toggleLikeSong } = useLibrary();

  if (!currentTrack) return null;

  const liked = isLiked(currentTrack.id);

  return (
    <TouchableOpacity style={styles.container} onPress={onExpand} activeOpacity={0.9}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress.percentage}%` }]} />
      </View>
      <View style={styles.content}>
        <Image source={{ uri: currentTrack.thumbnail }} style={styles.artwork} />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
          <Text style={styles.artist} numberOfLines={1}>{currentTrack.artist}</Text>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => isPlaying ? pause() : play()}>
            <LinearGradient colors={gradientColors} style={styles.playBtn}>
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={skipToNext} style={styles.nextBtn}>
            <Ionicons name="play-skip-forward" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleLikeSong(currentTrack)}>
            <Ionicons name={liked ? 'heart' : 'heart-outline'} size={22} color={liked ? colors.accentPink : colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { position: 'absolute', bottom: 80, left: 16, right: 16, backgroundColor: colors.glassBg, borderRadius: radius.lg, overflow: 'hidden' },
  progressBar: { height: 2.5, backgroundColor: 'rgba(255,255,255,0.1)' },
  progressFill: { height: '100%', backgroundColor: colors.accentPink },
  content: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  artwork: { width: 48, height: 48, borderRadius: radius.sm },
  info: { flex: 1, marginLeft: 12 },
  title: { color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  artist: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  playBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  nextBtn: { marginLeft: 4 },
});
