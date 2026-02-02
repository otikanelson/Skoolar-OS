import React from 'react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const plans = [
    {
      name: 'Basic',
      price: '₦200',
      period: 'per student/month',
      description: 'Records and result processing',
      students: '200-400 students',
      features: [
        'Student Records Management',
        'Result Processing & Report Cards',
        'Parent Portal Access',
        'SMS Notifications',
        'Email Support',
        'Basic Analytics',
      ],
      notIncluded: [
        'CBT Examination System',
        'Advanced Analytics',
        'Priority Support',
      ],
    },
    {
      name: 'Standard',
      price: '₦300',
      period: 'per student/month',
      description: 'Complete academic management',
      students: '400-800 students',
      features: [
        'Everything in Basic',
        'CBT Examination System',
        'Question Bank Management',
        'Auto-Marking & Grading',
        'Practice Exams',
        'Advanced Analytics Dashboard',
        'Priority Email Support',
        'Teacher Training',
      ],
      notIncluded: [
        'Custom Integrations',
        'Dedicated Account Manager',
      ],
      recommended: true,
    },
    {
      name: 'Premium',
      price: '₦400',
      period: 'per student/month',
      description: 'Enterprise-grade solution',
      students: '800+ students',
      features: [
        'Everything in Standard',
        'Custom Integrations',
        'API Access',
        'Dedicated Account Manager',
        '24/7 Phone Support',
        'Custom Report Templates',
        'Advanced Security Features',
        'On-site Training',
        'White-label Options',
      ],
      notIncluded: [],
    },
  ];

  const addons = [
    { name: 'CBT Lab Setup', price: '₦2,000,000 - ₦5,000,000', description: 'Complete hardware setup with computers, networking, and furniture' },
    { name: 'Additional Training', price: '₦50,000/day', description: 'On-site training for teachers and administrators' },
    { name: 'Custom Development', price: 'Contact Us', description: 'Custom features and integrations tailored to your needs' },
    { name: 'Data Migration', price: '₦100,000 - ₦300,000', description: 'Migrate existing student records and data' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-semibold text-gray-900">EduCore</Link>
            <div className="flex gap-4">
              <Link to="/login" className="text-gray-700 hover:text-gray-900 px-4 py-2">Login</Link>
              <button className="bg-primary-700 text-white-900 px-4 py-2 hover:bg-primary-800">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center border-b border-gray-300">
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">
          Subscription Plans
        </h1>
        <p className="text-base text-gray-600 max-w-2xl mx-auto">
          Per-student pricing with one-time setup fee of ₦200,000 - ₦400,000
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`bg-white border-2 ${
                plan.recommended ? 'border-black' : 'border-gray-300'
              }`}
            >
              {plan.recommended && (
                <div className="bg-primary-700 text-white-900 text-center py-2 font-semibold text-sm">
                  RECOMMENDED
                </div>
              )}
              <div className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-3xl font-semibold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                  <p className="text-sm text-gray-600 mt-2">{plan.students}</p>
                </div>
                <button className={`w-full py-3 font-semibold mb-6 ${
                  plan.recommended 
                    ? 'bg-primary-700 text-white-900 hover:bg-primary-800' 
                    : 'bg-white border-2 border-gray-300 text-gray-900 hover:bg-gray-50'
                }`}>
                  Contact Sales
                </button>
                <div className="space-y-3">
                  <p className="font-semibold text-gray-900 text-sm">INCLUDED:</p>
                  {plan.features.map((feature, fidx) => (
                    <div key={fidx} className="flex items-start gap-2">
                      <span className="text-gray-900 flex-shrink-0 mt-0.5">✓</span>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.length > 0 && (
                    <>
                      <p className="font-semibold text-gray-900 text-sm mt-4">NOT INCLUDED:</p>
                      {plan.notIncluded.map((feature, fidx) => (
                        <div key={fidx} className="flex items-start gap-2">
                          <span className="text-gray-400 flex-shrink-0 mt-0.5">×</span>
                          <span className="text-sm text-gray-500">{feature}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add-ons */}
      <div className="bg-gray-50 py-16 border-t border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Additional Services</h2>
            <p className="text-base text-gray-600">Optional add-ons available for all plans</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {addons.map((addon, idx) => (
              <div key={idx} className="bg-white border border-gray-300 p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-semibold text-gray-900">{addon.name}</h3>
                  <span className="text-gray-900 font-semibold">{addon.price}</span>
                </div>
                <p className="text-gray-600 text-sm">{addon.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="bg-white border border-gray-300 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">What is included in the setup fee?</h3>
            <p className="text-gray-600">Initial system configuration, data migration, staff training, and technical support during onboarding.</p>
          </div>
          <div className="bg-white border border-gray-300 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Can we change plans later?</h3>
            <p className="text-gray-600">Yes. Plan changes take effect at the start of the next billing cycle.</p>
          </div>
          <div className="bg-white border border-gray-300 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Is there a trial period?</h3>
            <p className="text-gray-600">We offer a 30-day evaluation period with full access to all features.</p>
          </div>
          <div className="bg-white border border-gray-300 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">What payment methods are accepted?</h3>
            <p className="text-gray-600">Bank transfers, card payments, and installment plans for annual subscriptions.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary-700 py-16 border-t border-gray-300">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-300 mb-8 text-base">
            Contact our sales team to discuss your school's requirements
          </p>
          <button className="bg-white text-gray-900 px-8 py-3 text-base font-semibold hover:bg-gray-100">
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;


