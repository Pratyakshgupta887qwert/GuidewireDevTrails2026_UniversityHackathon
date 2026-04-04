import React, { useEffect, useState } from 'react';
import { ArrowRight, Check, Crown, Shield, Zap } from 'lucide-react';
import { apiRequest } from '../lib/api';
import { formatCurrency, getRiskTone } from '../lib/insurance';

const tierIcons = {
  basic: <Shield />,
  standard: <Zap />,
  premium: <Crown />,
};

const tierClasses = {
  basic: 'bg-blue-100 text-blue-600',
  standard: 'bg-emerald-100 text-emerald-600',
  premium: 'bg-indigo-100 text-indigo-600',
};

const PolicyMarket = ({ user, onPurchase, purchaseLoadingTier, activePolicy, error }) => {
  const [planData, setPlanData] = useState(null);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [planError, setPlanError] = useState('');

  useEffect(() => {
    const loadPlans = async () => {
      if (!user?.city) {
        return;
      }

      setIsLoadingPlans(true);
      setPlanError('');

      try {
        const data = await apiRequest('/api/calculate-plan', {
          method: 'POST',
          body: JSON.stringify({ city: user.city }),
        });
        setPlanData(data);
      } catch (requestError) {
        setPlanError(requestError.message);
      } finally {
        setIsLoadingPlans(false);
      }
    };

    loadPlans();
  }, [user?.city]);

  const hasActivePolicy = Boolean(activePolicy);
  const isAadhaarVerified = Boolean(user?.aadhaar_verified);

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-black text-slate-900 mb-4">Choose Your Weekly Shield</h2>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto">
          Dynamic weekly pricing based on {user?.city || 'your city'} risk. Premiums and coverage adjust using rain, heat, AQI, and traffic conditions.
        </p>
      </div>

      <div className="max-w-6xl mx-auto mb-8 space-y-3">
        {planData && (
          <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">City Risk Snapshot</p>
              <p className="text-lg font-black text-slate-900 mt-2">
                {planData.city} risk score {planData.risk_score} with multiplier {planData.multiplier}x
              </p>
            </div>
            <div className={`inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-black uppercase tracking-[0.18em] border ${getRiskTone(planData.risk_level)}`}>
              {planData.risk_level} risk
            </div>
          </div>
        )}

        {!isAadhaarVerified && (
          <div className="rounded-[24px] border border-amber-200 bg-amber-50 px-6 py-4 text-sm font-bold text-amber-700">
            Verify Aadhaar from the Overview tab to unlock plan selection.
          </div>
        )}

        {hasActivePolicy && (
          <div className="rounded-[24px] border border-blue-200 bg-blue-50 px-6 py-4 text-sm font-bold text-blue-700">
            You already have an active policy. Your current shield stays active until it expires.
          </div>
        )}

        {(planError || error) && (
          <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-6 py-4 text-sm font-bold text-rose-700">
            {planError || error}
          </div>
        )}
      </div>

      {isLoadingPlans ? (
        <div className="max-w-6xl mx-auto rounded-[32px] border border-slate-200 bg-white p-10 text-center">
          <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 font-bold mt-4">Calculating city risk and dynamic pricing...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {(planData?.plans || []).map((tier) => {
            const tierKey = tier.key;
            const isLoading = purchaseLoadingTier === tierKey;

            return (
              <div
                key={tier.name}
                className={`relative bg-white rounded-[40px] p-8 border-2 transition-all hover:scale-105 ${
                  tier.popular ? 'border-blue-600 shadow-2xl shadow-blue-100' : 'border-slate-100 shadow-xl'
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                    Most Popular
                  </span>
                )}

                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${tierClasses[tierKey]}`}>
                  {tierIcons[tierKey]}
                </div>

                <h3 className="text-2xl font-black text-slate-900">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mt-2 mb-3">
                  <span className="text-4xl font-black text-slate-900">{formatCurrency(tier.premium)}</span>
                  <span className="text-slate-400 font-bold">/week</span>
                </div>
                <p className="text-sm font-bold text-slate-500 mb-6">
                  Coverage up to {formatCurrency(tier.coverage)}
                </p>

                <ul className="space-y-4 mb-10">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                      <Check className="text-emerald-500" size={18} /> {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onPurchase(tier.key)}
                  disabled={isLoading || hasActivePolicy || !isAadhaarVerified}
                  className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${
                    tier.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : hasActivePolicy ? (
                    'Shield Already Active'
                  ) : !isAadhaarVerified ? (
                    'Verify Aadhaar First'
                  ) : (
                    <>
                      Activate Shield <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PolicyMarket;
