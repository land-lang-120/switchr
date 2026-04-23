/**
 * Switchr — AuthContext.
 * Expose user courant + signup/login/logout au reste de l'app.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import * as authSvc from '../services/auth';
import type { LoginInput, SignupInput, User } from '../types/user';

interface AuthContextValue {
  readonly user: User | null;
  readonly loading: boolean;
  readonly signup: (i: SignupInput) => Promise<User>;
  readonly login: (i: LoginInput) => Promise<User>;
  readonly logout: () => void;
  readonly refresh: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => authSvc.currentUser());
  const [loading, setLoading] = useState(false);

  // Re-sync sur focus (changement entre onglets)
  useEffect(() => {
    const onFocus = () => setUser(authSvc.currentUser());
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const signup = useCallback(async (i: SignupInput) => {
    setLoading(true);
    try {
      const u = await authSvc.signup(i);
      setUser(u);
      return u;
    } finally { setLoading(false); }
  }, []);

  const login = useCallback(async (i: LoginInput) => {
    setLoading(true);
    try {
      const u = await authSvc.login(i);
      setUser(u);
      return u;
    } finally { setLoading(false); }
  }, []);

  const logout = useCallback(() => {
    authSvc.logout();
    setUser(null);
  }, []);

  const refresh = useCallback(() => setUser(authSvc.currentUser()), []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, signup, login, logout, refresh }),
    [user, loading, signup, login, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit etre utilise dans <AuthProvider>');
  return ctx;
}
