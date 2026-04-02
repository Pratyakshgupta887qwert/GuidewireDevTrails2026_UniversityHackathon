import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isAdmin = false }) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const workerMenuItems = [
    { path: '/worker-dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/worker-dashboard/profile', label: 'Profile', icon: '👤' },
    { path: '/worker-dashboard/coverage', label: 'Coverage', icon: '🛡️' },
    { path: '/worker-dashboard/claims', label: 'Claims', icon: '📋' },
    { path: '/worker-dashboard/earnings', label: 'Earnings', icon: '💰' },
    { path: '/worker-dashboard/heatmap', label: 'Risk Heatmap', icon: '🗺️' },
  ];

  const adminMenuItems = [
    { path: '/admin-dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin-dashboard/disruptions', label: 'Disruptions', icon: '⚠️' },
    { path: '/admin-dashboard/workers', label: 'Workers', icon: '👥' },
    { path: '/admin-dashboard/policies', label: 'Policies', icon: '🧾' },
    { path: '/admin-dashboard/fraud', label: 'Fraud Alerts', icon: '🚨' },
    { path: '/admin-dashboard/payouts', label: 'Payouts', icon: '💳' },
  ];

  const menuItems = isAdmin ? adminMenuItems : workerMenuItems;

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-24 z-40 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 p-2 text-white shadow-lg lg:hidden"
        aria-label="Open sidebar"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
        </svg>
      </button>

      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 overflow-y-auto border-r border-white/30 bg-white/70 px-3 pb-6 pt-24 shadow-xl backdrop-blur-md transition-transform duration-300 dark:border-slate-700 dark:bg-slate-950/70 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="rounded-xl border border-white/60 bg-gradient-to-r from-primary-50 to-secondary-50 p-4 dark:border-slate-700 dark:from-slate-900 dark:to-slate-800">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-300">{isAdmin ? 'Admin Workspace' : 'Worker Workspace'}</h2>
          <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{isAdmin ? 'Control Center' : 'Earnings Hub'}</p>
        </div>

        <nav className="mt-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-white/70 dark:text-slate-200 dark:hover:bg-slate-800/80'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;