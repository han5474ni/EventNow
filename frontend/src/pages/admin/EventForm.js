import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { config } from '../../config';
import AdminLayout from '../../components/layouts/AdminLayout';

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'academic',
    location: '',
    start_datetime: '',
    end_datetime: '',
    registration_deadline: '',
    max_participants: '',
    registration_link: '',
    is_featured: false,
    image_url: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Format dates for datetime-local input
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  // Use useCallback to memoize the fetchEventDetails function
  const fetchEventDetails = useCallback(async () => {
    try {
      // Get token from localStorage or sessionStorage based on remember me functionality
      const token = localStorage.getItem('eventnow_token') || sessionStorage.getItem('eventnow_token');
      
      const response = await axios.get(`${config.API_URL}/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const event = response.data;
      
      setFormData({
        title: event.title,
        description: event.description,
        category: event.category,
        location: event.location,
        start_datetime: formatDateForInput(event.start_datetime),
        end_datetime: formatDateForInput(event.end_datetime),
        registration_deadline: formatDateForInput(event.registration_deadline),
        max_participants: event.max_participants || '',
        registration_link: event.registration_link || '',
        is_featured: event.is_featured || false,
        image_url: event.image_url || ''
      });
      
      // Set image preview if event has an image
      if (event.image_url) {
        console.log('Setting image preview URL - Original:', event.image_url);
        
        // Construct the correct static file URL
        const previewUrl = `${config.API_URL.replace('/api', '')}${event.image_url}`;
        console.log('Setting image preview URL - Modified:', previewUrl);
        
        setImagePreview(previewUrl);
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load event details. Please try again.');
      setLoading(false);
    }
  }, [id]); // Include id in the dependency array

  useEffect(() => {
    if (isEditMode) {
      fetchEventDetails();
    }
  }, [isEditMode, fetchEventDetails]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      console.log('Submitting form data:', formData);
      
      const token = localStorage.getItem('eventnow_token') || sessionStorage.getItem('eventnow_token');
      
      if (isEditMode) {
        // If we have a new image, upload it first
        if (imageFile) {
          const imageFormData = new FormData();
          imageFormData.append('image', imageFile);
          
          const imageResponse = await axios.put(`${config.API_URL}/events/${id}/image`, imageFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          });
          
          console.log('Image upload response:', imageResponse.data);
        }
        
        // Then update other event data
        const eventData = {
          ...formData,
          max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
          registration_deadline: formData.registration_deadline || null,
          registration_link: formData.registration_link || null
        };
        
        console.log('Sending event data for update:', eventData);
        
        // Use the same token for updating event data
        const updateResponse = await axios.put(`${config.API_URL}/events/${id}`, eventData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('Event update response:', updateResponse.data);
        
        navigate(`/events/${id}`);
      } else {
        // Creating a new event
        if (imageFile) {
          // Use form endpoint if we have an image
          const eventFormData = new FormData();
          eventFormData.append('title', formData.title);
          eventFormData.append('description', formData.description);
          eventFormData.append('category', formData.category);
          eventFormData.append('location', formData.location);
          eventFormData.append('start_datetime', formData.start_datetime);
          eventFormData.append('end_datetime', formData.end_datetime);
          
          if (formData.registration_deadline) {
            console.log('Adding registration_deadline:', formData.registration_deadline);
            eventFormData.append('registration_deadline', formData.registration_deadline);
          }
          
          if (formData.max_participants) {
            console.log('Adding max_participants:', formData.max_participants);
            eventFormData.append('max_participants', parseInt(formData.max_participants));
          }
          
          if (formData.registration_link) {
            console.log('Adding registration_link:', formData.registration_link);
            eventFormData.append('registration_link', formData.registration_link);
          }
          
          eventFormData.append('image', imageFile);
          
          // Log all form data being sent
          for (let pair of eventFormData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
          }
          
          const createResponse = await axios.post(`${config.API_URL}/events/form`, eventFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          });
          
          console.log('Event creation response:', createResponse.data);
        } else {
          // Use JSON endpoint if no image
          const eventData = {
            ...formData,
            max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
            registration_deadline: formData.registration_deadline || null,
            registration_link: formData.registration_link || null
          };
          
          console.log('Sending event data for creation:', eventData);
          
          // Token sudah didefinisikan di awal fungsi
          const createResponse = await axios.post(`${config.API_URL}/events`, eventData, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          });
          
          console.log('Event creation response:', createResponse.data);
        }
        
        navigate('/events');
      }
    } catch (err) {
      console.error('Error submitting event:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        console.error('Error status:', err.response.status);
      }
      setError(err.response?.data?.detail || 'Failed to save event. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <AdminLayout><div className="p-4">Loading event details...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Event' : 'Create New Event'}</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="academic">Academic</option>
                  <option value="culture">Culture</option>
                  <option value="sports">Sports</option>
                  <option value="seminar">Seminar</option>
                  <option value="workshop">Workshop</option>
                  <option value="competition">Competition</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="registration_link" className="block text-sm font-medium text-gray-700 mb-1">Registration Link</label>
                <input
                  type="url"
                  id="registration_link"
                  name="registration_link"
                  value={formData.registration_link}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://"
                />
              </div>
              
              <div>
                <label htmlFor="start_datetime" className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time *</label>
                <input
                  type="datetime-local"
                  id="start_datetime"
                  name="start_datetime"
                  value={formData.start_datetime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="end_datetime" className="block text-sm font-medium text-gray-700 mb-1">End Date & Time *</label>
                <input
                  type="datetime-local"
                  id="end_datetime"
                  name="end_datetime"
                  value={formData.end_datetime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="registration_deadline" className="block text-sm font-medium text-gray-700 mb-1">Registration Deadline</label>
                <input
                  type="datetime-local"
                  id="registration_deadline"
                  name="registration_deadline"
                  value={formData.registration_deadline}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="max_participants" className="block text-sm font-medium text-gray-700 mb-1">Maximum Participants</label>
                <input
                  type="number"
                  id="max_participants"
                  name="max_participants"
                  value={formData.max_participants}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
              
              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_featured"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">Feature this event on homepage</label>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="event_image" className="block text-sm font-medium text-gray-700 mb-1">Event Image</label>
                <input
                  type="file"
                  id="event_image"
                  name="event_image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
                    <img 
                      src={imagePreview} 
                      alt="Event preview" 
                      className="max-h-40 rounded-md border border-gray-300" 
                      onError={(e) => {
                        console.error('Preview image failed to load:', e);
                        console.log('Preview URL was:', imagePreview);
                        
                        // Try alternate URL format
                        if (formData.image_url) {
                          const altSrc = `${config.API_URL}${formData.image_url}`;
                          console.log('Trying alternate preview URL:', altSrc);
                          e.target.src = altSrc;
                          
                          // Add second error handler for the fallback
                          e.target.onerror = () => {
                            console.log('Fallback preview also failed, using placeholder');
                            e.target.src = 'https://via.placeholder.com/400x200?text=Preview+Not+Available';
                            e.target.onerror = null; // Prevent infinite loop
                          };
                        } else {
                          e.target.src = 'https://via.placeholder.com/400x200?text=Preview+Not+Available';
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/admin/events')}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              >
                {submitting ? 'Saving...' : 'Save Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EventForm;
