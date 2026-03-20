import React, { useState } from 'react';

const ClaimHistory = () => {
  const [filterStatus, setFilterStatus] = useState('all');

  const claims = [
    {
      id: 'CLM001',
      date: 'Mar 15, 2026',
      event: 'Heavy Rainfall',
      zone: 'South Delhi',
      amount: '₹450',
      status: 'Paid',
      hoursAffected: 3,
      expectedEarnings: 600,
    },
    {
      id: 'CLM002',
      date: 'Mar 10, 2026',
      event: 'High Traffic Congestion',
      zone: 'South Delhi',
      amount: '₹320',
      status: 'Paid',
      hoursAffected: 2.5,
      expectedEarnings: 425,
    },
    {
      id: 'CLM003',
      date: 'Mar 05, 2026',
      event: 'Air Pollution Alert',
      zone: 'South Delhi',
      amount: '₹280',
      status: 'Pending',
      hoursAffected: 2,
      expectedEarnings: 370,
    },
    {
      id: 'CLM004',
      date: 'Feb 28, 2026',
      event: 'Heavy Rainfall',
      zone: 'South Delhi',
      amount: '₹500',
      status: 'Paid',
      hoursAffected: 3.5,
      expectedEarnings: 580,
    },
  ];

  const filteredClaims = filterStatus === 'all' 
    ? claims 
    : claims.filter(claim => claim.status.toLowerCase() === filterStatus);

  const totalClaimed = claims.reduce((sum, claim) => {
    const amount = parseInt(claim.amount.replace('₹', ''));
    return sum + amount;
  }, 0);

  const totalHours = claims.reduce((sum, claim) => sum + claim.hoursAffected, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Claim History</h1>
          <p className="text-gray-600 mt-1">View all your processed claims and payouts</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 font-semibold">Total Claimed</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">₹{totalClaimed}</p>
          <p className="text-sm text-gray-500 mt-1">{claims.length} claims</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 font-semibold">Hours Protected</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{totalHours}h</p>
          <p className="text-sm text-gray-500 mt-1">Average {(totalHours / claims.length).toFixed(1)}h per claim</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 font-semibold">Success Rate</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">100%</p>
          <p className="text-sm text-gray-500 mt-1">All eligible claims paid</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Filter Claims</h2>
        <div className="flex flex-wrap gap-3">
          {['all', 'paid', 'pending'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Claim ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Event</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Hours</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{claim.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{claim.event}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{claim.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{claim.hoursAffected}h</td>
                  <td className="px-6 py-4 text-sm font-semibold text-blue-600">{claim.amount}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        claim.status === 'Paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {claim.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Claim Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Latest Claim Details</h2>
        {filteredClaims.length > 0 && (
          <div className="space-y-4">
            {filteredClaims.slice(0, 1).map((claim) => (
              <div key={claim.id} className="border border-gray-200 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600 font-semibold">Event</p>
                    <p className="text-lg text-gray-900 mt-1">{claim.event}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Hours Affected</p>
                    <p className="text-lg text-gray-900 mt-1">{claim.hoursAffected} hours</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Expected Earnings Lost</p>
                    <p className="text-lg text-gray-900 mt-1">₹{claim.expectedEarnings}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Payout Amount</p>
                    <p className="text-lg text-green-600 font-bold mt-1">{claim.amount}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimHistory;