const { renderHook, act } = require('@testing-library/react-hooks');
const { useForm } = require('../useForm');

// Mock validation function
const validate = (values) => {
  const errors = {};
  
  if (!values.name) {
    errors.name = 'Name is required';
  } else if (values.name.length < 3) {
    errors.name = 'Name must be at least 3 characters';
  }
  
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email is invalid';
  }
  
  return errors;
};

describe('useForm', () => {
  const initialValues = {
    name: '',
    email: '',
  };

  it('initializes with default values', () => {
    const { result } = renderHook(() => useForm({ initialValues }));
    
    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isValid).toBe(false);
  });

  it('updates field value on change', () => {
    const { result } = renderHook(() => useForm({ initialValues }));
    
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'John' }
      });
    });
    
    expect(result.current.values.name).toBe('John');
  });

  it('validates on blur when validateOnBlur is true', () => {
    const { result } = renderHook(() => 
      useForm({ 
        initialValues, 
        validate,
        validateOnBlur: true 
      })
    );
    
    act(() => {
      result.current.handleBlur({
        target: { name: 'name' }
      });
    });
    
    expect(result.current.touched.name).toBe(true);
    expect(result.current.errors.name).toBe('Name is required');
  });

  it('validates on change when validateOnChange is true', () => {
    const { result } = renderHook(() => 
      useForm({ 
        initialValues: { ...initialValues, name: 'Jo' },
        validate,
        validateOnChange: true 
      })
    );
    
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'J' }
      });
    });
    
    expect(result.current.errors.name).toBe('Name must be at least 3 characters');
  });

  it('calls onSubmit when form is valid', async () => {
    const onSubmit = jest.fn();
    const { result } = renderHook(() => 
      useForm({ 
        initialValues: { name: 'John', email: 'john@example.com' },
        onSubmit,
        validate 
      })
    );
    
    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn()
      });
    });
    
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      { name: 'John', email: 'john@example.com' },
      expect.anything()
    );
    expect(result.current.isSubmitting).toBe(false);
  });

  it('sets errors and does not call onSubmit when form is invalid', async () => {
    const onSubmit = jest.fn();
    const { result } = renderHook(() => 
      useForm({ 
        initialValues: { name: '', email: 'invalid' },
        onSubmit,
        validate 
      })
    );
    
    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn()
      });
    });
    
    expect(onSubmit).not.toHaveBeenCalled();
    expect(result.current.errors.name).toBe('Name is required');
    expect(result.current.errors.email).toBe('Email is invalid');
    expect(result.current.isSubmitting).toBe(false);
  });

  it('resets the form to initial values', () => {
    const { result } = renderHook(() => 
      useForm({ 
        initialValues: { name: 'John', email: 'john@example.com' },
        validate 
      })
    );
    
    // Change values
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'Jane' }
      });
      result.current.handleBlur({ target: { name: 'name' } });
    });
    
    // Reset form
    act(() => {
      result.current.resetForm();
    });
    
    expect(result.current.values).toEqual({ name: 'John', email: 'john@example.com' });
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it('sets field value programmatically', () => {
    const { result } = renderHook(() => useForm({ initialValues }));
    
    act(() => {
      result.current.setFieldValue('name', 'John');
    });
    
    expect(result.current.values.name).toBe('John');
  });

  it('sets field touched programmatically', () => {
    const { result } = renderHook(() => useForm({ initialValues }));
    
    act(() => {
      result.current.setFieldTouched('name', true);
    });
    
    expect(result.current.touched.name).toBe(true);
  });

  it('sets field error programmatically', () => {
    const { result } = renderHook(() => useForm({ initialValues }));
    
    act(() => {
      result.current.setFieldError('name', 'Custom error');
    });
    
    expect(result.current.errors.name).toBe('Custom error');
  });

  it('validates the entire form', async () => {
    const { result } = renderHook(() => 
      useForm({ 
        initialValues: { name: '', email: '' },
        validate 
      })
    );
    
    await act(async () => {
      const isValid = await result.current.validateForm();
      expect(isValid).toBe(false);
    });
    
    expect(result.current.errors.name).toBe('Name is required');
    expect(result.current.errors.email).toBe('Email is required');
  });

  it('handles async validation', async () => {
    const asyncValidate = jest.fn().mockImplementation((values) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const errors = {};
          if (values.username === 'taken') {
            errors.username = 'Username is already taken';
          }
          resolve(errors);
        }, 100);
      });
    });
    
    const { result } = renderHook(() => 
      useForm({
        initialValues: { username: '' },
        validate: asyncValidate
      })
    );
    
    // Test with taken username
    await act(async () => {
      result.current.setFieldValue('username', 'taken');
      await result.current.validateForm();
    });
    
    expect(result.current.errors.username).toBe('Username is already taken');
    
    // Test with available username
    await act(async () => {
      result.current.setFieldValue('username', 'available');
      const isValid = await result.current.validateForm();
      expect(isValid).toBe(true);
    });
    
    expect(result.current.errors.username).toBeUndefined();
  });

  it('handles form submission with async validation', async () => {
    const asyncValidate = jest.fn().mockResolvedValue({});
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    
    const { result } = renderHook(() => 
      useForm({
        initialValues: { name: 'John' },
        validate: asyncValidate,
        onSubmit
      })
    );
    
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() });
    });
    
    expect(asyncValidate).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalled();
    expect(result.current.isSubmitting).toBe(false);
  });

  it('handles form reset with new initial values', () => {
    const { result, rerender } = renderHook(
      ({ initialValues }) => useForm({ initialValues }),
      { initialProps: { initialValues: { name: 'John' } } }
    );
    
    // Change value
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'Jane' }
      });
    });
    
    // Update initial values
    rerender({ initialValues: { name: 'Mike' } });
    
    // Reset form
    act(() => {
      result.current.resetForm();
    });
    
    expect(result.current.values.name).toBe('Mike');
  });
});
