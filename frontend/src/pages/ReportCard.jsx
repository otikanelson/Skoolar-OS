import React from 'react';

const ReportCard = () => {
  const studentInfo = {
    name: 'CHUKWUDI OKAFOR',
    id: 'STU001',
    class: 'SSS 2A',
    session: '2024/2025',
    term: '2nd Term',
  };

  const results = [
    { subject: 'Mathematics', ca: 28, exam: 52, total: 80, grade: 'A', position: '2nd', remark: 'Excellent' },
    { subject: 'English Language', ca: 32, exam: 48, total: 80, grade: 'A', position: '1st', remark: 'Excellent' },
    { subject: 'Physics', ca: 25, exam: 50, total: 75, grade: 'B', position: '5th', remark: 'Very Good' },
    { subject: 'Chemistry', ca: 30, exam: 48, total: 78, grade: 'B', position: '3rd', remark: 'Very Good' },
    { subject: 'Biology', ca: 27, exam: 45, total: 72, grade: 'B', position: '8th', remark: 'Good' },
    { subject: 'Further Mathematics', ca: 26, exam: 46, total: 72, grade: 'B', position: '4th', remark: 'Good' },
    { subject: 'Economics', ca: 35, exam: 50, total: 85, grade: 'A', position: '1st', remark: 'Excellent' },
    { subject: 'Government', ca: 30, exam: 45, total: 75, grade: 'B', position: '6th', remark: 'Very Good' },
    { subject: 'Literature', ca: 28, exam: 42, total: 70, grade: 'B', position: '10th', remark: 'Good' },
  ];

  const summary = {
    totalObtained: 687,
    totalObtainable: 900,
    average: 76.3,
    position: '3rd',
    totalStudents: 42,
    grade: 'B',
  };

  const gradeScale = [
    { grade: 'A', range: '80-100', remark: 'Excellent' },
    { grade: 'B', range: '70-79', remark: 'Very Good' },
    { grade: 'C', range: '60-69', remark: 'Good' },
    { grade: 'D', range: '50-59', remark: 'Pass' },
    { grade: 'F', range: '0-49', remark: 'Fail' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mb-4">
          <button className="bg-white border border-gray-300 text-gray-900 px-4 py-2 text-sm font-medium hover:bg-gray-50">
            Print Report Card
          </button>
          <button className="bg-[#1e3a8a] text-white px-4 py-2 text-sm font-medium hover:bg-[#1e293b]">
            Download PDF
          </button>
        </div>

        {/* Report Card */}
        <div className="bg-white border-4 border-[#1e3a8a]">
          {/* Header */}
          <div className="bg-[#1e3a8a] text-white p-8 text-center">
            <h1 className="text-2xl font-bold mb-2">Fieldgreen SECONDARY SCHOOL</h1>
            <p className="text-sm text-gray-300">123 Education Avenue, Lagos, Nigeria</p>
            <p className="text-sm text-gray-300">Tel: +234 800 123 4567 | Email: info@Fieldgreen.edu.ng</p>
            <div className="mt-6 pt-4 border-t border-gray-700">
              <h2 className="text-xl font-bold">STUDENT REPORT CARD</h2>
              <p className="text-sm text-gray-300">{studentInfo.session} Academic Session • {studentInfo.term}</p>
            </div>
          </div>

          {/* Student Info */}
          <div className="p-6 bg-gray-50 border-b-2 border-gray-300">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase">Student Name:</p>
                <p className="text-base font-bold text-gray-900">{studentInfo.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase">Student ID:</p>
                <p className="text-base font-bold text-gray-900">{studentInfo.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase">Class:</p>
                <p className="text-base font-bold text-gray-900">{studentInfo.class}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase">Session:</p>
                <p className="text-base font-bold text-gray-900">{studentInfo.session}</p>
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase">Academic Performance</h3>
            <table className="w-full border-collapse border-2 border-[#1e3a8a]">
              <thead>
                <tr className="bg-[#1e3a8a] text-white">
                  <th className="border border-[#1e3a8a] px-3 py-2 text-left text-xs font-bold">Subject</th>
                  <th className="border border-[#1e3a8a] px-3 py-2 text-center text-xs font-bold">CA (40)</th>
                  <th className="border border-[#1e3a8a] px-3 py-2 text-center text-xs font-bold">Exam (60)</th>
                  <th className="border border-[#1e3a8a] px-3 py-2 text-center text-xs font-bold">Total (100)</th>
                  <th className="border border-[#1e3a8a] px-3 py-2 text-center text-xs font-bold">Grade</th>
                  <th className="border border-[#1e3a8a] px-3 py-2 text-center text-xs font-bold">Position</th>
                  <th className="border border-[#1e3a8a] px-3 py-2 text-center text-xs font-bold">Remark</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="border border-gray-300 px-3 py-2 text-sm font-medium">{result.subject}</td>
                    <td className="border border-gray-300 px-3 py-2 text-center text-sm">{result.ca}</td>
                    <td className="border border-gray-300 px-3 py-2 text-center text-sm">{result.exam}</td>
                    <td className="border border-gray-300 px-3 py-2 text-center font-bold text-sm">{result.total}</td>
                    <td className="border border-gray-300 px-3 py-2 text-center font-bold text-sm">{result.grade}</td>
                    <td className="border border-gray-300 px-3 py-2 text-center text-sm">{result.position}</td>
                    <td className="border border-gray-300 px-3 py-2 text-center text-xs">{result.remark}</td>
                  </tr>
                ))}
                <tr className="bg-gray-200 font-bold">
                  <td className="border border-gray-300 px-3 py-2 text-sm">TOTAL</td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-sm" colSpan="2">-</td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-sm">{summary.totalObtained}/{summary.totalObtainable}</td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-sm">{summary.grade}</td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-sm" colSpan="2">-</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="px-6 pb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 border-2 border-gray-300">
                <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase">Performance Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Obtained:</span>
                    <span className="font-bold">{summary.totalObtained}/{summary.totalObtainable}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Score:</span>
                    <span className="font-bold">{summary.average}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Class Position:</span>
                    <span className="font-bold">{summary.position} of {summary.totalStudents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Overall Grade:</span>
                    <span className="font-bold">{summary.grade}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 border-2 border-gray-300">
                <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase">Grading Scale</h4>
                <div className="space-y-1 text-xs">
                  {gradeScale.map((scale, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="font-medium">{scale.grade} ({scale.range})</span>
                      <span className="text-gray-600">{scale.remark}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="px-6 pb-6">
            <div className="bg-gray-50 p-4 border-2 border-gray-300 mb-3">
              <h4 className="font-bold text-gray-900 mb-2 text-sm uppercase">Class Teacher's Comment:</h4>
              <p className="text-sm text-gray-700">
                Chukwudi has shown excellent performance this term. He is consistent and demonstrates strong understanding across all subjects. Keep up the good work!
              </p>
            </div>
            <div className="bg-gray-50 p-4 border-2 border-gray-300">
              <h4 className="font-bold text-gray-900 mb-2 text-sm uppercase">Principal's Comment:</h4>
              <p className="text-sm text-gray-700">
                An outstanding student with great potential. Promoted to SSS 3.
              </p>
            </div>
          </div>

          {/* Signatures */}
          <div className="px-6 pb-6">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="border-t-2 border-primary-700 pt-2">
                <p className="text-xs font-semibold text-gray-600 uppercase">Class Teacher</p>
              </div>
              <div className="border-t-2 border-primary-700 pt-2">
                <p className="text-xs font-semibold text-gray-600 uppercase">Principal</p>
              </div>
              <div className="border-t-2 border-primary-700 pt-2">
                <p className="text-xs font-semibold text-gray-600 uppercase">Date</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 p-3 text-center text-xs text-gray-600 border-t-2 border-gray-300">
            <p>Generated by Skoolar Academic Management System • {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;


