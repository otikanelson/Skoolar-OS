import React, { useState, useEffect } from 'react';

const ExamHall = () => {
  const [timeLeft, setTimeLeft] = useState(3600); // 60 mins
  const [cheats, setCheats] = useState(0);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setCheats(c => c + 1);
        alert("Warning: Do not leave the exam tab!");
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-white border-b-2 border-primary-700">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Chemistry Mock Examination</h2>
            <p className="text-xs text-gray-600">Fieldgreen Secondary School • SSS 3</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-xs text-gray-600">Violations</div>
              <div className="text-lg font-bold text-red-600">{cheats}</div>
            </div>
            <div className="bg-primary-700 text-white-900 px-4 py-2 font-mono text-xl font-bold">
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white border border-gray-300 p-8">
          {/* Question Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-300">
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Question 1 of 50</span>
            <span className="text-xs text-gray-600">Section A: Multiple Choice</span>
          </div>

          {/* Question */}
          <p className="text-base text-gray-900 leading-relaxed mb-8">
            Which of the following elements is a noble gas commonly used in filling advertising signs and producing bright colored lights?
          </p>
          
          {/* Options */}
          <div className="space-y-3">
            {['Argon', 'Neon', 'Helium', 'Nitrogen'].map((opt, i) => (
              <button 
                key={i} 
                className="w-full text-left p-4 border-2 border-gray-300 hover:border-primary-700 hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 mr-3">{String.fromCharCode(65 + i)}.</span>
                <span className="text-gray-900">{opt}</span>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="mt-8 pt-6 border-t border-gray-300 flex justify-between items-center">
            <button className="border border-gray-300 text-gray-700 px-6 py-2 text-sm font-medium hover:bg-gray-50">
              Previous
            </button>
            <div className="text-xs text-gray-600">
              <button className="underline hover:text-gray-900">Flag for Review</button>
            </div>
            <button className="bg-primary-700 text-white-900 px-6 py-2 text-sm font-medium hover:bg-primary-800">
              Next Question
            </button>
          </div>
        </div>

        {/* Question Navigator */}
        <div className="bg-white border border-gray-300 p-6 mt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Question Navigator</h3>
          <div className="grid grid-cols-10 gap-2">
            {Array.from({length: 50}, (_, i) => (
              <button 
                key={i} 
                className={`w-10 h-10 border text-sm font-medium ${
                  i === 0 
                    ? 'border-primary-700 bg-primary-700 text-white-900' 
                    : 'border-gray-300 text-gray-700 hover:border-primary-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 text-center">
          <button className="bg-red-600 text-gray-900 px-8 py-3 text-sm font-bold hover:bg-red-700">
            SUBMIT EXAMINATION
          </button>
        </div>
      </main>
    </div>
  );
};

export default ExamHall;

