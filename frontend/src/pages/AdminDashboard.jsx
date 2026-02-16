import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Students', value: '1,247', change: '+12 this term' },
    { label: 'Active Teachers', value: '84', change: '3 new hires' },
    { label: 'Pending Results', value: '23', change: 'Awaiting approval' },
    { label: 'Scheduled Exams', value: '8', change: 'This week' },
  ];

  const recentActivity = [
    { action: 'Result Approved', user: 'Mrs. Adeyemi', subject: 'Mathematics SSS 2A', time: '5 mins ago' },
    { action: 'New Student Enrolled', user: 'Admin', subject: 'Chukwudi Okafor - JSS 1B', time: '12 mins ago' },
    { action: 'Result Submitted', user: 'Mr. Bello', subject: 'English SSS 3C', time: '25 mins ago' },
    { action: 'Exam Completed', user: '45 Students', subject: 'Chemistry Mock Exam', time: '1 hour ago' },
  ];

  const pendingApprovals = [
    { teacher: 'Mrs. Adeyemi Folake', subject: 'Mathematics', class: 'SSS 2A', students: 42, submitted: '2 hours ago' },
    { teacher: 'Mr. Bello Ibrahim', subject: 'English Language', class: 'SSS 3C', students: 38, submitted: '5 hours ago' },
    { teacher: 'Miss Okonkwo Grace', subject: 'Biology', class: 'SSS 1B', students: 45, submitted: '1 day ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white border-b border-gray-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Administrator Dashboard</h1>
              <p className="text-xs text-gray-600">Fieldgreen Secondary School</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
              </button>
              <div className="flex items-center gap-2 border-l border-gray-300 pl-4">
                <div className="w-8 h-8 bg-[#1e3a8a] text-white flex items-center justify-center text-xs font-semibold">
                  DO
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">Dr. Okonkwo</div>
                  <div className="text-xs text-gray-600">Administrator</div>
                </div>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white border border-gray-300 p-4"
            >
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-gray-700 mb-1">{stat.label}</div>
              <div className="text-xs text-gray-500">{stat.change}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pending Approvals */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white border border-gray-300"
          >
            <div className="p-4 border-b border-gray-300">
              <h2 className="text-sm font-semibold text-gray-900">Pending Result Approvals</h2>
              <p className="text-xs text-gray-600">Results awaiting your approval</p>
            </div>
            <div className="divide-y divide-gray-200">
              {pendingApprovals.map((item, idx) => (
                <div key={idx} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.subject} - {item.class}</div>
                      <div className="text-xs text-gray-600">by {item.teacher}</div>
                    </div>
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 font-medium">
                      Pending
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-600">{item.students} students • {item.submitted}</span>
                    <button className="text-xs text-[#1e3a8a] hover:underline font-medium">
                      Review →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white border border-gray-300"
          >
            <div className="p-4 border-b border-gray-300">
              <h2 className="text-sm font-semibold text-gray-900">Recent Activity</h2>
              <p className="text-xs text-gray-600">Latest system activities</p>
            </div>
            <div className="divide-y divide-gray-200">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[#1e3a8a] rounded-full mt-1.5"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{activity.action}</div>
                      <div className="text-xs text-gray-600">{activity.subject}</div>
                      <div className="text-xs text-gray-500 mt-1">by {activity.user} • {activity.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Link to="/admin/students" className="bg-white border-2 border-[#1e3a8a] text-gray-900 p-4 hover:bg-gray-50 transition-colors text-center">
            <div className="text-sm font-semibold">Manage Students</div>
          </Link>
          <Link to="/admin/approvals" className="bg-white border-2 border-[#1e3a8a] text-gray-900 p-4 hover:bg-gray-50 transition-colors text-center">
            <div className="text-sm font-semibold">Approve Results</div>
          </Link>
          <Link to="/report-card" className="bg-white border-2 border-[#1e3a8a] text-gray-900 p-4 hover:bg-gray-50 transition-colors text-center">
            <div className="text-sm font-semibold">View Reports</div>
          </Link>
          <button className="bg-white border-2 border-[#1e3a8a] text-gray-900 p-4 hover:bg-gray-50 transition-colors">
            <div className="text-sm font-semibold">System Settings</div>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
