import React, { createContext, useState, useEffect } from 'react';
import API, { getErrorMessage } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('userInfo');
      return savedUser && savedUser !== 'undefined' ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('userInfo', JSON.stringify(user));
      } else {
        localStorage.removeItem('userInfo');
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await API.post('/auth/login', { email, password });
      setUser(data);
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const register = async (name, email, password, role = 'CUSTOMER') => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await API.post('/auth/register', { name, email, password, role });
      setUser(data);
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('userInfo');
    } catch (e) {
      console.error(e);
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    try {
      const { data } = await API.get('/auth/profile');
      setUser((prev) => ({ ...prev, ...data }));
    } catch (err) {
      console.error('Error refreshing profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        refreshProfile,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
