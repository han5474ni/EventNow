/**
 * Combines multiple class names into a single string.
 * Filters out falsy values to avoid undefined or null class names.
 * 
 * @param {...(string|Object|Array<string|Object>)} classes - Class names to combine
 * @returns {string} Combined class names as a single string
 */
export function cn(...classes) {
  return classes
    .filter(Boolean)
    .map(cls => {
      if (typeof cls === 'string') return cls;
      if (Array.isArray(cls)) return cls.filter(Boolean).join(' ');
      if (typeof cls === 'object' && cls !== null) {
        return Object.entries(cls)
          .filter(([_, value]) => Boolean(value))
          .map(([key]) => key)
          .join(' ');
      }
      return '';
    })
    .filter(Boolean)
    .join(' ');
}

/**
 * Formats a date string into a more readable format.
 * 
 * @param {string|Date} date - The date to format
 * @param {Object} options - Options for formatting
 * @param {boolean} options.includeTime - Whether to include the time in the output
 * @returns {string} Formatted date string
 */
export function formatDate(date, { includeTime = false } = {}) {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(includeTime && {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }),
  });
}

/**
 * Truncates text to a specified length and adds an ellipsis if needed.
 * 
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @param {string} [ellipsis='...'] - The ellipsis character(s) to append
 * @returns {string} Truncated text with ellipsis if needed
 */
export function truncate(text, maxLength, ellipsis = '...') {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}${ellipsis}`;
}

/**
 * Converts a string to title case.
 * 
 * @param {string} str - The string to convert
 * @returns {string} The string in title case
 */
export function toTitleCase(str) {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

/**
 * Debounces a function call to limit how often it can be invoked.
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @returns {Function} A debounced version of the function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttles a function call to limit how often it can be invoked.
 * 
 * @param {Function} func - The function to throttle
 * @param {number} limit - The time limit in milliseconds
 * @returns {Function} A throttled version of the function
 */
export function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Generates a unique ID.
 * 
 * @param {string} [prefix='id'] - A prefix for the ID
 * @returns {string} A unique ID
 */
export function generateId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Deeply merges two or more objects.
 * 
 * @param {Object} target - The target object
 * @param {...Object} sources - The source objects
 * @returns {Object} The merged object
 */
export function deepMerge(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

/**
 * Checks if a value is an object.
 * 
 * @param {*} item - The item to check
 * @returns {boolean} True if the item is an object
 */
function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Converts a string to kebab case.
 * 
 * @param {string} str - The string to convert
 * @returns {string} The string in kebab case
 */
export function toKebabCase(str) {
  if (!str) return '';
  return str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join('-');
}

/**
 * Converts a string to camel case.
 * 
 * @param {string} str - The string to convert
 * @returns {string} The string in camel case
 */
export function toCamelCase(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
}
