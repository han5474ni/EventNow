/**
 * Scroll to the top of the page smoothly
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

/**
 * Toggle body scroll
 * @param {boolean} disable - Whether to disable scrolling
 */
export const toggleBodyScroll = (disable) => {
  document.body.style.overflow = disable ? 'hidden' : '';
};

/**
 * Add a class to the body element
 * @param {string} className - The class name to add
 */
export const addBodyClass = (className) => {
  document.body.classList.add(className);
};

/**
 * Remove a class from the body element
 * @param {string} className - The class name to remove
 */
export const removeBodyClass = (className) => {
  document.body.classList.remove(className);
};

/**
 * Toggle a class on the body element
 * @param {string} className - The class name to toggle
 * @param {boolean} [force] - Force add or remove the class
 */
export const toggleBodyClass = (className, force) => {
  document.body.classList.toggle(className, force);
};

/**
 * Get the current scroll position
 * @returns {number} The current scroll position in pixels
 */
export const getScrollPosition = () => {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
};

/**
 * Check if an element is in the viewport
 * @param {HTMLElement} element - The element to check
 * @param {number} [offset=0] - Optional offset in pixels
 * @returns {boolean} True if the element is in the viewport
 */
export const isInViewport = (element, offset = 0) => {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= -offset &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Debounce a function
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @returns {Function} The debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle a function
 * @param {Function} func - The function to throttle
 * @param {number} limit - The time limit in milliseconds
 * @returns {Function} The throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Copy text to clipboard
 * @param {string} text - The text to copy
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export const copyToClipboard = async (text) => {
  if (!navigator.clipboard) {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  }
  
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
};

/**
 * Generate a unique ID
 * @returns {string} A unique ID
 */
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Format a number as a percentage
 * @param {number} value - The value to format
 * @param {number} [decimals=0] - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 0) => {
  if (value === null || value === undefined) return '';
  return `${parseFloat(value).toFixed(decimals)}%`;
};

/**
 * Get the current breakpoint based on window width
 * @returns {string} The current breakpoint (xs, sm, md, lg, xl)
 */
export const getCurrentBreakpoint = () => {
  const width = window.innerWidth;
  
  if (width < 576) return 'xs';
  if (width < 768) return 'sm';
  if (width < 992) return 'md';
  if (width < 1200) return 'lg';
  return 'xl';
};

/**
 * Check if the current device is a mobile device
 * @returns {boolean} True if the current device is a mobile device
 */
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Detect if the browser supports touch events
 * @returns {boolean} True if the browser supports touch events
 */
export const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
};
