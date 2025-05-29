import React from 'react';
import { FiCalendar, FiMapPin, FiClock, FiArrowRight } from 'react-icons/fi';

const Card = ({
  id,
  title,
  date,
  time,
  location,
  image,
  imageAlt = '',
  isFree = false,
  category = 'General',
  className,
  onDetailClick,
  ...props
}) => {
  const handleDetailClick = (e) => {
    if (onDetailClick) {
      e.preventDefault();
      onDetailClick(id);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Time TBD';
    return new Date(timeString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      music: 'bg-purple-100 text-purple-800',
      sports: 'bg-green-100 text-green-800',
      business: 'bg-blue-100 text-blue-800',
      technology: 'bg-indigo-100 text-indigo-800',
      education: 'bg-yellow-100 text-yellow-800',
      default: 'bg-gray-100 text-gray-800'
    };
    return colors[category?.toLowerCase()] || colors.default;
  };

  return (
    <div 
      className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-100 h-full flex flex-col ${className}`}
      {...props}
    >
      {/* Image */}
      <div className="h-40 bg-gray-100 relative overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={imageAlt || title} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.classList.add('flex', 'items-center', 'justify-center', 'bg-gray-50');
              e.target.parentElement.innerHTML = `
                <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              `;
            }}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        )}
        
        {/* Category Badge */}
        <div className={`absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(category)}`}>
          {category}
        </div>
        
        {/* Free Badge */}
        {isFree && (
          <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            FREE
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 leading-tight">
            {title}
          </h3>
          
          {/* Date and Time */}
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <FiCalendar className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
            <span className="mr-3">{formatDate(date)}</span>
            <FiClock className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
            <span>{formatTime(time || date)}</span>
          </div>
          
          {/* Location */}
          <div className="flex items-start text-gray-600 text-sm">
            <FiMapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-400" />
            <span className="line-clamp-1">{location || 'Online'}</span>
          </div>
        </div>
        
        {/* Action Button */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <button 
            onClick={handleDetailClick}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <span>View Details</span>
            <FiArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
