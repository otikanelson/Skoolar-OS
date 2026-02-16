import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const RequestDemo = () => {
  const [formData, setFormData] = useState({
    schoolName: '',
    contactName: '',
    email: '',
    phone: '',
    studentCount: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement actual demo request submission
    console.log('Demo request:', formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#fafaf9]">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="bg-white border border-gray-300 p-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Demo Request Received
            </h1>
            <p className="text-gray-600 mb-8">
              Thank you for your interest in EduCore. Our team will contact you within 24 hours to schedule your personalized demo.
            </p>
            <Link 
              to="/" 
              className="inline-block bg-[#1e3a8a] text-white px-8 py-3 font-semibold hover:bg-[#1e40af] transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <Header />

      {/* Header */}
      <div className="bg-white border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Request a Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See EduCore in action. Schedule a personalized demo with our team.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white border border-gray-300 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  School Name *
                </label>
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#1e3a8a]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Contact Name *
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#1e3a8a]"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#1e3a8a]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#1e3a8a]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Number of Students *
              </label>
              <select
                name="studentCount"
                value={formData.studentCount}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#1e3a8a]"
              >
                <option value="">Select range</option>
                <option value="200-400">200-400 students</option>
                <option value="400-800">400-800 students</option>
                <option value="800+">800+ students</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#1e3a8a]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Preferred Time
                </label>
                <select
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#1e3a8a]"
                >
                  <option value="">Select time</option>
                  <option value="morning">Morning (9AM - 12PM)</option>
                  <option value="afternoon">Afternoon (12PM - 3PM)</option>
                  <option value="evening">Evening (3PM - 6PM)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Additional Information
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                placeholder="Tell us about your school's specific needs..."
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#1e3a8a]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#1e3a8a] text-white py-4 font-semibold hover:bg-[#1e40af] transition-colors"
            >
              Request Demo
            </button>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-gray-50 border border-gray-300 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">What to Expect</h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#1e3a8a] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>30-45 minute personalized demo session</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#1e3a8a] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Live walkthrough of all features</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#1e3a8a] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Q&A session with our product experts</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#1e3a8a] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Custom pricing based on your needs</span>
            </li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RequestDemo;
