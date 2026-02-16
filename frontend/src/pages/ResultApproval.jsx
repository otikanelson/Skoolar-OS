import React, { useState } from 'react';

const ResultApproval = () => {
  const [selectedResult, setSelectedResult] = useState(null);

  const pendingResults = [
    {
      id: 1,
      teacher: 'Mrs. Adeyemi Folake',
      subject: 'Mathematics',
      class: 'SSS 2A',
      students: 42,
      submittedDate: '2025-01-15',
      submittedTime: '2 hours ago',
      status: 'pending_hod',
      stage: 1,
    },
    {
      id: 2,
      teacher: 'Mr. Bello Ibrahim',
      subject: 'English Language',
      class: 'SSS 3C',
      students: 38,
      submittedDate: '2025-01-15',
      submittedTime: '5 hours ago',
      status: 'pending_hod',
      stage: 1,
    },
    {
      id: 3,
      teacher: 'Miss Okonkwo Grace',
      subject: 'Biology',
      class: 'SSS 1B',
      students: 45,
      submittedDate: '2025-01-14',
      submittedTime: '1 day ago',
      status: 'pending_admin',
      stage: 2,
    },
  ];

  const sampleScores = [
    { id: 'STU001', name: 'Chukwudi Okafor', ca: 28, exam: 52, total: 80, grade: 'A', position: 2 },
    { id: 'STU002', name: 'Zainab Musa', ca: 32, exam: 48, total: 80, grade: 'A', position: 1 },
    { id: 'STU003', name: 'Tobi Adekunle', ca: 25, exam: 50, total: 75, grade: 'B', position: 5 },
    { id: 'STU004', name: 'Amina Ibrahim', ca: 30, exam: 48, total: 78, grade: 'B', position: 3 },
    { id: 'STU005', name: 'Emmanuel Obi', ca: 27, exam: 45, total: 72, grade: 'B', position: 8 },
  ];

  const getStageInfo = (stage) => {
    const stages = [
      { label: 'Teacher Submitted', number: '1' },
      { label: 'HOD Review', number: '2' },
      { label: 'Admin Approval', number: '3' },
      { label: 'Published', number: '4' },
    ];
    return stages[stage];
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Result Approval Workflow</h1>
              <p className="text-sm text-gray-600">Review and approve submitted results</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="bg-gray-100 text-gray-700 px-3 py-1 border border-gray-300 text-sm">
                {pendingResults.filter(r => r.status === 'pending_hod').length} Pending Review
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Workflow Stages */}
        <div className="bg-white border border-gray-300 p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Three-Stage Approval Process</h2>
          <div className="flex items-center justify-between">
            {[0, 1, 2, 3].map((stage) => {
              const info = getStageInfo(stage);
              return (
                <div key={stage} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-2 border-gray-400 bg-white flex items-center justify-center text-sm font-semibold mb-2">
                      {info.number}
                    </div>
                    <span className="text-sm text-gray-700">{info.label}</span>
                  </div>
                  {stage < 3 && (
                    <div className="w-24 h-0.5 bg-gray-300 mx-4"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Pending Results List */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-300">
              <div className="p-4 border-b border-gray-300 bg-gray-50">
                <h2 className="text-base font-semibold text-gray-900">Pending Submissions</h2>
                <p className="text-sm text-gray-600">{pendingResults.length} results awaiting action</p>
              </div>
              <div className="divide-y divide-gray-300">
                {pendingResults.map((result) => {
                  const stageInfo = getStageInfo(result.stage);
                  return (
                    <div
                      key={result.id}
                      onClick={() => setSelectedResult(result)}
                      className={`p-4 cursor-pointer ${
                        selectedResult?.id === result.id ? 'bg-gray-100 border-l-4 border-black' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-semibold text-gray-900">{result.subject}</div>
                          <div className="text-sm text-gray-600">{result.class}</div>
                        </div>
                        <span className="text-xs bg-gray-100 border border-gray-300 px-2 py-1">
                          Stage {stageInfo.number}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>{result.teacher}</div>
                        <div>{result.students} students • {result.submittedTime}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Result Details & Review */}
          <div className="lg:col-span-2">
            {selectedResult ? (
              <div className="bg-white border border-gray-300">
                {/* Header */}
                <div className="p-6 border-b border-gray-300 bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{selectedResult.subject} - {selectedResult.class}</h2>
                      <p className="text-sm text-gray-600">Submitted by {selectedResult.teacher}</p>
                      <p className="text-sm text-gray-600">{selectedResult.submittedDate} • {selectedResult.submittedTime}</p>
                    </div>
                    <span className="px-3 py-1 border border-gray-300 text-sm bg-white">
                      {selectedResult.status === 'pending_hod' ? 'Awaiting HOD Review' : 'Awaiting Admin Approval'}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-white border border-gray-300 p-3">
                      <div className="text-2xl font-semibold text-gray-900">{selectedResult.students}</div>
                      <div className="text-xs text-gray-600">Total Students</div>
                    </div>
                    <div className="bg-white border border-gray-300 p-3">
                      <div className="text-2xl font-semibold text-gray-900">76.5%</div>
                      <div className="text-xs text-gray-600">Class Average</div>
                    </div>
                    <div className="bg-white border border-gray-300 p-3">
                      <div className="text-2xl font-semibold text-gray-900">38</div>
                      <div className="text-xs text-gray-600">Passed</div>
                    </div>
                    <div className="bg-white border border-gray-300 p-3">
                      <div className="text-2xl font-semibold text-gray-900">4</div>
                      <div className="text-xs text-gray-600">Failed</div>
                    </div>
                  </div>
                </div>

                {/* Scores Table */}
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Student Scores (Sample)</h3>
                  <div className="overflow-x-auto border border-gray-300">
                    <table className="w-full">
                      <thead className="bg-gray-100 border-b border-gray-300">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 border-r border-gray-300">Student ID</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 border-r border-gray-300">Name</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 border-r border-gray-300">CA (40)</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 border-r border-gray-300">Exam (60)</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 border-r border-gray-300">Total</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 border-r border-gray-300">Grade</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Position</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-300">
                        {sampleScores.map((score) => (
                          <tr key={score.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-mono text-gray-900 border-r border-gray-300">{score.id}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">{score.name}</td>
                            <td className="px-4 py-3 text-sm text-center border-r border-gray-300">{score.ca}</td>
                            <td className="px-4 py-3 text-sm text-center border-r border-gray-300">{score.exam}</td>
                            <td className="px-4 py-3 text-sm text-center font-semibold border-r border-gray-300">{score.total}</td>
                            <td className="px-4 py-3 text-center border-r border-gray-300">
                              <span className="px-2 py-1 text-xs font-semibold border border-gray-300 bg-white">
                                {score.grade}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-center">{score.position}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">Showing 5 of {selectedResult.students} students</p>
                </div>

                {/* Comments Section */}
                <div className="p-6 bg-gray-50 border-t border-gray-300">
                  <h3 className="font-semibold text-gray-900 mb-3">Review Comments</h3>
                  <textarea
                    placeholder="Enter comments or feedback..."
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500"
                    rows="3"
                  ></textarea>
                </div>

                {/* Action Buttons */}
                <div className="p-6 bg-gray-50 border-t border-gray-300 flex gap-4">
                  <button className="flex-1 bg-white border-2 border-gray-400 text-gray-900 py-3 font-semibold hover:bg-gray-100">
                    Reject & Return
                  </button>
                  <button className="flex-1 bg-[#1e3a8a] text-white py-3 font-semibold hover:bg-[#1e293b]">
                    Approve & Forward
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-300 p-12 text-center">
                <div className="w-16 h-16 border-2 border-gray-300 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl text-gray-400">□</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Result to Review</h3>
                <p className="text-gray-600">Choose a pending submission from the list to view details and take action</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultApproval;


