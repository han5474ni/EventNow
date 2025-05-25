export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return re.test(password);
};

export const validateEventForm = (formData) => {
  const errors = {};
  
  if (!formData.title?.trim()) {
    errors.title = 'Title is required';
  } else if (formData.title.length < 5) {
    errors.title = 'Title must be at least 5 characters';
  }
  
  if (!formData.description?.trim()) {
    errors.description = 'Description is required';
  } else if (formData.description.length < 20) {
    errors.description = 'Description must be at least 20 characters';
  }
  
  if (!formData.category) {
    errors.category = 'Category is required';
  }
  
  if (!formData.start_date) {
    errors.start_date = 'Start date is required';
  } else if (new Date(formData.start_date) < new Date()) {
    errors.start_date = 'Start date cannot be in the past';
  }
  
  if (!formData.end_date) {
    errors.end_date = 'End date is required';
  } else if (formData.start_date && new Date(formData.end_date) < new Date(formData.start_date)) {
    errors.end_date = 'End date must be after start date';
  }
  
  if (formData.capacity !== undefined && formData.capacity < 1) {
    errors.capacity = 'Capacity must be at least 1';
  }
  
  if (formData.price !== undefined && formData.price < 0) {
    errors.price = 'Price cannot be negative';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateRegistrationForm = (formData) => {
  const errors = {};
  
  if (!formData.full_name?.trim()) {
    errors.full_name = 'Full name is required';
  }
  
  if (!formData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (formData.phone && !/^[0-9+\-\s()]{10,20}$/.test(formData.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateCommentForm = (formData) => {
  const errors = {};
  
  if (!formData.content?.trim()) {
    errors.content = 'Comment cannot be empty';
  } else if (formData.content.length < 10) {
    errors.content = 'Comment must be at least 10 characters';
  }
  
  if (formData.rating !== undefined && (formData.rating < 1 || formData.rating > 5)) {
    errors.rating = 'Rating must be between 1 and 5';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
