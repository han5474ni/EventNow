import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/authActions';

const MainLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useSelector(state => state.auth.user);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    // Dispatch the logoutUser action which handles clearing tokens and updating Redux state
    dispatch(logoutUser());
    
    // Redirect to home page
    navigate('/');
  };
  
  // Check if the current route is active
  const isActive = (path) => {
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600">EventNow</Link>
              
              <nav className="hidden md:ml-8 md:flex md:space-x-6">
                <Link 
                  to="/" 
                  className={`px-3 py-2 text-sm font-medium ${isActive('/') && !isActive('/events') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
                >
                  Home
                </Link>
                <Link 
                  to="/events" 
                  className={`px-3 py-2 text-sm font-medium ${isActive('/events') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
                >
                  Events
                </Link>
              </nav>
            </div>
            
            <div className="hidden md:flex items-center">
              {isAuthenticated ? (
                <div className="relative flex items-center">
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin/dashboard" 
                      className="mr-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  
                  <Link 
                    to="/profile" 
                    className="mr-4 flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold mr-2">
                      {user?.full_name?.charAt(0)}
                    </div>
                    <span>{user?.full_name}</span>
                  </Link>
                  
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/login" 
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    Log in
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
              >
                <svg 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link 
                to="/" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') && !isActive('/events') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/events" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/events') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </Link>
            </div>
            
            <div className="pt-4 pb-3 border-t border-gray-200">
              {isAuthenticated ? (
                <div className="px-2 space-y-1">
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin/dashboard" 
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  
                  <Link 
                    to="/profile" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Your Profile
                  </Link>
                  
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="px-2 space-y-1">
                  <Link 
                    to="/login" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link 
                    to="/register" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
      
      {/* Main content */}
      <main className="flex-grow bg-gray-50">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1: About */}
            <div className="mb-6 md:mb-0">
              <Link to="/" className="text-2xl font-bold text-white flex items-center">
                <span className="bg-white text-blue-600 rounded-full p-1 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                EventNow
              </Link>
              <p className="text-gray-300 mt-3">Platform acara kampus terbaik untuk menemukan dan mengelola berbagai kegiatan menarik di kampus Anda.</p>
              <div className="mt-4 flex space-x-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors" aria-label="Facebook">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                  <span className="sr-only">Facebook</span>
                </a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors" aria-label="Twitter">
                  <svg className="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span className="sr-only">Twitter</span>
                </a>
                <a href="https://instagram.com/handayani_aja_" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors" aria-label="Instagram">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                  <span className="sr-only">Instagram</span>
                </a>
              </div>
            </div>
            
            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/events" className="text-gray-300 hover:text-white transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Events
                  </Link>
                </li>
                {isAuthenticated ? (
                  <>
                    <li>
                      <Link to="/profile" className="text-gray-300 hover:text-white transition-colors flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </Link>
                    </li>
                    {user?.role === 'admin' && (
                      <li>
                        <Link to="/admin/dashboard" className="text-gray-300 hover:text-white transition-colors flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                          </svg>
                          Admin Dashboard
                        </Link>
                      </li>
                    )}
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login" className="text-gray-300 hover:text-white transition-colors flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Log in
                      </Link>
                    </li>
                    <li>
                      <Link to="/register" className="text-gray-300 hover:text-white transition-colors flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Sign up
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
            
            {/* Column 3: Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-300">Way Huwi, Jati Agung<br />Kab. Lampung Selatan, Lampung</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:handayani.122140166@student.itera.ac.id" className="text-gray-300 hover:text-white transition-colors">handayani.122140166@student.itera.ac.id</a>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:089607993000" className="text-gray-300 hover:text-white transition-colors">0896-0799-3000</a>
                </li>
              </ul>
            </div>
            

          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="bg-blue-900 py-6">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-300 mb-4 md:mb-0">&copy; {new Date().getFullYear()} EventNow. All rights reserved.</p>
            <div className="flex space-x-6">
              <button onClick={() => window.location.href = '/privacy-policy'} className="text-sm text-gray-300 hover:text-white transition-colors focus:outline-none">
                Privacy Policy
              </button>
              <button onClick={() => window.location.href = '/terms-of-service'} className="text-sm text-gray-300 hover:text-white transition-colors focus:outline-none">
                Terms of Service
              </button>
              <button onClick={() => window.location.href = '/cookie-policy'} className="text-sm text-gray-300 hover:text-white transition-colors focus:outline-none">
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
