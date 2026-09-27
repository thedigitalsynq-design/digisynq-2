// src/auth.jsx
// Session context for the redesigned workspace.
// Wraps the additive /api/auth/* endpoints (server + edge). Data endpoints
// remain ungated, so existing integrations and cached flows keep working.

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchAuthUser, getAuthToken, loginRequest, logoutRequest } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const explicitLogout = typeof window !== 'undefined' && sessionStorage.getItem('cdc_logged_out') === 'true';
      const token = getAuthToken();

      if (!token) {
        if (!explicitLogout) {
          // Auto-initialize guest session so deep-links (tab/movie) and first-time visitors work seamlessly
          const guestUser = { email: 'guest@cinema-damage-control.com', name: 'Studio Guest', role: 'guest' };
          try {
            localStorage.setItem('cdc_auth_token', 'guest-token');
            localStorage.setItem('cdc_auth_user', JSON.stringify(guestUser));
          } catch {}
          if (!cancelled) {
            setUser(guestUser);
            setSessionChecked(true);
          }
          return;
        }
        setSessionChecked(true);
        return;
      }

      const me = await fetchAuthUser();
      if (!cancelled) {
        setUser(me || { email: 'guest@cinema-damage-control.com', name: 'Studio Guest', role: 'guest' });
        setSessionChecked(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (email, password) => {
    try { sessionStorage.removeItem('cdc_logged_out'); } catch {}
    const session = await loginRequest(email, password);
    setUser(session.user);
    return session;
  }, []);

  const loginGuest = useCallback(() => {
    try { sessionStorage.removeItem('cdc_logged_out'); } catch {}
    const guestUser = { email: 'guest@cinema-damage-control.com', name: 'Studio Guest', role: 'guest' };
    setUser(guestUser);
    try {
      localStorage.setItem('cdc_auth_token', 'guest-token');
      localStorage.setItem('cdc_auth_user', JSON.stringify(guestUser));
    } catch {}
    return { token: 'guest-token', user: guestUser, _source: 'LOCAL' };
  }, []);

  const logout = useCallback(async () => {
    try { sessionStorage.setItem('cdc_logged_out', 'true'); } catch {}
    await logoutRequest();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), sessionChecked, login, loginGuest, logout }),
    [user, sessionChecked, login, loginGuest, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
