import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const UserLogin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const portalId = searchParams.get('portal') || 'fieldgreen';
  
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if no portal specified
  useEffect(() => {
    if (!searchParams.get('portal')) {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Navigate to appropriate dashboard based on role
      navigate('/admin');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Portal Connection Status */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 bg-white border border-gray-300 rounded px-4 py-2 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-600">Connected to: </span>
            <span className="text-xs font-mono text-[#1e3a8a] font-semibold">{portalId}.educore.ng</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {portalId.charAt(0).toUpperCase() + portalId.slice(1)} Secondary School
          </h1>
          <p className="text-sm text-gray-600">Sign in to your account</p>
        </motion.div>

        {/* Login Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white border border-gray-300 shadow-sm p-8"
        >
          <form onSubmit={handleLogin}>
            {/* Email Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder={`user@${portalId}.edu`}
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-[#1e3a8a]"
                required
                disabled={isLoading}
              />
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
                <input type="checkbox" className="border-gray-300 text-[#1e3a8a] focus:ring-[#1e3a8a]" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
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

            {/* Demo Note */}
            <div className="mt-6 p-3 bg-gray-50 border border-gray-200">
              <p className="text-xs text-gray-600 mb-2 font-medium">Demo Accounts:</p>
              <div className="text-xs text-gray-500 space-y-1">
                <div>admin@{portalId}.edu / password123</div>
                <div>teacher@{portalId}.edu / password123</div>
                <div>parent@{portalId}.edu / password123</div>
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
          <button 
            onClick={() => navigate('/login')}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Connect to Different Portal
          </button>
        </motion.div>
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">Powered by EduCore OS</p>
        </div>
      </motion.div>
    </div>
  );
};

export default UserLogin;
