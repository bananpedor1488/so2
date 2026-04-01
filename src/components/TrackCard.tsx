import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius } from '../theme';
import { usePlayer } from '../context/PlayerContext';
import { useLibrary } from '../context/LibraryContext';
import { Ionicons } from '@expo/vector-icons';

interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
}

export const TrackCard = ({ track, variant = 'default', onPress }: { track: Track; variant?: 'default' | 'compact' | 'list'; onPress?: () => void }) => {
  const { currentTrack, isPlaying } = usePlayer();
  const { isLiked, toggleLikeSong } = useLibrary();
  const isCurrentTrack = currentTrack?.id === track.id;
  const liked = isLiked(track.id);

  if (variant === 'compact') {
    return (
      <TouchableOpacity style={styles.compact} onPress={onPress}>
        <Image source={{ uri: track.thumbnail }} style={styles.compactImg} />
        <View style={styles.compactInfo}>
          <Text style={styles.compactTitle} numberOfLines={1}>{track.title}</Text>
          <Text style={styles.compactArtist} numberOfLines={1}>{track.artist}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === 'list') {
    return (
      <TouchableOpacity style={[styles.list, isCurrentTrack && styles.listActive]} onPress={onPress}>
        <Image source={{ uri: track.thumbnail }} style={styles.listImg} />
        <View style={styles.listInfo}>
          <Text style={styles.listTitle} numberOfLines={1}>{track.title}</Text>
          <Text style={styles.listArtist} numberOfLines={1}>{track.artist}</Text>
        </View>
        <TouchableOpacity onPress={() => toggleLikeSong(track)}>
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={22} color={liked ? colors.accentPink : colors.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.default} onPress={onPress}>
      <Image source={{ uri: track.thumbnail }} style={styles.defaultImg} />
      <View style={styles.defaultInfo}>
        <Text style={styles.defaultTitle} numberOfLines={1}>{track.title}</Text>
        <Text style={styles.defaultArtist} numberOfLines={1}>{track.artist}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  compact: { width: 140, marginRight: 12 },
  compactImg: { width: 140, height: 140, borderRadius: radius.md },
  compactInfo: { marginTop: 8 },
  compactTitle: { color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  compactArtist: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },

  list: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: colors.bgSecondary, borderRadius: radius.md, marginBottom: 8 },
  listActive: { backgroundColor: colors.bgTertiary },
  listImg: { width: 48, height: 48, borderRadius: radius.sm },
  listInfo: { flex: 1, marginLeft: 12 },
  listTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: '600' },
  listArtist: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },

  default: { width: 160, marginRight: 12 },
  defaultImg: { width: 160, height: 160, borderRadius: radius.md },
  defaultInfo: { marginTop: 8 },
  defaultTitle: { color: colors.textPrimary, fontSize: 14, fontWeight: '600' },
  defaultArtist: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
});
