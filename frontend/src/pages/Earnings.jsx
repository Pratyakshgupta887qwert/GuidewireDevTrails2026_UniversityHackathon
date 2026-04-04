import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownLeft, Filter } from 'lucide-react';
import { formatCurrency } from '../lib/insurance';

const MOCK_EARNINGS = {
  total_earned: 18450,
  total_premium_paid: 3200,
  net_profit: 15250,
  this_month: 4800,
};

const MOCK_TRANSACTIONS = [
  { id: 'TXN-001', date: '2026-04-01', type: 'payout', description: 'Heavy Rain Payout – Mumbai', amount: 3200, status: 'credited' },
  { id: 'TXN-002', date: '2026-03-28', type: 'premium', description: 'Weekly Shield Premium – Bronze', amount: -400, status: 'debited' },
  { id: 'TXN-003', date: '2026-03-24', type: 'payout', description: 'Heat Wave Disruption Payout', amount: 1800, status: 'credited' },
  { id: 'TXN-004', date: '2026-03-21', type: 'premium', description: 'Weekly Shield Premium – Silver', amount: -650, status: 'debited' },
  { id: 'TXN-005', date: '2026-03-18', type: 'payout', description: 'AQI Disruption Payout', amount: 2400, status: 'credited' },
  { id: 'TXN-006', date: '2026-03-14', type: 'premium', description: 'Weekly Shield Premium – Bronze', amount: -400, status: 'debited' },
  { id: 'TXN-007', date: '2026-03-10', type: 'payout', description: 'Heavy Rain Payout – Chennai', amount: 3600, status: 'credited' },
  { id: 'TXN-008', date: '2026-03-07', type: 'premium', description: 'Weekly Shield Premium – Gold', amount: -950, status: 'debited' },
  { id: 'TXN-009', date: '2026-03-03', type: 'payout', description: 'Traffic Disruption Compensation', amount: 1200, status: 'credited' },
  { id: 'TXN-010', date: '2026-02-28', type: 'premium', description: 'Weekly Shield Premium – Bronze', amount: -400, status: 'debited' },
];

const FILTERS = ['All', 'Payouts', 'Premiums'];

const EarningsPage = ({ summary }) => {
  const [activeFilter, setActiveFilter] = useState('All');

  const totalEarned = summary?.total_payout_received || MOCK_EARNINGS.total_earned;
  const totalPremium = summary?.total_premium_paid || MOCK_EARNINGS.total_premium_paid;
  const netProfit = summary?.profit || MOCK_EARNINGS.net_profit;

  const filteredTxns = MOCK_TRANSACTIONS.filter((txn) => {
    if (activeFilter === 'Payouts') return txn.type === 'payout';
    if (activeFilter === 'Premiums') return txn.type === 'premium';
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">Earnings Overview</p>
        <h3 className="text-3xl font-black text-slate-100 mt-2">Income & Transactions</h3>
        <p className="text-slate-400 mt-1 font-medium">Track all payouts received and premiums paid over time.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <SummaryCard
          label="Total Payouts Received"
          value={formatCurrency(totalEarned)}
          icon={<TrendingUp size={20} />}
          tone="emerald"
          helper="Lifetime insurance payouts"
        />
        <SummaryCard
          label="Total Premiums Paid"
          value={formatCurrency(totalPremium)}
          icon={<TrendingDown size={20} />}
          tone="rose"
          helper="Lifetime shield costs"
        />
        <SummaryCard
          label="Net Profit"
          value={formatCurrency(netProfit)}
          icon={<Wallet size={20} />}
          tone="blue"
          helper="Payouts minus premiums"
        />
        <SummaryCard
          label="This Month"
          value={formatCurrency(MOCK_EARNINGS.this_month)}
          icon={<ArrowUpRight size={20} />}
          tone="violet"
          helper="Earnings in April 2026"
        />
      </div>

      {/* Transaction History */}
      <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 shadow-2xl shadow-black/20 rounded-[32px] p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h4 className="font-black text-slate-100 uppercase tracking-widest text-sm">Transaction History</h4>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-500" />
            <div className="flex gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                    activeFilter === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pb-4 pr-4">Txn ID</th>
                <th className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pb-4 pr-4">Date</th>
                <th className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pb-4 pr-4">Description</th>
                <th className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pb-4 pr-4">Type</th>
                <th className="text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pb-4">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {filteredTxns.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-700/10 transition-colors">
                  <td className="py-4 pr-4 font-mono text-xs text-slate-500">{txn.id}</td>
                  <td className="py-4 pr-4 text-slate-400 font-bold">{txn.date}</td>
                  <td className="py-4 pr-4 text-slate-200 font-bold">{txn.description}</td>
                  <td className="py-4 pr-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        txn.type === 'payout'
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                      }`}
                    >
                      {txn.type === 'payout' ? <ArrowUpRight size={10} /> : <ArrowDownLeft size={10} />}
                      {txn.type === 'payout' ? 'Payout' : 'Premium'}
                    </span>
                  </td>
                  <td className={`py-4 text-right font-black ${txn.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {txn.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(txn.amount))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTxns.length === 0 && (
            <div className="text-center py-12 text-slate-500 font-bold">No transactions found for this filter.</div>
          )}
        </div>
      </div>
    </div>
  );
};

const TONE_STYLES = {
  emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  rose: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
  blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  violet: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
};

const SummaryCard = ({ label, value, icon, tone, helper }) => (
  <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 shadow-xl shadow-black/20 rounded-[28px] p-6 flex flex-col gap-4">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${TONE_STYLES[tone]}`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="text-2xl font-black text-slate-100 mt-1">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{helper}</p>
    </div>
  </div>
);

export default EarningsPage;
