import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const DirectLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '', rememberMe: false });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { authAPI } = await import('../services/api');
      const { login } = await import('../utils/auth');
      
      // Call login API without portalId (direct login)
      const response = await authAPI.login(
        credentials.email,
        credentials.password,
        credentials.rememberMe,
        null // No portalId for direct login
      );
      
      // Store token and user data
      login(response.accessToken, response.refreshToken, response.user);
      
      // Check if school is pending verification
      if (response.user.schoolStatus === 'PENDING_VERIFICATION') {
        navigate('/pending-verification');
        return;
      }
      
      // Check if password change is required
      if (response.user.requirePasswordChange) {
        navigate('/change-password', { state: { firstLogin: true } });
        return;
      }
      
      // Navigate based on role
      const role = response.user.role.toLowerCase();
      switch (role) {
        case 'manufacturer':
          navigate('/manufacturer/dashboard');
          break;
        case 'school_admin':
        case 'admin':
          navigate('/admin');
          break;
        case 'teacher':
        case 'hod':
          navigate('/teacher');
          break;
        case 'parent':
          navigate('/parent');
          break;
        case 'student':
          navigate('/exam');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-6"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">EduCore OS</h1>
            <p className="text-sm text-gray-600">Academic Management Platform</p>
          </motion.div>
        </div>

        {/* Login Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white border border-gray-300 shadow-sm p-8"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Direct Sign In</h2>
            <p className="text-sm text-gray-600">
              Sign in with your institutional email address. Your portal will be automatically detected.
            </p>
          </div>

          <form onSubmit={handleLogin}>
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Institutional Email Address
              </label>
              <input
                type="email"
                placeholder="user@fieldgreen.edu"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-[#1e3a8a]"
                required
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Use your full school email address
              </p>
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-[#1e3a8a]"
                required
                disabled={isLoading}
              />
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={credentials.rememberMe}
                  onChange={(e) => setCredentials({ ...credentials, rememberMe: e.target.checked })}
                  className="border-gray-300 text-[#1e3a8a] focus:ring-[#1e3a8a]" 
                />
                <span className="ml-2 text-sm text-gray-600">Remember me (30 days)</span>
              </label>
              <a href="#" className="text-sm text-[#1e3a8a] hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1e3a8a] text-white py-2 text-sm font-medium hover:bg-[#1e293b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-[#1e3a8a] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">🔒 Secure Login</p>
                  <p className="text-xs text-gray-600">
                    Protected by rate limiting, account lockout after 5 failed attempts, and comprehensive security monitoring.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-6"
        >
          <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to Portal Connection
          </Link>
        </motion.div>
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            Need access? <Link to="/request-access" className="text-[#1e3a8a] hover:underline">Request School Portal</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default DirectLogin;
