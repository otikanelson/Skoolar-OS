import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserData, logout } from '../utils/auth';
import { authAPI } from '../services/api';

const SchoolRegistrations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUserData();
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [expandedSchoolId, setExpandedSchoolId] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showMoreInfoModal, setShowMoreInfoModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [moreInfoRequest, setMoreInfoRequest] = useState('');
  const [verificationChecklist, setVerificationChecklist] = useState({
    cacVerified: false,
    locationVerified: false,
    contactVerified: false,
    noDuplicates: false,
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'MANUFACTURER') {
      navigate('/manufacturer/login');
      return;
    }
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setIsLoading(true);
      setError('');
      console.log('🔍 Fetching pending registrations...');
      const data = await authAPI.getPendingRegistrations();
      console.log('✅ Received registrations:', data);
      setRegistrations(data);
    } catch (err) {
      console.error('❌ Failed to fetch registrations:', err);
      setError(err.message || 'Failed to load registrations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (school) => {
    if (expandedSchoolId === school.id) {
      setExpandedSchoolId(null);
      setSelectedSchool(null);
    } else {
      setExpandedSchoolId(school.id);
      setSelectedSchool(school);
      setVerificationChecklist({
        cacVerified: false,
        locationVerified: false,
        contactVerified: false,
        noDuplicates: false,
      });
    }
  };

  const handleMoreInfoClick = (school) => {
    setSelectedSchool(school);
    setShowMoreInfoModal(true);
  };

  const handleMoreInfoSubmit = async () => {
    if (!moreInfoRequest.trim()) {
      setError('Please specify what information is needed');
      return;
    }

    try {
      setActionLoading(true);
      setError('');
      console.log('Requesting more info:', moreInfoRequest);
      setSuccessMessage('Information request sent to school');
      setShowMoreInfoModal(false);
      setMoreInfoRequest('');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to request info:', err);
      setError(err.message || 'Failed to send request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async (schoolId) => {
    if (!confirm('Are you sure you want to approve this school registration?')) {
      return;
    }

    try {
      setActionLoading(true);
      setError('');
      await authAPI.approveRegistration(schoolId);
      setSuccessMessage('School approved successfully. Approval email sent to school admin.');
      setRegistrations(prev => prev.filter(s => s.id !== schoolId));
      setExpandedSchoolId(null);
      setSelectedSchool(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to approve school:', err);
      setError(err.message || 'Failed to approve school');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectClick = (school) => {
    setSelectedSchool(school);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    try {
      setActionLoading(true);
      setError('');
      await authAPI.rejectRegistration(selectedSchool.id, rejectReason);
      setSuccessMessage('School registration rejected');
      setRegistrations(prev => prev.filter(s => s.id !== selectedSchool.id));
      setShowRejectModal(false);
      setRejectReason('');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to reject school:', err);
      setError(err.message || 'Failed to reject school');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/manufacturer/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/manufacturer/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'School Registrations', path: '/manufacturer/registrations', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'All Schools', path: '/manufacturer/schools', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', comingSoon: true },
    { name: 'Subscriptions', path: '/manufacturer/subscriptions', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', comingSoon: true },
    { name: 'Payments', path: '/manufacturer/payments', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z', comingSoon: true },
    { name: 'Users', path: '/manufacturer/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', comingSoon: true },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1e3a8a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] flex">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'} hidden md:block`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            {!isSidebarCollapsed && (
              <h1 className="text-xl font-bold text-[#1e3a8a]">Skoolar</h1>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSidebarCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
                  location.pathname === item.path
                    ? 'bg-[#1e3a8a] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {!isSidebarCollapsed && (
                  <>
                    <span className="font-medium">{item.name}</span>
                    {item.comingSoon && (
                      <span className="ml-auto text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Soon</span>
                    )}
                  </>
                )}
              </Link>
            ))}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-gray-200">
            <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 bg-[#1e3a8a] rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0) || 'M'}
              </div>
              {!isSidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Manufacturer'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              )}
            </div>
            {!isSidebarCollapsed && (
              <button
                onClick={handleLogout}
                className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">School Registrations</h1>
            <p className="text-gray-600 mt-1">Review and approve pending school registrations</p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {successMessage}
            </div>
          )}

          {/* Registrations Table */}
          {registrations.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Registrations</h3>
              <p className="text-gray-600">All school registrations have been processed</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">School Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Registered</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {registrations.map((school) => (
                    <>
                      {/* Main Row */}
                      <tr key={school.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 border-r border-gray-200">
                          <div className="font-medium text-gray-900">{school.name}</div>
                          <div className="text-sm text-gray-500">{school.subdomain}.skoolar.com</div>
                        </td>
                        <td className="px-6 py-4 border-r border-gray-200">
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                            {school.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 border-r border-gray-200">
                          <div className="text-sm text-gray-900">{school.state}</div>
                          <div className="text-xs text-gray-500">{school.lga}</div>
                        </td>
                        <td className="px-6 py-4 border-r border-gray-200">
                          <div className="text-sm text-gray-900">{school.email}</div>
                          <div className="text-xs text-gray-500">{school.phone}</div>
                        </td>
                        <td className="px-6 py-4 border-r border-gray-200">
                          <div className="text-sm text-gray-900">{formatDate(school.createdAt)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleViewDetails(school)}
                            className="text-[#1e3a8a] hover:text-[#152d6b] font-medium text-sm"
                          >
                            {expandedSchoolId === school.id ? 'Hide Details' : 'View Details'}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Details Row */}
                      {expandedSchoolId === school.id && (
                        <tr>
                          <td colSpan={6} className="px-6 py-6 bg-gray-50">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                              {/* School Details */}
                              <div className="lg:col-span-2 space-y-6">
                                {/* Basic Information */}
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                  <h3 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">School Information</h3>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="text-gray-600">School Name:</span>
                                      <p className="font-medium text-gray-900 mt-1">{school.name}</p>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Type:</span>
                                      <p className="font-medium text-gray-900 mt-1">{school.type}</p>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Email:</span>
                                      <p className="font-medium text-gray-900 mt-1">{school.email}</p>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Phone:</span>
                                      <p className="font-medium text-gray-900 mt-1">{school.phone}</p>
                                    </div>
                                    <div className="col-span-2">
                                      <span className="text-gray-600">Address:</span>
                                      <p className="font-medium text-gray-900 mt-1">{school.address}</p>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">State:</span>
                                      <p className="font-medium text-gray-900 mt-1">{school.state}</p>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">LGA:</span>
                                      <p className="font-medium text-gray-900 mt-1">{school.lga}</p>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Subdomain:</span>
                                      <p className="font-medium text-gray-900 mt-1">{school.subdomain}.skoolar.com</p>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Est. Students:</span>
                                      <p className="font-medium text-gray-900 mt-1">{school.estimatedStudentCount}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Contact Person */}
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                  <h3 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">Contact Person</h3>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="text-gray-600">Name:</span>
                                      <p className="font-medium text-gray-900 mt-1">{school.contactPersonName}</p>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Role:</span>
                                      <p className="font-medium text-gray-900 mt-1">{school.contactPersonRole}</p>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Phone:</span>
                                      <p className="font-medium text-gray-900 mt-1">{school.contactPersonPhone}</p>
                                    </div>
                                    {school.contactPersonId && (
                                      <div>
                                        <span className="text-gray-600">ID Number:</span>
                                        <p className="font-medium text-gray-900 mt-1">{school.contactPersonId}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Admin User */}
                                {school.users && school.users.length > 0 && (
                                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">Admin Account</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <span className="text-gray-600">Name:</span>
                                        <p className="font-medium text-gray-900 mt-1">{school.users[0].name}</p>
                                      </div>
                                      <div>
                                        <span className="text-gray-600">Email:</span>
                                        <p className="font-medium text-gray-900 mt-1">{school.users[0].email}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Documents */}
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                  <h3 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">Verification Documents</h3>
                                  {school.verificationDocuments ? (
                                    <div className="space-y-2">
                                      {Object.entries(school.verificationDocuments).map(([key, url]) => (
                                        <a
                                          key={key}
                                          href={url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-2 text-sm text-[#1e3a8a] hover:text-[#152d6b] hover:underline"
                                        >
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                          </svg>
                                          {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </a>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-gray-500">No documents uploaded</p>
                                  )}
                                </div>
                              </div>

                              {/* Verification Panel */}
                              <div className="space-y-4">
                                {/* Verification Checklist */}
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                  <h3 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">Verification Checklist</h3>
                                  <div className="space-y-3">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={verificationChecklist.cacVerified}
                                        onChange={(e) => setVerificationChecklist(prev => ({ ...prev, cacVerified: e.target.checked }))}
                                        className="w-4 h-4 text-[#1e3a8a] border-gray-300 rounded focus:ring-[#1e3a8a]"
                                      />
                                      <span className="text-sm text-gray-700">CAC/Registration verified</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={verificationChecklist.locationVerified}
                                        onChange={(e) => setVerificationChecklist(prev => ({ ...prev, locationVerified: e.target.checked }))}
                                        className="w-4 h-4 text-[#1e3a8a] border-gray-300 rounded focus:ring-[#1e3a8a]"
                                      />
                                      <span className="text-sm text-gray-700">Location verified</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={verificationChecklist.contactVerified}
                                        onChange={(e) => setVerificationChecklist(prev => ({ ...prev, contactVerified: e.target.checked }))}
                                        className="w-4 h-4 text-[#1e3a8a] border-gray-300 rounded focus:ring-[#1e3a8a]"
                                      />
                                      <span className="text-sm text-gray-700">Contact details verified</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={verificationChecklist.noDuplicates}
                                        onChange={(e) => setVerificationChecklist(prev => ({ ...prev, noDuplicates: e.target.checked }))}
                                        className="w-4 h-4 text-[#1e3a8a] border-gray-300 rounded focus:ring-[#1e3a8a]"
                                      />
                                      <span className="text-sm text-gray-700">No duplicate registrations</span>
                                    </label>
                                  </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                  <h3 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">Quick Actions</h3>
                                  <div className="space-y-2">
                                    <a
                                      href={`mailto:${school.email}`}
                                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#1e3a8a] transition-colors"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                      </svg>
                                      Send Email
                                    </a>
                                    <a
                                      href={`tel:${school.phone}`}
                                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#1e3a8a] transition-colors"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                      </svg>
                                      Call School
                                    </a>
                                    <button
                                      onClick={() => handleMoreInfoClick(school)}
                                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#1e3a8a] transition-colors w-full"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      Request More Info
                                    </button>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-2">
                                  <button
                                    onClick={() => handleApprove(school.id)}
                                    disabled={actionLoading}
                                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {actionLoading ? 'Processing...' : 'Approve Registration'}
                                  </button>
                                  <button
                                    onClick={() => handleRejectClick(school)}
                                    disabled={actionLoading}
                                    className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Reject Registration
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Reject Registration</h2>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting {selectedSchool?.name}'s registration:
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent resize-none"
              rows={4}
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* More Info Modal */}
      {showMoreInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Request More Information</h2>
            <p className="text-gray-600 mb-4">
              What additional information do you need from {selectedSchool?.name}?
            </p>
            <textarea
              value={moreInfoRequest}
              onChange={(e) => setMoreInfoRequest(e.target.value)}
              placeholder="Specify what information is needed..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent resize-none"
              rows={4}
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowMoreInfoModal(false);
                  setMoreInfoRequest('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleMoreInfoSubmit}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#152d6b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolRegistrations;
