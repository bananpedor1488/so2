import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradientColors, radius } from '../theme';
import { useAuth } from '../context/AuthContext';

export const AuthOverlay = () => {
  const { authOverlayOpen, closeAuth, login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loginId, setLoginId] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        if (!loginId.trim()) throw new Error('Email or Username required');
        await login({ login: loginId.trim(), password });
      } else {
        if (!email.trim()) throw new Error('Email required');
        if (!username.trim()) throw new Error('Username required');
        await register({ email: email.trim(), username: username.trim(), password });
      }
    } catch (e: any) {
      setError(e?.message || 'Auth failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={authOverlayOpen} transparent animationType="fade">
      <BlurView intensity={80} style={styles.backdrop}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Weeky</Text>
            <Text style={styles.subtitle}>Sign in to start listening</Text>

            <View style={styles.switchRow}>
              <TouchableOpacity style={[styles.switchBtn, mode === 'login' && styles.switchBtnActive]} onPress={() => setMode('login')}>
                <Text style={[styles.switchText, mode === 'login' && styles.switchTextActive]}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.switchBtn, mode === 'register' && styles.switchBtnActive]} onPress={() => setMode('register')}>
                <Text style={[styles.switchText, mode === 'register' && styles.switchTextActive]}>Register</Text>
              </TouchableOpacity>
            </View>

            {mode === 'login' ? (
              <TextInput style={styles.input} placeholder="Username or Email" placeholderTextColor={colors.textTertiary} value={loginId} onChangeText={setLoginId} autoCapitalize="none" />
            ) : (
              <>
                <TextInput style={styles.input} placeholder="Email" placeholderTextColor={colors.textTertiary} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                <TextInput style={styles.input} placeholder="Username" placeholderTextColor={colors.textTertiary} value={username} onChangeText={setUsername} autoCapitalize="none" />
              </>
            )}
            <TextInput style={styles.input} placeholder="Password" placeholderTextColor={colors.textTertiary} value={password} onChangeText={setPassword} secureTextEntry />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity onPress={submit} disabled={loading}>
              <LinearGradient colors={gradientColors} style={styles.submitBtn}>
                <Text style={styles.submitText}>{loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={closeAuth} style={styles.closeBtn}>
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  container: { width: '90%', maxWidth: 400 },
  card: { backgroundColor: colors.bgSecondary, borderRadius: radius.xl, padding: 24, borderWidth: 1, borderColor: colors.glassBorder },
  title: { fontSize: 28, fontWeight: '800', color: colors.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 8, marginBottom: 24 },
  switchRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  switchBtn: { flex: 1, paddingVertical: 10, borderRadius: radius.md, backgroundColor: colors.bgTertiary, alignItems: 'center' },
  switchBtnActive: { backgroundColor: colors.accentPink },
  switchText: { color: colors.textSecondary, fontWeight: '600' },
  switchTextActive: { color: '#fff' },
  input: { backgroundColor: colors.bgTertiary, borderRadius: radius.md, padding: 14, color: colors.textPrimary, marginBottom: 12, fontSize: 15 },
  error: { color: '#ff4444', fontSize: 13, marginBottom: 12, textAlign: 'center' },
  submitBtn: { borderRadius: radius.md, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  closeBtn: { marginTop: 16, alignItems: 'center' },
  closeText: { color: colors.textSecondary, fontSize: 14 },
});
