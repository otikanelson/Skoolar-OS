import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const [role, setRole] = useState('teacher');
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const roles = [
    { id: 'admin', label: 'Admin' },
    { id: 'teacher', label: 'Teacher' },
    { id: 'hod', label: 'HOD' },
    { id: 'parent', label: 'Parent' },
    { id: 'student', label: 'Student' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* School Portal Header */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white border border-gray-300 rounded px-4 py-2 inline-block mb-4"
          >
            <span className="text-sm text-gray-600">School Portal: </span>
            <span className="text-sm font-mono text-[#1e3a8a] font-semibold">fieldgreen.educore.ng</span>
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Fieldgreen Secondary School</h1>
          <p className="text-sm text-gray-600">Academic Management System</p>
        </div>

        {/* Login Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white border border-gray-300 shadow-sm p-8"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Sign In to Your Account</h2>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Your Role
            </label>
            <div className="grid grid-cols-5 gap-2">
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`p-2 text-xs font-medium border transition-colors ${
                    role === r.id
                      ? 'border-[#1e3a8a] bg-[#1e3a8a] text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="text"
              placeholder="user@fieldgreen.edu.ng"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-[#1e3a8a]"
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
          <button className="w-full bg-[#1e3a8a] text-white py-2 text-sm font-medium hover:bg-[#1e293b] transition-colors">
            Sign In
          </button>

          {/* Demo Note */}
          <div className="mt-6 p-3 bg-gray-50 border border-gray-200">
            <p className="text-xs text-gray-600 mb-2 font-medium">Demo Access:</p>
            <div className="text-xs text-gray-500 space-y-1">
              <div>admin@fieldgreen.edu / password123</div>
              <div>teacher@fieldgreen.edu / password123</div>
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
          <p className="text-xs text-gray-500">Powered by EduCore OS</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
