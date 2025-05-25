import React, { forwardRef } from 'react';
import { cn } from '../../utils/helpers';

const Textarea = forwardRef(
  (
    {
      label,
      id,
      name,
      placeholder = '',
      value,
      onChange,
      onBlur,
      error,
      touched,
      disabled = false,
      required = false,
      rows = 3,
      className = '',
      labelClassName = '',
      containerClassName = '',
      ...props
    },
    ref
  ) => {
    const inputId = id || name || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    const textareaClasses = cn(
      'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
      {
        'border-red-500': error && touched,
        'opacity-50 bg-gray-50': disabled,
      },
      className
    );

    const labelClasses = cn(
      'block text-sm font-medium text-gray-700 mb-1',
      { 'text-red-600': error && touched },
      labelClassName
    );

    return (
      <div className={cn('space-y-1', containerClassName)}>
        {label && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="mt-1">
          <textarea
            id={inputId}
            name={name}
            rows={rows}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            className={textareaClasses}
            placeholder={placeholder}
            ref={ref}
            {...props}
          />
        </div>
        {error && touched && (
          <p className="mt-1 text-sm text-red-600" id={`${inputId}-error`}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
