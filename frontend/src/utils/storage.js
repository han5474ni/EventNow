import { APP_CONFIG } from '../config';

export const getToken = () => {
  // Check both localStorage and sessionStorage for the token
  return localStorage.getItem(APP_CONFIG.TOKEN_KEY) || sessionStorage.getItem(APP_CONFIG.TOKEN_KEY);
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(APP_CONFIG.TOKEN_KEY, token);
  } else {
    localStorage.removeItem(APP_CONFIG.TOKEN_KEY);
  }
};

export const getUser = () => {
  const userStr = localStorage.getItem(APP_CONFIG.USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

export const setUser = (user) => {
  if (user) {
    localStorage.setItem(APP_CONFIG.USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(APP_CONFIG.USER_KEY);
  }
};

export const clearAuthData = () => {
  localStorage.removeItem(APP_CONFIG.TOKEN_KEY);
  localStorage.removeItem(APP_CONFIG.USER_KEY);
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const isAdmin = () => {
  const user = getUser();
  return user?.role === 'admin';
};

export const hasRole = (role) => {
  const user = getUser();
  return user?.role === role;
};

export const hasAnyRole = (roles) => {
  if (!Array.isArray(roles)) return false;
  const user = getUser();
  return roles.includes(user?.role);
};
