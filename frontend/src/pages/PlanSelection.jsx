import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PlanSelection = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('ANNUAL'); // MONTHLY, QUARTERLY, ANNUAL
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: 'ESSENTIAL',
      name: 'Essential',
      description: 'Perfect for small schools getting started',
      monthlyPrice: 15000,
      quarterlyPrice: 40000,
      annualPrice: 150000,
      features: [
        'Up to 500 students',
        'Basic student management',
        'Result processing',
        'Parent portal access',
        'Email support',
        '5GB storage',
      ],
      popular: false,
    },
    {
      id: 'PROFESSIONAL',
      name: 'Professional',
      description: 'Most popular for growing schools',
      monthlyPrice: 30000,
      quarterlyPrice: 80000,
      annualPrice: 300000,
      features: [
        'Up to 1,500 students',
        'Advanced student management',
        'Result processing & analytics',
        'Parent & teacher portals',
        'CBT examination system',
        'Priority email support',
        '20GB storage',
        'Custom branding',
      ],
      popular: true,
    },
    {
      id: 'ENTERPRISE',
      name: 'Enterprise',
      description: 'For large institutions',
      monthlyPrice: 60000,
      quarterlyPrice: 160000,
      annualPrice: 600000,
      features: [
        'Unlimited students',
        'Full platform access',
        'Advanced analytics & reports',
        'Multi-campus support',
        'CBT examination system',
        'Dedicated account manager',
        'Phone & email support',
        '100GB storage',
        'Custom branding',
        'API access',
      ],
      popular: false,
    },
  ];

  const getPrice = (plan) => {
    if (billingCycle === 'MONTHLY') return plan.monthlyPrice;
    if (billingCycle === 'QUARTERLY') return plan.quarterlyPrice;
    return plan.annualPrice;
  };

  const getSavings = (plan) => {
    const monthly = plan.monthlyPrice;
    if (billingCycle === 'QUARTERLY') {
      const saved = (monthly * 3) - plan.quarterlyPrice;
      return `Save ₦${saved.toLocaleString()}`;
    }
    if (billingCycle === 'ANNUAL') {
      const saved = (monthly * 12) - plan.annualPrice;
      return `Save ₦${saved.toLocaleString()}`;
    }
    return null;
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    setIsProcessing(false);
    setShowPaymentModal(false);
    
    // Show success and redirect
    alert('Payment successful! Your school account is now active.');
    navigate('/admin'); // Redirect to school admin dashboard
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Select the perfect plan for your school. Start with a 30-day free trial.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex border border-gray-300 bg-white">
            <button
              onClick={() => setBillingCycle('MONTHLY')}
              className={`px-6 py-2 text-sm font-medium transition-colors ${
                billingCycle === 'MONTHLY'
                  ? 'bg-[#1e3a8a] text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('QUARTERLY')}
              className={`px-6 py-2 text-sm font-medium transition-colors border-x border-gray-300 ${
                billingCycle === 'QUARTERLY'
                  ? 'bg-[#1e3a8a] text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Quarterly
              <span className="ml-2 text-xs text-green-600">Save 10%</span>
            </button>
            <button
              onClick={() => setBillingCycle('ANNUAL')}
              className={`px-6 py-2 text-sm font-medium transition-colors ${
                billingCycle === 'ANNUAL'
                  ? 'bg-[#1e3a8a] text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Annual
              <span className="ml-2 text-xs text-green-600">Save 17%</span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white border-2 ${
                plan.popular ? 'border-[#1e3a8a]' : 'border-gray-200'
              } p-8 relative`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-[#1e3a8a] text-white px-4 py-1 text-xs font-semibold">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">
                    ₦{getPrice(plan).toLocaleString()}
                  </span>
                  <span className="text-gray-600 ml-2">
                    /{billingCycle.toLowerCase()}
                  </span>
                </div>
                {getSavings(plan) && (
                  <p className="text-sm text-green-600 mt-1">{getSavings(plan)}</p>
                )}
              </div>

              <button
                onClick={() => handleSelectPlan(plan)}
                className={`w-full py-3 text-sm font-medium transition-colors mb-6 ${
                  plan.popular
                    ? 'bg-[#1e3a8a] text-white hover:bg-[#1e293b]'
                    : 'border border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white'
                }`}
              >
                Start Free Trial
              </button>

              <div className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-600 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            Trusted by over 100+ schools across Nigeria
          </p>
          <div className="flex items-center justify-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span className="text-sm">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">30-Day Free Trial</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Complete Payment</h2>
              <p className="text-sm text-gray-600 mt-1">
                {selectedPlan.name} Plan - ₦{getPrice(selectedPlan).toLocaleString()}/{billingCycle.toLowerCase()}
              </p>
            </div>

            <form onSubmit={handlePayment} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  value={paymentDetails.cardNumber}
                  onChange={(e) =>
                    setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })
                  }
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={paymentDetails.expiryDate}
                    onChange={(e) =>
                      setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })
                    }
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={paymentDetails.cvv}
                    onChange={(e) =>
                      setPaymentDetails({ ...paymentDetails, cvv: e.target.value })
                    }
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Billing Address
                </label>
                <textarea
                  value={paymentDetails.billingAddress}
                  onChange={(e) =>
                    setPaymentDetails({ ...paymentDetails, billingAddress: e.target.value })
                  }
                  placeholder="Enter your billing address"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  required
                />
              </div>

              <div className="bg-gray-50 border border-gray-200 p-4 mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">₦{getPrice(selectedPlan).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Tax (0%)</span>
                  <span className="text-gray-900">₦0</span>
                </div>
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">₦{getPrice(selectedPlan).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-3 text-sm text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 text-sm text-white bg-[#1e3a8a] hover:bg-[#1e293b] transition-colors disabled:opacity-50 flex items-center justify-center"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Complete Payment'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PlanSelection;
