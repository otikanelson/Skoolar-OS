import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Support = () => {
  const [activeCategory, setActiveCategory] = useState('getting-started');

  const categories = [
    { id: 'getting-started', name: 'Getting Started' },
    { id: 'account', name: 'Account & Billing' },
    { id: 'features', name: 'Features' },
    { id: 'technical', name: 'Technical Issues' },
    { id: 'security', name: 'Security' },
  ];

  const faqs = {
    'getting-started': [
      {
        question: 'How do I get started with Skoolar?',
        answer: 'After registration and approval, you will receive login credentials and access to our onboarding portal. Our team will guide you through the initial setup, data migration, and staff training.',
      },
      {
        question: 'What is the implementation timeline?',
        answer: 'Typical implementation takes 2-4 weeks depending on school size and data migration requirements. This includes system setup, data import, staff training, and testing.',
      },
      {
        question: 'Do you provide training for staff?',
        answer: 'Yes, we provide comprehensive training for administrators, teachers, and other staff members. Training includes both on-site sessions and online resources.',
      },
    ],
    'account': [
      {
        question: 'How is pricing calculated?',
        answer: 'Pricing is based on per-student monthly fees plus a one-time setup fee. The exact cost depends on your chosen plan and number of students. Contact our sales team for a custom quote.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept bank transfers, card payments, and offer installment plans for annual subscriptions. Payment terms can be customized based on your school\'s needs.',
      },
      {
        question: 'Can I upgrade or downgrade my plan?',
        answer: 'Yes, you can change your plan at any time. Changes take effect at the start of the next billing cycle. Contact support to discuss plan changes.',
      },
    ],
    'features': [
      {
        question: 'Can I customize report card templates?',
        answer: 'Yes, Premium plan subscribers can create custom report card templates. Standard plan users have access to pre-designed templates that can be configured.',
      },
      {
        question: 'How does the CBT system work?',
        answer: 'The CBT system allows teachers to create exams with multiple question types, schedule tests, and automatically grade objective questions. Students take exams on computers with instant results for MCQs.',
      },
      {
        question: 'Can parents access student information?',
        answer: 'Yes, parents receive login credentials to access their child\'s results, attendance, and communicate with teachers through the parent portal.',
      },
    ],
    'technical': [
      {
        question: 'What are the system requirements?',
        answer: 'Skoolar is web-based and works on any modern browser (Chrome, Firefox, Safari, Edge). For CBT exams, we recommend computers with at least 4GB RAM and stable internet connection.',
      },
      {
        question: 'Is my data backed up?',
        answer: 'Yes, we perform automated daily backups with 30-day retention. Premium subscribers get extended backup retention and on-demand backup options.',
      },
      {
        question: 'What if I experience technical issues?',
        answer: 'Contact our support team via email, phone, or the in-app support chat. Response times vary by plan: Basic (24-48 hours), Standard (12-24 hours), Premium (2-4 hours).',
      },
    ],
    'security': [
      {
        question: 'How is student data protected?',
        answer: 'We use industry-standard encryption for data in transit and at rest. Access is controlled through role-based permissions, and all activities are logged for audit purposes.',
      },
      {
        question: 'Is Skoolar NDPR compliant?',
        answer: 'Yes, Skoolar is compliant with Nigeria Data Protection Regulation (NDPR). We implement strict data protection measures and provide tools for data privacy management.',
      },
      {
        question: 'Who has access to school data?',
        answer: 'Only authorized school staff have access to data based on their assigned roles. Skoolar staff can only access data for support purposes with explicit permission.',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <Header />

      {/* Header */}
      <div className="bg-white border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Support Center
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions or contact our support team
          </p>
        </div>
      </div>

      {/* Contact Options */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-gray-300 p-6 text-center hover:border-[#1e3a8a] transition-colors">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#1e3a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-sm text-gray-600 mb-3">Get help via email</p>
            <a 
              href="mailto:support@skoolar.com" 
              className="text-[#1e3a8a] font-semibold hover:underline text-sm"
            >
              support@skoolar.com
            </a>
          </div>

          <div className="bg-white border border-gray-300 p-6 text-center hover:border-[#1e3a8a] transition-colors">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#1e3a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-sm text-gray-600 mb-3">Call us directly</p>
            <a 
              href="tel:+2348012345678" 
              className="text-[#1e3a8a] font-semibold hover:underline text-sm"
            >
              +234 801 234 5678
            </a>
          </div>

          <div className="bg-white border border-gray-300 p-6 text-center hover:border-[#1e3a8a] transition-colors">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#1e3a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600 mb-3">Chat with our team</p>
            <button className="text-[#1e3a8a] font-semibold hover:underline text-sm">
              Start Chat
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white border border-gray-300">
          <div className="border-b border-gray-300 p-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid md:grid-cols-4">
            {/* Categories Sidebar */}
            <div className="border-r border-gray-300 p-4">
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                      activeCategory === category.id
                        ? 'bg-[#1e3a8a] text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* FAQ Content */}
            <div className="md:col-span-3 p-6">
              <div className="space-y-6">
                {faqs[activeCategory].map((faq, idx) => (
                  <div key={idx} className="border-b border-gray-200 pb-6 last:border-0">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Still Need Help */}
        <div className="mt-12 bg-gray-50 border border-gray-300 p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Still need help?
          </h3>
          <p className="text-gray-600 mb-4">
            Our support team is here to assist you
          </p>
          <a 
            href="mailto:support@skoolar.com"
            className="inline-block bg-[#1e3a8a] text-white px-8 py-3 font-semibold hover:bg-[#1e40af] transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Support;
