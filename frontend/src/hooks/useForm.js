import { useState } from 'react';

export const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    // Handle different input types
    let inputValue;
    if (type === 'checkbox') {
      inputValue = checked;
    } else if (type === 'file') {
      inputValue = files[0];
    } else {
      inputValue = value;
    }

    setValues({
      ...values,
      [name]: inputValue,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });

    // Validate on blur if validate function is provided
    if (validate) {
      const { errors: validationErrors } = validate(values);
      setErrors({
        ...errors,
        [name]: validationErrors[name],
      });
    }
  };

  const handleSubmit = (onSubmit) => (e) => {
    e.preventDefault();
    
    if (validate) {
      const { isValid, errors: validationErrors } = validate(values);
      setErrors(validationErrors);
      
      if (isValid) {
        onSubmit(values);
      } else {
        // Mark all fields as touched to show errors
        const allTouched = {};
        Object.keys(values).forEach(key => {
          allTouched[key] = true;
        });
        setTouched(allTouched);
      }
    } else {
      onSubmit(values);
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  const setFieldValue = (name, value) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  const setFieldError = (name, error) => {
    setErrors({
      ...errors,
      [name]: error,
    });
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    setValues,
    isValid: Object.keys(errors).length === 0 || !Object.values(errors).some(Boolean),
  };
};

export default useForm;
