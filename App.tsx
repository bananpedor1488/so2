import React, { useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const TRACKS = [
  { id: '1', title: 'Sunset Dreams', artist: 'Yukino', duration: '3:04' },
  { id: '2', title: 'Ocean Eyes', artist: 'Lana', duration: '2:56' },
  { id: '3', title: 'Moonwalk', artist: 'Nairobi', duration: '3:47' },
  { id: '4', title: 'City Nights', artist: 'Mora', duration: '4:12' },
  { id: '5', title: 'Running Free', artist: 'Nova', duration: '3:29' },
];

const TABS = ['Home', 'Search', 'Library'];

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [activeTrackId, setActiveTrackId] = useState(TRACKS[0].id);
  const [isPlaying, setIsPlaying] = useState(false);

  const activeTrack = useMemo(
    () => TRACKS.find((track) => track.id === activeTrackId) || TRACKS[0],
    [activeTrackId],
  );

  const renderTab = (tab) => {
    const selected = tab === activeTab;
    return (
      <TouchableOpacity
        key={tab}
        style={[styles.tabItem, selected && styles.tabItemActive]}
        onPress={() => setActiveTab(tab)}
      >
        <Text style={[styles.tabText, selected && styles.tabTextActive]}>{tab}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Weeky Music</Text>
        <Text style={styles.headerSubtitle}>React Native порт</Text>
      </View>

      <View style={styles.content}>
        {activeTab === 'Home' && (
          <FlatList
            data={TRACKS}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.trackList}
            renderItem={({ item }) => {
              const isActive = item.id === activeTrackId;
              return (
                <TouchableOpacity
                  style={[styles.trackCard, isActive && styles.trackCardActive]}
                  onPress={() => {
                    setActiveTrackId(item.id);
                    setIsPlaying(true);
                  }}
                >
                  <View>
                    <Text style={[styles.trackTitle, isActive && styles.trackTitleActive]}>{item.title}</Text>
                    <Text style={styles.trackArtist}>{item.artist}</Text>
                  </View>
                  <View style={styles.trackRight}>
                    <Text style={styles.trackTime}>{item.duration}</Text>
                    {isActive && <Text style={styles.playingTag}>PLAYING</Text>}
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}

        {activeTab === 'Search' && (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>Поиск треков по названию и исполнителю (подключи API)</Text>
          </View>
        )}

        {activeTab === 'Library' && (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>Библиотека пользователя (сохранённые треки, плейлисты)</Text>
          </View>
        )}
      </View>

      <View style={styles.playerBar}>
        <View style={styles.playerInfo}>
          <Text style={styles.playerTitle}>{activeTrack.title}</Text>
          <Text style={styles.playerArtist}>{activeTrack.artist}</Text>
        </View>

        <TouchableOpacity
          style={[styles.playButton, isPlaying ? styles.pauseButton : styles.playButton]}
          onPress={() => setIsPlaying((prev) => !prev)}
        >
          <Text style={styles.playButtonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomTabs}>{TABS.map(renderTab)}</View>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e1d37',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a3e60',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#a5b8d5',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  trackList: {
    padding: 12,
    paddingBottom: 90,
  },
  trackCard: {
    backgroundColor: '#142a4f',
    borderRadius: 12,
    marginBottom: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trackCardActive: {
    backgroundColor: '#1b447e',
  },
  trackTitle: {
    color: '#f5f8ff',
    fontSize: 16,
    fontWeight: '700',
  },
  trackTitleActive: {
    color: '#fff',
  },
  trackArtist: {
    color: '#97b0d5',
    marginTop: 2,
  },
  trackRight: {
    alignItems: 'flex-end',
  },
  trackTime: {
    color: '#c2d1ea',
  },
  playingTag: {
    marginTop: 4,
    backgroundColor: '#42b7ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    overflow: 'hidden',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    color: '#bec8dd',
    textAlign: 'center',
    fontSize: 16,
  },
  playerBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 56,
    backgroundColor: '#162f55',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#2a3e60',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playerInfo: {
    flex: 1,
    marginRight: 12,
  },
  playerTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  playerArtist: {
    color: '#a7b9d8',
    marginTop: 2,
  },
  playButton: {
    minWidth: 72,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#3f73c3',
    alignItems: 'center',
  },
  pauseButton: {
    backgroundColor: '#ff5c75',
  },
  playButtonText: {
    color: '#fff',
    fontWeight: '800',
  },
  bottomTabs: {
    width,
    height: 56,
    backgroundColor: '#0a1c3d',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#263a61',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabItemActive: {
    backgroundColor: '#1f477f',
  },
  tabText: {
    fontSize: 14,
    color: '#9bb7df',
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#fff',
  },
});
