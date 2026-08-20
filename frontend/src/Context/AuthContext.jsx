import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import authService from '../services/auth.service';
import { STORAGE_KEY } from '../utils/constants';

export const AuthContext = createContext(null);

const DEFAULT_BUYER = {
  id: 'b1',
  firstName: 'Abebe',
  lastName: 'Kebede',
  name: 'Abebe Kebede',
  email: 'abebe.k@nesthome.com',
  phone: '+251 911 123 456',
  role: 'buyer',
  title: 'Real Estate Buyer',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  unreadNotifications: 7,
  unreadMessages: 3,
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('realestate_auth_user');
    return saved ? JSON.parse(saved) : DEFAULT_BUYER;
  });

  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY));
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem('realestate_is_auth');
    return savedAuth !== null ? JSON.parse(savedAuth) : true;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('realestate_auth_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('realestate_is_auth', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    const hydrate = async () => {
      const savedToken = localStorage.getItem(STORAGE_KEY);
      if (!savedToken) return;
      try {
        const { user: currentUser } = await authService.getMe();
        if (currentUser) {
          setUser(currentUser);
          setToken(savedToken);
          setIsAuthenticated(true);
        }
      } catch {
        // Fallback to local state if backend API is offline
      }
    };
    hydrate();
  }, []);

  const login = useCallback(async (credentialsOrUserData = DEFAULT_BUYER) => {
    if (typeof credentialsOrUserData === 'object' && credentialsOrUserData.email && credentialsOrUserData.password) {
      try {
        const result = await authService.login(credentialsOrUserData);
        setToken(result.token);
        setUser(result.user);
        setIsAuthenticated(true);
        return result;
      } catch (err) {
        // Fallback to mock buyer if API request fails
        setUser(DEFAULT_BUYER);
        setIsAuthenticated(true);
        return { user: DEFAULT_BUYER };
      }
    } else {
      setUser(credentialsOrUserData || DEFAULT_BUYER);
      setIsAuthenticated(true);
    }
  }, []);

  const register = useCallback(async (payload) => {
    const result = await authService.register(payload);
    if (result.token) {
      setToken(result.token);
      setUser(result.user);
      setIsAuthenticated(true);
    }
    return result;
  }, []);

  const registerAgent = useCallback(async (payload) => {
    return await authService.registerAgent(payload);
  }, []);

  const completeAgentProfile = useCallback(async (payload) => {
    const result = await authService.completeAgentProfile(payload);
    setUser(result.user);
    return result;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore API logout error if offline
    } finally {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('realestate_auth_user');
      setToken(null);
      setIsAuthenticated(false);
    }
  }, []);

  const switchRole = useCallback((role) => {
    if (role === 'guest') {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
      setUser((prev) => ({
        ...(prev || DEFAULT_BUYER),
        role: role,
        name: role === 'buyer' ? 'Abebe Kebede' : role === 'agent' ? 'Sara Tamrat' : 'Admin User',
        title: role === 'buyer' ? 'Real Estate Buyer' : role === 'agent' ? 'Licensed Agent' : 'System Admin',
      }));
    }
  }, []);

  const updateUserProfile = useCallback((updatedFields) => {
    setUser((prev) => {
      const updated = { ...(prev || DEFAULT_BUYER), ...updatedFields };
      if (updatedFields.firstName || updatedFields.lastName) {
        updated.name = `${updated.firstName || prev?.firstName || 'Abebe'} ${updated.lastName || prev?.lastName || 'Kebede'}`.trim();
      }
      return updated;
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isLoading: loading,
      isAuthenticated: Boolean(isAuthenticated || (token && user)),
      login,
      register,
      registerAgent,
      completeAgentProfile,
      logout,
      switchRole,
      updateUserProfile,
    }),
    [user, token, loading, isAuthenticated, login, register, registerAgent, completeAgentProfile, logout, switchRole, updateUserProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
