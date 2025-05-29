import { DATE_FORMATS } from '../config';

/**
 * Format a date string with customizable options
 * @param {string|Date} dateString - The date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  };
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, defaultOptions);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Format time from a date string
 * @param {string|Date} dateString - The date to format
 * @returns {string} Formatted time string (HH:MM AM/PM)
 */
export const formatTime = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};

/**
 * Format a date and time string in a readable format
 * @param {string|Date} dateString - The date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  return formatDate(dateString, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format a numeric amount as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: 'USD')
 * @param {string} locale - The locale to use (default: 'en-US')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  if (amount === null || amount === undefined) return '';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return amount.toString();
  }
};

/**
 * Truncate text to a specified length and add ellipsis if needed
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}...`;
};

/**
 * Generate initials from a name
 * @param {string} name - The full name
 * @param {number} maxLength - Maximum number of initials to return
 * @returns {string} Uppercase initials
 */
export const getInitials = (name, maxLength = 2) => {
  if (!name) return '';
  
  try {
    return name
      .split(/\s+/)
      .filter(part => part.length > 0)
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, maxLength);
  } catch (error) {
    console.error('Error generating initials:', error);
    return '';
  }
};

/**
 * Get a full URL for a file path
 * @param {string} filePath - The file path or URL
 * @param {string} baseUrl - Base URL to prepend if filePath is relative
 * @returns {string|null} Full URL or null if invalid
 */
export const getFileUrl = (filePath, baseUrl = '') => {
  if (!filePath) return null;
  
  // If it's already a full URL, return as is
  if (filePath.startsWith('http') || filePath.startsWith('//') || filePath.startsWith('data:')) {
    return filePath;
  }
  
  // If it's an absolute path (starts with /), use the base URL
  if (filePath.startsWith('/')) {
    return `${baseUrl}${filePath}`;
  }
  
  // Otherwise, assume it's a relative path
  return `${baseUrl}/${filePath}`;
};

/**
 * Format a duration in milliseconds to a human-readable string
 * @param {number} ms - Duration in milliseconds
 * @returns {string} Formatted duration (e.g., "2h 30m")
 */
export const formatDuration = (ms) => {
  if (!ms && ms !== 0) return '';
  
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

/**
 * Format a number with thousands separators
 * @param {number|string} number - The number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number string
 */
export const formatNumber = (number, decimals = 0) => {
  if (number === null || number === undefined) return '';
  
  const num = typeof number === 'string' ? parseFloat(number) : number;
  if (isNaN(num)) return number.toString();
  
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

/**
 * Convert a string to title case
 * @param {string} str - The string to convert
 * @returns {string} Title-cased string
 */
export const toTitleCase = (str) => {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

/**
 * Format a count with proper pluralization
 * @param {number} count - The count
 * @param {string} singular - Singular form of the noun
 * @param {string} [plural] - Optional plural form (defaults to singular + 's')
 * @returns {string} Formatted count with noun
 */
export const pluralize = (count, singular, plural) => {
  if (count === 1) return `1 ${singular}`;
  const pluralForm = plural || `${singular}s`;
  return `${formatNumber(count)} ${pluralForm}`;
};

/**
 * Format a date as a relative time string (e.g., "2 days ago")
 * @param {string|Date} date - The date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const target = new Date(date);
  const diffInSeconds = Math.floor((now - target) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };
  
  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    
    if (interval >= 1) {
      return interval === 1 
        ? `${interval} ${unit} ago`
        : `${interval} ${unit}s ago`;
    }
  }
  
  return 'just now';
};

