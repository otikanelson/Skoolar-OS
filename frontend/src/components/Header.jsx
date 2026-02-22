import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isCurrentPage = (path) => currentPath === path;

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#1e3a8a] flex items-center justify-center">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <div className="text-lg md:text-xl font-bold text-gray-900">Skoolar</div>
              <div className="text-xs text-gray-500 -mt-0.5 hidden sm:block">Academic Management Platform</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4">
            {!isCurrentPage('/features') && (
              <Link to="/features" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Features</Link>
            )}
            {!isCurrentPage('/pricing') && (
              <Link to="/pricing" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Pricing</Link>
            )}
            {!isCurrentPage('/register') && (
              <Link to="/register" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Register School</Link>
            )}
            {!isCurrentPage('/login') && !currentPath.startsWith('/login') && (
              <Link to="/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Login</Link>
            )}
            {!isCurrentPage('/contact-sales') && (
              <Link to="/contact-sales" className="bg-[#1e3a8a] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[#1e293b] transition-colors">
                Contact Sales
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-200 bg-white"
          >
            <div className="px-4 py-4 space-y-3">
              {!isCurrentPage('/features') && (
                <Link 
                  to="/features" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-600 hover:text-gray-900 text-sm font-medium py-2 transition-colors"
                >
                  Features
                </Link>
              )}
              {!isCurrentPage('/pricing') && (
                <Link 
                  to="/pricing" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-600 hover:text-gray-900 text-sm font-medium py-2 transition-colors"
                >
                  Pricing
                </Link>
              )}
              {!isCurrentPage('/register') && (
                <Link 
                  to="/register" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-600 hover:text-gray-900 text-sm font-medium py-2 transition-colors"
                >
                  Register School
                </Link>
              )}
              {!isCurrentPage('/login') && !currentPath.startsWith('/login') && (
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-600 hover:text-gray-900 text-sm font-medium py-2 transition-colors"
                >
                  Login
                </Link>
              )}
              {!isCurrentPage('/contact-sales') && (
                <Link 
                  to="/contact-sales" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block bg-[#1e3a8a] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[#1e293b] transition-colors text-center"
                >
                  Contact Sales
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Header;
