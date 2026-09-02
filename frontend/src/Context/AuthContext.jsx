import { useCallback, useEffect, useMemo, useState } from 'react';
import authService from '../services/auth.service';
import { STORAGE_KEY } from '../utils/constants';
import { AuthContext } from './auth-context';

export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hydrate = async () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        setLoading(false);
        return;
      }
      try {
        const { user: currentUser } = await authService.getMe();
        setUser(currentUser);
        setToken(saved);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    hydrate();
  }, []);

  const login = useCallback(async (credentials) => {
    const result = await authService.login(credentials);
    setToken(result.token);
    setUser(result.user);
    return result;
  }, []);

  const register = useCallback(async (payload) => {
    const result = await authService.register(payload);
    if (result.token) {
      setToken(result.token);
      setUser(result.user);
    }
    return result;
  }, []);

  const registerAgent = useCallback(async (payload) => {
    const result = await authService.registerAgent(payload);
    return result;
  }, []);

  const completeAgentProfile = useCallback(async (payload) => {
    const result = await authService.completeAgentProfile(payload);
    setUser(result.user);
    return result;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem(STORAGE_KEY);
      setToken(null);
      setUser(null);
    }
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      registerAgent,
      completeAgentProfile,
      logout,
      updateUser,
    }),
    [user, token, loading, login, register, registerAgent, completeAgentProfile, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
