import React, { useState } from 'react';

const DisruptionMonitoring = () => {
  const [filterZone, setFilterZone] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const disruptions = [
    {
      id: 'DIS001',
      zone: 'South Delhi',
      event: 'Heavy Rainfall',
      severity: 'High',
      workers: 289,
      payouts: '₹156,300',
      startTime: '2026-03-15 14:30',
      endTime: '2026-03-15 17:45',
      status: 'Resolved',
      dataSource: 'OpenWeatherMap API',
    },
    {
      id: 'DIS002',
      zone: 'West Delhi',
      event: 'Traffic Congestion',
      severity: 'Medium',
      workers: 145,
      payouts: '₹87,450',
      startTime: '2026-03-15 18:00',
      endTime: 'Ongoing',
      status: 'Active',
      dataSource: 'Google Maps Traffic API',
    },
    {
      id: 'DIS003',
      zone: 'North Delhi',
      event: 'High Pollution Alert',
      severity: 'Medium',
      workers: 98,
      payouts: '₹45,200',
      startTime: '2026-03-15 08:00',
      endTime: '2026-03-15 12:00',
      status: 'Resolved',
      dataSource: 'AQICN API',
    },
    {
      id: 'DIS004',
      zone: 'East Delhi',
      event: 'Severe Weather Warning',
      severity: 'High',
      workers: 156,
      payouts: '₹89,500',
      startTime: '2026-03-14 16:00',
      endTime: '2026-03-14 21:30',
      status: 'Resolved',
      dataSource: 'Weather API',
    },
  ];

  const zones = ['all', 'South Delhi', 'North Delhi', 'East Delhi', 'West Delhi'];

  const filteredDisruptions = disruptions.filter((d) => {
    const zoneMatch = filterZone === 'all' || d.zone === filterZone;
    const statusMatch = filterStatus === 'all' || d.status === filterStatus;
    return zoneMatch && statusMatch;
  });

  const severityColor = {
    'High': 'text-red-600 bg-red-50',
    'Medium': 'text-yellow-600 bg-yellow-50',
    'Low': 'text-green-600 bg-green-50',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Disruption Monitoring</h1>
          <p className="text-gray-600 mt-1">Real-time tracking of external disruptions</p>
        </div>
      </div>

      {/* Alerts Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-700 font-semibold">Active Disruptions</p>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {disruptions.filter(d => d.status === 'Active').length}
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-700 font-semibold">Workers Affected</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {disruptions.reduce((sum, d) => sum + d.workers, 0)}
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-green-700 font-semibold">Total Payouts</p>
          <p className="text-3xl font-bold text-green-600 mt-2">₹4.78L</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Zone</label>
            <select
              value={filterZone}
              onChange={(e) => setFilterZone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {zones.map(zone => (
                <option key={zone} value={zone}>
                  {zone === 'all' ? 'All Zones' : zone}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Disruptions Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Zone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Event</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Severity</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Workers</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDisruptions.map((disruption) => (
                <tr key={disruption.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{disruption.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{disruption.zone}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{disruption.event}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${severityColor[disruption.severity]}`}>
                      {disruption.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{disruption.workers}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        disruption.status === 'Active'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {disruption.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed View */}
      {filteredDisruptions.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Latest Disruption Details</h2>
          {filteredDisruptions.slice(0, 1).map((d) => (
            <div key={d.id} className="border border-gray-200 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600 font-semibold">Event</p>
                  <p className="text-lg text-gray-900 mt-1">{d.event}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">Zone Affected</p>
                  <p className="text-lg text-gray-900 mt-1">{d.zone}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">Start Time</p>
                  <p className="text-lg text-gray-900 mt-1">{d.startTime}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">End Time</p>
                  <p className="text-lg text-gray-900 mt-1">{d.endTime}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">Data Source</p>
                  <p className="text-lg text-gray-900 mt-1">{d.dataSource}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">Total Payouts</p>
                  <p className="text-lg text-green-600 font-bold mt-1">{d.payouts}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisruptionMonitoring;