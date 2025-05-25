import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { config } from '../config';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/auth/verify-email/${token}`);
        setVerificationStatus('success');
        setMessage(response.data.message);
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', { 
            state: { message: 'Email verified successfully! You can now log in.' } 
          });
        }, 3000);
      } catch (err) {
        setVerificationStatus('error');
        if (err.response && err.response.data && err.response.data.detail) {
          // Make sure we're only setting a string as the message
          const detail = err.response.data.detail;
          setMessage(typeof detail === 'object' ? JSON.stringify(detail) : detail);
        } else {
          setMessage('Failed to verify your email. The link may be invalid or expired.');
        }
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Email Verification</h2>
        </div>
        
        {verificationStatus === 'verifying' && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Verifying your email address...</p>
          </div>
        )}
        
        {verificationStatus === 'success' && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{message}</p>
                <p className="mt-2 text-sm text-green-700">Redirecting to login page...</p>
              </div>
            </div>
          </div>
        )}
        
        {verificationStatus === 'error' && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{message}</p>
                <div className="mt-4">
                  <Link 
                    to="/login" 
                    className="text-sm font-medium text-red-700 hover:text-red-600 mr-4"
                  >
                    Go to login
                  </Link>
                  <button 
                    onClick={() => navigate('/resend-verification')}
                    className="text-sm font-medium text-red-700 hover:text-red-600"
                  >
                    Resend verification email
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
