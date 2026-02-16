import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getUserRole } from '../utils/auth';

const Unauthorized = () => {
  const userRole = getUserRole();
  
  // Determine appropriate dashboard based on role
  const getDashboardLink = () => {
    switch (userRole) {
      case 'admin':
        return '/admin';
      case 'teacher':
      case 'hod':
        return '/teacher';
      case 'parent':
        return '/parent';
      case 'student':
        return '/exam';
      default:
        return '/login';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <div className="bg-white border border-gray-300 shadow-sm p-8">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. This area is restricted to authorized users only.
          </p>

          {/* User Info */}
          {userRole && (
            <div className="bg-gray-50 border border-gray-200 p-4 mb-6">
              <p className="text-xs text-gray-600 mb-1">Your Current Role:</p>
              <p className="text-sm font-semibold text-gray-900 uppercase">{userRole}</p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Link 
              to={getDashboardLink()}
              className="block w-full bg-[#1e3a8a] text-white py-3 text-sm font-medium hover:bg-[#1e293b] transition-colors"
            >
              Go to My Dashboard
            </Link>
            <Link 
              to="/"
              className="block w-full border-2 border-gray-300 text-gray-700 py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-xs text-gray-500 mt-6">
          If you believe this is an error, please contact your school administrator.
        </p>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
