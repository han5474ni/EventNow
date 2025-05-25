import React from 'react';
import { cn } from '../../utils/helpers';

const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
  className = '',
  showText = false,
  text = 'Loading...',
  textClassName = '',
}) => {
  const sizeClasses = {
    xs: 'h-4 w-4',
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-12 w-12',
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    danger: 'text-red-600',
    warning: 'text-yellow-600',
    light: 'text-gray-300',
    dark: 'text-gray-800',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div className={cn('animate-spin rounded-full border-b-2 border-current', 
        sizeClasses[size] || sizeClasses['md'],
        colorClasses[color] || colorClasses['primary'],
        'border-t-transparent'
      )}>
        <span className="sr-only">Loading...</span>
      </div>
      {showText && (
        <p className={cn('mt-2 text-sm text-gray-600', textClassName)}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
