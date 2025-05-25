import React from 'react';
import { cn } from '../../utils/helpers';

const Card = ({
  children,
  className = '',
  header,
  footer,
  title,
  subtitle,
  image,
  imageAlt = '',
  imagePosition = 'top', // 'top', 'left', 'right', 'bottom'
  hoverEffect = false,
  onClick,
  ...props
}) => {
  const isClickable = typeof onClick === 'function';
  
  const renderImage = () => {
    if (!image) return null;
    
    return (
      <div className={cn(
        'overflow-hidden',
        imagePosition === 'left' || imagePosition === 'right' 
          ? 'w-1/3' 
          : 'w-full',
        {
          'rounded-t-lg': imagePosition !== 'bottom' && imagePosition !== 'right',
          'rounded-l-lg': imagePosition === 'right',
          'rounded-r-lg': imagePosition === 'left',
          'rounded-b-lg': imagePosition === 'bottom',
        }
      )}>
        {typeof image === 'string' ? (
          <img 
            src={image} 
            alt={imageAlt} 
            className={cn(
              'w-full h-full object-cover',
              {
                'h-48': imagePosition === 'top' || imagePosition === 'bottom',
                'h-full': imagePosition === 'left' || imagePosition === 'right',
              }
            )} 
          />
        ) : (
          image
        )}
      </div>
    );
  };
  
  const renderContent = () => (
    <div 
      className={cn(
        'p-4',
        {
          'flex-1': imagePosition === 'left' || imagePosition === 'right',
        }
      )}
    >
      {title && (
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          {title}
        </h3>
      )}
      {subtitle && (
        <p className="text-sm text-gray-500 mb-3">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );

  const cardContent = (
    <>
      {header && (
        <div className="px-4 pt-4">
          {header}
        </div>
      )}
      
      <div className={cn(
        'flex',
        {
          'flex-col': imagePosition === 'top' || imagePosition === 'bottom',
          'flex-row': imagePosition === 'left' || imagePosition === 'right',
        }
      )}>
        {(imagePosition === 'left' || imagePosition === 'top') && renderImage()}
        {renderContent()}
        {(imagePosition === 'right' || imagePosition === 'bottom') && renderImage()}
      </div>
      
      {footer && (
        <div className="px-4 pb-4">
          {footer}
        </div>
      )}
    </>
  );

  const cardClasses = cn(
    'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden',
    'transition-all duration-200',
    {
      'hover:shadow-md hover:border-gray-300': hoverEffect,
      'cursor-pointer': isClickable,
    },
    className
  );

  if (isClickable) {
    return (
      <button 
        onClick={onClick} 
        className={cn(cardClasses, 'text-left block w-full')}
        {...props}
      >
        {cardContent}
      </button>
    );
  }

  return (
    <div className={cardClasses} {...props}>
      {cardContent}
    </div>
  );
};

export default Card;
