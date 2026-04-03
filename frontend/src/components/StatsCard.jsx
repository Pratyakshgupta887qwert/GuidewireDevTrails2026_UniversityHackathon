import React from 'react';

const StatsCard = ({ icon, label, value, subtext }) => (
  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-blue-600">
      {icon}
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <h4 className="text-2xl font-black text-slate-900">{value}</h4>
    {subtext && <p className="text-xs font-bold text-emerald-500 mt-1">{subtext}</p>}
  </div>
);

export default StatsCard;