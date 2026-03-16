import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingRegistration, setPendingRegistration] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedPendingRegistration = sessionStorage.getItem('pendingRegistration');

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }

    if (storedPendingRegistration) {
      try {
        setPendingRegistration(JSON.parse(storedPendingRegistration));
      } catch (error) {
        console.error('Error parsing pending registration:', error);
        sessionStorage.removeItem('pendingRegistration');
      }
    }

    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const startRegistration = (draftUser) => {
    setPendingRegistration(draftUser);
    sessionStorage.setItem('pendingRegistration', JSON.stringify(draftUser));
  };

  const completeRegistrationWithOtp = (otpCode) => {
    if (!pendingRegistration || !/^\d{4,6}$/.test(otpCode)) {
      return false;
    }

    const verifiedUser = {
      ...pendingRegistration,
      otpVerified: true,
      createdAt: new Date().toISOString(),
    };

    login(verifiedUser);
    setPendingRegistration(null);
    sessionStorage.removeItem('pendingRegistration');
    return true;
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    pendingRegistration,
    login,
    logout,
    startRegistration,
    completeRegistrationWithOtp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};