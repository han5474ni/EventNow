export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/;
  return re.test(password);
};

export const validatePhoneNumber = (phone) => {
  // Basic phone number validation (10-15 digits, can start with +)
  const re = /^[+]?[0-9]{10,15}$/;
  return re.test(phone);
};

export const validateRequired = (value) => {
  return value && value.trim() !== '';
};

export const validateMinLength = (value, min) => {
  return value && value.length >= min;
};

export const validateMaxLength = (value, max) => {
  return value && value.length <= max;
};

export const validateDate = (date) => {
  return date && !isNaN(Date.parse(date));
};

export const validateFutureDate = (date) => {
  return new Date(date) > new Date();
};

export const validateNumber = (value) => {
  return !isNaN(value) && !isNaN(parseFloat(value));
};

export const validateMinValue = (value, min) => {
  return parseFloat(value) >= min;
};

export const validateMaxValue = (value, max) => {
  return parseFloat(value) <= max;
};
