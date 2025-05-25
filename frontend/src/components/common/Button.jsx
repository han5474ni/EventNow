import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  onClick,
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-blue-500',
    link: 'bg-transparent text-blue-600 hover:underline p-0 h-auto',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2 text-sm',
    lg: 'h-12 px-6 py-3 text-base',
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  const iconOnly = !children && Icon;
  const iconSize = iconSizes[size] || 16;
  
  const buttonClasses = [
    baseStyles,
    variants[variant] || variants.primary,
    sizes[size] || sizes.md,
    fullWidth ? 'w-full' : '',
    iconOnly ? 'p-0 w-10 h-10 flex items-center justify-center' : '',
    className,
  ].filter(Boolean).join(' ');

  const renderIcon = () => {
    if (!Icon) return null;
    
    if (loading) {
      return <Loader2 className="animate-spin" size={iconSize} />;
    }
    
    return <Icon size={iconSize} className={children ? (iconPosition === 'left' ? 'mr-2' : 'ml-2') : ''} />;
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {Icon && iconPosition === 'left' && renderIcon()}
      {children && <span>{children}</span>}
      {Icon && iconPosition === 'right' && renderIcon()}
    </button>
  );
};

export default Button;
