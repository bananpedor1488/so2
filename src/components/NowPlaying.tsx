import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { colors, gradientColors, radius } from '../theme';
import { usePlayer } from '../context/PlayerContext';
import { useLibrary } from '../context/LibraryContext';

const { width } = Dimensions.get('window');

export const NowPlaying = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const { currentTrack, isPlaying, play, pause, skipToNext, skipToPrevious, progress, seek, shuffle, repeat, toggleShuffle, toggleRepeat } = usePlayer();
  const { isLiked, toggleLikeSong } = useLibrary();
  const [showQueue, setShowQueue] = useState(false);

  if (!currentTrack) return null;

  const liked = isLiked(currentTrack.id);
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        <Image source={{ uri: currentTrack.thumbnail }} style={styles.bgImage} blurRadius={100} />
        <BlurView intensity={80} style={StyleSheet.absoluteFill} />

        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="chevron-down" size={28} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerLabel}>Now Playing</Text>
          <TouchableOpacity onPress={() => setShowQueue(!showQueue)}>
            <Ionicons name="list" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Image source={{ uri: currentTrack.thumbnail }} style={styles.artwork} />
          <View style={styles.info}>
            <Text style={styles.title}>{currentTrack.title}</Text>
            <Text style={styles.artist}>{currentTrack.artist}</Text>
          </View>

          <View style={styles.progressSection}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={progress.duration || 100}
              value={progress.current}
              onSlidingComplete={seek}
              minimumTrackTintColor={colors.accentPink}
              maximumTrackTintColor="rgba(255,255,255,0.2)"
              thumbTintColor="#fff"
            />
            <View style={styles.timeRow}>
              <Text style={styles.time}>{formatTime(progress.current)}</Text>
              <Text style={styles.time}>{formatTime(progress.duration)}</Text>
            </View>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity onPress={toggleShuffle}>
              <Ionicons name="shuffle" size={24} color={shuffle ? colors.accentPink : colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={skipToPrevious}>
              <Ionicons name="play-skip-back" size={36} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => isPlaying ? pause() : play()}>
              <LinearGradient colors={gradientColors} style={styles.playBtn}>
                <Ionicons name={isPlaying ? 'pause' : 'play'} size={32} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={skipToNext}>
              <Ionicons name="play-skip-forward" size={36} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleRepeat}>
              <Ionicons name="repeat" size={24} color={repeat ? colors.accentPink : colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => toggleLikeSong(currentTrack)} style={styles.likeBtn}>
            <Ionicons name={liked ? 'heart' : 'heart-outline'} size={28} color={liked ? colors.accentPink : colors.textSecondary} />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  bgImage: { position: 'absolute', width: '100%', height: '100%', opacity: 0.3 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  headerLabel: { color: colors.textSecondary, fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  content: { alignItems: 'center', paddingHorizontal: 32, paddingBottom: 40 },
  artwork: { width: width - 80, height: width - 80, borderRadius: radius.lg, marginTop: 20 },
  info: { alignItems: 'center', marginTop: 24 },
  title: { color: colors.textPrimary, fontSize: 22, fontWeight: '700', textAlign: 'center' },
  artist: { color: colors.textSecondary, fontSize: 16, marginTop: 8, textAlign: 'center' },
  progressSection: { width: '100%', marginTop: 32 },
  slider: { width: '100%', height: 40 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  time: { color: colors.textSecondary, fontSize: 12 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: 24, paddingHorizontal: 20 },
  playBtn: { width: 66, height: 66, borderRadius: 33, alignItems: 'center', justifyContent: 'center' },
  likeBtn: { marginTop: 32 },
});
