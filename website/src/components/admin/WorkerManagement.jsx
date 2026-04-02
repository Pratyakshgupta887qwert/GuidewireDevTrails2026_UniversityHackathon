import React, { useState } from 'react';

const WorkerManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedWorker, setSelectedWorker] = useState(null);

  const workers = [
    {
      id: 'W12345',
      name: 'Rajesh Kumar',
      zone: 'South Delhi',
      phone: '+91 98765 43210',
      email: 'rajesh@example.com',
      status: 'Active',
      joinDate: '2026-01-15',
      trustScore: 92,
      claims: 5,
      payouts: '₹2,450',
      activePolicy: true,
      completedDeliveries: 1250,
    },
    {
      id: 'W54321',
      name: 'Priya Sharma',
      zone: 'North Delhi',
      phone: '+91 87654 32109',
      email: 'priya@example.com',
      status: 'Active',
      joinDate: '2026-02-20',
      trustScore: 85,
      claims: 3,
      payouts: '₹1,280',
      activePolicy: true,
      completedDeliveries: 890,
    },
    {
      id: 'W11111',
      name: 'Amit Singh',
      zone: 'East Delhi',
      phone: '+91 76543 21098',
      email: 'amit@example.com',
      status: 'Flagged',
      joinDate: '2026-02-01',
      trustScore: 34,
      claims: 8,
      payouts: '₹3,200',
      activePolicy: false,
      completedDeliveries: 456,
    },
    {
      id: 'W22222',
      name: 'Deepak Patel',
      zone: 'West Delhi',
      phone: '+91 65432 10987',
      email: 'deepak@example.com',
      status: 'Suspended',
      joinDate: '2025-12-10',
      trustScore: 18,
      claims: 2,
      payouts: '₹950',
      activePolicy: false,
      completedDeliveries: 234,
    },
  ];

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          worker.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || worker.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const selectedWorkerData = selectedWorker ? workers.find(w => w.id === selectedWorker) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Worker Management</h1>
          <p className="text-gray-600 mt-1">View and manage all registered workers</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 font-semibold">Total Workers</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{workers.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 font-semibold">Active Workers</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{workers.filter(w => w.status === 'Active').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 font-semibold">Flagged</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{workers.filter(w => w.status === 'Flagged').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 font-semibold">Suspended</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{workers.filter(w => w.status === 'Suspended').length}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Search Worker</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or ID..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Flagged">Flagged</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Workers Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Worker ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Zone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Trust Score</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredWorkers.map((worker) => (
                <tr key={worker.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{worker.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{worker.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{worker.zone}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2 max-w-[60px]">
                        <div
                          className={`h-2 rounded-full ${
                            worker.trustScore > 80
                              ? 'bg-green-600'
                              : worker.trustScore > 50
                              ? 'bg-yellow-600'
                              : 'bg-red-600'
                          }`}
                          style={{ width: `${worker.trustScore}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-gray-700">{worker.trustScore}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        worker.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : worker.status === 'Flagged'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {worker.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => setSelectedWorker(worker.id)}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed View */}
      {selectedWorkerData && (
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedWorkerData.name}</h2>
              <p className="text-gray-600">ID: {selectedWorkerData.id}</p>
            </div>
            <button
              onClick={() => setSelectedWorker(null)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-gray-600 font-semibold">Zone</p>
              <p className="text-lg text-gray-900 mt-2">{selectedWorkerData.zone}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-gray-600 font-semibold">Phone</p>
              <p className="text-lg text-gray-900 mt-2">{selectedWorkerData.phone}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-gray-600 font-semibold">Email</p>
              <p className="text-lg text-gray-900 mt-2">{selectedWorkerData.email}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-gray-600 font-semibold">Joined</p>
              <p className="text-lg text-gray-900 mt-2">{selectedWorkerData.joinDate}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-gray-600 font-semibold">Trust Score</p>
              <p className="text-lg text-gray-900 mt-2">{selectedWorkerData.trustScore}%</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-gray-600 font-semibold">Status</p>
              <p className="text-lg text-gray-900 mt-2">{selectedWorkerData.status}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-gray-600 font-semibold">Claims Filed</p>
              <p className="text-lg text-gray-900 mt-2">{selectedWorkerData.claims}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-gray-600 font-semibold">Total Payouts</p>
              <p className="text-lg text-green-600 font-bold mt-2">{selectedWorkerData.payouts}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-gray-600 font-semibold">Active Policy</p>
              <p className="text-lg text-gray-900 mt-2">{selectedWorkerData.activePolicy ? 'Yes' : 'No'}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-gray-600 font-semibold">Deliveries</p>
              <p className="text-lg text-gray-900 mt-2">{selectedWorkerData.completedDeliveries}</p>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              Approve
            </button>
            <button className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition">
              Flag for Review
            </button>
            <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              Suspend
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerManagement;