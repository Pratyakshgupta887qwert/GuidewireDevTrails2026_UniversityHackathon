import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ToastStack from './ToastStack';

const DashboardLayout = ({ isAdmin, title, subtitle, children, toasts = [], onDismissToast }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/40 to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navbar isDashboard />
      <Sidebar isAdmin={isAdmin} />
      <main className="px-4 pb-10 pt-20 lg:pl-72 lg:pr-8">
        <div className="mx-auto max-w-7xl animate-fade-in">
          <header className="mb-6 rounded-2xl border border-white/40 bg-white/60 p-6 shadow-xl backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/70">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 md:text-3xl">{title}</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 md:text-base">{subtitle}</p>
          </header>
          {children}
        </div>
      </main>
      {toasts.length > 0 ? <ToastStack toasts={toasts} onDismiss={onDismissToast} /> : null}
    </div>
  );
};

export default DashboardLayout;
