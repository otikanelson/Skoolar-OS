import React, { useState } from 'react';

const TeacherLedger = () => {
  const [scores, setScores] = useState([
    { id: 'STU001', name: 'Chukwudi Okafor', ca: 28, exam: 52 },
    { id: 'STU002', name: 'Zainab Musa', ca: 32, exam: 48 },
    { id: 'STU003', name: 'Tobi Adekunle', ca: 25, exam: 50 },
    { id: 'STU004', name: 'Amina Ibrahim', ca: 30, exam: 48 },
    { id: 'STU005', name: 'Emmanuel Obi', ca: 27, exam: 45 },
  ]);

  const updateScore = (id, field, val) => {
    const newVal = Math.min(field === 'ca' ? 40 : 60, Math.max(0, Number(val)));
    setScores(prev => prev.map(s => s.id === id ? { ...s, [field]: newVal } : s));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Score Entry: Mathematics - SSS 2A</h1>
              <p className="text-xs text-gray-600">2nd Term 2024/2025 • Mrs. Adeyemi Folake</p>
            </div>
            <div className="flex gap-3">
              <button className="border border-gray-300 text-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-50">
                Save Draft
              </button>
              <button className="bg-[#1e3a8a] text-white px-4 py-2 text-sm font-medium hover:bg-[#1e293b]">
                Submit for Approval
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Instructions */}
        <div className="bg-white border border-gray-300 p-4 mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Score Entry Instructions</h2>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Continuous Assessment (CA): Maximum 40 marks</li>
            <li>• Examination Score: Maximum 60 marks</li>
            <li>• Total score will be calculated automatically</li>
            <li>• Save draft to continue later or submit for HOD approval</li>
          </ul>
        </div>

        {/* Score Entry Table */}
        <div className="bg-white border border-gray-300">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Student ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Full Name</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">CA (40)</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Exam (60)</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Total (100)</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {scores.map(s => {
                const total = s.ca + s.exam;
                const grade = total >= 80 ? 'A' : total >= 70 ? 'B' : total >= 60 ? 'C' : total >= 50 ? 'D' : 'F';
                return (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-sm text-gray-900">{s.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{s.name}</td>
                    <td className="px-4 py-3 text-center">
                      <input 
                        type="number" 
                        value={s.ca} 
                        onChange={e => updateScore(s.id, 'ca', e.target.value)} 
                        className="w-16 border border-gray-300 p-1 text-center text-sm focus:outline-none focus:border-primary-700" 
                        min="0"
                        max="40"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input 
                        type="number" 
                        value={s.exam} 
                        onChange={e => updateScore(s.id, 'exam', e.target.value)} 
                        className="w-16 border border-gray-300 p-1 text-center text-sm focus:outline-none focus:border-primary-700" 
                        min="0"
                        max="60"
                      />
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-sm text-gray-900">{total}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 font-semibold">{grade}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Summary Footer */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-300">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Total Students: <span className="font-semibold text-gray-900">42</span></span>
              <span className="text-gray-600">Showing: <span className="font-semibold text-gray-900">5 of 42</span></span>
              <span className="text-gray-600">Status: <span className="font-semibold text-gray-700">Draft</span></span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button className="border border-gray-300 text-gray-700 px-6 py-2 text-sm font-medium hover:bg-gray-50">
            Cancel
          </button>
          <button className="border border-gray-300 text-gray-700 px-6 py-2 text-sm font-medium hover:bg-gray-50">
            Save Draft
          </button>
          <button className="bg-[#1e3a8a] text-white px-6 py-2 text-sm font-medium hover:bg-[#1e293b]">
            Submit for Approval
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherLedger;

