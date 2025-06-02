import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Removed unused Link import
import axios from 'axios';
import { config } from '../config';
import { FiSearch, FiClock, FiMapPin, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Add global styles for gradients
const globalStyles = `
  .gradient-bg {
    background: linear-gradient(135deg, #FFD700 0%, #0000FF 50%, #000000 75%, #FF0000 100%);
    background-size: 200% 200%;
    animation: gradient 10s ease infinite;
    min-height: 100vh;
  }
  
  .gradient-text {
    background: linear-gradient(135deg, #FFD700, #0000FF, #000000, #FF0000);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: 300% 300%;
    animation: gradient 8s ease infinite;
  }
  
  .gradient-button {
    background: linear-gradient(135deg, #FFD700 0%, #0000FF 50%, #000000 75%, #FF0000 100%);
    background-size: 200% 200%;
    transition: all 0.3s ease;
    color: white;
    border: none;
    border-radius: 0.5rem;
    padding: 0.5rem 1.5rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .gradient-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    background-position: right center;
  }
  
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

// Add global styles to document head
const styleElement = document.createElement('style');
styleElement.innerHTML = globalStyles;
document.head.appendChild(styleElement);

// Helper function to format time from ISO string to 12-hour format
const formatTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories] = useState(['music', 'sports', 'business', 'technology', 'education']);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/events`, {
          params: {
            upcoming: true,
            sort: 'start_datetime',
            limit: 100
          }
        });

        if (response.data && Array.isArray(response.data)) {
          // Filter out past events
          const upcomingEvents = response.data.filter(event => {
            const eventDate = new Date(event.start_datetime || event.date);
            return eventDate >= new Date();
          });
          
          setEvents(upcomingEvents);
        } else {
          console.warn('Unexpected API response format:', response.data);
          setEvents([]);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDetailClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  // Filter events based on search query and category
  const filteredEvents = events.filter(event => {
    const matchesSearch = searchQuery === '' || 
      (event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || 
      (event.category && event.category.toLowerCase() === categoryFilter.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  // Removed unused isActive and toggleMenu functions
  
  // Format date to a readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not specified';
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Handle image error
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop if placeholder also fails
    e.target.src = 'https://via.placeholder.com/400x225?text=Event+Image+Not+Available';
  };
  
  // Process image URL
  const getImageUrl = (url) => {
    if (!url) {
      console.log('No URL provided to getImageUrl');
      return 'https://via.placeholder.com/400x225?text=No+Image+Available';
    }
    
    console.log('Processing image URL:', url);
    
    try {
      // If it's a data URL, return as is
      if (url.startsWith('data:')) {
        return url;
      }
      
      // If it's already a full URL, return as is
      if (url.startsWith('http')) {
        return url;
      }
      
      // Handle the case where URL might be coming from the API with /api prefix
      if (url.startsWith('/api/static/')) {
        const correctedUrl = url.replace('/api/static/', '/static/');
        const baseUrl = config.API_URL.replace('/api', '');
        return `${baseUrl}${correctedUrl}`;
      }
      
      // Handle static file paths
      if (url.startsWith('/static/')) {
        const baseUrl = config.API_URL.replace('/api', '');
        return `${baseUrl}${url}`;
      }
      
      // If it's a relative path, try to construct the full URL
      if (url.startsWith('.')) {
        const baseUrl = window.location.origin;
        return `${baseUrl}${url.replace(/^\./, '')}`;
      }
      
      // For any other case, try to construct a valid URL using the API base URL
      const baseUrl = config.API_URL.replace('/api', '');
      const filename = url.split('/').pop();
      
      // Try different possible locations for the image
      const possiblePaths = [
        `${baseUrl}/static/event_images/${filename}`,
        `${baseUrl}/static/uploads/${filename}`,
        `${baseUrl}/uploads/${filename}`,
        `${baseUrl}/images/${filename}`,
      ];
      
      // Return the first path that exists (this will be checked by the browser)
      return possiblePaths[0];
      
    } catch (error) {
      console.error('Error processing image URL:', error);
      return 'https://via.placeholder.com/400x225?text=Error+Loading+Image';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col gradient-bg">

      {/* Main Content */}
      <div className="flex-1">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-yellow-500 via-blue-600 to-red-600 bg-clip-text text-transparent mb-6 md:mb-0">
              Upcoming Events
            </h1>
            
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search events..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-48">
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Search Summary */}
          {(searchQuery || categoryFilter !== 'all') && (
            <div className="mb-8 p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
              <p className="text-sm text-gray-700">
                {searchQuery && (
                  <span>Showing results for: <span className="font-medium">"{searchQuery}"</span> </span>
                )}
                {searchQuery && categoryFilter !== 'all' && <span>in </span>}
                {categoryFilter !== 'all' && (
                  <span>category: <span className="font-medium">{categoryFilter}</span></span>
                )}
              </p>
            </div>
          )}
          
          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => {
                const imageUrl = getImageUrl(event.image_url || event.image);
                
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                  >
                    <div className="relative h-48 overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={event.title || 'Event'}
                          onError={handleImageError}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-yellow-100 to-blue-100 flex items-center justify-center">
                          <span className="text-gray-400">No Image Available</span>
                        </div>
                      )}
                      {event.is_free && (
                        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          FREE
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {event.title || 'Untitled Event'}
                      </h3>
                      
                      <div className="space-y-3 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <FiCalendar className="mr-2 text-blue-500 flex-shrink-0" />
                          <span>{formatDate(event.start_datetime) || 'Date not specified'}</span>
                        </div>
                        <div className="flex items-center">
                          <FiClock className="mr-2 text-blue-500 flex-shrink-0" />
                          <span>{event.start_datetime ? formatTime(event.start_datetime) : 'TBD'}</span>
                        </div>
                        <div className="flex">
                          <FiMapPin className="mt-0.5 mr-2 flex-shrink-0 text-blue-500" />
                          <span className="line-clamp-2">{event.location || 'Online'}</span>
                        </div>
                      </div>
                      
                      <div className="mt-auto pt-4 flex justify-between items-center">
                        <button
                          onClick={() => handleDetailClick(event.id)}
                          className="text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors"
                        >
                          View Details <FiArrowRight className="ml-1" />
                        </button>
                        
                        {event.registration_link && (
                          <a
                            href={event.registration_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gradient-button text-white text-sm font-medium px-4 py-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(event.registration_link, '_blank');
                            }}
                          >
                            Register Now
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm">
              <h3 className="text-xl font-medium text-gray-700">No events found</h3>
              <p className="mt-2 text-gray-500">
                {searchQuery || categoryFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Check back later for upcoming events.'}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Events;
