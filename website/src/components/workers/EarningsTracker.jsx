import React, { useState } from 'react';

const EarningsTracker = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const weeklyData = [
    { day: 'Mon', earnings: 850, protected: 200, potential: 900 },
    { day: 'Tue', earnings: 920, protected: 150, potential: 950 },
    { day: 'Wed', earnings: 750, protected: 300, potential: 850 },
    { day: 'Thu', earnings: 880, protected: 180, potential: 920 },
    { day: 'Fri', earnings: 950, protected: 100, potential: 1000 },
    { day: 'Sat', earnings: 1050, protected: 250, potential: 1100 },
    { day: 'Sun', earnings: 600, protected: 400, potential: 700 },
  ];

  const monthlyData = [
    { week: 'Week 1', earnings: 6000, protected: 1200, potential: 6500 },
    { week: 'Week 2', earnings: 6500, protected: 900, potential: 7000 },
    { week: 'Week 3', earnings: 5800, protected: 1500, potential: 6300 },
    { week: 'Week 4', earnings: 7200, protected: 800, potential: 7800 },
  ];

  const displayData = selectedPeriod === 'week' ? weeklyData : monthlyData;
  const totalEarnings = displayData.reduce((sum, item) => sum + item.earnings, 0);
  const totalProtected = displayData.reduce((sum, item) => sum + item.protected, 0);
  const totalPotential = displayData.reduce((sum, item) => sum + item.potential, 0);

  const maxEarnings = Math.max(...displayData.map(item => item.potential));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Earnings Tracker</h1>
          <p className="text-gray-600 mt-1">Monitor your actual earnings vs. protected amount</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 font-semibold">Actual Earnings</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">₹{totalEarnings}</p>
          <p className="text-sm text-gray-500 mt-1">This {selectedPeriod}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 font-semibold">Amount Protected</p>
          <p className="text-3xl font-bold text-green-600 mt-2">₹{totalProtected}</p>
          <p className="text-sm text-gray-500 mt-1">From disruptions</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 font-semibold">Potential Earnings</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">₹{totalPotential}</p>
          <p className="text-sm text-gray-500 mt-1">Without disruptions</p>
        </div>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Time Period</h2>
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
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Earnings Comparison</h2>
        <div className="space-y-6">
          {displayData.map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-gray-700">{item.day || item.week}</p>
                <div className="flex gap-4">
                  <span className="text-sm text-gray-600">Actual: ₹{item.earnings}</span>
                  <span className="text-sm text-green-600">Protected: ₹{item.protected}</span>
                </div>
              </div>
              <div className="h-8 bg-gray-100 rounded-lg overflow-hidden flex">
                <div
                  className="bg-blue-500 flex items-center justify-center text-xs text-white font-semibold"
                  style={{ width: `${(item.earnings / maxEarnings) * 100}%` }}
                >
                  {item.earnings > 200 && '₹' + item.earnings}
                </div>
                <div
                  className="bg-green-500 flex items-center justify-center text-xs text-white font-semibold"
                  style={{ width: `${(item.protected / maxEarnings) * 100}%` }}
                >
                  {item.protected > 150 && '₹' + item.protected}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-gray-600 font-semibold">Average Daily Earnings</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              ₹{Math.round(totalEarnings / displayData.length)}
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-gray-600 font-semibold">Protection Rate</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {Math.round((totalProtected / totalEarnings) * 100)}%
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-gray-600 font-semibold">Best Day</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              ₹{Math.max(...displayData.map(item => item.earnings))}
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-gray-600 font-semibold">Lowest Day</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              ₹{Math.min(...displayData.map(item => item.earnings))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsTracker;