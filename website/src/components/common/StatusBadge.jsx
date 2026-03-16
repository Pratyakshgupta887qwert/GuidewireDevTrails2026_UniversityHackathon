import React from 'react';

const variantMap = {
  success: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-800',
  warning: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800',
  danger: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800',
  info: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
};

const StatusBadge = ({ children, variant = 'neutral' }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${variantMap[variant] || variantMap.neutral}`}
    >
      {children}
    </span>
  );
};

export default StatusBadge;
