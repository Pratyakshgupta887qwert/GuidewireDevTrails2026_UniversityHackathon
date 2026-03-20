import React, { useState } from 'react';
import { useWorker } from '../../hooks/useWorker';

const ProfileSetup = () => {
  const { worker, loading } = useWorker();
  const [isEditing, setIsEditing] = useState(false);
  const [claimNotice, setClaimNotice] = useState('');
  const [selectedIncident, setSelectedIncident] = useState('');
  const externalIncidents = [
    {
      id: 'INC-901',
      label: 'Heavy Rainfall Alert - South Delhi',
      date: '2026-03-16',
      triggerType: 'Heavy Rainfall',
      suggestedLoss: 460,
    },
    {
      id: 'INC-902',
      label: 'AQI Spike - South Delhi',
      date: '2026-03-14',
      triggerType: 'AQI Spike',
      suggestedLoss: 320,
    },
    {
      id: 'INC-903',
      label: 'Traffic Congestion - South Delhi',
      date: '2026-03-12',
      triggerType: 'Traffic Congestion',
      suggestedLoss: 280,
    },
  ];
  const [claimForm, setClaimForm] = useState({
    triggerType: 'Heavy Rainfall',
    eventDate: '',
    hoursLost: '',
    expectedLoss: '',
    reason: '',
  });
  const [claimRequests, setClaimRequests] = useState([
    {
      id: 'CR-2201',
      triggerType: 'Traffic Congestion',
      eventDate: '2026-03-14',
      expectedLoss: 420,
      status: 'Under Review',
    },
    {
      id: 'CR-2199',
      triggerType: 'AQI Spike',
      eventDate: '2026-03-10',
      expectedLoss: 350,
      status: 'Approved',
    },
  ]);
  const [formData, setFormData] = useState({
    name: worker?.name || 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: worker?.phone || '+91 98765 43210',
    zone: worker?.zone || 'South Delhi',
    vehicleType: 'Two Wheeler',
    licenseNumber: 'DL01AB1234',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleClaimChange = (e) => {
    const { name, value } = e.target;
    setClaimForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClaimRequestSubmit = (e) => {
    e.preventDefault();
    setClaimNotice('');

    if (!claimForm.eventDate || !claimForm.hoursLost || !claimForm.expectedLoss || !claimForm.reason.trim()) {
      setClaimNotice('Please fill all claim request fields before submitting.');
      return;
    }

    const newRequest = {
      id: `CR-${Math.floor(1000 + Math.random() * 9000)}`,
      triggerType: claimForm.triggerType,
      eventDate: claimForm.eventDate,
      expectedLoss: Number(claimForm.expectedLoss),
      status: 'Submitted',
    };

    setClaimRequests((prev) => [newRequest, ...prev]);
    setClaimForm({
      triggerType: 'Heavy Rainfall',
      eventDate: '',
      hoursLost: '',
      expectedLoss: '',
      reason: '',
    });
    setClaimNotice('Claim request submitted successfully. Our team will review it shortly.');
  };

  const applyIncident = (incidentId) => {
    const incident = externalIncidents.find((item) => item.id === incidentId);
    if (!incident) {
      return;
    }

    setSelectedIncident(incidentId);
    setClaimForm((prev) => ({
      ...prev,
      triggerType: incident.triggerType,
      eventDate: incident.date,
      expectedLoss: String(incident.suggestedLoss),
      reason: `${incident.label} impacted my deliveries and reduced my earning window.`,
    }));
    setClaimNotice('External disruption selected. Please verify details and submit your compensation request.');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-3xl">👤</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{worker?.name}</h3>
            <p className="text-gray-600">Worker ID: {worker?.id}</p>
            <p className="text-gray-600">Zone: {worker?.zone}</p>
          </div>
        </div>

        {!isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 font-semibold mb-2">Name</label>
                <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{formData.name}</p>
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-2">Email</label>
                <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{formData.email}</p>
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-2">Phone</label>
                <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{formData.phone}</p>
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-2">Zone</label>
                <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{formData.zone}</p>
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-2">Vehicle Type</label>
                <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{formData.vehicleType}</p>
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-2">License Number</label>
                <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{formData.licenseNumber}</p>
              </div>
            </div>
          </div>
        ) : (
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Zone</label>
                <select
                  name="zone"
                  value={formData.zone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option>South Delhi</option>
                  <option>North Delhi</option>
                  <option>East Delhi</option>
                  <option>West Delhi</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Vehicle Type</label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option>Two Wheeler</option>
                  <option>Three Wheeler</option>
                  <option>Four Wheeler</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">License Number</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Save Changes
            </button>
          </form>
        )}
      </div>

      {/* Trust Score Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Trust Score</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 mb-2">Your credibility score with AegisAI: Smart Gig Insurance Platform</p>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-yellow-500">{worker?.trustScore}%</div>
              <div className="text-gray-600">
                <p>Completed Deliveries: {worker?.completedDeliveries}</p>
                <p>Claims Processed: {worker?.claimsProcessed}</p>
              </div>
            </div>
          </div>
          <div className="text-6xl">⭐</div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h3>
        <div className="space-y-3">
          <button className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition text-left font-semibold text-gray-900">
            🔐 Change Password
          </button>
          <button className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition text-left font-semibold text-gray-900">
            🔔 Notification Preferences
          </button>
          <button className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition text-left font-semibold text-gray-900">
            💳 Payment Methods
          </button>
          <button className="w-full px-4 py-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition text-left font-semibold text-red-600">
            🚪 Delete Account
          </button>
        </div>
      </div>

      {/* Claim Request */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Claim Compensation for External Disasters</h3>
        <p className="text-sm text-gray-600 mb-4">
          If rainfall, pollution, or traffic disruption affected your shift and was missed by auto-processing, submit a compensation claim from this section.
        </p>

        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="mb-3 text-sm font-semibold text-blue-800">Recent external disruption feed</p>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            {externalIncidents.map((incident) => (
              <button
                key={incident.id}
                type="button"
                onClick={() => applyIncident(incident.id)}
                className={`rounded-lg border px-3 py-2 text-left text-xs transition ${selectedIncident === incident.id ? 'border-blue-500 bg-blue-100 text-blue-900' : 'border-blue-200 bg-white text-blue-700 hover:bg-blue-100'}`}
              >
                <p className="font-semibold">{incident.label}</p>
                <p className="mt-1">Suggested loss: ₹{incident.suggestedLoss}</p>
              </button>
            ))}
          </div>
        </div>

        {claimNotice && (
          <div className={`mb-4 rounded-lg border px-4 py-3 text-sm font-medium ${claimNotice.includes('successfully') ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
            {claimNotice}
          </div>
        )}

        <form onSubmit={handleClaimRequestSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Trigger Type</label>
            <select
              name="triggerType"
              value={claimForm.triggerType}
              onChange={handleClaimChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option>Heavy Rainfall</option>
              <option>AQI Spike</option>
              <option>Traffic Congestion</option>
              <option>Heatwave Alert</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Event Date</label>
            <input
              type="date"
              name="eventDate"
              value={claimForm.eventDate}
              onChange={handleClaimChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Hours Lost</label>
            <input
              type="number"
              name="hoursLost"
              min="0.5"
              step="0.5"
              value={claimForm.hoursLost}
              onChange={handleClaimChange}
              placeholder="2.5"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Expected Income Loss (INR)</label>
            <input
              type="number"
              name="expectedLoss"
              min="1"
              value={claimForm.expectedLoss}
              onChange={handleClaimChange}
              placeholder="450"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">Description</label>
            <textarea
              name="reason"
              value={claimForm.reason}
              onChange={handleClaimChange}
              rows={3}
              placeholder="Describe what happened and how it affected your work."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
            >
              Submit Claim Request
            </button>
          </div>
        </form>
      </div>

      {/* Claim Request History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Claim Request History</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px]">
            <thead className="border-b border-gray-200 text-left text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-3 py-3">Request ID</th>
                <th className="px-3 py-3">Trigger</th>
                <th className="px-3 py-3">Date</th>
                <th className="px-3 py-3">Expected Loss</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {claimRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-3 py-3 font-semibold text-gray-900">{request.id}</td>
                  <td className="px-3 py-3 text-gray-700">{request.triggerType}</td>
                  <td className="px-3 py-3 text-gray-600">{request.eventDate}</td>
                  <td className="px-3 py-3 text-gray-700">₹{request.expectedLoss}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${request.status === 'Approved' ? 'bg-green-100 text-green-700' : request.status === 'Submitted' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;