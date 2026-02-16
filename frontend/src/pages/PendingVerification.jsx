import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const PendingVerification = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user should be on this page
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.schoolId) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white border border-gray-200 p-6 sm:p-8 shadow-sm">
        <div className="text-center mb-6 sm:mb-8">
          <div className="mb-4 text-yellow-500 text-5xl sm:text-6xl">⏳</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Account Pending Verification</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Your school registration is currently under review
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Current Status</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Registration Submitted</p>
                <p className="text-sm text-gray-600">Your application has been received</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
              <div>
                <p className="font-medium text-gray-900">Under Review</p>
                <p className="text-sm text-gray-600">Our team is verifying your information</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-gray-600">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-500">Approval & Activation</p>
                <p className="text-sm text-gray-500">You'll receive email notification when approved</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">What you can do while waiting:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Check your email regularly for updates</li>
            <li>• Prepare your student and teacher data for upload</li>
            <li>• Review our documentation and training materials</li>
            <li>• Contact support if you have questions</li>
          </ul>
        </div>

        <div className="text-center space-y-3">
          <p className="text-xs sm:text-sm text-gray-600">
            Verification typically takes 1-2 business days
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleLogout}
              className="px-6 py-2 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Logout
            </button>
            <a
              href="mailto:support@educore.ng"
              className="px-6 py-2 bg-[#1e3a8a] text-white font-medium hover:bg-blue-800 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingVerification;
