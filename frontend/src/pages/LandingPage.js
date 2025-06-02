import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { config } from '../config';
import MainLayout from '../components/layouts/MainLayout';
import CountdownTimer from '../components/CountdownTimer';

const LandingPage = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchUpcomingEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${config.API_URL}/events`, {
          params: {
            sort: 'start_datetime',
            upcoming: true,
            limit: 3
          },
          timeout: 10000
        });

        if (!isMounted) return;

        if (response.data && Array.isArray(response.data)) {
          setUpcomingEvents(response.data);
        } else {
          console.warn('Unexpected API response format:', response.data);
          setUpcomingEvents([]);
        }
      } catch (err) {
        console.error('Error fetching upcoming events:', err);
        if (isMounted) {
          setError('Gagal memuat event yang akan datang. Silakan coba lagi nanti.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUpcomingEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Tanggal belum ditentukan';
    try {
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Tanggal tidak valid';
    }
  };

  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
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
  
  // Handle image error
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop if placeholder also fails
    e.target.src = 'https://via.placeholder.com/400x225?text=Event+Image+Not+Available';
  };

  // Get the next upcoming event for the countdown
  const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;

  const handleRetryFetch = () => {
    window.location.reload();
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <main className="flex-grow">
          {/* Hero Section with Countdown */}
          <section className="relative py-20 md:py-32 bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-6xl mx-auto">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-12"
                >
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    {nextEvent ? 'UPCOMING!' : 'EVENT!'}
                  </h1>
                  <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                    {nextEvent 
                      ? 'AYO SAMA-SAMA MERIAHKAN EVENT SEPSIAL BULAN INI'
                      : 'AYO SAMA-SAMA MERIAHKAN EVENT SEPSIAL BULAN INI!'}
                  </p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mb-12"
                >
                  {loading ? (
                    <div className="h-64 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                    </div>
                  ) : nextEvent ? (
                    <CountdownTimer 
                      targetDate={nextEvent.start_datetime} 
                      event={nextEvent} 
                    />
                  ) : (
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 text-center">
                      <p className="text-xl">Tidak ada event yang akan datang</p>
                      <p className="text-blue-100 mt-2">Nantikan event-event menarik kami selanjutnya!</p>
                    </div>
                  )}
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-center"
                >
                  <Link 
                    to="/events"
                    className="inline-block bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full font-semibold text-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
                  >
                    Lihat Semua Event
                  </Link>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Upcoming Events Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Event Mendatang</h2>
              
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-500 mb-4">{error}</p>
                  <button 
                    onClick={handleRetryFetch}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Coba Lagi
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {upcomingEvents.slice(0, 3).map((event, index) => {
                    const imageUrl = event.image_url || `https://source.unsplash.com/random/600x400/?event,${index}`;
                    
                    return (
                      <motion.div
                        key={event.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.03 }}
                        className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full cursor-pointer"
                        onClick={() => navigate(`/events/${event.id}`)}
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={getImageUrl(event.image_url || event.image)}
                            alt={event.title || 'Event'}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            onError={handleImageError}
                          />
                          {(!event.price || event.price === 0) && (
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
                              <FaCalendarAlt className="mr-2 text-blue-500 flex-shrink-0" />
                              <span>{formatDate(event.start_datetime) || 'Date not specified'}</span>
                            </div>
                            {event.start_datetime && (
                              <div className="flex items-center">
                                <FaClock className="mr-2 text-blue-500 flex-shrink-0" />
                                <span>{formatTime(event.start_datetime) || 'Time TBD'}</span>
                              </div>
                            )}
                            <div className="flex">
                              <FaMapMarkerAlt className="mt-0.5 mr-2 flex-shrink-0 text-blue-500" />
                              <span className="line-clamp-2">{event.location || 'Location not specified'}</span>
                            </div>
                          </div>
                          
                          <div className="mt-auto pt-4 flex justify-between items-center">
                            <span className="text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors">
                              Lihat Detail <FaArrowRight className="ml-1" />
                            </span>
                            
                            {event.price > 0 && (
                              <span className="text-sm font-medium text-gray-900">
                                Rp {parseInt(event.price).toLocaleString('id-ID')}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
              
              {upcomingEvents.length > 0 && (
                <div className="text-center mt-12">
                  <Link 
                    to="/events" 
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Lihat Semua Event
                  </Link>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </MainLayout>
  );
};

export default LandingPage;