import React from 'react';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Workers', value: '1,670', icon: '👥', color: 'bg-blue-100', trend: '+12%' },
    { label: 'Active Policies', value: '1,488', icon: '🛡️', color: 'bg-green-100', trend: '+8%' },
    { label: 'Total Payouts', value: '₹12.45L', icon: '💳', color: 'bg-purple-100', trend: '+15%' },
    { label: 'Fraud Cases', value: '3', icon: '🚨', color: 'bg-red-100', trend: '-2%' },
  ];

  const recentDisruptions = [
    { id: 1, zone: 'South Delhi', event: 'Heavy Rainfall', workers: 289, payouts: '₹156,300', time: '2 hours ago' },
    { id: 2, zone: 'West Delhi', event: 'Traffic Congestion', workers: 145, payouts: '₹87,450', time: '5 hours ago' },
    { id: 3, zone: 'North Delhi', event: 'High Pollution', workers: 98, payouts: '₹45,200', time: '12 hours ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-blue-100">Monitor system activity, disruptions, and payouts in real-time</p>
      </div>

      {/* Stats Grid */}
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Claims Overview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Claims Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Total Claims</span>
              <span className="font-bold text-gray-900">347</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Approved & Paid</span>
              <span className="font-bold text-green-600">341</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Under Review</span>
              <span className="font-bold text-yellow-600">4</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Rejected</span>
              <span className="font-bold text-red-600">2</span>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">System Health</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 font-semibold">API Status</span>
                <span className="text-green-600 font-semibold">Operational</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 font-semibold">Database</span>
                <span className="text-green-600 font-semibold">Healthy</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '98%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 font-semibold">Server Load</span>
                <span className="text-yellow-600 font-semibold">Moderate</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Disruptions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Disruptions</h3>
        <div className="space-y-3">
          {recentDisruptions.map((disruption) => (
            <div key={disruption.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{disruption.event}</h4>
                  <p className="text-sm text-gray-600">{disruption.zone}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{disruption.workers} workers</p>
                  <p className="text-sm text-green-600">{disruption.payouts}</p>
                  <p className="text-xs text-gray-500">{disruption.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="bg-blue-50 border border-blue-200 rounded-lg p-6 hover:bg-blue-100 transition">
          <h3 className="font-bold text-blue-900 mb-2">📊 View Analytics</h3>
          <p className="text-blue-800 text-sm">Detailed reports and insights</p>
        </button>
        <button className="bg-green-50 border border-green-200 rounded-lg p-6 hover:bg-green-100 transition">
          <h3 className="font-bold text-green-900 mb-2">⚠️ Active Alerts</h3>
          <p className="text-green-800 text-sm">Monitor ongoing disruptions</p>
        </button>
        <button className="bg-purple-50 border border-purple-200 rounded-lg p-6 hover:bg-purple-100 transition">
          <h3 className="font-bold text-purple-900 mb-2">👥 Worker Management</h3>
          <p className="text-purple-800 text-sm">Manage and support workers</p>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;