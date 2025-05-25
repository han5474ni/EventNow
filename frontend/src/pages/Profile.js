import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { config } from '../config';

const Profile = () => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  
  const [registrations, setRegistrations] = useState([]);
  const [showRegistrations, setShowRegistrations] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    return () => {
      // Cleanup function to prevent state updates on unmounted component
      setIsMounted(false);
    };
  }, []);

  // Update form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        full_name: user.full_name || '',
        email: user.email || ''
      }));
      
      if (isMounted) {
        fetchUserRegistrations();
      }
    }
  }, [user, isMounted]);

  const fetchUserRegistrations = async () => {
    if (!isMounted) return;
    
    try {
      setDataLoading(true);
      const token = localStorage.getItem('eventnow_token') || sessionStorage.getItem('eventnow_token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.get(`${config.API_URL}/api/users/me/registrations`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (isMounted) {
        setRegistrations(response.data || []);
        setShowRegistrations(true);
      }
    } catch (err) {
      console.error('Failed to fetch registrations', err);
      if (isMounted) {
        setShowRegistrations(false);
        if (err.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('eventnow_token');
          sessionStorage.removeItem('eventnow_token');
          window.location.href = '/login';
        }
      }
    } finally {
      if (isMounted) {
        setDataLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isMounted) return;
    
    setLoading(true);
    setSuccess(null);
    setError(null);
    
    // Validate form data
    if (!formData.full_name.trim()) {
      setError('Full name is required');
      setLoading(false);
      return;
    }
    
    // Check if passwords match when changing password
    if (formData.new_password) {
      if (formData.new_password !== formData.confirm_password) {
        setError('New passwords do not match');
        setLoading(false);
        return;
      }
      
      if (!formData.current_password) {
        setError('Current password is required to change password');
        setLoading(false);
        return;
      }
      
      if (formData.new_password.length < 6) {
        setError('New password must be at least 6 characters long');
        setLoading(false);
        return;
      }
    }
    
    try {
      const token = localStorage.getItem('eventnow_token') || sessionStorage.getItem('eventnow_token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Prepare data for API
      const profileData = {
        name: formData.full_name.trim()
      };
      
      // Include password fields if changing password
      if (formData.new_password) {
        profileData.current_password = formData.current_password;
        profileData.password = formData.new_password;
      }
      
      // Update profile
      const response = await axios.put(`${config.API_URL}/api/users/me`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Update user in Redux store
      dispatch({
        type: 'auth/updateUser',
        payload: response.data
      });
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        current_password: '',
        new_password: '',
        confirm_password: ''
      }));
      
      setSuccess('Profile updated successfully');
    } catch (err) {
      console.error('Profile update error:', err);
      if (err.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('eventnow_token');
        sessionStorage.removeItem('eventnow_token');
        window.location.href = '/login';
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="mb-4">
            <button 
              onClick={fetchUserRegistrations}
              className="text-blue-600 hover:underline"
            >
              {showRegistrations ? 'Hide My Registrations' : 'Show My Registrations'}
            </button>
          </div>
          
          {showRegistrations && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">My Event Registrations</h2>
              {dataLoading ? (
                <p>Loading registrations...</p>
              ) : registrations.length > 0 ? (
                <div className="space-y-4">
                  {registrations.map(reg => (
                    <div key={reg.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold">{reg.event?.title || 'Event'}</h3>
                      <p>Status: {reg.status || 'Registered'}</p>
                      <p>Registered at: {new Date(reg.created_at).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No event registrations found.</p>
              )}
            </div>
          )}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                <p className="text-green-700">{success}</p>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      className="w-full px-4 py-2 border rounded-md bg-gray-100"
                      disabled
                    />
                    <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Change Password</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      id="current_password"
                      name="current_password"
                      value={formData.current_password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div></div> {/* Empty div for grid alignment */}
                  
                  <div>
                    <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      id="new_password"
                      name="new_password"
                      value={formData.new_password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirm_password"
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Your Event Registrations</h2>
            
            {dataLoading ? (
              <p className="text-gray-500">Loading your registrations...</p>
            ) : registrations.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">You haven't registered for any events yet.</p>
                <Link to="/events" className="text-blue-600 hover:underline">Browse Events</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {registrations.map((registration) => (
                  <div key={registration.id} className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">{registration.event.title}</h3>
                    <div className="text-sm text-gray-600 mb-2">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full mr-2 ${
                        registration.event.category === 'academic' ? 'bg-blue-100 text-blue-800' :
                        registration.event.category === 'culture' ? 'bg-purple-100 text-purple-800' :
                        registration.event.category === 'sports' ? 'bg-green-100 text-green-800' :
                        registration.event.category === 'seminar' ? 'bg-yellow-100 text-yellow-800' :
                        registration.event.category === 'workshop' ? 'bg-indigo-100 text-indigo-800' :
                        registration.event.category === 'competition' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {registration.event.category.charAt(0).toUpperCase() + registration.event.category.slice(1)}
                      </span>
                      <span>
                        {new Date(registration.event.start_datetime).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        registration.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        registration.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        registration.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                      </span>
                      <Link to={`/events/${registration.event.id}`} className="text-blue-600 hover:underline text-sm">
                        View Event
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
