import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { config } from '../config';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-cards';

// Import custom Swiper styles
import '../styles/swiper-custom.css';

// Import required modules
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'Date not set';
  try {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
            limit: 5 // Limit to 5 events for the swiper
          },
          timeout: 10000 // 10 second timeout
        });
        
        if (!isMounted) return; // Don't update state if component unmounted
        
        console.log('Fetched events for swiper:', response.data);
        
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
          // that falls out of the range of 2xx
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

  if (loading) return (
    <div className="flex justify-center items-center p-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <span className="ml-3 text-gray-600">Loading events...</span>
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
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Featured Events Carousel */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Event Terdekat</h2>
          <Link to="/events" className="text-blue-600 hover:underline">View all</Link>
        </div>
        
        {events.length === 0 ? (
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-8 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-2xl font-bold mb-4">No Upcoming Events</h1>
              <p className="text-lg mb-6">Check back later for new events</p>
              <Link to="/events" className="btn-primary bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-md font-medium">
                Browse All Events
              </Link>
            </div>
          </div>
        ) : (
          <div className="featured-events-carousel overflow-hidden relative">
            <Swiper
              grabCursor={true}
              centeredSlides={false}
              slidesPerView={1}
              spaceBetween={0}
              loop={true}
              speed={1000}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true
              }}
              navigation={true}
              modules={[Pagination, Navigation, Autoplay]}
              className="mySwiper"
              style={{ padding: '0' }}
            >
              {events.slice(0, 5).map((event) => (
                <SwiperSlide key={event.id}>
                  <div className="relative w-full h-full">
                    {/* Event Image */}
                    <div className="relative h-full overflow-hidden">
                      {event.image_url ? (
                        <>
                          <img 
                            src={`${config.API_URL.replace('/api', '')}/static/event_images/${event.image_url.split('/').pop()}`} 
                            alt={event.title}
                            className="w-full h-full object-cover"
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
                                e.target.src = 'https://via.placeholder.com/1200x600?text=' + encodeURIComponent(event.title);
                                e.target.onerror = null; // Prevent infinite loop
                              };
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                          <span className="text-white text-lg font-medium">No Image Available</span>
                        </div>
                      )}
                      
                      {/* Category Badge - Positioned on the image */}
                      <span className={`absolute top-5 left-5 px-3 py-1 text-sm rounded-full ${
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
                      
                      {/* Content overlay at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{event.title}</h2>
                        <p className="text-white text-opacity-90 mb-4 line-clamp-2">{event.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-white text-opacity-90 mb-4">
                          <div className="flex items-center bg-black bg-opacity-30 px-3 py-1 rounded-full">
                            <svg className="w-4 h-4 mr-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <span className="text-sm">{formatDate(event.start_datetime)}</span>
                          </div>
                          
                          {event.location && (
                            <div className="flex items-center bg-black bg-opacity-30 px-3 py-1 rounded-full">
                              <svg className="w-4 h-4 mr-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              </svg>
                              <span className="text-sm truncate max-w-[200px]">{event.location}</span>
                            </div>
                          )}
                        </div>
                        
                        <Link 
                          to={`/events/${event.id}`} 
                          className="inline-flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-md shadow-md"
                        >
                          <span>View Details</span>
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>

      {/* Upcoming Events Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Upcoming Events</h2>
          <Link to="/events" className="text-blue-600 hover:underline">View all</Link>
        </div>
        
        {events.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <p className="text-gray-600 mb-4">No upcoming events at the moment.</p>
            <Link to="/events" className="btn-primary">Browse All Events</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
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
                      {formatDate(event.start_datetime)}
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
        )}
      </div>
      
      {/* Call to Action */}
      <div className="bg-gray-50 rounded-lg p-8 text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">Ready to explore more events?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Browse our complete collection of campus events and find the perfect ones for you.
        </p>
        <Link 
          to="/events" 
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          View All Events
        </Link>
      </div>
    </div>
  );
};

export default Home;
