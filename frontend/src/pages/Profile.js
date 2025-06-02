import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { config } from '../config';
import { updateUser } from '../store/authSlice';
import MainLayout from '../components/layouts/MainLayout';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
      
      if (user.profileImage) {
        setPreviewImage(`${config.API_URL}/uploads/profiles/${user.profileImage}`);
      } else {
        setPreviewImage('https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y');
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('Image size should be less than 2MB');
        return;
      }
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return false;
    }
    
    if (formData.newPassword && !formData.currentPassword) {
      toast.error('Current password is required to change password');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Add profile image if selected
      if (profileImage) {
        formDataToSend.append('profileImage', profileImage);
      }
      
      // Add other form data
      formDataToSend.append('name', formData.name);
      if (formData.currentPassword) {
        formDataToSend.append('currentPassword', formData.currentPassword);
      }
      if (formData.newPassword) {
        formDataToSend.append('newPassword', formData.newPassword);
      }
      
      const token = localStorage.getItem('eventnow_token') || sessionStorage.getItem('eventnow_token');
      const response = await axios.put(
        `${config.API_URL}/api/users/me`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Update user in Redux store
      dispatch(updateUser(response.data.user));
      
      // Reset form
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      toast.success('Profile updated successfully!');
      
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
            <p className="mt-1 text-sm text-gray-500">
              Update your account information and settings.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
            {/* Profile Picture Section */}
            <div className="px-4 py-6 sm:px-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-20 w-20 rounded-full object-cover"
                    src={previewImage}
                    alt="Profile"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
                    }}
                  />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">Profile photo</div>
                  <div className="mt-1">
                    <label
                      htmlFor="profile-image"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                    >
                      <span>Change</span>
                      <input
                        id="profile-image"
                        name="profile-image"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">JPG, GIF or PNG. Max size 2MB</p>
                </div>
              </div>
            </div>
            
            {/* Personal Information Section */}
            <div className="px-4 py-6 sm:px-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
                <p className="mt-1 text-sm text-gray-500">Update your personal information.</p>
              </div>
              
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div className="sm:col-span-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Change Password Section */}
            <div className="px-4 py-6 sm:px-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Change Password</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Leave these fields empty if you don't want to change your password.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    id="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="px-4 py-4 bg-gray-50 text-right sm:px-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;