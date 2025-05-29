import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { config } from '../config';

// Import Hero component
import Hero from '../components/home/Hero';

// Import Card component
import Card from '../components/common/Card';



// Helper function to format time from ISO string to 12-hour format
const formatTime = (dateTimeString) => {
  if (!dateTimeString) return 'TBD';
  const date = new Date(dateTimeString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const Home = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDetailClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  useEffect(() => {
    let isMounted = true; // Track if component is mounted

    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get upcoming events sorted by start date (closest first)
        const response = await axios.get(`${config.API_URL}/events`, {
          params: {
            sort: 'start_datetime',
            upcoming: true,
            limit: 6 // Limit to 6 events for the grid
          },
          timeout: 10000 // 10 second timeout
        });
        
        if (!isMounted) return; // Don't update state if component unmounted
        
        if (response.data && Array.isArray(response.data)) {
          setEvents(response.data);
        } else {
          console.warn('Unexpected API response format:', response.data);
          setEvents([]);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        if (!isMounted) return; // Don't update state if component unmounted
        
        let errorMessage = 'Failed to load events. Please try again later.';
        if (err.code === 'ECONNABORTED') {
          errorMessage = 'Request timed out. Please check your internet connection.';
        } else if (err.response) {
          // The request was made and the server responded with a status code
          console.error('Server responded with error status:', err.response.status);
          if (err.response.status === 404) {
            errorMessage = 'Events endpoint not found. Please contact support.';
          } else if (err.response.status >= 500) {
            errorMessage = 'Server error. Please try again later.';
          }
        } else if (err.request) {
          // The request was made but no response was received
          console.error('No response received:', err.request);
          errorMessage = 'No response from server. Please check your connection.';
        }
        
        setError(errorMessage);
        setEvents([]); // Set empty events on error
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchEvents();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  // Process image URL with better handling for different formats
  const getImageUrl = (url) => {
    if (!url) return null;
    
    // If URL is already a full URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If URL starts with /uploads, construct full URL
    if (url.startsWith('/uploads/')) {
      return `${config.API_URL}${url}`;
    }
    
    // If URL is just a filename, assume it's in the uploads directory
    if (!url.includes('/') && !url.startsWith('data:')) {
      return `${config.API_URL}/uploads/${url}`;
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading events...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero />
      
      {/* Upcoming Events Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
          <Link to="/events" className="text-blue-600 hover:underline font-medium">
            View All Events
          </Link>
        </div>
        
        {events.length === 0 ? (
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">No Upcoming Events</h3>
            <p className="mb-6">Check back later for new events</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const imageUrl = getImageUrl(event.image_url);
              
              return (
                <Card
                  key={event.id}
                  id={event.id}
                  title={event.title || 'Untitled Event'}
                  date={event.start_datetime || new Date().toISOString()}
                  time={event.start_datetime ? formatTime(event.start_datetime) : 'TBD'}
                  location={event.location || 'Online'}
                  image={imageUrl}
                  imageAlt={event.title || 'Event'}
                  isFree={event.is_free || false}
                  category={event.category || 'General'}
                  onDetailClick={handleDetailClick}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
