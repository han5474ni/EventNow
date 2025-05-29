import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { config } from './config';
import { login } from './store/authSlice';

// Layouts
import MainLayout from './components/layouts/MainLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import ResendVerification from './pages/ResendVerification';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminEvents from './pages/admin/Events';
import EventForm from './pages/admin/EventForm';
import AdminProfile from './pages/admin/Profile';

// Import CSS
import './App.css';
import './styles/custom.css';
import './styles/animations.css';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect to home if not authorized
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  
  useEffect(() => {
    // Check if user is already logged in (token exists in localStorage or sessionStorage)
    const localToken = localStorage.getItem('eventnow_token');
    const sessionToken = sessionStorage.getItem('eventnow_token');
    const token = localToken || sessionToken;
    
    const fetchUserData = async () => {
      if (!token) return;
      
      try {
        const response = await axios.get(`${config.API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Update Redux state using the imported action creator
        dispatch(login({ user: response.data, token }));
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        // Token might be invalid or expired
        localStorage.removeItem('eventnow_token');
        sessionStorage.removeItem('eventnow_token');
        window.location.href = '/login';
      }
    };
    
    if (token && !isAuthenticated) {
      fetchUserData();
    }
  }, [dispatch, isAuthenticated]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/events" element={<MainLayout><Events /></MainLayout>} />
        <Route path="/events/:id" element={<MainLayout><EventDetail /></MainLayout>} />
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
        <Route path="/forgot-password" element={<MainLayout><ForgotPassword /></MainLayout>} />
        <Route path="/reset-password/:token" element={<MainLayout><ResetPassword /></MainLayout>} />
        <Route path="/verify-email/:token" element={<MainLayout><VerifyEmail /></MainLayout>} />
        <Route path="/resend-verification" element={<MainLayout><ResendVerification /></MainLayout>} />
        
        {/* Protected User Routes */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <MainLayout><Profile /></MainLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/events" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminEvents />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/events/create" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <EventForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/events/:id/edit" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <EventForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/profile" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'organizer']}>
              <AdminProfile />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
