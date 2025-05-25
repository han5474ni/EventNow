import React, { useState, Children, cloneElement } from 'react';
import { cn } from '../../utils/helpers';

const Tabs = ({
  children,
  defaultActiveKey,
  onChange,
  className = '',
  tabListClassName = '',
  tabClassName = '',
  activeTabClassName = '',
  contentClassName = '',
  variant = 'default', // 'default', 'underline', 'pills', 'segmented'
  size = 'md', // 'sm', 'md', 'lg'
  fullWidth = false,
  centered = false,
  ...props
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveKey || (Children.toArray(children)[0]?.props.tabKey || 0));

  const variants = {
    default: {
      tab: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
      active: 'border-blue-500 text-blue-600',
    },
    underline: {
      tab: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
      active: 'border-b-2 border-blue-500 text-blue-600',
    },
    pills: {
      tab: 'rounded-md text-gray-600 hover:bg-gray-100',
      active: 'bg-blue-100 text-blue-700',
    },
    segmented: {
      tab: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
      active: 'bg-blue-50 border-blue-200 text-blue-700',
    },
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const handleTabClick = (tabKey, disabled, e) => {
    if (disabled) return;
    
    setActiveTab(tabKey);
    if (onChange) {
      onChange(tabKey, e);
    }
  };

  const tabs = [];
  const tabPanes = [];

  Children.forEach(children, (child, index) => {
    if (!child) return;
    
    const tabKey = child.props.tabKey || index;
    const isActive = activeTab === tabKey;
    const isDisabled = child.props.disabled || false;
    const icon = child.props.icon;
    const count = child.props.count;

    // Add tab
    tabs.push(
      <button
        key={`tab-${tabKey}`}
        role="tab"
        aria-selected={isActive}
        aria-disabled={isDisabled}
        onClick={(e) => handleTabClick(tabKey, isDisabled, e)}
        className={cn(
          'flex items-center justify-center whitespace-nowrap font-medium',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
          'transition-colors duration-200',
          sizes[size],
          variants[variant]?.tab || variants.default.tab,
          isActive ? (variants[variant]?.active || variants.default.active) : '',
          isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          fullWidth ? 'flex-1' : '',
          tabClassName,
          isActive && activeTabClassName
        )}
        disabled={isDisabled}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {child.props.tab}
        {typeof count === 'number' && (
          <span className={cn(
            'ml-2 px-2 py-0.5 rounded-full text-xs font-medium',
            isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
          )}>
            {count}
          </span>
        )}
      </button>
    );

    // Add tab pane
    if (isActive) {
      tabPanes.push(
        <div 
          key={`tabpane-${tabKey}`}
          role="tabpanel"
          className={contentClassName}
          aria-labelledby={`tab-${tabKey}`}
        >
          {child.props.children}
        </div>
      );
    }
  });

  return (
    <div className={cn('w-full', className)} {...props}>
      <div 
        className={cn(
          'flex',
          variant === 'segmented' ? 'p-1 bg-gray-100 rounded-lg' : 'border-b border-gray-200',
          centered ? 'justify-center' : '',
          tabListClassName
        )}
        role="tablist"
      >
        {tabs}
      </div>
      <div className="mt-4">
        {tabPanes}
      </div>
    </div>
  );
};

const Tab = ({ children }) => {
  return <>{children}</>;
};

Tabs.Tab = Tab;

export default Tabs;
