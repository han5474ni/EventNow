import { LOCAL_STORAGE_KEYS } from '../config';

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
};

/**
 * Get the current user from localStorage
 * @returns {Object|null} User object or null if not found
 */
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Get the authentication token
 * @returns {string|null} Authentication token or null if not found
 */
export const getAuthToken = () => {
  return localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
};

/**
 * Set user session data in localStorage
 * @param {Object} data - User data and tokens
 * @param {string} data.access_token - Access token
 * @param {string} data.refresh_token - Refresh token
 * @param {Object} data.user - User object
 */
export const setSession = ({ access_token, refresh_token, user }) => {
  if (access_token) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, access_token);
  }
  if (refresh_token) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
  }
  if (user) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(user));
  }
};

/**
 * Clear user session data from localStorage
 */
export const clearSession = () => {
  Object.values(LOCAL_STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

/**
 * Check if user has a specific role
 * @param {string|string[]} roles - Role or array of roles to check
 * @returns {boolean} True if user has any of the specified roles
 */
export const hasRole = (roles) => {
  const user = getCurrentUser();
  if (!user || !user.role) return false;
  
  const userRoles = Array.isArray(user.role) ? user.role : [user.role];
  const requiredRoles = Array.isArray(roles) ? roles : [roles];
  
  return requiredRoles.some(role => userRoles.includes(role));
};

/**
 * Check if user has any of the required permissions
 * @param {string|string[]} permissions - Permission or array of permissions to check
 * @returns {boolean} True if user has any of the specified permissions
 */
export const hasPermission = (permissions) => {
  const user = getCurrentUser();
  if (!user || !user.permissions) return false;
  
  const userPermissions = Array.isArray(user.permissions) 
    ? user.permissions 
    : [];
  
  const requiredPermissions = Array.isArray(permissions) 
    ? permissions 
    : [permissions];
  
  return requiredPermissions.some(permission => 
    userPermissions.includes(permission)
  );
};

/**
 * Get the authorization header for API requests
 * @returns {Object} Headers object with Authorization if token exists
 */
export const getAuthHeader = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Handle API error responses
 * @param {Error} error - The error object
 * @returns {Promise<never>} Rejected promise with error details
 */
export const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { status, data } = error.response;
    
    if (status === 401) {
      // Unauthorized - clear session and redirect to login
      clearSession();
      window.location.href = '/login';
    }
    
    return Promise.reject({
      status,
      message: data?.message || 'An error occurred',
      errors: data?.errors || {},
    });
  } else if (error.request) {
    // The request was made but no response was received
    return Promise.reject({
      status: 0,
      message: 'No response from server. Please check your connection.',
    });
  } else {
    // Something happened in setting up the request that triggered an Error
    return Promise.reject({
      status: 0,
      message: error.message || 'An error occurred',
    });
  }
};
