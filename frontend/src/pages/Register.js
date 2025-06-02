import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { config } from '../config';
import { login } from '../store/authSlice'; // For potential auto-login after registration

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    role: 'general' // Default role is general
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Add global styles for gradient animation
  const globalStyles = `
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `;

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = globalStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, [globalStyles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registerData } = formData;
      
      await axios.post(`${config.API_URL}/auth/register`, registerData);
      
      // Redirect to login page after successful registration
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        // Make sure we're only setting a string as the error
        const detail = err.response.data.detail;
        setError(typeof detail === 'object' ? JSON.stringify(detail) : detail);
      } else {
        setError('Registration failed. Please try again.');
      }
      setLoading(false);
    }
  };

  // Background image path
  const backgroundImage = '/images/background.jpg';

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      
      {/* Fixed background with overlay */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          height: '100vh',
          width: '100vw',
        }}
      />
      
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl relative z-10 border border-gray-100">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-yellow-500 via-blue-600 to-red-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H12a3 3 0 01-3-3v-1.317z" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">Create your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Or{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                sign in to your existing account
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  autoComplete="name"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  id="role"
                  name="role"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="general">General Public</option>
                  <option value="student">Student</option>
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create account'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
