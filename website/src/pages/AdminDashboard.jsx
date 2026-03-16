import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Dashboard from '../components/admin/AdminDashboard';
import DisruptionMonitoring from '../components/admin/DisruptionMonitoring';
import WorkerManagement from '../components/admin/WorkerManagement';
import FraudAlerts from '../components/admin/FraudAlerts';
import PayoutAnalytics from '../components/admin/PayoutAnalytics';
import PolicyManagement from '../components/admin/PolicyManagement';

const AdminDashboardPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-indigo-50/40 to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navbar isDashboard={true} />
      <div className="flex flex-1">
        <Sidebar isAdmin={true} />
        <main className="flex-1 p-4 pt-28 md:p-8 md:pt-28 lg:ml-64">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/disruptions" element={<DisruptionMonitoring />} />
            <Route path="/workers" element={<WorkerManagement />} />
            <Route path="/policies" element={<PolicyManagement />} />
            <Route path="/fraud" element={<FraudAlerts />} />
            <Route path="/payouts" element={<PayoutAnalytics />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;