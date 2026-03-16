import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CoverageActivation = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isActivating, setIsActivating] = useState(false);
  const [activationSuccess, setActivationSuccess] = useState(false);
  const navigate = useNavigate();

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      risk: 'Low Risk Zones',
      premium: 15,
      coverage: 5000,
      color: 'from-green-600 to-emerald-600',
      features: [
        '✓ Rainfall protection',
        '✓ Basic 24-hour support',
        '✓ 24-hour payout processing',
        '✓ Email notifications',
      ],
      badge: null,
    },
    {
      id: 'standard',
      name: 'Standard Plan',
      risk: 'Medium Risk Zones',
      premium: 25,
      coverage: 10000,
      color: 'from-blue-600 to-indigo-600',
      features: [
        '✓ Rainfall + Pollution protection',
        '✓ Priority 24/7 support',
        '✓ Instant payouts (within 1 hour)',
        '✓ Risk heatmap access',
        '✓ SMS + Email alerts',
      ],
      badge: 'Most Popular',
    },
    {
      id: 'extended',
      name: 'Extended Plan',
      risk: 'High Risk Zones',
      premium: 35,
      coverage: 15000,
      color: 'from-red-600 to-orange-600',
      features: [
        '✓ All disruption types covered',
        '✓ Dedicated account manager',
        '✓ Instant payouts (within 15 mins)',
        '✓ Advanced heatmap + analytics',
        '✓ Emergency disruption trigger',
        '✓ WhatsApp + SMS + Email',
        '✓ Monthly bonus rewards',
      ],
      badge: 'Premium',
    },
  ];

  const handleActivate = async () => {
    if (!selectedPlan) {
      alert('Please select a plan first');
      return;
    }

    setIsActivating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setActivationSuccess(true);
      
      setTimeout(() => {
        navigate('/worker-dashboard');
      }, 2000);
    } catch (error) {
      alert('Error activating plan. Please try again.');
      setIsActivating(false);
    }
  };

  if (activationSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Coverage Activated!</h2>
          <p className="text-gray-600 mb-4">Your {plans.find(p => p.id === selectedPlan)?.name} has been activated successfully.</p>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-2">Select Your Coverage</h1>
        <p className="text-blue-100">Choose a plan that fits your working pattern and risk level</p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={`relative rounded-lg overflow-hidden shadow-md cursor-pointer transition transform hover:scale-105 ${
              selectedPlan === plan.id
                ? 'ring-4 ring-green-500 bg-white'
                : 'bg-white hover:shadow-xl'
            }`}
          >
            {/* Badge */}
            {plan.badge && (
              <div className={`bg-gradient-to-r ${plan.color} text-white px-4 py-2 text-center font-bold text-sm`}>
                ⭐ {plan.badge}
              </div>
            )}

            <div className="p-6">
              {/* Plan Name */}
              <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
              <p className="text-gray-600 text-sm mb-6">{plan.risk}</p>

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <span className="text-4xl font-bold text-gray-900">₹{plan.premium}</span>
                <span className="text-gray-600 text-sm">/week</span>
              </div>

              {/* Coverage Amount */}
              <div className={`mb-6 p-4 bg-gradient-to-r ${plan.color} bg-opacity-10 rounded-lg`}>
                <p className="text-gray-600 text-sm font-semibold">Coverage Limit</p>
                <p className={`text-2xl font-bold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>₹{plan.coverage.toLocaleString()}</p>
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-700 text-sm">
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Selection Radio */}
              <div className={`flex items-center justify-between p-3 rounded-lg ${
                selectedPlan === plan.id
                  ? `bg-gradient-to-r ${plan.color} bg-opacity-10 border-2 border-blue-600`
                  : 'bg-gray-100'
              }`}>
                <span className="font-semibold text-gray-700">Select Plan</span>
                <input
                  type="radio"
                  checked={selectedPlan === plan.id}
                  onChange={() => setSelectedPlan(plan.id)}
                  className="w-6 h-6 cursor-pointer"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: 1, icon: '📋', title: 'Select Plan', desc: 'Choose coverage for your zone' },
            { step: 2, icon: '💳', title: 'Activate', desc: 'Confirm payment weekly' },
            { step: 3, icon: '📡', title: 'Monitor', desc: 'System watches 24/7' },
            { step: 4, icon: '💰', title: 'Get Paid', desc: 'Auto-payout instantly' },
          ].map((item) => (
            <div key={item.step} className="text-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition">
              <div className="text-4xl mb-3">{item.icon}</div>
              <div className="inline-block w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mb-3">
                {item.step}
              </div>
              <h3 className="font-bold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Comparison */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Plan Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Feature</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-900">Basic</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-900">Standard</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-900">Extended</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { feature: 'Weekly Premium', basic: '₹15', standard: '₹25', extended: '₹35' },
                { feature: 'Coverage Limit', basic: '₹5,000', standard: '₹10,000', extended: '₹15,000' },
                { feature: 'Rainfall Coverage', basic: '✓', standard: '✓', extended: '✓' },
                { feature: 'Pollution Coverage', basic: '✗', standard: '✓', extended: '✓' },
                { feature: 'Traffic Coverage', basic: '✗', standard: '✗', extended: '✓' },
                { feature: 'Payout Speed', basic: '24 hrs', standard: '1 hour', extended: '15 mins' },
                { feature: 'Support', basic: 'Email', standard: '24/7 Priority', extended: 'Dedicated' },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900">{row.feature}</td>
                  <td className="px-4 py-3 text-center text-gray-700">{row.basic}</td>
                  <td className="px-4 py-3 text-center text-gray-700">{row.standard}</td>
                  <td className="px-4 py-3 text-center text-gray-700">{row.extended}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Button */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Ready to get protected?</h3>
            <p className="text-gray-600 text-sm mt-1">
              {selectedPlan 
                ? `${plans.find(p => p.id === selectedPlan).name} selected`
                : 'Choose a plan to continue'}
            </p>
          </div>
          <button
            onClick={handleActivate}
            disabled={!selectedPlan || isActivating}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
          >
            {isActivating ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Activating...
              </>
            ) : (
              'Activate Coverage'
            )}
          </button>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: 'How quickly do I get paid after a disruption?',
              a: 'Payouts are processed instantly (15 mins - 24 hours) depending on your plan. Extended plan members get paid within 15 minutes.'
            },
            {
              q: 'Can I change my plan?',
              a: 'Yes! You can upgrade or downgrade your plan anytime. Changes take effect from the next billing cycle.'
            },
            {
              q: 'What if there\'s no disruption in my zone?',
              a: 'If no disruption occurs, you keep your premium but don\'t earn any claims. The goal is to have zero disruptions!'
            },
            {
              q: 'Is my GPS location verified?',
              a: 'Yes, the system verifies your location is within the affected zone before processing claims for fraud prevention.'
            },
          ].map((item, idx) => (
            <details key={idx} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer group">
              <summary className="font-semibold text-gray-900 flex justify-between items-center">
                <span>{item.q}</span>
                <span className="text-gray-600 group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="text-gray-700 mt-3">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoverageActivation;