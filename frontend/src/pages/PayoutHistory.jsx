import React from 'react';
import { Activity, Filter, Wallet, Zap } from 'lucide-react';
import { formatCurrency } from '../lib/insurance';

const PayoutHistory = ({ claims = [], activePolicy, summary }) => {
  const ledgerItems = [
    ...claims.map((claim) => ({
      id: claim.id,
      label: claim.event_type.replace(/_/g, ' '),
      date: new Date(claim.created_at).toLocaleString(),
      amount: `+${formatCurrency(claim.payout_amount)}`,
      status: claim.status.toUpperCase(),
      type: 'payout',
    })),
    ...(activePolicy ? [{
      id: `${activePolicy.id}-premium`,
      label: `${activePolicy.tier_name} weekly shield`,
      date: `${activePolicy.days_remaining} day(s) remaining`,
      amount: `-${formatCurrency(activePolicy.premium)}`,
      status: activePolicy.status.toUpperCase(),
      type: 'premium',
    }] : []),
  ];

  return (
    <div className="bg-slate-800/40 backdrop-blur-md rounded-[40px] p-10 border border-slate-700/50 shadow-2xl shadow-black/20 min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

      <div className="relative flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-12 z-10">
        <div>
          <h2 className="text-3xl font-black text-slate-100 tracking-tight">Payout History</h2>
          <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-[0.15em]">
            Weekly premiums, automated payouts, and your running profit
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-[20px] bg-slate-900/50 border border-slate-700/50 px-4 py-3">
          <Filter size={16} className="text-slate-500" />
          <p className="text-sm font-bold text-slate-300">
            Net profit: {formatCurrency(summary?.profit || 0)}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Premium Paid" value={formatCurrency(summary?.total_premium_paid || 0)} />
        <StatCard label="Payout Received" value={formatCurrency(summary?.total_payout_received || 0)} />
        <StatCard label="Net Profit" value={formatCurrency(summary?.profit || 0)} highlight />
      </div>

      <div className="relative z-10 space-y-4">
        {ledgerItems.length > 0 ? (
          ledgerItems.map((item) => (
            <LedgerItem
              key={item.id}
              label={item.label}
              date={item.date}
              amount={item.amount}
              status={item.status}
              type={item.type}
            />
          ))
        ) : (
          <div className="rounded-[32px] border border-dashed border-slate-700 bg-slate-900/40 p-8 text-center">
            <p className="text-lg font-black text-slate-100">No automated payouts yet</p>
            <p className="text-sm font-bold text-slate-400 mt-3">
              Verify Aadhaar, activate a weekly shield, then simulate heavy rain to see the automated claim history here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, highlight = false }) => (
  <div className="rounded-[24px] border border-slate-700/50 bg-slate-900/40 px-5 py-4">
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</p>
    <p className={`text-xl font-black mt-2 ${highlight ? 'text-emerald-400' : 'text-slate-100'}`}>{value}</p>
  </div>
);

const LedgerItem = ({ label, date, amount, status, type }) => (
  <div className="flex justify-between items-center p-5 rounded-[24px] bg-slate-900/50 hover:bg-slate-800/50 transition-all border border-slate-700/50 hover:border-slate-600">
    <div className="flex gap-5 items-center">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
        type === 'payout'
          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
      }`}>
        {type === 'payout' ? <Zap size={24} /> : <Wallet size={24} />}
      </div>
      <div>
        <p className="text-lg font-bold text-slate-200 capitalize">{label}</p>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{date}</p>
      </div>
    </div>
    <div className="text-right">
      <p className={`text-xl font-black ${amount.startsWith('+') ? 'text-emerald-400' : 'text-slate-200'}`}>{amount}</p>
      <div className="inline-flex items-center justify-center px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg mt-1.5">
        <p className="text-[10px] font-bold text-slate-400 tracking-widest">{status}</p>
      </div>
    </div>
  </div>
);

export default PayoutHistory;
