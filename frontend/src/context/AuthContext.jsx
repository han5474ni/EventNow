import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, APP_CONFIG } from '../config';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(APP_CONFIG.TOKEN_KEY) || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.AUTH.ME);
      setUser(response.data);
      localStorage.setItem(APP_CONFIG.USER_KEY, JSON.stringify(response.data));
    } catch (err) {
      console.error('Error fetching user:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);
      
      const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const { access_token } = response.data;
      setToken(access_token);
      localStorage.setItem(APP_CONFIG.TOKEN_KEY, access_token);
      
      // Fetch user details
      await fetchUser();
      
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Login failed');
      return { success: false, error: err.response?.data?.detail || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      await axios.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.detail || 'Registration failed');
      return { success: false, error: err.response?.data?.detail || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.put(API_ENDPOINTS.AUTH.UPDATE_PROFILE, userData);
      setUser(response.data);
      localStorage.setItem(APP_CONFIG.USER_KEY, JSON.stringify(response.data));
      return { success: true };
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err.response?.data?.detail || 'Update failed');
      return { success: false, error: err.response?.data?.detail || 'Update failed' };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      await axios.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        current_password: currentPassword,
        new_password: newPassword,
      });
      return { success: true };
    } catch (err) {
      console.error('Change password error:', err);
      setError(err.response?.data?.detail || 'Password change failed');
      return { success: false, error: err.response?.data?.detail || 'Password change failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(APP_CONFIG.TOKEN_KEY);
    localStorage.removeItem(APP_CONFIG.USER_KEY);
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
