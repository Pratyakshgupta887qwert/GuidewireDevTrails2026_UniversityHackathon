import React from 'react';

const GlassCard = ({ children, className = '' }) => {
  return (
    <section
      className={`rounded-2xl border border-white/30 bg-white/70 p-5 shadow-xl shadow-blue-900/10 backdrop-blur-md transition duration-300 dark:border-slate-700 dark:bg-slate-900/70 ${className}`}
    >
      {children}
    </section>
  );
};

export default GlassCard;
