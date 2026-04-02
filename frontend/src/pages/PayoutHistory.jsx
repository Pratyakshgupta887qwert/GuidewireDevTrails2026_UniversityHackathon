import React from 'react';
import { Activity, Zap, ChevronDown, Filter } from 'lucide-react';

const PayoutHistory = () => {
  return (
    <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-xl shadow-slate-200/40 min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500 relative overflow-hidden">
      
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 opacity-60"></div>
      
      <div className="relative flex justify-between items-center mb-12 z-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Payout History</h2>
          <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-[0.15em]">All System Transactions</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 shadow-sm">
          <Filter size={16} /> Filter <ChevronDown size={16} className="ml-1" />
        </button>
      </div>

      <div className="relative z-10 space-y-4">
        <LedgerItem label="Heavy Rain Compensation" date="Today, 2:40 PM" amount="+₹450" status="AUTO-PAID" type="payout" />
        <LedgerItem label="Delivery #9021" date="Today, 1:15 PM" amount="+₹120" status="COMPLETED" type="earning" />
        <LedgerItem label="Weekly Premium Shield" date="Yesterday, 9:00 AM" amount="-₹25" status="SETTLED" type="premium" />
        <LedgerItem label="Delivery #8994" date="Yesterday, 1:30 PM" amount="+₹80" status="COMPLETED" type="earning" />
        <LedgerItem label="Traffic Delay Bonus" date="Oct 24, 4:15 PM" amount="+₹150" status="AUTO-PAID" type="payout" />
      </div>
    </div>
  );
};

const LedgerItem = ({ label, date, amount, status, type }) => (
  <div className="flex justify-between items-center p-5 rounded-[24px] bg-slate-50 hover:bg-white transition-all border border-transparent hover:border-slate-200 hover:shadow-lg hover:shadow-slate-200/50 cursor-pointer group">
     <div className="flex gap-5 items-center">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 ${
          type === 'payout' ? 'bg-orange-100 text-orange-600 border border-orange-200/50' : 
          type === 'earning' ? 'bg-blue-100 text-blue-600 border border-blue-200/50' :
          'bg-slate-200 text-slate-500 border border-slate-300/50'
        }`}>
           {type === 'payout' ? <Zap size={24}/> : <Activity size={24}/>}
        </div>
        <div>
           <p className="text-lg font-black text-slate-800 group-hover:text-blue-600 transition-colors">{label}</p>
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{date}</p>
        </div>
     </div>
     <div className="text-right">
        <p className={`text-xl font-black ${amount.startsWith('+') ? 'text-emerald-600' : 'text-slate-900'}`}>{amount}</p>
        <div className="inline-flex items-center justify-center px-2.5 py-1 bg-white border border-slate-200 rounded-lg mt-1.5 shadow-sm">
          <p className="text-[10px] font-black text-slate-500 tracking-widest">{status}</p>
        </div>
     </div>
  </div>
);

export default PayoutHistory;
