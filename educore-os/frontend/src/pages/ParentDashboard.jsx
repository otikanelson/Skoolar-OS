import React from 'react';

const ParentDashboard = () => {
  const recentResults = [
    { subject: 'Mathematics', ca: 28, exam: 52, total: 80, grade: 'A', position: '2nd' },
    { subject: 'English Language', ca: 32, exam: 48, total: 80, grade: 'A', position: '1st' },
    { subject: 'Physics', ca: 25, exam: 50, total: 75, grade: 'B', position: '5th' },
    { subject: 'Chemistry', ca: 30, exam: 48, total: 78, grade: 'B', position: '3rd' },
    { subject: 'Biology', ca: 27, exam: 45, total: 72, grade: 'B', position: '8th' },
  ];

  const notifications = [
    { message: '2nd Term results published', time: '2 hours ago' },
    { message: 'Mock JAMB exam scheduled for next week', time: '1 day ago' },
    { message: 'School fees payment reminder', time: '3 days ago' },
    { message: 'Parent-Teacher meeting on Friday', time: '5 days ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Parent Portal</h1>
              <p className="text-xs text-gray-600">Mr. Okafor • Fieldgreen Secondary School</p>
            </div>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-50">
              Notifications (4)
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Student Info Card */}
        <div className="bg-white border border-gray-300 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Chukwudi Okafor</h2>
              <p className="text-sm text-gray-600">SSS 2A • 2024/2025 Academic Session • 2nd Term</p>
              <div className="flex gap-6 mt-3 text-sm">
                <span className="text-gray-600">Position: <span className="font-semibold text-gray-900">3rd of 42</span></span>
                <span className="text-gray-600">Average: <span className="font-semibold text-gray-900">76.3%</span></span>
                <span className="text-gray-600">Grade: <span className="font-semibold text-gray-900">B</span></span>
              </div>
            </div>
            <button className="bg-primary-700 text-white-900 px-4 py-2 text-sm font-medium hover:bg-primary-800">
              Download Report Card
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Results Table */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-300">
              <div className="p-4 border-b border-gray-300">
                <h2 className="text-sm font-semibold text-gray-900">2nd Term Results - 2024/2025</h2>
                <p className="text-xs text-gray-600">Academic Performance Summary</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-300">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Subject</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">CA (40)</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Exam (60)</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Total</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Grade</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Position</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentResults.map((result, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{result.subject}</td>
                        <td className="px-4 py-3 text-sm text-center text-gray-600">{result.ca}</td>
                        <td className="px-4 py-3 text-sm text-center text-gray-600">{result.exam}</td>
                        <td className="px-4 py-3 text-sm text-center font-bold text-gray-900">{result.total}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 font-semibold">
                            {result.grade}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-center text-gray-600">{result.position}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-300">
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <span className="text-gray-600">Overall Average: </span>
                    <span className="font-bold text-gray-900">76.3%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Class Position: </span>
                    <span className="font-bold text-gray-900">3rd of 42</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white border border-gray-300">
            <div className="p-4 border-b border-gray-300">
              <h2 className="text-sm font-semibold text-gray-900">Recent Notifications</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {notifications.map((notif, idx) => (
                <div key={idx} className="p-4 hover:bg-gray-50 cursor-pointer">
                  <p className="text-sm font-medium text-gray-900">{notif.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-300">
              <button className="w-full text-center text-sm text-gray-900 hover:underline font-medium">
                View All Notifications
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white border border-gray-300 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">95%</div>
            <div className="text-xs text-gray-600">Attendance</div>
          </div>
          <div className="bg-white border border-gray-300 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">9/9</div>
            <div className="text-xs text-gray-600">Subjects Passed</div>
          </div>
          <div className="bg-white border border-gray-300 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">3rd</div>
            <div className="text-xs text-gray-600">Class Position</div>
          </div>
          <div className="bg-white border border-gray-300 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">B</div>
            <div className="text-xs text-gray-600">Average Grade</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;


