import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/helpers';
import { ChevronDown, Check, X } from 'lucide-react';

const Dropdown = ({
  children,
  trigger,
  placement = 'bottom-start', // 'bottom-start', 'bottom-end', 'top-start', 'top-end'
  triggerClassName = '',
  contentClassName = '',
  menuClassName = '',
  itemClassName = '',
  activeItemClassName = '',
  showArrow = true,
  closeOnSelect = true,
  closeOnBlur = true,
  disabled = false,
  isOpen: isOpenProp,
  onOpenChange,
  onSelect,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const isControlled = isOpenProp !== undefined;
  const dropdownIsOpen = isControlled ? isOpenProp : isOpen;

  // Handle controlled and uncontrolled state
  const setOpenState = (open) => {
    if (!isControlled) {
      setIsOpen(open);
    }
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  // Position the dropdown menu
  const updatePosition = () => {
    if (!triggerRef.current || !menuRef.current) return;
    
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    
    let top, left;
    
    switch (placement) {
      case 'bottom-start':
        top = triggerRect.bottom + scrollY;
        left = triggerRect.left + scrollX;
        break;
      case 'bottom-end':
        top = triggerRect.bottom + scrollY;
        left = triggerRect.right + scrollX - menuRect.width;
        break;
      case 'top-start':
        top = triggerRect.top + scrollY - menuRect.height;
        left = triggerRect.left + scrollX;
        break;
      case 'top-end':
        top = triggerRect.top + scrollY - menuRect.height;
        left = triggerRect.right + scrollX - menuRect.width;
        break;
      default:
        top = triggerRect.bottom + scrollY;
        left = triggerRect.left + scrollX;
    }
    
    // Adjust for viewport edges
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Prevent menu from going off the right edge
    if (left + menuRect.width > viewportWidth + scrollX) {
      left = viewportWidth + scrollX - menuRect.width - 8;
    }
    
    // Prevent menu from going off the left edge
    if (left < scrollX) {
      left = scrollX + 8;
    }
    
    // Prevent menu from going off the bottom edge
    if (top + menuRect.height > viewportHeight + scrollY) {
      if (placement.startsWith('bottom')) {
        top = triggerRect.top + scrollY - menuRect.height;
      } else {
        top = viewportHeight + scrollY - menuRect.height - 8;
      }
    }
    
    // Prevent menu from going off the top edge
    if (top < scrollY) {
      top = scrollY + 8;
    }
    
    setPosition({ top, left });
  };

  // Toggle dropdown
  const toggleDropdown = (e) => {
    if (disabled) return;
    e?.stopPropagation();
    
    const newState = !dropdownIsOpen;
    setOpenState(newState);
    
    if (newState) {
      // Position the menu after the state updates and the menu is rendered
      setTimeout(updatePosition, 0);
    }
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (
      menuRef.current && 
      !menuRef.current.contains(e.target) && 
      triggerRef.current && 
      !triggerRef.current.contains(e.target)
    ) {
      setOpenState(false);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!dropdownIsOpen) return;
    
    const menuItems = Array.from(
      menuRef.current?.querySelectorAll('[role="menuitem"]') || []
    );
    
    if (!menuItems.length) return;
    
    const currentIndex = menuItems.indexOf(document.activeElement);
    
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setOpenState(false);
        triggerRef.current?.focus();
        break;
        
      case 'ArrowDown':
        e.preventDefault();
        if (currentIndex < menuItems.length - 1) {
          menuItems[currentIndex + 1]?.focus();
        } else {
          menuItems[0]?.focus();
        }
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        if (currentIndex > 0) {
          menuItems[currentIndex - 1]?.focus();
        } else {
          menuItems[menuItems.length - 1]?.focus();
        }
        break;
        
      case 'Tab':
        if (!e.shiftKey && currentIndex === menuItems.length - 1) {
          e.preventDefault();
          menuItems[0]?.focus();
        } else if (e.shiftKey && currentIndex <= 0) {
          e.preventDefault();
          menuItems[menuItems.length - 1]?.focus();
        }
        break;
        
      case 'Home':
        e.preventDefault();
        menuItems[0]?.focus();
        break;
        
      case 'End':
        e.preventDefault();
        menuItems[menuItems.length - 1]?.focus();
        break;
        
      default:
        break;
    }
  };

  // Handle item selection
  const handleSelect = (value, itemProps, e) => {
    if (onSelect) {
      onSelect(value, itemProps, e);
    }
    
    if (closeOnSelect) {
      setOpenState(false);
      triggerRef.current?.focus();
    }
  };

  // Add event listeners
  useEffect(() => {
    if (dropdownIsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [dropdownIsOpen]);

  // Update position when content changes
  useEffect(() => {
    if (dropdownIsOpen) {
      updatePosition();
    }
  }, [dropdownIsOpen, children]);

  // Clone the trigger to add ref and event handlers
  const triggerElement = React.isValidElement(trigger) 
    ? React.cloneElement(trigger, {
        ref: (node) => {
          triggerRef.current = node;
          // Call the original ref if it exists
          if (trigger.ref) {
            if (typeof trigger.ref === 'function') {
              trigger.ref(node);
            } else {
              trigger.ref.current = node;
            }
          }
        },
        'aria-haspopup': 'menu',
        'aria-expanded': dropdownIsOpen,
        'aria-controls': props.id,
        onClick: (e) => {
          toggleDropdown(e);
          trigger.props.onClick?.(e);
        },
        onKeyDown: (e) => {
          if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
            e.preventDefault();
            if (!dropdownIsOpen) {
              setOpenState(true);
            }
            // Focus first menu item when opened with keyboard
            if (dropdownIsOpen && e.key === 'ArrowDown') {
              setTimeout(() => {
                const firstItem = menuRef.current?.querySelector('[role="menuitem"]');
                firstItem?.focus();
              }, 0);
            }
          }
          trigger.props.onKeyDown?.(e);
        },
        className: cn(
          'inline-flex items-center justify-between',
          { 'opacity-50 cursor-not-allowed': disabled },
          triggerClassName,
          trigger.props.className
        ),
      })
    : (
        <button
          ref={triggerRef}
          type="button"
          className={cn(
            'inline-flex items-center justify-between',
            'px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm',
            'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
            { 'opacity-50 cursor-not-allowed': disabled },
            triggerClassName
          )}
          disabled={disabled}
          aria-haspopup="menu"
          aria-expanded={dropdownIsOpen}
          aria-controls={props.id}
          onClick={toggleDropdown}
          onKeyDown={(e) => {
            if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
              e.preventDefault();
              if (!dropdownIsOpen) {
                setOpenState(true);
              }
              // Focus first menu item when opened with keyboard
              if (dropdownIsOpen && e.key === 'ArrowDown') {
                setTimeout(() => {
                  const firstItem = menuRef.current?.querySelector('[role="menuitem"]');
                  firstItem?.focus();
                }, 0);
              }
            }
          }}
        >
          {trigger || 'Options'}
          {showArrow && (
            <ChevronDown 
              className={cn(
                'ml-2 h-4 w-4',
                { 'transform rotate-180': dropdownIsOpen }
              )} 
              aria-hidden="true" 
            />
          )}
        </button>
      );

  // Clone children to add event handlers and classes
  const menuItems = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return null;
    
    if (child.type === Dropdown.Item) {
      return React.cloneElement(child, {
        onClick: (e) => {
          handleSelect(child.props.value || index, child.props, e);
          child.props.onClick?.(e);
        },
        className: cn(
          'block w-full text-left px-4 py-2 text-sm text-gray-700',
          'hover:bg-gray-100 focus:bg-gray-100',
          'focus:outline-none',
          itemClassName,
          child.props.className,
          { [activeItemClassName]: selectedItem === (child.props.value || index) }
        ),
        role: 'menuitem',
        tabIndex: -1,
      });
    }
    
    if (child.type === Dropdown.Divider) {
      return React.cloneElement(child, {
        className: cn('border-t border-gray-200 my-1', child.props.className),
        role: 'separator',
      });
    }
    
    if (child.type === Dropdown.Header) {
      return React.cloneElement(child, {
        className: cn(
          'px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider',
          child.props.className
        ),
        role: 'presentation',
      });
    }
    
    return child;
  });

  return (
    <div className={cn('relative inline-block text-left', contentClassName)}>
      {triggerElement}
      
      {dropdownIsOpen && (
        <div
          ref={menuRef}
          id={props.id}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
          className={cn(
            'absolute z-50 w-56 mt-1 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5',
            'focus:outline-none',
            'py-1',
            menuClassName
          )}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            minWidth: triggerRef.current?.offsetWidth,
          }}
        >
          {menuItems}
        </div>
      )}
    </div>
  );
};

// Sub-components
const DropdownItem = ({ children, ...props }) => (
  <div
    role="menuitem"
    tabIndex={-1}
    {...props}
  >
    {children}
  </div>
);

const DropdownDivider = (props) => (
  <div 
    className={cn('border-t border-gray-200 my-1', props.className)} 
    role="separator"
  />
);

const DropdownHeader = (props) => (
  <div 
    className={cn(
      'px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider',
      props.className
    )}
    role="presentation"
  >
    {props.children}
  </div>
);

// Attach sub-components to Dropdown
Dropdown.Item = DropdownItem;
Dropdown.Divider = DropdownDivider;
Dropdown.Header = DropdownHeader;

export default Dropdown;
