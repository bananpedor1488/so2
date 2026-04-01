import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradientColors, radius } from '../theme';
import { useAuth } from '../context/AuthContext';

export const Account = () => {
  const { user, isAuthenticated, openAuth, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Account</Text>
          <Text style={styles.subtitle}>Your profile & sync</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.emptyText}>Sign in to sync your library across devices.</Text>
          <TouchableOpacity onPress={() => openAuth()}>
            <LinearGradient colors={gradientColors} style={styles.btn}>
              <Text style={styles.btnText}>Login / Register</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Account</Text>
        <Text style={styles.subtitle}>@{user?.username}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email}</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary, padding: 20, paddingTop: 60 },
  header: { marginBottom: 24 },
  title: { fontSize: 32, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  card: { backgroundColor: colors.bgSecondary, borderRadius: radius.lg, padding: 20 },
  emptyText: { color: colors.textSecondary, fontSize: 15, marginBottom: 20, textAlign: 'center' },
  btn: { borderRadius: radius.md, paddingVertical: 14, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  label: { color: colors.textSecondary, fontSize: 13, marginBottom: 4 },
  value: { color: colors.textPrimary, fontSize: 16, marginBottom: 20 },
  logoutBtn: { backgroundColor: colors.bgTertiary, borderRadius: radius.md, paddingVertical: 12, alignItems: 'center' },
  logoutText: { color: colors.textPrimary, fontSize: 15, fontWeight: '600' },
});
