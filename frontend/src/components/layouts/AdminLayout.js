import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    
    // Update Redux state using the imported action creator
    dispatch(logout());
    
    // Redirect to login page
    navigate('/login');
  };
  
  // Check if the current route is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-blue-800 text-white w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-200 ease-in-out z-30`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-blue-700">
          <Link to="/admin/dashboard" className="text-xl font-bold">EventNow Admin</Link>
          <button 
            className="lg:hidden text-white focus:outline-none"
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/admin/dashboard" 
                className={`flex items-center px-4 py-2 rounded-md ${isActive('/admin/dashboard') ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/events" 
                className={`flex items-center px-4 py-2 rounded-md ${isActive('/admin/events') ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Events
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/events/create" 
                className={`flex items-center px-4 py-2 rounded-md ${isActive('/admin/events/create') ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Create Event
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/profile" 
                className={`flex items-center px-4 py-2 rounded-md ${isActive('/admin/profile') ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Profile
              </Link>
            </li>
          </ul>
          
          <div className="mt-8 pt-4 border-t border-blue-700">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 rounded-md hover:bg-blue-700"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Logout
            </button>
          </div>
        </nav>
      </aside>
      
      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navbar */}
        <header className="bg-white shadow-sm h-16 flex items-center">
          <div className="flex items-center justify-between w-full px-4">
            <button 
              className="text-gray-600 lg:hidden focus:outline-none"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            
            <div className="flex items-center">
              <Link to="/" className="mr-4 text-blue-600 hover:underline">
                View Site
              </Link>
              
              <div className="relative">
                <div className="flex items-center">
                  <div className="mr-2 text-right">
                    <div className="text-sm font-medium text-gray-900">{user?.full_name}</div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                    {user?.full_name?.charAt(0)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
