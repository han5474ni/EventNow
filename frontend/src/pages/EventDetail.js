import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { config, API_ENDPOINTS } from '../config';
import { FiArrowLeft, FiCalendar, FiMapPin, FiDollarSign, FiUsers, FiMessageSquare, FiStar, FiClock } from 'react-icons/fi';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [comments, setComments] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [commentName, setCommentName] = useState('Anonymous');
  const [rating, setRating] = useState(5);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentError, setCommentError] = useState('');
  const navigate = useNavigate();
  
  const user = useSelector(state => state.auth.user);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  
  // Add gradient background style
  const gradientStyle = {
    background: 'linear-gradient(135deg, #FFD700 0%, #0000FF 50%, #000000 75%, #FF0000 100%)',
    backgroundSize: '200% 200%',
    animation: 'gradient 10s ease infinite',
  };
  
  // Add animation for the gradient
  const globalStyles = `
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `;

  // Add global styles
  React.useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = globalStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, [globalStyles]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching event details for ID:', id);
        const eventResponse = await axios.get(`${config.API_URL}/events/${id}`);
        console.log('Event data received:', eventResponse.data);
        
        // Log all event data for debugging
        console.log('Event title:', eventResponse.data.title);
        console.log('Event description:', eventResponse.data.description);
        console.log('Event max_participants:', eventResponse.data.max_participants);
        console.log('Event registration_link:', eventResponse.data.registration_link);
        console.log('Event registration_deadline:', eventResponse.data.registration_deadline);
        
        // Check if image_url exists and log it
        if (eventResponse.data.image_url) {
          console.log('Image URL from API:', eventResponse.data.image_url);
          console.log('Full image URL:', `${config.API_URL}${eventResponse.data.image_url}`);
        } else {
          console.log('No image URL in event data');
        }
        
        setEvent(eventResponse.data);
        
        // Menggunakan endpoint comments yang benar
        try {
          const commentsResponse = await axios.get(`${config.API_URL}/comments/event/${id}`);
          console.log('Comments response:', commentsResponse.data);
          setComments(commentsResponse.data);
        } catch (commentErr) {
          console.error('Error fetching comments:', commentErr);
          // Tetap melanjutkan meskipun gagal mengambil komentar
          setComments([]);
        }
        
        if (isAuthenticated) {
          try {
            const recommendationsResponse = await axios.get(API_ENDPOINTS.RECOMMENDATIONS.EVENTS, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('eventnow_token') || sessionStorage.getItem('eventnow_token')}`
              }
            });
            console.log('Recommendations response:', recommendationsResponse.data);
            setRecommendedEvents(recommendationsResponse.data);
          } catch (recErr) {
            console.error('Error fetching recommendations:', recErr);
            // Tetap melanjutkan meskipun gagal mengambil rekomendasi
            setRecommendedEvents([]);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Failed to load event details. Please try again later.');
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, isAuthenticated]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    try {
      setCommentSubmitting(true);
      console.log('Submitting comment for event ID:', id);
      console.log('Comment text:', commentText);
      console.log('Rating:', rating);
      
      // Ensure event_id is a number
      const eventId = parseInt(id);
      if (isNaN(eventId)) {
        console.error('Invalid event ID:', id);
        alert('Invalid event ID');
        setCommentSubmitting(false);
        return;
      }
      
      // Ensure rating is a number between 1-5
      const ratingValue = parseInt(rating);
      if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
        console.error('Invalid rating value:', rating);
        alert('Please select a rating between 1 and 5');
        setCommentSubmitting(false);
        return;
      }
      
      // Prepare comment data
      const commentData = {
        event_id: eventId,
        content: commentText,
        rating: ratingValue,
        anonymous: true, // Mark as anonymous comment
        author_name: commentName || 'Anonymous' // Use provided name or default to 'Anonymous'
      };
      
      console.log('Sending comment data:', commentData);
      
      // Get token if user is logged in
      const token = localStorage.getItem('eventnow_token') || sessionStorage.getItem('eventnow_token');
      
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Add authorization header only if user is logged in
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios.post(`${config.API_URL}/comments`, commentData, { headers });
      
      console.log('Comment submission response:', response.data);
      
      // Add the new comment to the list
      const newComment = {
        ...response.data,
        author: {
          full_name: commentName || 'Anonymous'
        }
      };
      
      setComments([...comments, newComment]);
      setCommentText('');
      setRating(5);
      setCommentSubmitting(false);
      alert('Comment submitted successfully!');
    } catch (err) {
      console.error('Error submitting comment:', err);
      let errorMessage = 'Failed to submit comment. Please try again later.';
      
      if (err.response) {
        console.error('Error response data:', err.response.data);
        console.error('Error response status:', err.response.status);
        
        if (err.response.data && err.response.data.detail) {
          errorMessage = err.response.data.detail;
        }
      }
      
      alert(errorMessage);
      setCommentSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error || 'Event not found'}</p>
        </div>
        <Link to="/events" className="text-blue-600 hover:underline">Back to Events</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      <div className="container mx-auto">
        <div className="relative overflow-hidden" style={gradientStyle}>
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="container mx-auto px-4 py-6 relative z-10">
            <div className="flex items-center">
              <button 
                onClick={() => navigate(-1)} 
                className="flex items-center text-white hover:text-gray-200 transition-colors"
              >
                <FiArrowLeft className="w-5 h-5 mr-1" />
                <span>Back to Events</span>
              </button>
            </div>
            
            <div className="mt-8 mb-12 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Event Details</h1>
              <div className="w-24 h-1 bg-white mx-auto rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {/* Event Header Section */}
        <div className="mb-6">
          {/* Event Image Section */}
          <div className="relative w-full h-64 md:h-80 mb-6 overflow-hidden rounded-lg">
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
                      e.target.src = 'https://via.placeholder.com/800x400?text=' + encodeURIComponent(event.title);
                      e.target.onerror = null; // Prevent infinite loop
                    };
                  }} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <span className={`inline-block px-3 py-1 text-sm rounded-full mb-3 ${
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
                  <h1 className="text-3xl font-bold mb-2 text-white">{event.title}</h1>
                  <p className="text-gray-200">Organized by {event.organizer?.full_name || 'Unknown'}</p>
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                <span className="text-gray-500 text-xl font-medium">{event.title}</span>
              </div>
            )}
          </div>
          
          {/* Registration Button */}
          <div className="flex flex-wrap gap-4 mt-6">
            {isAuthenticated ? (
              event.registration_link ? (
                <a 
                  href={event.registration_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center px-8 py-3 overflow-hidden text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-full hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"></span>
                  <span className="relative flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    Register Now
                  </span>
                </a>
              ) : (
                <button
                  disabled
                  className="px-6 py-3 bg-gray-300 text-gray-600 rounded-full font-medium cursor-not-allowed focus:outline-none"
                >
                  Registration Closed
                </button>
              )
            ) : (
              <Link 
                to="/login" 
                state={{ from: `/events/${id}` }}
                className="group relative inline-flex items-center px-8 py-3 overflow-hidden text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"></span>
                <span className="relative flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Login to Register
                </span>
              </Link>
            )}
            
            {event.registration_deadline && (
              <div className="flex items-center text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-full">
                <FiClock className="mr-1 text-blue-500" />
                Registration closes {new Date(event.registration_deadline).toLocaleDateString()}
              </div>
            )}
          </div>
          
          {/* Event Details */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Event Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Date & Time</h3>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p className="text-gray-800">
                      {formatDate(event.start_datetime)}
                      {event.end_datetime && (
                        <span> to {formatDate(event.end_datetime)}</span>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <p className="text-gray-800">{event.location}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Price</h3>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="text-gray-800">
                      {event.price === 0 ? 'Free' : `$${event.price}`}
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Capacity</h3>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    <p className="text-gray-800">
                      {event.max_participants ? `${event.max_participants} attendees` : 'Unlimited'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Event Description */}
        <div className="p-8">
          <div className="border-b border-gray-200 pb-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Event</h2>
            <div className="prose max-w-none text-gray-600 leading-relaxed">
              <p className="whitespace-pre-line">{event.description}</p>
            </div>
          </div>
          
          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <FiCalendar className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Date & Time</h3>
              </div>
              <p className="text-gray-600 ml-11">
                {formatDate(event.start_datetime)}
                {event.end_datetime && (
                  <span className="block">to {formatDate(event.end_datetime)}</span>
                )}
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <FiMapPin className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Location</h3>
              </div>
              <p className="text-gray-600 ml-11">
                {event.location || 'Online Event'}
                {event.online_event && (
                  <span className="block text-sm text-blue-600 mt-1">This is an online event</span>
                )}
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                  <FiDollarSign className="w-5 h-5 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Price</h3>
              </div>
              <p className="text-gray-600 ml-11">
                {!event.price && event.price !== 0 ? (
                  <span className="text-gray-500">Price not specified</span>
                ) : event.price === 0 ? (
                  <span className="text-green-600 font-semibold">Free</span>
                ) : (
                  <span className="font-semibold">${Number(event.price).toFixed(2)}</span>
                )}
                {event.max_participants > 0 && (
                  <span className="block text-sm text-gray-500 mt-1">
                    Max {event.max_participants} participants
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Comments Section */}
      <div className="container mx-auto px-4 mt-12 mb-16">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Comments & Reviews</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-yellow-500 to-red-500 mb-6 rounded-full"></div>
        
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Share Your Experience</h3>
            <form onSubmit={handleSubmitComment}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex items-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                      aria-label={`Rate ${star} out of 5`}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-6 w-6 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-500">{rating} out of 5</span>
                </div>
              </div>
              
              <div className="mb-4">
                {!isAuthenticated && (
                  <div className="mb-3">
                    <label htmlFor="comment-name" className="block text-sm font-medium text-gray-700 mb-1">Your Name (Optional)</label>
                    <input
                      type="text"
                      id="comment-name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your name (leave blank to remain anonymous)"
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                    />
                  </div>
                )}
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Your Comment</label>
                <textarea
                  id="comment"
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Share your thoughts about this event..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required
                ></textarea>
                <p className="text-sm text-gray-500 mt-1">Your comment will be visible to all event attendees.</p>
              </div>
              
              <div className="flex justify-between items-center">
                <button
                  type="submit"
                  disabled={commentSubmitting}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 flex items-center"
                >
                  {commentSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FiMessageSquare className="mr-2" />
                      Post Comment
                    </>
                  )}
                </button>
                <div className="text-sm text-gray-500">
                  {commentError && <span className="text-red-500">{commentError}</span>}
                </div>
              </div>
            </form>
          </div>
        
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
              </svg>
              <p className="text-gray-600 mb-2">No comments yet.</p>
              <p className="text-gray-500 text-sm">Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center font-semibold mr-3">
                        {comment.author && comment.author.full_name ? comment.author.full_name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div>
                        <p className="font-semibold">{comment.author && comment.author.full_name ? comment.author.full_name : 'Anonymous'}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    {comment.rating && (
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 ${star <= comment.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-1 text-xs text-gray-600">{comment.rating}.0</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="pl-13 ml-13">
                    <p className="whitespace-pre-line text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isAuthenticated && recommendedEvents.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recommended Events For You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedEvents.slice(0, 3).map((recEvent) => (
              <div key={recEvent.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full mb-2 ${
                    recEvent.category === 'academic' ? 'bg-blue-100 text-blue-800' :
                    recEvent.category === 'culture' ? 'bg-purple-100 text-purple-800' :
                    recEvent.category === 'sports' ? 'bg-green-100 text-green-800' :
                    recEvent.category === 'seminar' ? 'bg-yellow-100 text-yellow-800' :
                    recEvent.category === 'workshop' ? 'bg-indigo-100 text-indigo-800' :
                    recEvent.category === 'competition' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {recEvent.category ? recEvent.category.charAt(0).toUpperCase() + recEvent.category.slice(1) : 'Other'}
                  </span>
                  <h3 className="text-lg font-semibold mb-2">{recEvent.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{recEvent.description}</p>
                  <Link to={`/events/${recEvent.id}`} className="text-blue-600 hover:underline text-sm">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default EventDetail;
