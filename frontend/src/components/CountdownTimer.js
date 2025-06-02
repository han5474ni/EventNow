import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { config } from '../config';

const CountdownTimer = ({ targetDate, event }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();
    
    return () => clearInterval(timer);
  }, [targetDate]);

  const TimeBox = ({ value, label }) => (
    <div className="flex flex-col items-center mx-2">
      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
        <span className="text-2xl md:text-4xl font-bold text-white">
          {value < 10 ? `0${value}` : value}
        </span>
      </div>
      <span className="text-white text-sm mt-2">{label}</span>
    </div>
  );

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl my-8">
      {/* Event Preview Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={(() => {
            if (!event?.image_url) return 'https://source.unsplash.com/random/1200x400/?event';
            
            // If it's already a full URL, use it as is
            if (event.image_url.startsWith('http')) {
              return event.image_url;
            }
            
            // If it's a path starting with /static, prepend the base URL
            if (event.image_url.startsWith('/static/')) {
              return `${config.API_URL.replace('/api', '')}${event.image_url}`;
            }
            
            // For any other case, try to construct the URL
            return `${config.API_URL.replace('/api', '')}/static/event_images/${event.image_url.split('/').pop()}`;
          })()}
          alt={event?.title || 'Event'} 
          className="w-full h-full object-cover transition-all duration-500 transform hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://source.unsplash.com/random/1200x400/?event';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 p-8 text-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-2">Menuju {event?.title || 'Event Spesial'}</h3>
          <div className="flex flex-wrap items-center text-sm text-gray-200 gap-4">
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2" />
              <span>{formatDate(event?.start_datetime || targetDate)}</span>
            </div>
            {event?.location && (
              <div className="flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                <span>{event.location}</span>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Countdown Timer */}
        <div className="flex justify-center flex-wrap gap-2 py-4">
          <TimeBox value={timeLeft.days} label="Hari" />
          <TimeBox value={timeLeft.hours} label="Jam" />
          <TimeBox value={timeLeft.minutes} label="Menit" />
          <TimeBox value={timeLeft.seconds} label="Detik" />
        </div>
        
        {event?.id && (
          <div className="mt-6 text-center">
            <a 
              href={`/events/${event.id}`}
              className="inline-block bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-full font-medium transition-colors duration-300"
            >
              Lihat Detail Event
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountdownTimer;
