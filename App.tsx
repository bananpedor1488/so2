import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider } from './src/context/AuthContext';
import { PlayerProvider } from './src/context/PlayerContext';
import { LibraryProvider } from './src/context/LibraryContext';
import { Home } from './src/pages/Home';
import { Search } from './src/pages/Search';
import { Library } from './src/pages/Library';
import { Account } from './src/pages/Account';
import { TabBar } from './src/components/TabBar';
import { MiniPlayer } from './src/components/MiniPlayer';
import { NowPlaying } from './src/components/NowPlaying';
import { AuthOverlay } from './src/components/AuthOverlay';

const Tab = createBottomTabNavigator();

export default function App() {
  const [showNowPlaying, setShowNowPlaying] = useState(false);

  return (
    <AuthProvider>
      <PlayerProvider>
        <LibraryProvider>
          <StatusBar style="light" />
          <NavigationContainer>
            <Tab.Navigator tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
              <Tab.Screen name="Home" component={Home} />
              <Tab.Screen name="Search" component={Search} />
              <Tab.Screen name="Library" component={Library} />
              <Tab.Screen name="Account" component={Account} />
            </Tab.Navigator>
            <MiniPlayer onExpand={() => setShowNowPlaying(true)} />
            <NowPlaying visible={showNowPlaying} onClose={() => setShowNowPlaying(false)} />
            <AuthOverlay />
          </NavigationContainer>
        </LibraryProvider>
      </PlayerProvider>
    </AuthProvider>
  );
}
