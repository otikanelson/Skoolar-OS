import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PortalConnect = () => {
  const [portalId, setPortalId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();

  const handleConnect = (e) => {
    e.preventDefault();
    if (portalId.trim()) {
      setIsConnecting(true);
      // Simulate connection check
      setTimeout(() => {
        // Navigate to user login with portal context
        navigate(`/login/user?portal=${portalId}`);
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full"
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

        {/* Connection Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white border border-gray-300 shadow-sm p-8"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#1e3a8a] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Connect to School Portal</h2>
            <p className="text-sm text-gray-600">
              Enter your school's portal ID to connect to your institution's network
            </p>
          </div>

          <form onSubmit={handleConnect}>
            {/* Portal ID Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                School Portal ID
              </label>
              <div className="flex items-center border border-gray-300 focus-within:border-[#1e3a8a] transition-colors">
                <input
                  type="text"
                  placeholder="fieldgreen"
                  value={portalId}
                  onChange={(e) => setPortalId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="flex-1 px-4 py-3 text-sm focus:outline-none"
                  disabled={isConnecting}
                />
                <span className="px-4 py-3 text-sm text-gray-500 bg-gray-50 border-l border-gray-300">
                  .educore.ng
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Example: fieldgreen, stmarys, royalacademy
              </p>
            </div>

            {/* Connect Button */}
            <button 
              type="submit"
              disabled={!portalId.trim() || isConnecting}
              className="w-full bg-[#1e3a8a] text-white py-3 text-sm font-medium hover:bg-[#1e293b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isConnecting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting to Portal...
                </>
              ) : (
                <>
                  Connect to Portal
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Direct Login Link */}
            <Link 
              to="/login/direct"
              className="block w-full text-center border-2 border-gray-300 text-gray-700 py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Sign In Directly with Email
            </Link>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-[#1e3a8a] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">What is a Portal ID?</p>
                <p className="text-xs text-gray-600">
                  Your school's unique identifier on the EduCore network. Contact your school administrator if you don't know your portal ID.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-6"
        >
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to Home
          </Link>
        </motion.div>
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            Don't have a school portal yet?{' '}
            <Link to="/register" className="text-[#1e3a8a] hover:underline font-medium">
              Register Your School
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PortalConnect;
