export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  EVENTS: {
    BASE: '/events',
    FEATURED: '/events/featured',
    CATEGORIES: '/events/categories',
    SEARCH: '/events/search',
  },
  USERS: {
    PROFILE: '/users/me',
    EVENTS: '/users/me/events',
    REGISTRATIONS: '/users/me/registrations',
  },
  COMMENTS: '/comments',
  RATINGS: '/ratings',
};

export const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
};

export const ROLES = {
  ADMIN: 'admin',
  ORGANIZER: 'organizer',
  USER: 'user',
};

export const EVENT_CATEGORIES = [
  'Technology',
  'Business',
  'Science',
  'Health',
  'Sports',
  'Entertainment',
  'Education',
  'Other',
];

export const DATE_FORMATS = {
  DATE: 'DD/MM/YYYY',
  DATE_TIME: 'DD/MM/YYYY HH:mm',
  TIME: 'HH:mm',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [5, 10, 20, 50],
};
