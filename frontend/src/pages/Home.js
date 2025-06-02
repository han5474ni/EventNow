import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { config } from '../config';
import Hero from '../components/home/Hero';
import { FiSearch, FiClock, FiMapPin, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Helper function to format time from ISO string to 12-hour format
const formatTime = (dateTimeString) => {
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
  const [searchQuery, setSearchQuery] = useState('');
  
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
            limit: 6
          },
          timeout: 10000
        });
        
        if (!isMounted) return;
        
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
        if (!isMounted) return;
        
        let errorMessage = 'Failed to load events. Please try again later.';
        if (err.code === 'ECONNABORTED') {
          errorMessage = 'Request timed out. Please check your connection and try again.';
        } else if (err.response) {
          console.error('Server error:', err.response.status, err.response.data);
        } else if (err.request) {
          console.error('No response received:', err.request);
          errorMessage = 'Could not connect to the server. Please check your connection.';
        }
        
        setError(errorMessage);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchEvents();
    
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-gray-50 p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-md w-full">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      {/* Hero Section */}
      <Hero />
    </div>
  );
};

export default Home;
