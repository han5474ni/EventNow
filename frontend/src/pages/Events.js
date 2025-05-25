import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { config } from '../config';

// Date formatting is handled inline where needed

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get all events with optional filtering
        const response = await axios.get(`${config.API_URL}/events`, {
          params: {
            sort: 'start_datetime'
          }
        });
        
        if (response.data && Array.isArray(response.data)) {
          setEvents(response.data);
        } else {
          console.warn('Unexpected API response format:', response.data);
          setEvents([]);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === 'all' || event.category === filter;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) return (
    <div className="flex justify-center items-center p-12">
      <div className="loading-spinner mr-3"></div>
      <span className="text-gray-600">Loading events...</span>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Events</h1>
      
      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <label htmlFor="search" className="form-label">Search Events</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                id="search"
                type="text"
                placeholder="Search by title or description..."
                className="form-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          <div className="w-full md:w-2/3">
            <label className="form-label">Filter by Category</label>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-4 py-2 rounded-md transition-all ${filter === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setFilter('all')}
              >
                All Events
              </button>
              <button
                className={`px-4 py-2 rounded-md transition-all ${filter === 'academic' ? 'bg-blue-100 text-blue-800 shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
                onClick={() => setFilter('academic')}
              >
                Academic
              </button>
              <button
                className={`px-4 py-2 rounded-md transition-all ${filter === 'culture' ? 'bg-purple-100 text-purple-800 shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-600'}`}
                onClick={() => setFilter('culture')}
              >
                Culture
              </button>
              <button
                className={`px-4 py-2 rounded-md transition-all ${filter === 'sports' ? 'bg-green-100 text-green-800 shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600'}`}
                onClick={() => setFilter('sports')}
              >
                Sports
              </button>
              <button
                className={`px-4 py-2 rounded-md transition-all ${filter === 'seminar' ? 'bg-yellow-100 text-yellow-800 shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600'}`}
                onClick={() => setFilter('seminar')}
              >
                Seminar
              </button>
              <button
                className={`px-4 py-2 rounded-md transition-all ${filter === 'workshop' ? 'bg-indigo-100 text-indigo-800 shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'}`}
                onClick={() => setFilter('workshop')}
              >
                Workshop
              </button>
              <button
                className={`px-4 py-2 rounded-md transition-all ${filter === 'competition' ? 'bg-red-100 text-red-800 shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600'}`}
                onClick={() => setFilter('competition')}
              >
                Competition
              </button>
            </div>
          </div>
        </div>
        
        {searchTerm && (
          <div className="mt-4 text-sm text-gray-600">
            Showing results for: <span className="font-medium">"{searchTerm}"</span>
            {filter !== 'all' && <span> in <span className="font-medium">{filter}</span> category</span>}
          </div>
        )}
      </div>

      {filteredEvents.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 className="text-xl font-semibold mb-2">No Events Found</h2>
          <p className="text-gray-600 mb-4">
            {searchTerm && filter !== 'all' 
              ? `No ${filter} events matching "${searchTerm}" were found.`
              : searchTerm 
                ? `No events matching "${searchTerm}" were found.` 
                : filter !== 'all' 
                  ? `No ${filter} events are currently available.` 
                  : 'No events are currently available.'}
          </p>
          {(searchTerm || filter !== 'all') && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilter('all');
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}</p>
            <div className="text-sm text-gray-500">
              Sorted by date (upcoming first)
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="event-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  {event.image_url ? (
                    <>
                      <img 
                        src={`${config.API_URL.replace('/api', '')}/static/event_images/${event.image_url.split('/').pop()}`} 
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        onError={(e) => {
                          console.error('Image failed to load:', e);
                          console.log('Original image URL:', event.image_url);
                          console.log('Attempted URL:', `${config.API_URL.replace('/api', '')}/static/event_images/${event.image_url.split('/').pop()}`);
                          
                          // Try alternate URL format
                          const newSrc = `${config.API_URL}${event.image_url}`;
                          console.log('Trying alternate URL:', newSrc);
                          e.target.src = newSrc;
                          
                          // Add second error handler for the fallback
                          e.target.onerror = () => {
                            console.log('Fallback also failed, using placeholder');
                            e.target.src = 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(event.title);
                            e.target.onerror = null; // Prevent infinite loop
                          };
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 text-xs font-semibold bg-blue-500 text-white rounded-full">{event.category}</span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                      <span className="text-gray-500 text-lg font-medium">No Image Available</span>
                    </div>
                  )}
                  
                  {/* Category Badge - Positioned on the image */}
                  <span className={`absolute top-3 left-3 px-3 py-1 text-sm rounded-full ${
                    event.category === 'academic' ? 'bg-blue-600 text-white' :
                    event.category === 'culture' ? 'bg-purple-600 text-white' :
                    event.category === 'sports' ? 'bg-green-600 text-white' :
                    event.category === 'seminar' ? 'bg-yellow-600 text-white' :
                    event.category === 'workshop' ? 'bg-indigo-600 text-white' :
                    event.category === 'competition' ? 'bg-red-600 text-white' :
                    'bg-gray-600 text-white'
                  }`}>
                    {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                  </span>
                  
                  {/* Featured Badge */}
                  {event.is_featured && (
                    <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Featured
                    </span>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 hover:text-blue-600 transition-colors duration-300">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-2 bg-gray-50 p-2 rounded-md">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span className="font-medium">
                      {new Date(event.start_datetime).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3 bg-gray-50 p-2 rounded-md">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span className="font-medium truncate">{event.location}</span>
                  </div>
                  
                  <Link 
                    to={`/events/${event.id}`}
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                  >
                    <span>View Details</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
