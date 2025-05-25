import React, { forwardRef } from 'react';
import { cn } from '../../utils/helpers';

const Checkbox = forwardRef(
  (
    {
      label,
      id,
      name,
      checked = false,
      onChange,
      onBlur,
      error,
      touched,
      disabled = false,
      required = false,
      className = '',
      labelClassName = '',
      containerClassName = '',
      ...props
    },
    ref
  ) => {
    const inputId = id || name || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    const checkboxClasses = cn(
      'h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500',
      {
        'border-red-500': error && touched,
        'opacity-50': disabled,
      },
      className
    );

    const labelClasses = cn(
      'ml-2 block text-sm text-gray-900',
      { 'text-red-600': error && touched },
      labelClassName
    );

    return (
      <div className={cn('flex items-start', containerClassName)}>
        <div className="flex items-center h-5">
          <input
            id={inputId}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            className={checkboxClasses}
            ref={ref}
            {...props}
          />
        </div>
        {label && (
          <div className="ml-3 text-sm">
            <label
              htmlFor={inputId}
              className={labelClasses}
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {error && touched && (
              <p className="mt-1 text-sm text-red-600" id={`${inputId}-error`}>
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
