import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { loginUser, registerUser, logoutUser, getCurrentUser } from '../api/authApi';

const AuthContext = createContext(null);

const persistSession = ({ token, user }) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await getCurrentUser();
      setUser(data.data.user);
    } catch {
      clearSession();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (credentials) => {
    const { data } = await loginUser(credentials);
    persistSession({ token: data.token, user: data.data.user });
    setUser(data.data.user);
    return data.data.user;
  };

  const register = async (payload) => {
    const { data } = await registerUser(payload);
    persistSession({ token: data.token, user: data.data.user });
    setUser(data.data.user);
    return data.data.user;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // Network errors on logout shouldn't block clearing the local session
    } finally {
      clearSession();
      setUser(null);
    }
  };

  const value = { user, loading, login, register, logout, isAuthenticated: Boolean(user) };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
