import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Dashboard from '../components/workers/Dashboard';
import ProfileSetup from '../components/workers/ProfileSetup';
import CoverageActivation from '../components/workers/CoverageActivation';
import ClaimHistory from '../components/workers/ClaimHistory';
import EarningsTracker from '../components/workers/EarningsTracker';
import RiskHeatmap from '../components/workers/RiskHeatmap';

const WorkerDashboard = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-indigo-50/40 to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navbar isDashboard={true} />
      <div className="flex flex-1">
        <Sidebar isAdmin={false} />
        <main className="flex-1 p-4 pt-28 md:p-8 md:pt-28 lg:ml-64">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<ProfileSetup />} />
            <Route path="/coverage" element={<CoverageActivation />} />
            <Route path="/claims" element={<ClaimHistory />} />
            <Route path="/earnings" element={<EarningsTracker />} />
            <Route path="/heatmap" element={<RiskHeatmap />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default WorkerDashboard;