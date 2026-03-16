import React, { useState } from 'react';

const FraudAlerts = () => {
  const [filterLevel, setFilterLevel] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState(null);

  const fraudAlerts = [
    {
      id: 'FRAUD001',
      workerId: 'W12456',
      workerName: 'Amit Singh',
      riskLevel: 'High',
      reason: 'Multiple claims in non-disruption areas',
      claimCount: 5,
      suspiciousPattern: 'Claims filed immediately after policy activation',
      timestamp: '2026-03-15 19:30',
      trustScore: 34,
      status: 'Under Review',
    },
    {
      id: 'FRAUD002',
      workerId: 'W15789',
      workerName: 'Priya Sharma',
      riskLevel: 'Medium',
      reason: 'GPS location inconsistency',
      claimCount: 2,
      suspiciousPattern: 'Claims from outside designated zone',
      timestamp: '2026-03-15 15:20',
      trustScore: 58,
      status: 'Flagged',
    },
    {
      id: 'FRAUD003',
      workerId: 'W98234',
      workerName: 'Raj Patel',
      riskLevel: 'Low',
      reason: 'Duplicate claim attempt',
      claimCount: 1,
      suspiciousPattern: 'Attempted to file same claim twice',
      timestamp: '2026-03-14 22:10',
      trustScore: 82,
      status: 'Resolved',
    },
  ];

  const filteredAlerts = filterLevel === 'all' 
    ? fraudAlerts 
    : fraudAlerts.filter(alert => alert.riskLevel === filterLevel);

  const riskColor = {
    'High': 'bg-red-100 text-red-700 border-red-300',
    'Medium': 'bg-yellow-100 text-yellow-700 border-yellow-300',
    'Low': 'bg-green-100 text-green-700 border-green-300',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fraud Detection</h1>
          <p className="text-gray-600 mt-1">Monitor and manage fraud risk alerts</p>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-700 font-semibold">High Risk Alerts</p>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {fraudAlerts.filter(a => a.riskLevel === 'High').length}
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-700 font-semibold">Flagged Cases</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {fraudAlerts.filter(a => a.status === 'Flagged').length}
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-green-700 font-semibold">Resolved Cases</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {fraudAlerts.filter(a => a.status === 'Resolved').length}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter by Risk Level</h2>
        <div className="flex gap-3">
          {['all', 'High', 'Medium', 'Low'].map((level) => (
            <button
              key={level}
              onClick={() => setFilterLevel(level)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filterLevel === level
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {level === 'all' ? 'All Alerts' : level}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            onClick={() => setSelectedAlert(alert.id)}
            className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition border-2 ${
              selectedAlert === alert.id ? 'border-blue-600 bg-blue-50' : 'border-transparent hover:shadow-lg'
            } ${riskColor[alert.riskLevel]}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{alert.workerName}</h3>
                <p className="text-sm text-gray-600">ID: {alert.workerId}</p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${riskColor[alert.riskLevel]}`}>
                  {alert.riskLevel} Risk
                </span>
                <p className="text-sm text-gray-600 mt-1">Trust Score: {alert.trustScore}%</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 text-sm">
              <div>
                <p className="text-gray-600 font-semibold">Alert Reason</p>
                <p className="text-gray-900 mt-1">{alert.reason}</p>
              </div>
              <div>
                <p className="text-gray-600 font-semibold">Pattern</p>
                <p className="text-gray-900 mt-1">{alert.suspiciousPattern}</p>
              </div>
              <div>
                <p className="text-gray-600 font-semibold">Status</p>
                <p className="text-gray-900 mt-1">{alert.status}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed View */}
      {selectedAlert && (
        <div className="bg-white rounded-lg shadow-md p-8">
          {filteredAlerts.filter(a => a.id === selectedAlert).map((alert) => (
            <div key={alert.id}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Alert Details: {alert.workerName}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-600 font-semibold">Worker ID</p>
                  <p className="text-lg text-gray-900 mt-2">{alert.workerId}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-600 font-semibold">Trust Score</p>
                  <p className="text-lg text-gray-900 mt-2">{alert.trustScore}%</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-600 font-semibold">Claims Filed</p>
                  <p className="text-lg text-gray-900 mt-2">{alert.claimCount}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-600 font-semibold">Detected</p>
                  <p className="text-lg text-gray-900 mt-2">{alert.timestamp}</p>
                </div>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                <p className="text-red-900 font-semibold">⚠️ Suspicious Pattern</p>
                <p className="text-red-800 mt-2">{alert.suspiciousPattern}</p>
              </div>

              <div className="flex gap-3 flex-wrap">
                <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                  Approve & Whitelist
                </button>
                <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                  Reject & Ban
                </button>
                <button className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                  Review Later
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FraudAlerts;