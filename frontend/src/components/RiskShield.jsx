import React from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

const RiskShield = ({ isDisrupted }) => (
  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-black text-xs uppercase tracking-tighter shadow-sm border transition-all duration-700 ${
    isDisrupted 
    ? 'bg-red-50 text-red-600 border-red-100' 
    : 'bg-emerald-50 text-emerald-600 border-emerald-100'
  }`}>
    {isDisrupted ? <ShieldAlert size={14}/> : <ShieldCheck size={14}/>}
    {isDisrupted ? "Disruption Warning" : "System Protected"}
  </div>
);

export default RiskShield;