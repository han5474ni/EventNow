import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { config } from '../config';

const ResendVerification = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      await axios.post(`${config.API_URL}/auth/verify-email/send`, { email });
      setIsSubmitted(true);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        // Make sure we're only setting a string as the error
        const detail = err.response.data.detail;
        setError(typeof detail === 'object' ? JSON.stringify(detail) : detail);
      } else {
        setError('Failed to process your request. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Resend verification email</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a new verification link
          </p>
        </div>
        
        {isSubmitted ? (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  If an account exists with that email, we've sent a new verification link.
                </p>
                <p className="mt-4">
                  <Link to="/login" className="text-sm font-medium text-green-700 hover:text-green-600">
                    Return to login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Back to login
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2"
              >
                {loading ? 'Sending...' : 'Send verification email'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResendVerification;
