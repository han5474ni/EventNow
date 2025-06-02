import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiUsers } from 'react-icons/fi';
import axios from 'axios';
import { config } from '../config';
import { format, parseISO, formatDistanceToNow } from 'date-fns';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState('');
  const [participantsCount, setParticipantsCount] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/events/${id}`);
        setEvent(response.data);
        setParticipantsCount(response.data.participants_count || 0);
        
        // Check registration status
        const now = new Date();
        const registrationStart = new Date(response.data.registration_start);
        const registrationEnd = new Date(response.data.registration_end);
        
        if (now < registrationStart) {
          setRegistrationStatus('upcoming');
        } else if (now > registrationEnd) {
          setRegistrationStatus('closed');
        } else {
          setRegistrationStatus('open');
        }
        
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const formatDateRange = (start, end) => {
    const startDate = parseISO(start);
    const endDate = parseISO(end);
    
    if (format(startDate, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd')) {
      // Same day, show time range
      return (
        <>
          <span>{format(startDate, 'EEEE, MMMM d, yyyy')}</span>
          <span className="block text-sm text-gray-600">
            {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
          </span>
        </>
      );
    }
    
    // Different days, show date range
    return `${format(startDate, 'EEEE, MMMM d, yyyy')} - ${format(endDate, 'EEEE, MMMM d, yyyy')}`;
  };

  // Registration is now handled by direct link in the button

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="mb-4">{error || 'Event not found'}</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isCapacityFull = event.capacity && participantsCount >= event.capacity;
  const isRegistrationOpen = registrationStatus === 'open';
  const isRegistered = registrationStatus === 'registered';
  const isRegistrationUpcoming = registrationStatus === 'upcoming';
  const isRegistrationClosed = registrationStatus === 'closed';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
      </header>

      {/* Event Banner with Image */}
      <div className="relative h-64 md:h-96 w-full overflow-hidden bg-gray-200">
        {event.image_url ? (
          <>
            <img 
              src={`${config.API_URL.replace('/api', '')}${event.image_url.startsWith('/') ? '' : '/'}${event.image_url}`}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Error loading image:', event.image_url);
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/1200x400?text=Event+Image+Not+Found';
              }}
              loading="lazy"
            />
            {/* Overlay with title when image loads */}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h1 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg">{event.title}</h1>
                <p className="text-xl md:text-2xl drop-shadow-md">
                  {format(parseISO(event.start_datetime), 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="text-center text-white p-6">
              <h1 className="text-3xl md:text-5xl font-bold mb-2">{event.title}</h1>
              <p className="text-xl md:text-2xl">
                {format(parseISO(event.start_datetime), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
          </div>
        )}
        
      </div>
      
      {/* Image Gallery Thumbnails - Add if you have multiple images */}
      {event.gallery && event.gallery.length > 0 && (
        <div className="container mx-auto px-4 py-4">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {event.gallery.map((img, index) => (
              <div key={index} className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 border-transparent hover:border-blue-500 transition-colors">
                <img 
                  src={img.thumbnail || img.url} 
                  alt={`${event.title} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column */}
          <div className="md:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{event.title}</h2>
                {isRegistrationOpen && (
                  <a
                    href={event.registration_link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!event.registration_link) {
                        e.preventDefault();
                        setError('No registration link available for this event.');
                      }
                    }}
                    className={`inline-flex items-center px-6 py-2 rounded-md font-medium text-white ${
                      isCapacityFull 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : isRegistered 
                          ? 'bg-green-500' 
                          : 'bg-blue-600 hover:bg-blue-700'
                    } transition-colors`}
                  >
                    {isRegistered 
                      ? 'Registered' 
                      : isCapacityFull 
                        ? 'Event Full' 
                        : 'Register Now'}
                    {!isRegistered && !isCapacityFull && event.registration_link && (
                      <span className="ml-2 text-xs opacity-80">(Opens in new tab)</span>
                    )}
                  </a>
                )}
                {isRegistrationUpcoming && (
                  <button 
                    disabled
                    className="px-6 py-2 bg-gray-400 text-white rounded-md font-medium cursor-not-allowed"
                  >
                    Registration Opens {formatDistanceToNow(parseISO(event.registration_start))}
                  </button>
                )}
                {isRegistrationClosed && (
                  <button 
                    disabled
                    className="px-6 py-2 bg-gray-400 text-white rounded-md font-medium cursor-not-allowed"
                  >
                    Registration Closed
                  </button>
                )}
              </div>
              
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">About This Event</h3>
                <div className="text-gray-700 space-y-4">
                  {event.description ? (
                    <div dangerouslySetInnerHTML={{ __html: event.description }} />
                  ) : (
                    <p>No description available for this event.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Event Details Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Event Details</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-blue-600 mt-0.5">
                    <FiCalendar className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Date & Time</p>
                    <p className="text-sm text-gray-600">
                      {formatDateRange(event.start_datetime, event.end_datetime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-blue-600 mt-0.5">
                    <FiMapPin className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Location</p>
                    <p className="text-sm text-gray-600">
                      {event.location || 'Online'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-blue-600 mt-0.5">
                    <FiUsers className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Capacity</p>
                    <p className="text-sm text-gray-600">
                      {event.capacity 
                        ? `${participantsCount} of ${event.capacity} spots filled` 
                        : 'Unlimited'}
                    </p>
                    {event.capacity && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ 
                            width: `${Math.min(100, (participantsCount / event.capacity) * 100)}%` 
                          }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-xl font-semibold mb-4">Event Status</h3>
              
              <div className="space-y-4">
                <div>
                  {isRegistrationOpen && (
                  <a
                    href={event.registration_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3 px-4 rounded-md font-medium text-white ${
                      isRegistered 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    } transition-colors`}
                  >
                    {isRegistered ? 'Already Registered' : 'Register Now'}
                    {!isRegistered && event.registration_link && (
                      <span className="ml-2 text-xs opacity-80">(External Link)</span>
                    )}
                  </a>
                  )}
                  
                  {isCapacityFull && (
                    <button
                      disabled
                      className="w-full py-3 px-4 bg-gray-400 text-white rounded-md font-medium cursor-not-allowed"
                    >
                      Event Full
                    </button>
                  )}
                  
                  {isRegistrationUpcoming && (
                    <button 
                      disabled
                      className="w-full py-3 px-4 bg-gray-400 text-white rounded-md font-medium cursor-not-allowed"
                    >
                      Registration Opens {formatDistanceToNow(parseISO(event.registration_start))}
                    </button>
                  )}
                  
                  {isRegistrationClosed && (
                    <button 
                      disabled
                      className="w-full py-3 px-4 bg-gray-400 text-white rounded-md font-medium cursor-not-allowed"
                    >
                      Registration Closed
                    </button>
                  )}
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Duration</span>
                    <span className="text-sm text-gray-900">
                      {Math.ceil((new Date(event.end_datetime) - new Date(event.start_datetime)) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Format</span>
                    <span className="text-sm text-gray-900">
                      {event.is_online ? 'Online' : 'In-Person'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Participants</span>
                    <span className="text-sm text-gray-900">
                      {participantsCount}+ {participantsCount === 1 ? 'person' : 'people'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default EventDetail;
