import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { config } from '../../config';

const Hero = () => {
  const [nearestEvent, setNearestEvent] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration - remove this in production
  useEffect(() => {
    const mockEvent = {
      id: 1,
      title: 'International Conference on Computer Science',
      location: 'San Francisco, CA',
      start_datetime: '2025-06-15T10:00:00',
      image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      short_description: 'Join us for the biggest tech conference of the year with industry leaders and innovative minds.'
    };
    
    setNearestEvent(mockEvent);
    startCountdown(mockEvent.start_datetime);
    setLoading(false);
    
    // Uncomment this in production
    /*
    const fetchNearestEvent = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/events/upcoming?limit=1`);
        if (response.data && response.data.length > 0) {
          const event = response.data[0];
          setNearestEvent(event);
          startCountdown(event.start_datetime);
        }
      } catch (error) {
        console.error('Error fetching nearest event:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNearestEvent();
    */
  }, []);

  const startCountdown = (endDate) => {
    let countdownTimer; // Declare the variable at the function scope

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = new Date(endDate).getTime() - now;

      if (distance < 0) {
        if (countdownTimer) clearInterval(countdownTimer);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ 
        days: days.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0')
      });
    };

    updateCountdown();
    countdownTimer = setInterval(updateCountdown, 1000);
    
    // Cleanup function to clear the interval when component unmounts or when endDate changes
    return () => {
      if (countdownTimer) clearInterval(countdownTimer);
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!nearestEvent) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
        <h1 className="text-4xl font-bold mb-4">No Upcoming Events</h1>
        <p className="text-xl mb-8">Check back later for upcoming events</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${nearestEvent.image_url || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'})`,
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Event Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {nearestEvent.title}
          </h1>
          
          {/* Event Date */}
          <div className="flex items-center justify-center space-x-2 text-white/80 mb-8">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-lg">{formatDate(nearestEvent.start_datetime)}</span>
          </div>
          
          {/* Location */}
          <div className="flex items-center justify-center space-x-2 text-white/80 mb-12">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-lg">{nearestEvent.location || 'Online Event'}</span>
          </div>
          
          {/* Countdown Timer */}
          <div className="flex justify-center space-x-2 sm:space-x-4 mb-12">
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 w-16 sm:w-20">
                <div className="text-2xl sm:text-3xl font-bold text-white">{timeLeft.days}</div>
              </div>
              <div className="text-sm text-white/70 mt-2">Days</div>
            </div>
            
            <div className="text-3xl font-bold text-white flex items-center">:</div>
            
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 w-16 sm:w-20">
                <div className="text-2xl sm:text-3xl font-bold text-white">{timeLeft.hours}</div>
              </div>
              <div className="text-sm text-white/70 mt-2">Hours</div>
            </div>
            
            <div className="text-3xl font-bold text-white flex items-center">:</div>
            
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 w-16 sm:w-20">
                <div className="text-2xl sm:text-3xl font-bold text-white">{timeLeft.minutes}</div>
              </div>
              <div className="text-sm text-white/70 mt-2">Minutes</div>
            </div>
            
            <div className="text-3xl font-bold text-white flex items-center">:</div>
            
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 w-16 sm:w-20">
                <div className="text-2xl sm:text-3xl font-bold text-white">{timeLeft.seconds}</div>
              </div>
              <div className="text-sm text-white/70 mt-2">Seconds</div>
            </div>
          </div>
          
          {/* Register Button */}
          <Link 
            to={`/events/${nearestEvent.id}`}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-md text-lg transition-colors duration-200"
          >
            Register Now
          </Link>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Hero;
