import React from 'react';
import { useWorker } from '../../hooks/useWorker';

const Dashboard = () => {
  const { worker, loading } = useWorker();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Protected', value: `₹${worker?.totalEarningsProtected}`, icon: '🛡️', color: 'bg-blue-100', trend: '+12%' },
    { label: 'Expected Weekly', value: `₹${worker?.expectedEarnings}`, icon: '💰', color: 'bg-green-100', trend: '+8%' },
    { label: 'Trust Score', value: `${worker?.trustScore}%`, icon: '⭐', color: 'bg-yellow-100', trend: '+5%' },
    { label: 'Claims Processed', value: worker?.claimsProcessed, icon: '✅', color: 'bg-purple-100', trend: '+2' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {worker?.name}! 👋</h1>
        <p className="text-blue-100">Your income is protected in {worker?.zone}</p>
      </div>

      {/* Policy Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Active Policy Status</h2>
            <p className="text-gray-600 mt-2">
              {worker?.activePolicy ? (
                <>✅ Policy Active until {worker?.policyEndDate}</>
              ) : (
                <>No active policy</>
              )}
            </p>
          </div>
          <div className="bg-green-100 p-4 rounded-full">
            <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`inline-block ${stat.color} p-3 rounded-lg`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <span className="text-green-600 font-semibold text-sm">{stat.trend}</span>
            </div>
            <p className="text-gray-600 text-sm font-semibold">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Claims</h3>
        <div className="space-y-4">
          {[
            { date: 'Mar 15, 2026', event: 'Heavy rainfall detected', amount: '₹450', status: 'Paid' },
            { date: 'Mar 10, 2026', event: 'Traffic congestion', amount: '₹320', status: 'Paid' },
            { date: 'Mar 05, 2026', event: 'High pollution alert', amount: '₹280', status: 'Paid' },
          ].map((claim, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <div>
                <p className="font-semibold text-gray-900">{claim.event}</p>
                <p className="text-sm text-gray-600">{claim.date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{claim.amount}</p>
                <p className="text-sm text-green-600">{claim.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Protection Meter */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Weekly Protection Meter</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Income Protected</span>
              <span className="font-semibold">₹{worker?.totalEarningsProtected} / ₹{worker?.expectedEarnings}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all"
                style={{ width: `${(worker?.totalEarningsProtected / worker?.expectedEarnings) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-3">📋 View Detailed Claims</h3>
          <p className="text-blue-800 text-sm mb-4">Check all your claims and payment history</p>
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
            View Claims
          </button>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-bold text-green-900 mb-3">🔄 Renew Coverage</h3>
          <p className="text-green-800 text-sm mb-4">Extend your protection for another week</p>
          <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold">
            Renew Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;