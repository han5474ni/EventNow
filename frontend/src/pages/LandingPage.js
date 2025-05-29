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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const isActive = (path) => {
    return window.location.pathname === path;
  };

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600">EventNow</Link>
              
              <nav className="hidden md:ml-8 md:flex md:space-x-6">
                <Link 
                  to="/" 
                  className={`px-3 py-2 text-sm font-medium ${isActive('/') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
                >
                  Home
                </Link>
                <Link 
                  to="/events" 
                  className={`px-3 py-2 text-sm font-medium ${isActive('/events') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
                >
                  Events
                </Link>
              </nav>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                to="/login" 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Masuk
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Daftar
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={toggleMenu}
                className="text-gray-700 hover:text-blue-600 focus:outline-none"
                aria-label="Toggle menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="pt-2 pb-3 space-y-1">
                <Link
                  to="/"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/events"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/events') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Events
                </Link>
                <div className="pt-2 border-t border-gray-200">
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 mt-2 bg-blue-600 text-white text-center rounded-md text-base font-medium hover:bg-blue-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Daftar
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      
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
      </main>
      
      {/* Footer */}
      <footer className="bg-blue-950 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1: About */}
            <div>
              <h3 className="text-xl font-bold mb-4">EventNow</h3>
              <p className="text-gray-300 mb-4">Platform terbaik untuk menemukan dan mengelola event-event menarik di seluruh Indonesia.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.294 0 2.238.966 2.238 2.22V12h3.2l-.467 3.022H15.89v9.856C20.61 20.525 24 16.56 24 11.67v-.67z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427C2.013 15.1 2 14.76 2 12.044v-.08c0-2.643.012-2.987.06-4.043.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.94 2.013 9.28 2 11.996 2h.32zM12 6.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zm0 9.062a3.562 3.562 0 110-7.124 3.562 3.562 0 010 7.124zm7.5-9.062a1.28 1.28 0 100-2.56 1.28 1.28 0 000 2.56z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/events" className="text-gray-300 hover:text-white transition-colors">Events</Link></li>
                <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            {/* Column 3: Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-300">Way Huwi, Jati Agung<br />Kab. Lampung Selatan, Lampung</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:handayani.122140166@student.itera.ac.id" className="text-gray-300 hover:text-white transition-colors">handayani.122140166@student.itera.ac.id</a>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:089607993000" className="text-gray-300 hover:text-white transition-colors">0896-0799-3000</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="bg-blue-900 py-6">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-300 mb-4 md:mb-0">&copy; {new Date().getFullYear()} EventNow. All rights reserved.</p>
            <div className="flex space-x-6">
              <button onClick={() => window.location.href = '/privacy-policy'} className="text-sm text-gray-300 hover:text-white transition-colors focus:outline-none">
                Privacy Policy
              </button>
              <button onClick={() => window.location.href = '/terms-of-service'} className="text-sm text-gray-300 hover:text-white transition-colors focus:outline-none">
                Terms of Service
              </button>
              <button onClick={() => window.location.href = '/cookie-policy'} className="text-sm text-gray-300 hover:text-white transition-colors focus:outline-none">
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
