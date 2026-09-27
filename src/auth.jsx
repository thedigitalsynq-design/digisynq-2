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
      if (!getAuthToken()) {
        setSessionChecked(true);
        return;
      }
      const me = await fetchAuthUser();
      if (!cancelled) {
        setUser(me);
        setSessionChecked(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (email, password) => {
    const session = await loginRequest(email, password);
    setUser(session.user);
    return session;
  }, []);

  const loginGuest = useCallback(() => {
    const guestUser = { email: 'guest@cinema-damage-control.com', name: 'Studio Guest', role: 'guest' };
    setUser(guestUser);
    try {
      localStorage.setItem('cdc_auth_token', 'guest-token');
      localStorage.setItem('cdc_auth_user', JSON.stringify(guestUser));
    } catch {}
    return { token: 'guest-token', user: guestUser, _source: 'LOCAL' };
  }, []);

  const logout = useCallback(async () => {
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
