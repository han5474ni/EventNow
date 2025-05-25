import React, { forwardRef } from 'react';
import { cn } from '../../utils/helpers';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(
  (
    {
      label,
      id,
      name,
      value,
      onChange,
      onBlur,
      options = [],
      placeholder = 'Select an option',
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
    const inputId = id || name || `select-${Math.random().toString(36).substr(2, 9)}`;

    const selectClasses = cn(
      'appearance-none block w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
      {
        'border-red-500': error && touched,
        'opacity-50 bg-gray-50': disabled,
        'text-gray-500': !value,
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
        <div className="relative">
          <select
            id={inputId}
            name={name}
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            className={selectClasses}
            ref={ref}
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </div>
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

Select.displayName = 'Select';

export default Select;
