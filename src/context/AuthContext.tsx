import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'https://wekky-server.onrender.com';
const TOKEN_KEY = 'weeky-auth-token';

interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  avatar?: string;
}

interface AuthContextType {
  token: string;
  user: User | null;
  isAuthenticated: boolean;
  authOverlayOpen: boolean;
  openAuth: (pendingAction?: () => void) => void;
  closeAuth: () => void;
  login: (creds: { login: string; password: string }) => Promise<void>;
  register: (creds: { email: string; username: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [authOverlayOpen, setAuthOverlayOpen] = useState(false);
  const pendingActionRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(TOKEN_KEY).then(t => {
      if (t) setToken(t);
    });
  }, []);

  const persistToken = useCallback(async (next: string) => {
    setToken(next);
    if (next) await AsyncStorage.setItem(TOKEN_KEY, next);
    else await AsyncStorage.removeItem(TOKEN_KEY);
  }, []);

  useEffect(() => {
    if (!token) { setUser(null); return; }
    fetch(`${API_BASE}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d?.success) setUser(d.user); else persistToken(''); })
      .catch(() => {});
  }, [token]);

  const login = useCallback(async (creds: { login: string; password: string }) => {
    const r = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creds),
    });
    const d = await r.json();
    if (!r.ok || !d?.success) throw new Error(d?.error || 'Login failed');
    await persistToken(d.token);
    setUser(d.user);
    setAuthOverlayOpen(false);
    pendingActionRef.current?.();
    pendingActionRef.current = null;
  }, [persistToken]);

  const register = useCallback(async (creds: { email: string; username: string; password: string }) => {
    const r = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creds),
    });
    const d = await r.json();
    if (!r.ok || !d?.success) throw new Error(d?.error || 'Register failed');
    await persistToken(d.token);
    setUser(d.user);
    setAuthOverlayOpen(false);
    pendingActionRef.current?.();
    pendingActionRef.current = null;
  }, [persistToken]);

  const logout = useCallback(() => {
    persistToken('');
    setUser(null);
  }, [persistToken]);

  const openAuth = useCallback((pendingAction?: () => void) => {
    if (pendingAction) pendingActionRef.current = pendingAction;
    setAuthOverlayOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setAuthOverlayOpen(false);
    pendingActionRef.current = null;
  }, []);

  return (
    <AuthContext.Provider value={{
      token, user, isAuthenticated: Boolean(token),
      authOverlayOpen, openAuth, closeAuth, login, register, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
