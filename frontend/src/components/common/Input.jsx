import React, { forwardRef } from 'react';
import { cn } from '../../utils/helpers';

const Input = forwardRef(
  (
    {
      label,
      id,
      name,
      type = 'text',
      placeholder = '',
      value,
      onChange,
      onBlur,
      error,
      touched,
      disabled = false,
      required = false,
      className = '',
      labelClassName = '',
      containerClassName = '',
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      ...props
    },
    ref
  ) => {
    const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;

    const inputClasses = cn(
      'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
      {
        'border-red-500': error && touched,
        'pl-10': LeftIcon,
        'pr-10': RightIcon,
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
        <div className="relative rounded-md shadow-sm">
          {LeftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LeftIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
          )}
          <input
            id={inputId}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            className={inputClasses}
            placeholder={placeholder}
            ref={ref}
            {...props}
          />
          {RightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <RightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
          )}
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

Input.displayName = 'Input';

export default Input;
