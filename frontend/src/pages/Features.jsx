import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TourGuide from '../components/TourGuide';

const Features = () => {
  const features = [
    {
      category: 'Student Records Management',
      items: [
        'Complete student profile management',
        'Enrollment and admission tracking',
        'Class and section assignments',
        'Student attendance monitoring',
        'Parent/guardian information',
        'Medical records and emergency contacts',
      ],
    },
    {
      category: 'Result Processing',
      items: [
        'Automated result computation',
        'Customizable grading systems',
        'Report card generation',
        'Performance analytics',
        'Subject-wise analysis',
        'Term and annual reports',
      ],
    },
    {
      category: 'CBT Examination System',
      items: [
        'Computer-based testing platform',
        'Question bank management',
        'Multiple question types (MCQ, Essay, True/False)',
        'Auto-marking and instant results',
        'Practice exams and mock tests',
        'Exam scheduling and management',
      ],
    },
    {
      category: 'Parent Portal',
      items: [
        'Real-time access to student results',
        'Attendance tracking',
        'Fee payment history',
        'Communication with teachers',
        'Event notifications',
        'Progress reports',
      ],
    },
    {
      category: 'Teacher Tools',
      items: [
        'Digital grade book',
        'Lesson planning tools',
        'Assignment management',
        'Student performance tracking',
        'Class attendance',
        'Communication tools',
      ],
    },
    {
      category: 'Analytics & Reporting',
      items: [
        'Comprehensive dashboards',
        'Performance trends',
        'Class comparisons',
        'Subject analysis',
        'Custom report generation',
        'Data export capabilities',
      ],
    },
    {
      category: 'Communication',
      items: [
        'SMS notifications',
        'Email alerts',
        'In-app messaging',
        'Announcement system',
        'Event reminders',
        'Emergency broadcasts',
      ],
    },
    {
      category: 'Security & Access Control',
      items: [
        'Role-based access control',
        'Secure authentication',
        'Data encryption',
        'Audit logs',
        'Session management',
        'Multi-factor authentication',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <Header />
      <TourGuide />

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Features for Modern Schools
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Everything you need to manage your school efficiently, from student records to examination systems
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white border border-gray-300 p-8 hover:border-[#1e3a8a] transition-colors">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                {feature.category}
              </h2>
              <ul className="space-y-3">
                {feature.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#1e3a8a] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#1e3a8a] py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your School?
          </h2>
          <p className="text-gray-200 mb-8 text-lg">
            See how Skoolar can streamline your academic management
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              to="/contact-sales" 
              className="bg-white text-[#1e3a8a] px-8 py-3 font-semibold hover:bg-gray-100 transition-colors"
            >
              Request Demo
            </Link>
            <Link 
              to="/pricing" 
              className="bg-transparent border-2 border-white text-white px-8 py-3 font-semibold hover:bg-white hover:text-[#1e3a8a] transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Features;
