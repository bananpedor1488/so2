import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradientColors, radius } from '../theme';

const tabs = [
  { id: 'Home', label: 'Home', icon: 'home' },
  { id: 'Search', label: 'Search', icon: 'search' },
  { id: 'Library', label: 'Library', icon: 'library' },
  { id: 'Account', label: 'Me', icon: 'person' },
];

export const TabBar = ({ state, navigation }: any) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab, i) => {
        const active = state.index === i;
        return (
          <TouchableOpacity key={tab.id} style={styles.tab} onPress={() => navigation.navigate(tab.id)}>
            {active ? (
              <LinearGradient colors={gradientColors} style={styles.activeTab}>
                <Ionicons name={tab.icon as any} size={22} color="#fff" />
                <Text style={styles.activeLabel}>{tab.label}</Text>
              </LinearGradient>
            ) : (
              <>
                <Ionicons name={tab.icon as any} size={22} color={colors.textSecondary} />
                <Text style={styles.label}>{tab.label}</Text>
              </>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: 'absolute', bottom: 8, left: 16, right: 16, flexDirection: 'row', backgroundColor: colors.glassBg, borderRadius: radius.xl, padding: 4 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 6 },
  activeTab: { borderRadius: radius.md, paddingVertical: 6, paddingHorizontal: 16, alignItems: 'center' },
  label: { color: colors.textSecondary, fontSize: 10, fontWeight: '600', marginTop: 3 },
  activeLabel: { color: '#fff', fontSize: 10, fontWeight: '700', marginTop: 3 },
});
