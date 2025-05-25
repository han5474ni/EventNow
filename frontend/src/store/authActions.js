import { logout, updateUser } from './authSlice';

/**
 * Log out the user and clear all storage
 */
export const logoutUser = () => (dispatch) => {
  // Clear tokens from storage
  localStorage.removeItem('eventnow_token');
  sessionStorage.removeItem('eventnow_token');
  
  // Clear any other related items
  localStorage.removeItem('persist:root');
  sessionStorage.clear();
  
  // Clear all cookies
  document.cookie.split(';').forEach(c => {
    document.cookie = c.trim().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
  });
  
  // Update Redux state
  dispatch(logout());
  
  // Force reload to clear all state
  window.location.href = '/';
};

/**
 * Update the current user's profile
 */
export const updateUserProfile = (userData) => (dispatch) => {
  dispatch(updateUser(userData));
};
