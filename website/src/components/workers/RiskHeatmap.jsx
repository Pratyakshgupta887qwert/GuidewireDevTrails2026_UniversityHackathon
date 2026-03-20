import React, { useState } from 'react';

const RiskHeatmap = () => {
  const [selectedZone, setSelectedZone] = useState(null);

  const zones = [
    {
      id: 1,
      name: 'South Delhi',
      risk: 'High Risk',
      riskScore: 8.5,
      workers: 324,
      activePolicy: 289,
      weather: 'Cloudy, 28°C',
      aqi: 180,
      traffic: 'Moderate',
      color: 'bg-red-500',
      details: {
        rainfall: '60% chance',
        pollution: 'High (AQI 180)',
        congestion: 'Moderate',
        incidents: 3,
      },
    },
    {
      id: 2,
      name: 'North Delhi',
      risk: 'Medium Risk',
      riskScore: 5.2,
      workers: 456,
      activePolicy: 398,
      weather: 'Partly Cloudy, 27°C',
      aqi: 145,
      traffic: 'Light',
      color: 'bg-yellow-500',
      details: {
        rainfall: '30% chance',
        pollution: 'Moderate (AQI 145)',
        congestion: 'Light',
        incidents: 1,
      },
    },
    {
      id: 3,
      name: 'East Delhi',
      risk: 'Low Risk',
      riskScore: 3.1,
      workers: 512,
      activePolicy: 489,
      weather: 'Clear, 29°C',
      aqi: 95,
      traffic: 'Smooth',
      color: 'bg-green-500',
      details: {
        rainfall: '10% chance',
        pollution: 'Good (AQI 95)',
        congestion: 'Smooth',
        incidents: 0,
      },
    },
    {
      id: 4,
      name: 'West Delhi',
      risk: 'Medium Risk',
      riskScore: 6.2,
      workers: 378,
      activePolicy: 312,
      weather: 'Cloudy, 26°C',
      aqi: 165,
      traffic: 'Heavy',
      color: 'bg-yellow-500',
      details: {
        rainfall: '45% chance',
        pollution: 'High (AQI 165)',
        congestion: 'Heavy',
        incidents: 2,
      },
    },
  ];

  const selectedZoneData = selectedZone ? zones.find(z => z.id === selectedZone) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Risk Heatmap</h1>
          <p className="text-gray-600 mt-1">Real-time disruption risk across zones</p>
        </div>
      </div>

      {/* Risk Legend */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Risk Levels</h2>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-gray-700">Low Risk (0-3)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-gray-700">Medium Risk (4-7)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-gray-700">High Risk (8-10)</span>
          </div>
        </div>
      </div>

      {/* Zones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {zones.map((zone) => (
          <div
            key={zone.id}
            onClick={() => setSelectedZone(zone.id)}
            className={`rounded-lg shadow-md p-6 cursor-pointer transition transform hover:scale-105 border-2 ${
              selectedZone === zone.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-transparent hover:shadow-lg'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{zone.name}</h3>
                <p className="text-gray-600">{zone.workers} active workers</p>
              </div>
              <div className={`w-4 h-4 ${zone.color} rounded-full`}></div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-semibold">Risk Score</span>
                <span className="text-2xl font-bold text-gray-900">{zone.riskScore}/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${zone.color}`}
                  style={{ width: `${(zone.riskScore / 10) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-600 font-semibold">Weather</p>
                <p className="text-gray-900 mt-1">{zone.weather}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-600 font-semibold">AQI</p>
                <p className="text-gray-900 mt-1">{zone.aqi}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-600 font-semibold">Traffic</p>
                <p className="text-gray-900 mt-1">{zone.traffic}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-600 font-semibold">Policy Coverage</p>
                <p className="text-gray-900 mt-1">{zone.activePolicy}/{zone.workers}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed View */}
      {selectedZoneData && (
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Zone Details: {selectedZoneData.name}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="border-l-4 border-blue-600 pl-4">
                <p className="text-gray-600 font-semibold">Current Risk Level</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{selectedZoneData.risk}</p>
              </div>

              <div className="border-l-4 border-green-600 pl-4">
                <p className="text-gray-600 font-semibold">Weather Condition</p>
                <p className="text-gray-900 mt-2">{selectedZoneData.weather}</p>
              </div>

              <div className="border-l-4 border-yellow-600 pl-4">
                <p className="text-gray-600 font-semibold">Air Quality Index</p>
                <p className="text-gray-900 mt-2">
                  {selectedZoneData.aqi} - {selectedZoneData.details.pollution}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="border-l-4 border-red-600 pl-4">
                <p className="text-gray-600 font-semibold">Rainfall Forecast</p>
                <p className="text-gray-900 mt-2">{selectedZoneData.details.rainfall}</p>
              </div>

              <div className="border-l-4 border-purple-600 pl-4">
                <p className="text-gray-600 font-semibold">Recent Incidents</p>
                <p className="text-gray-900 mt-2">{selectedZoneData.details.incidents} disruptions this week</p>
              </div>

              <div className="border-l-4 border-indigo-600 pl-4">
                <p className="text-gray-600 font-semibold">Active Policies</p>
                <p className="text-gray-900 mt-2">
                  {selectedZoneData.activePolicy} out of {selectedZoneData.workers} workers
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-900 font-semibold">📌 Recommendation</p>
            <p className="text-blue-800 mt-2">
              {selectedZoneData.risk === 'High Risk' 
                ? 'This zone has high disruption risk. Consider activating Extended Plan for maximum coverage.' 
                : selectedZoneData.risk === 'Medium Risk'
                ? 'This zone has moderate risk. Standard Plan provides adequate protection.'
                : 'This zone has low risk. Basic Plan is sufficient for protection.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskHeatmap;