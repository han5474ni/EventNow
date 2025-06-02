import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { config } from '../config';
import { login } from '../store/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const response = await axios.post(`${config.API_URL}/auth/login`, {
        email,
        password,
        remember_me: rememberMe
      });
      
      const { access_token, user } = response.data;
      
      // Store token in localStorage or sessionStorage based on rememberMe
      if (rememberMe) {
        localStorage.setItem('eventnow_token', access_token);
      } else {
        sessionStorage.setItem('eventnow_token', access_token);
      }
      
      // Update Redux state using the imported action creator
      dispatch(login({ user, token: access_token }));
      
      // Redirect based on user role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        const detail = err.response.data.detail;
        setError(typeof detail === 'object' ? JSON.stringify(detail) : detail);
      } else {
        setError('Login failed. Please check your credentials and try again.');
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
          {/* Logo/Header Section */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-yellow-500 via-blue-600 to-red-600 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">EN</span>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 via-blue-600 to-red-600">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Sign up
              </Link>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="text-sm">
                    <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                      Forgot password?
                    </Link>
                  </div>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-yellow-500 via-blue-600 to-red-600 hover:from-yellow-600 hover:via-blue-700 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg transform transition-all duration-200 ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                style={{
                  backgroundSize: '200% 200%',
                  animation: 'gradient 3s ease infinite',
                }}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="relative">
                    <span className="absolute inset-0 flex items-center justify-center">
                    </span>
                    <span className="pl-6">Sign in to your account</span>
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
