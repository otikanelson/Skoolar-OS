import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3">
            {/* Logo/Icon */}
            <div className="w-10 h-10 bg-[#1e3a8a] flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">EduCore</div>
              <div className="text-xs text-gray-500 -mt-0.5">Academic Management Platform</div>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/pricing" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Pricing</Link>
            <Link to="/register" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Register School</Link>
            <Link to="/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Login</Link>
            <Link to="/contact-sales" className="bg-[#1e3a8a] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[#1e293b] transition-colors">
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Header;
