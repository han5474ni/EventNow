// API Configuration
export const config = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  SITE_NAME: 'EventNow',
  SITE_DESCRIPTION: 'Your campus events platform',
  BACKEND_CORS_ORIGINS: ['http://localhost:3000', 'http://localhost:8000']
};

export const API_BASE_URL = config.API_URL;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    ME: `${API_BASE_URL}/auth/me`,
    UPDATE_PROFILE: `${API_BASE_URL}/auth/me`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
  },
  EVENTS: {
    BASE: `${API_BASE_URL}/events`,
    BY_ID: (id) => `${API_BASE_URL}/events/${id}`,
  },
  COMMENTS: {
    BASE: `${API_BASE_URL}/comments`,
    BY_EVENT: (eventId) => `${API_BASE_URL}/comments/event/${eventId}`,
    BY_ID: (id) => `${API_BASE_URL}/comments/${id}`,
  },
  REGISTRATIONS: {
    BASE: `${API_BASE_URL}/registrations`,
    MY_REGISTRATIONS: `${API_BASE_URL}/registrations/my-registrations`,
    BY_ID: (id) => `${API_BASE_URL}/registrations/${id}`,
  },
  RECOMMENDATIONS: {
    EVENTS: `${API_BASE_URL}/recommendations/events`,
    SIMILAR_EVENTS: (eventId) => 
      `${API_BASE_URL}/recommendations/similar-events/${eventId}`,
  },
};

export const APP_CONFIG = {
  APP_NAME: 'EventNow',
  DEFAULT_PAGE_SIZE: 10,
  TOKEN_KEY: 'eventnow_token',
  USER_KEY: 'eventnow_user',
};

export const EVENT_CATEGORIES = [
  { value: 'academic', label: 'Academic' },
  { value: 'culture', label: 'Culture' },
  { value: 'sports', label: 'Sports' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'competition', label: 'Competition' },
  { value: 'other', label: 'Other' },
];

export const EVENT_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const USER_ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student',
  GENERAL: 'general',
};
