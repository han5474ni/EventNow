import React from 'react';
import { cn } from '../../utils/helpers';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = 'full',
  className = '',
  icon: Icon,
  onRemove,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center font-medium';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-cyan-100 text-cyan-800',
    light: 'bg-gray-50 text-gray-600',
    dark: 'bg-gray-800 text-white',
    outline: 'bg-transparent border border-gray-300 text-gray-700',
  };

  const sizes = {
    xs: 'text-xs px-2 py-0.5',
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1',
  };

  const roundedVariants = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const iconSizes = {
    xs: 'h-3 w-3',
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const hasRemove = typeof onRemove === 'function';
  const showIcon = Icon || hasRemove;

  return (
    <span
      className={cn(
        baseClasses,
        variants[variant] || variants.default,
        sizes[size] || sizes.md,
        roundedVariants[rounded] || roundedVariants.full,
        className
      )}
      {...props}
    >
      {Icon && (
        <Icon
          className={cn(
            'mr-1.5',
            iconSizes[size] || iconSizes.md
          )}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
      {hasRemove && (
        <button
          type="button"
          onClick={onRemove}
          className={cn(
            'ml-1.5 inline-flex items-center justify-center rounded-full',
            'focus:outline-none focus:ring-2 focus:ring-offset-1',
            'transition-colors duration-200',
            {
              'text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:ring-gray-400': variant === 'default' || variant === 'light' || variant === 'outline',
              'text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:ring-blue-400': variant === 'primary',
              'text-green-400 hover:bg-green-200 hover:text-green-500 focus:ring-green-400': variant === 'success',
              'text-red-400 hover:bg-red-200 hover:text-red-500 focus:ring-red-400': variant === 'danger',
              'text-yellow-400 hover:bg-yellow-200 hover:text-yellow-500 focus:ring-yellow-400': variant === 'warning',
              'text-cyan-400 hover:bg-cyan-200 hover:text-cyan-500 focus:ring-cyan-400': variant === 'info',
              'text-gray-300 hover:bg-gray-700 hover:text-white focus:ring-gray-500': variant === 'dark',
            },
            iconSizes[size] || iconSizes.md
          )}
          aria-label="Remove"
        >
          <span className="sr-only">Remove</span>
          <svg
            className="h-2 w-2"
            fill="currentColor"
            viewBox="0 0 8 8"
          >
            <path
              fillRule="evenodd"
              d="M4 3.293l2.146-2.147a.5.5 0 01.708.708L4.707 4l2.147 2.146a.5.5 0 01-.708.708L4 4.707l-2.146 2.147a.5.5 0 01-.708-.708L3.293 4 1.146 1.854a.5.5 0 01.708-.708L4 3.293z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

export default Badge;
