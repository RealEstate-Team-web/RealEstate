import React, { createContext, useState, useEffect } from 'react';

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

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem('realestate_is_auth');
    return savedAuth !== null ? JSON.parse(savedAuth) : true;
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('realestate_auth_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('realestate_is_auth', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  const login = (userData = DEFAULT_BUYER) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const switchRole = (role) => {
    if (role === 'guest') {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
      setUser(prev => ({
        ...prev,
        role: role,
        name: role === 'buyer' ? 'Abebe Kebede' : role === 'agent' ? 'Sara Tamrat' : 'Admin User',
        title: role === 'buyer' ? 'Real Estate Buyer' : role === 'agent' ? 'Licensed Agent' : 'System Admin',
      }));
    }
  };

  const updateUserProfile = (updatedFields) => {
    setUser(prev => {
      const updated = { ...prev, ...updatedFields };
      if (updatedFields.firstName || updatedFields.lastName) {
        updated.name = `${updated.firstName || prev.firstName} ${updated.lastName || prev.lastName}`.trim();
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      switchRole,
      updateUserProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
