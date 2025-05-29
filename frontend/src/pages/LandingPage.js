import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaArrowRight, FaClock } from 'react-icons/fa';
import CountdownTimer from '../components/CountdownTimer';
import axios from 'axios';
import { config } from '../config';

const LandingPage = () => {
  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
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

  // Get the next upcoming event for the countdown
  const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
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
                {nextEvent ? 'Event Terdekat Akan Segera Dimulai!' : 'Event Menarik Akan Datang'}
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                {nextEvent 
                  ? 'Siap-siap untuk pengalaman tak terlupakan di event spesial kami. Hitung mundur telah dimulai!'
                  : 'Nantikan event-event menarik yang akan datang. Segera hadir!'}
              </p>
            </motion.div>
            
            {/* Countdown Timer with Event Preview */}
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
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Event Mendatang</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Persiapkan dirimu untuk event-event seru yang akan datang</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 text-blue-600 hover:underline"
              >
                Coba Lagi
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event, index) => (
                    <motion.div
                      key={event.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col"
                      onClick={() => navigate(`/events/${event.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={event.image_url || `https://source.unsplash.com/random/600x400/?event,${index}`} 
                          alt={event.title} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://source.unsplash.com/random/600x400/?event,${index}`;
                          }}
                        />
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center text-sm text-blue-600 font-medium">
                              <FaCalendarAlt className="mr-1.5" />
                              <span>{formatDate(event.start_datetime || event.date)}</span>
                            </div>
                            {event.start_datetime && (
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <FaClock className="mr-1.5" />
                                <span>{formatTime(event.start_datetime)} WIB</span>
                              </div>
                            )}
                          </div>
                          {(!event.price || event.price === 0) ? (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              Gratis
                            </span>
                          ) : (
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              Rp {parseInt(event.price || 0).toLocaleString('id-ID')}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold mb-2 line-clamp-2">{event.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                          {event.description || 'Deskripsi tidak tersedia'}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <FaMapMarkerAlt className="mr-1.5 text-blue-500 flex-shrink-0" />
                          <span className="line-clamp-1">{event.location || 'Lokasi tidak tersedia'}</span>
                        </div>
                        <div className="mt-auto">
                          <button className="w-full text-center bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium transition-colors duration-300">
                            Lihat Detail <FaArrowRight className="inline ml-1.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500">Tidak ada event yang akan datang</p>
                  </div>
                )}
              </div>
              
              {upcomingEvents.length > 0 && (
                <div className="text-center mt-12">
                  <Link 
                    to="/events" 
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold text-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
                  >
                    Lihat Semua Event
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
