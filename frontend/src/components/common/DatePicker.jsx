import React, { forwardRef, useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { format, parse, isValid } from 'date-fns';
import { cn } from '../../utils/helpers';

const DatePicker = forwardRef(
  (
    {
      label,
      id,
      name,
      value,
      onChange,
      onBlur,
      error,
      touched,
      disabled = false,
      required = false,
      placeholder = 'Select date and time',
      showTimeSelect = true,
      dateFormat = 'yyyy-MM-dd',
      timeFormat = 'HH:mm',
      timeIntervals = 30,
      minDate,
      maxDate,
      className = '',
      labelClassName = '',
      containerClassName = '',
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [date, setDate] = useState(null);
    const [time, setTime] = useState('');
    const [view, setView] = useState('date'); // 'date' or 'time'
    
    const inputId = id || name || `datepicker-${Math.random().toString(36).substr(2, 9)}`;

    // Parse the initial value
    useEffect(() => {
      if (value) {
        const dateObj = new Date(value);
        if (isValid(dateObj)) {
          setDate(dateObj);
          setInputValue(format(dateObj, `${dateFormat}${showTime ? ` ${timeFormat}` : ''}`));
          if (showTime) {
            setTime(format(dateObj, timeFormat));
          }
        }
      } else {
        setDate(null);
        setInputValue('');
        setTime('');
      }
    }, [value, dateFormat, timeFormat, showTime]);

    const handleDateSelect = (selectedDate) => {
      if (!selectedDate) return;
      
      let newDate = new Date(selectedDate);
      
      // If we already have a time, apply it to the new date
      if (time && showTime) {
        const [hours, minutes] = time.split(':').map(Number);
        newDate.setHours(hours, minutes, 0, 0);
      }
      
      setDate(newDate);
      
      if (showTime) {
        setView('time');
      } else {
        handleDateChange(newDate);
        setIsOpen(false);
      }
    };

    const handleTimeChange = (e) => {
      const newTime = e.target.value;
      setTime(newTime);
      
      if (date) {
        const [hours, minutes] = newTime.split(':').map(Number);
        const newDate = new Date(date);
        newDate.setHours(hours, minutes, 0, 0);
        handleDateChange(newDate);
      }
    };

    const handleDateChange = (selectedDate) => {
      if (!selectedDate) {
        setInputValue('');
        if (onChange) {
          const e = { target: { name, value: '' } };
          onChange(e);
        }
        return;
      }
      
      const formattedDate = format(selectedDate, `${dateFormat}${showTime ? ` ${timeFormat}` : ''}`);
      setInputValue(formattedDate);
      
      if (onChange) {
        const e = { 
          target: { 
            name, 
            value: selectedDate.toISOString() 
          } 
        };
        onChange(e);
      }
    };

    const handleInputChange = (e) => {
      const value = e.target.value;
      setInputValue(value);
      
      try {
        const parsedDate = parse(value, `${dateFormat}${showTime ? ` ${timeFormat}` : ''}`, new Date());
        if (isValid(parsedDate)) {
          setDate(parsedDate);
          if (onChange) {
            const e = { 
              target: { 
                name, 
                value: parsedDate.toISOString() 
              } 
            };
            onChange(e);
          }
        }
      } catch (error) {
        console.error('Error parsing date:', error);
      }
    };

    const handleBlur = (e) => {
      if (onBlur) {
        onBlur(e);
      }
    };

    const toggleCalendar = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
      }
    };

    const handleClear = (e) => {
      e.stopPropagation();
      setDate(null);
      setInputValue('');
      setTime('');
      
      if (onChange) {
        const e = { target: { name, value: '' } };
        onChange(e);
      }
      
      if (onBlur) {
        onBlur(e);
      }
    };

    const renderCalendar = () => {
      if (!isOpen) return null;
      
      return (
        <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4 w-72">
          {view === 'date' && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Select Date</h3>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  ✕
                </button>
              </div>
              <input
                type="date"
                className="w-full p-2 border rounded-md"
                value={date ? format(date, 'yyyy-MM-dd') : ''}
                onChange={(e) => {
                  const selectedDate = e.target.value ? new Date(e.target.value) : null;
                  handleDateSelect(selectedDate);
                }}
                min={minDate}
                max={maxDate}
              />
            </div>
          )}
          
          {view === 'time' && showTime && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Select Time</h3>
                <button
                  type="button"
                  onClick={() => setView('date')}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Back to date
                </button>
              </div>
              <input
                type="time"
                className="w-full p-2 border rounded-md"
                value={time}
                onChange={handleTimeChange}
                step={timeIntervals * 60}
              />
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      );
    };

    const labelClasses = cn(
      'block text-sm font-medium text-gray-700 mb-1',
      { 'text-red-600': error && touched },
      labelClassName
    );

    return (
      <div className={cn('relative', containerClassName)}>
        {label && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          <div className="relative">
            <input
              id={inputId}
              type="text"
              name={name}
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder={placeholder}
              disabled={disabled}
              readOnly={!showTime} // Make it read-only if we're using the calendar
              className={cn(
                'block w-full rounded-md border-gray-300 shadow-sm pl-10 pr-10 py-2 text-left',
                'focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                { 'border-red-500': error && touched },
                { 'opacity-50 bg-gray-50': disabled },
                className
              )}
              ref={ref}
              {...props}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            {inputValue && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                aria-label="Clear date"
              >
                <span className="text-lg">×</span>
              </button>
            )}
          </div>
          
          {!disabled && (
            <button
              type="button"
              onClick={toggleCalendar}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
              aria-label="Open calendar"
            >
              {showTime ? (
                <Clock className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Calendar className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          )}
        </div>
        
        {isOpen && renderCalendar()}
        
        {error && touched && (
          <p className="mt-1 text-sm text-red-600" id={`${inputId}-error`}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;
