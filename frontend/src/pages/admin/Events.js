import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { config } from '../../config';
import AdminLayout from '../../components/layouts/AdminLayout';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.API_URL}/events`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('eventnow_token') || sessionStorage.getItem('eventnow_token')}`
        }
      });
      setEvents(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load events. Please try again later.');
      setLoading(false);
    }
  };

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;
    
    try {
      await axios.delete(`${config.API_URL}/events/${eventToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('eventnow_token') || sessionStorage.getItem('eventnow_token')}`
        }
      });
      
      // Remove deleted event from state
      setEvents(events.filter(e => e.id !== eventToDelete.id));
      setShowDeleteModal(false);
      setEventToDelete(null);
    } catch (err) {
      alert('Failed to delete event. Please try again.');
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === 'all' || event.status === filter;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) return <AdminLayout><div className="p-4">Loading events...</div></AdminLayout>;
  if (error) return <AdminLayout><div className="p-4 text-red-500">{error}</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Events</h1>
          <Link 
            to="/admin/events/create" 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create New Event
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-1/3">
              <input
                type="text"
                placeholder="Search events..."
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="w-full md:w-2/3">
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${filter === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                  onClick={() => setFilter('upcoming')}
                >
                  Upcoming
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${filter === 'ongoing' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                  onClick={() => setFilter('ongoing')}
                >
                  Ongoing
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                  onClick={() => setFilter('completed')}
                >
                  Completed
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${filter === 'cancelled' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                  onClick={() => setFilter('cancelled')}
                >
                  Cancelled
                </button>
              </div>
            </div>
          </div>
          
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No events found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-16 w-16 mr-4 rounded-md overflow-hidden">
                            {event.image_url ? (
                              <img 
                                src={`${config.API_URL.replace('/api', '')}/static/event_images/${event.image_url.split('/').pop()}`} 
                                alt={event.title}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  console.error('Image failed to load:', e);
                                  console.log('Admin page - Original image URL:', event.image_url);
                                  console.log('Admin page - Attempted URL:', `${config.API_URL}/static/event_images/${event.image_url.split('/').pop()}`);
                                  
                                  // Try alternate URL format
                                  const newSrc = `${config.API_URL}${event.image_url}`;
                                  console.log('Admin page - Trying alternate URL:', newSrc);
                                  e.target.src = newSrc;
                                  
                                  // Add second error handler for the fallback
                                  e.target.onerror = () => {
                                    console.log('Admin page - Fallback also failed, using placeholder');
                                    e.target.src = `https://via.placeholder.com/64?text=${encodeURIComponent(event.title.charAt(0))}`;
                                    e.target.onerror = null; // Prevent infinite loop
                                  };
                                }}
                              />
                            ) : (
                              <div className="h-full w-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                                <span className="text-gray-500 text-xl font-bold">{event.title.charAt(0)}</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{event.title}</div>
                            <div className="text-sm text-gray-500 capitalize">{event.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(event.start_datetime).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(event.start_datetime).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link 
                            to={`/admin/events/${event.id}/edit`} 
                            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                            Edit
                          </Link>
                          
                          <Link 
                            to={`/events/${event.id}`} 
                            className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                            target="_blank"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                            View
                          </Link>
                          
                          <button 
                            onClick={() => handleDeleteClick(event)} 
                            className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete the event "{eventToDelete?.title}"? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm} 
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminEvents;
