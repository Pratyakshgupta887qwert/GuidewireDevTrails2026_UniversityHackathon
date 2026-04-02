import React from 'react';
import { Zap, X } from 'lucide-react';

const PayoutToast = ({ amount, visible, onClose }) => {
  if (!visible) return null;
  return (
    <div className="fixed top-24 right-6 z-[100] animate-bounce">
      <div className="bg-slate-900 text-white p-5 rounded-[24px] shadow-2xl border border-blue-500/30 flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
          <Zap className="fill-white" size={24} />
        </div>
        <div>
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Instant Payout</p>
          <p className="text-lg font-black leading-tight">₹{amount} Processed</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default PayoutToast;