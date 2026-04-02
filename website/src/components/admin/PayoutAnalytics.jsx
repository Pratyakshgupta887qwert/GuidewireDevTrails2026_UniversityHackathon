import React, { useState } from 'react';

const PayoutAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const weeklyPayouts = [
    { day: 'Monday', amount: 24500, claims: 12 },
    { day: 'Tuesday', amount: 18900, claims: 9 },
    { day: 'Wednesday', amount: 32100, claims: 15 },
    { day: 'Thursday', amount: 21350, claims: 10 },
    { day: 'Friday', amount: 28700, claims: 13 },
    { day: 'Saturday', amount: 35200, claims: 16 },
    { day: 'Sunday', amount: 15600, claims: 7 },
  ];

  const monthlyPayouts = [
    { week: 'Week 1', amount: 156300, claims: 74 },
    { week: 'Week 2', amount: 187500, claims: 89 },
    { week: 'Week 3', amount: 142800, claims: 68 },
    { week: 'Week 4', amount: 198200, claims: 94 },
  ];

  const payoutsByZone = [
    { zone: 'South Delhi', amount: 325400, workers: 289, avgPayout: 1125 },
    { zone: 'North Delhi', amount: 298700, workers: 234, avgPayout: 1277 },
    { zone: 'West Delhi', amount: 187450, workers: 145, avgPayout: 1293 },
    { zone: 'East Delhi', amount: 156300, workers: 98, avgPayout: 1595 },
  ];

  const displayData = selectedPeriod === 'week' ? weeklyPayouts : monthlyPayouts;
  const totalPayouts = displayData.reduce((sum, item) => sum + item.amount, 0);
  const totalClaims = displayData.reduce((sum, item) => sum + item.claims, 0);
  const maxAmount = Math.max(...displayData.map(item => item.amount));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payout Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive payout and claims analysis</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 font-semibold">Total Payouts</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">₹{totalPayouts.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">This {selectedPeriod}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 font-semibold">Total Claims</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{totalClaims}</p>
          <p className="text-sm text-gray-500 mt-1">Approved & Paid</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 font-semibold">Average Payout</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">₹{Math.round(totalPayouts / totalClaims)}</p>
          <p className="text-sm text-gray-500 mt-1">Per claim</p>
        </div>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Time Period</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              selectedPeriod === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              selectedPeriod === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Chart View */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Payout Trend</h2>
        <div className="space-y-6">
          {displayData.map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-gray-700">{item.day || item.week}</p>
                <div className="flex gap-4">
                  <span className="text-sm text-gray-600">₹{item.amount.toLocaleString()}</span>
                  <span className="text-sm text-blue-600 font-semibold">{item.claims} claims</span>
                </div>
              </div>
              <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-8 flex items-center justify-center text-xs text-white font-semibold"
                  style={{ width: `${(item.amount / maxAmount) * 100}%` }}
                >
                  {item.amount > 50000 && '₹' + (item.amount / 1000).toFixed(0) + 'k'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payouts by Zone */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Payouts by Zone</h2>
        <div className="space-y-4">
          {payoutsByZone.map((zone, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-gray-900">{zone.zone}</h3>
                  <p className="text-sm text-gray-600">{zone.workers} workers paid</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₹{zone.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Avg: ₹{zone.avgPayout}/claim</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
                  style={{ width: `${(zone.amount / 325400) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Payout Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-gray-600 font-semibold">Average Claim Value</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">₹{Math.round(totalPayouts / totalClaims)}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-gray-600 font-semibold">Highest Payout Day</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">₹{Math.max(...displayData.map(item => item.amount)).toLocaleString()}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-gray-600 font-semibold">Lowest Payout Day</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">₹{Math.min(...displayData.map(item => item.amount)).toLocaleString()}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-gray-600 font-semibold">Average Claims Per Day</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{Math.round(totalClaims / displayData.length)}</p>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Detailed Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  {selectedPeriod === 'week' ? 'Day' : 'Week'}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total Payouts</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Claims Count</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Avg Per Claim</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayData.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {item.day || item.week}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    ₹{item.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{item.claims}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                    ₹{Math.round(item.amount / item.claims)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export & Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
            📥 Export Report
          </button>
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold">
            📧 Email Report
          </button>
          <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold">
            🔄 Refresh Data
          </button>
          <button className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold">
            ⚙️ Configure Alerts
          </button>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Key Insights</h3>
        <ul className="space-y-2 text-blue-800">
          <li>
            ✓ <strong>Peak Payout Day:</strong> {displayData.reduce((max, item) => item.amount > max.amount ? item : max).day || displayData.reduce((max, item) => item.amount > max.amount ? item : max).week} with ₹{Math.max(...displayData.map(item => item.amount)).toLocaleString()}
          </li>
          <li>
            ✓ <strong>Average Claim Value:</strong> ₹{Math.round(totalPayouts / totalClaims)}
          </li>
          <li>
            ✓ <strong>Busiest Zone:</strong> South Delhi with {payoutsByZone[0].workers} workers protected
          </li>
          <li>
            ✓ <strong>Total Coverage:</strong> {displayData.reduce((sum, item) => sum + item.claims, 0)} workers compensated this {selectedPeriod}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PayoutAnalytics;