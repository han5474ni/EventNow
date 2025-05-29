import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { config } from '../config';
import Card from '../components/common/Card';
import { FiSearch } from 'react-icons/fi';

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

  // Fungsi untuk membandingkan data event dari Home dan Events
  const compareEventData = async () => {
    try {
      // Ambil data dari endpoint yang sama dengan Home
      const homeResponse = await axios.get(`${config.API_URL}/events`, {
        params: { sort: 'start_datetime', upcoming: true, limit: 5 }
      });
      
      // Ambil data dari endpoint Events
      const eventsResponse = await axios.get(`${config.API_URL}/events`);
      
      console.group('=== PERBANDINGAN DATA HOME DAN EVENTS ===');
      
      // Cek struktur data
      console.log('Tipe data Home:', Array.isArray(homeResponse.data) ? 'array' : typeof homeResponse.data);
      console.log('Tipe data Events:', Array.isArray(eventsResponse.data) ? 'array' : typeof eventsResponse.data);
      
      // Ambil event pertama dari setiap respons
      const homeEvent = homeResponse.data?.[0];
      const eventsEvent = eventsResponse.data?.[0];
      
      if (homeEvent) {
        console.log('\n=== DATA DARI HOME ===');
        console.log('ID:', homeEvent.id);
        console.log('Judul:', homeEvent.title);
        console.log('URL Gambar:', homeEvent.image_url);
        console.log('Semua properti:', Object.keys(homeEvent));
      }
      
      if (eventsEvent) {
        console.log('\n=== DATA DARI EVENTS ===');
        console.log('ID:', eventsEvent.id);
        console.log('Judul:', eventsEvent.title);
        console.log('URL Gambar:', eventsEvent.image_url);
        console.log('Semua properti:', Object.keys(eventsEvent));
      }
      
      console.groupEnd();
      
    } catch (error) {
      console.error('Error comparing event data:', error);
    }
  };


  // Panggil fungsi compareEventData saat komponen dimuat
  useEffect(() => {
    compareEventData();
    
    const fetchEvents = async () => {
      try {
        console.log('Fetching upcoming events from:', `${config.API_URL}/events`);
        
        // Fetch only upcoming events
        const response = await axios.get(`${config.API_URL}/events`, {
          params: {
            upcoming: true,
            sort: 'start_datetime',
            limit: 100 // Adjust the limit as needed
          }
        });
        
        console.log('Raw API Response:', response);
        
        if (response.data && Array.isArray(response.data)) {
          console.log('Upcoming events count:', response.data.length);
          console.log('First upcoming event:', response.data[0]);
          
          // Filter out any past events that might have slipped through
          const upcomingEvents = response.data.filter(event => {
            const eventDate = new Date(event.start_datetime || event.date);
            return eventDate >= new Date();
          });
          
          setEvents(upcomingEvents);
          
          // We're using a static list of categories now
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

  const filteredEvents = events.filter(event => {
    const matchesSearch = searchQuery === '' || 
      (event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || 
      (event.category && event.category.toLowerCase() === categoryFilter.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">
                EventNow
              </Link>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link to="/" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                  Home
                </Link>
                <Link to="/events" className="border-b-2 border-blue-500 text-gray-900 px-3 py-2 text-sm font-medium">
                  Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search events..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
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
        {(searchQuery || categoryFilter !== '') && (
          <div className="mb-6 text-sm text-gray-600">
            {searchQuery && (
              <span>Showing results for: <span className="font-medium">"{searchQuery}"</span> </span>
            )}
            {searchQuery && categoryFilter !== '' && <span>in </span>}
            {categoryFilter !== '' && (
              <span>category: <span className="font-medium">{categoryFilter}</span></span>
            )}
          </div>
        )}
        
        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            // Process image URL with better handling for different formats
            const getImageUrl = (url) => {
              console.log('Original URL:', url);
              if (!url) {
                console.log('No image URL provided');
                return null;
              }
              
              try {
                // If it's a data URL, return as is
                if (url.startsWith('data:')) {
                  console.log('Using data URL directly');
                  return url;
                }
                
                // If it's a relative URL starting with /uploads
                if (url.startsWith('/uploads/')) {
                  const fullUrl = `${config.API_URL}${url}`;
                  console.log('Constructed URL from /uploads:', fullUrl);
                  return fullUrl;
                }
                
                // If it's just a filename
                if (!url.includes('/') && !url.startsWith('http')) {
                  const fullUrl = `${config.API_URL}/uploads/${url}`;
                  console.log('Constructed URL from filename:', fullUrl);
                  return fullUrl;
                }
                
                // If it's already a full URL
                if (url.startsWith('http')) {
                  console.log('Using full URL directly:', url);
                  return url;
                }
                
                console.log('Unhandled URL format, returning null');
                return null;
              } catch (error) {
                console.error('Error processing image URL:', error);
                return null;
              }
            };
            
            const imageUrl = getImageUrl(event.image_url || event.image);
            
            // Debug logging
            console.group(`Event: ${event.id} - ${event.title}`);
            console.log('Raw Image URL:', event.image_url || event.image);
            console.log('Processed Image URL:', imageUrl);
            console.log('Full event data:', event);
            console.groupEnd();
            
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
                registrationLink={event.registration_link || '#'}
                onDetailClick={handleDetailClick}
                className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              />
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Events;
