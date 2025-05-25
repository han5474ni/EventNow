import { useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const useApi = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token, logout } = useAuth();

  const request = useCallback(async (method, url, data = null, config = {}) => {
    setLoading(true);
    setError(null);

    try {
      const headers = {
        'Content-Type': 'application/json',
        ...config.headers,
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios({
        method,
        url,
        data,
        headers,
        ...config,
      });

      setData(response.data);
      return { data: response.data, status: response.status };
    } catch (err) {
      console.error(`API Error (${method} ${url}):`, err);
      
      // Handle 401 Unauthorized (token expired or invalid)
      if (err.response?.status === 401) {
        logout();
      }

      const errorMessage = err.response?.data?.detail || err.message || 'An error occurred';
      setError(errorMessage);
      return { error: errorMessage, status: err.response?.status };
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  const get = useCallback((url, config = {}) => 
    request('GET', url, null, config),
    [request]
  );

  const post = useCallback((url, data, config = {}) => 
    request('POST', url, data, config),
    [request]
  );

  const put = useCallback((url, data, config = {}) => 
    request('PUT', url, data, config),
    [request]
  );

  const del = useCallback((url, config = {}) => 
    request('DELETE', url, null, config),
    [request]
  );

  return {
    data,
    loading,
    error,
    get,
    post,
    put,
    delete: del,
    reset: () => {
      setData(null);
      setError(null);
    },
  };
};

export default useApi;
