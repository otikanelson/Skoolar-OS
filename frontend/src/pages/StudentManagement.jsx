import { useState } from 'react';
import { motion } from 'framer-motion';

const StudentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');

  const students = [
    { id: 'STU001', name: 'Chukwudi Okafor', class: 'SSS 2A', gender: 'Male', status: 'Active' },
    { id: 'STU002', name: 'Zainab Musa', class: 'SSS 2A', gender: 'Female', status: 'Active' },
    { id: 'STU003', name: 'Tobi Adekunle', class: 'SSS 1B', gender: 'Male', status: 'Active' },
    { id: 'STU004', name: 'Amina Ibrahim', class: 'JSS 3C', gender: 'Female', status: 'Active' },
    { id: 'STU005', name: 'Emmanuel Obi', class: 'SSS 3A', gender: 'Male', status: 'Active' },
    { id: 'STU006', name: 'Fatima Bello', class: 'JSS 2B', gender: 'Female', status: 'Active' },
    { id: 'STU007', name: 'David Adeyemi', class: 'SSS 2A', gender: 'Male', status: 'Active' },
    { id: 'STU008', name: 'Grace Nwosu', class: 'JSS 1A', gender: 'Female', status: 'Active' },
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
              <h1 className="text-lg font-semibold text-gray-900">Student Records Management</h1>
              <p className="text-xs text-gray-600">Manage student profiles and academic records</p>
            </div>
            <button className="bg-[#1e3a8a] text-white px-4 py-2 text-sm font-medium hover:bg-[#1e293b]">
              + Add New Student
            </button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white border border-gray-300 p-4 mb-6"
        >
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-2">Search Students</label>
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-[#1e3a8a]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Class</label>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-[#1e3a8a]"
              >
                <option value="all">All Classes</option>
                <option value="jss1">JSS 1</option>
                <option value="jss2">JSS 2</option>
                <option value="jss3">JSS 3</option>
                <option value="sss1">SSS 1</option>
                <option value="sss2">SSS 2</option>
                <option value="sss3">SSS 3</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Status</label>
              <select className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-[#1e3a8a]">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>Graduated</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { value: '1,247', label: 'Total Students' },
            { value: '1,205', label: 'Active' },
            { value: '42', label: 'New This Term' },
            { value: '156', label: 'Graduating' }
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
              className="bg-white border border-gray-300 p-4"
            >
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Student Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white border border-gray-300"
        >
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  <input type="checkbox" className="border-gray-300" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Student ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Full Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Class
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Gender
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input type="checkbox" className="border-gray-300" />
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm text-gray-900">{student.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-900">{student.class}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">{student.gender}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 font-medium">
                      {student.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button className="text-[#1e3a8a] hover:underline mr-3">View</button>
                    <button className="text-gray-600 hover:underline mr-3">Edit</button>
                    <button className="text-gray-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-300">
            <div className="text-xs text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of{' '}
              <span className="font-medium">1,247</span> students
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 text-xs hover:bg-gray-100">
                Previous
              </button>
              <button className="px-3 py-1 bg-[#1e3a8a] text-white text-xs">1</button>
              <button className="px-3 py-1 border border-gray-300 text-xs hover:bg-gray-100">2</button>
              <button className="px-3 py-1 border border-gray-300 text-xs hover:bg-gray-100">3</button>
              <button className="px-3 py-1 border border-gray-300 text-xs hover:bg-gray-100">
                Next
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentManagement;
