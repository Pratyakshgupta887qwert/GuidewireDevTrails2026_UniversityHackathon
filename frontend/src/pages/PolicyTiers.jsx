import React, { useEffect, useState } from 'react';
import PolicyMarket from './PolicyMarket';

const PolicyTiers = ({ user, activePolicy, onPurchasePolicy, onPolicyActivated }) => {
  const [loadingTier, setLoadingTier] = useState('');
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!showToast) return undefined;
    const timeoutId = window.setTimeout(() => setShowToast(false), 2600);
    return () => window.clearTimeout(timeoutId);
  }, [showToast]);

  const handlePurchase = async (selectedTier) => {
    setLoadingTier(selectedTier);
    setError('');

    try {
      await onPurchasePolicy(selectedTier);
      setShowToast(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.setTimeout(() => onPolicyActivated?.(), 700);
    } catch (purchaseError) {
      setError(purchaseError.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoadingTier('');
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {showToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[120]">
          <div className="bg-slate-900/95 text-white px-6 py-4 rounded-[20px] shadow-2xl border border-emerald-500/30">
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Shield Activated</p>
            <p className="text-sm font-bold text-slate-100 mt-1">Policy Activated for 7 Days</p>
          </div>
        </div>
      )}

      <PolicyMarket
        user={user}
        onPurchase={handlePurchase}
        purchaseLoadingTier={loadingTier}
        activePolicy={activePolicy}
        error={error}
      />
    </div>
  );
};

export default PolicyTiers;
