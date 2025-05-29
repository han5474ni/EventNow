import axios from 'axios';
import { API_BASE_URL, LOCAL_STORAGE_KEYS } from '../config';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh token yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
        if (!refreshToken) {
          // No refresh token, redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Try to refresh the token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
        const { access_token, refresh_token } = response.data;
        
        // Store the new tokens
        localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, access_token);
        localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
        
        // Update the authorization header
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (error) {
        // If refresh token fails, clear storage and redirect to login
        localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
