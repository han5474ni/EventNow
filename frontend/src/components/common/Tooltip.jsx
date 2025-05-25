import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/helpers';

const Tooltip = ({
  content,
  children,
  position = 'top', // 'top', 'right', 'bottom', 'left'
  delay = 200,
  className = '',
  tooltipClassName = '',
  showOnClick = false,
  disabled = false,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({});
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);
  let timeout;

  const showTooltip = () => {
    if (disabled) return;
    
    if (timeout) clearTimeout(timeout);
    
    timeout = setTimeout(() => {
      if (!triggerRef.current) return;
      
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current?.getBoundingClientRect() || { width: 0, height: 0 };
      
      let top, left;
      
      switch (position) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - 8;
          left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'right':
          top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
          left = triggerRect.right + 8;
          break;
        case 'bottom':
          top = triggerRect.bottom + 8;
          left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'left':
          top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
          left = triggerRect.left - tooltipRect.width - 8;
          break;
        default:
          top = triggerRect.top - tooltipRect.height - 8;
          left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
      }
      
      // Adjust for viewport edges
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Prevent tooltip from going off the right edge
      if (left + tooltipRect.width > viewportWidth - 10) {
        left = viewportWidth - tooltipRect.width - 10;
      }
      
      // Prevent tooltip from going off the left edge
      if (left < 10) {
        left = 10;
      }
      
      // Prevent tooltip from going off the bottom edge
      if (top + tooltipRect.height > viewportHeight - 10) {
        if (position === 'top' || position === 'bottom') {
          top = triggerRect.top - tooltipRect.height - 8;
        } else {
          top = viewportHeight - tooltipRect.height - 10;
        }
      }
      
      // Prevent tooltip from going off the top edge
      if (top < 10) {
        top = 10;
      }
      
      setCoords({ top, left });
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeout) clearTimeout(timeout);
    setIsVisible(false);
  };

  const handleClickOutside = (event) => {
    if (
      tooltipRef.current && 
      !tooltipRef.current.contains(event.target) && 
      !triggerRef.current.contains(event.target)
    ) {
      hideTooltip();
    }
  };

  useEffect(() => {
    if (isVisible && showOnClick) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeout) clearTimeout(timeout);
    };
  }, [isVisible, showOnClick]);

  const toggleTooltip = (e) => {
    if (showOnClick) {
      e.preventDefault();
      e.stopPropagation();
      
      if (isVisible) {
        hideTooltip();
      } else {
        showTooltip();
      }
    }
  };

  const eventHandlers = showOnClick
    ? {
        onClick: toggleTooltip,
      }
    : {
        onMouseEnter: showTooltip,
        onMouseLeave: hideTooltip,
        onFocus: showTooltip,
        onBlur: hideTooltip,
      };

  const tooltipClasses = cn(
    'absolute z-50 px-3 py-2 text-sm font-medium',
    'bg-gray-900 text-white rounded-md shadow-lg',
    'transition-opacity duration-200',
    'whitespace-nowrap',
    {
      'opacity-100': isVisible,
      'opacity-0 pointer-events-none': !isVisible,
    },
    tooltipClassName
  );

  const arrowClasses = cn(
    'absolute w-2 h-2 bg-gray-900 transform rotate-45',
    {
      'bottom-[-4px] left-1/2 -translate-x-1/2': position === 'top',
      'left-[-4px] top-1/2 -translate-y-1/2': position === 'right',
      'top-[-4px] left-1/2 -translate-x-1/2': position === 'bottom',
      'right-[-4px] top-1/2 -translate-y-1/2': position === 'left',
    }
  );

  return (
    <div className={cn('relative inline-block', className)} {...props}>
      <div 
        ref={triggerRef}
        className="inline-block"
        {...eventHandlers}
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={tooltipClasses}
          style={{
            top: `${coords.top}px`,
            left: `${coords.left}px`,
          }}
          role="tooltip"
        >
          <div className={arrowClasses} />
          <div className="relative z-10">{content}</div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
