import React from 'react';
import { Check, Zap, Shield, Crown, ArrowRight } from 'lucide-react';

const PolicyMarket = ({ onPurchase, purchaseLoadingTier, activePolicy, error }) => {
  const tiers = [
    {
      name: 'Basic',
      price: '15',
      risk: 'low',
      icon: <Shield />,
      iconClass: 'bg-blue-100 text-blue-600',
      features: ['Income loss cover for heavy rain', '7-day active shield window', 'Automated disruption payout checks']
    },
    {
      name: 'Standard',
      price: '25',
      risk: 'medium',
      icon: <Zap />,
      iconClass: 'bg-emerald-100 text-emerald-600',
      popular: true,
      features: ['Lower disruption trigger threshold', 'Higher weekly payout ceiling', 'Priority automated claim processing']
    },
    {
      name: 'Extended',
      price: '35',
      risk: 'high',
      icon: <Crown />,
      iconClass: 'bg-indigo-100 text-indigo-600',
      features: ['Maximum income loss cover', 'Best payout cap for 7 days', 'Built for high-risk delivery zones']
    }
  ];

  const hasActivePolicy = Boolean(activePolicy);

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-black text-slate-900 mb-4">Choose Your Weekly Shield</h2>
        <p className="text-slate-500 font-medium max-w-xl mx-auto">
          Flexible income protection tailored to your zone&apos;s risk level. Stay protected for the next 7 days.
        </p>
      </div>

      <div className="max-w-6xl mx-auto mb-8 space-y-3">
        {hasActivePolicy && (
          <div className="rounded-[24px] border border-blue-200 bg-blue-50 px-6 py-4 text-sm font-bold text-blue-700">
            You already have an active policy. Your current shield stays active until it expires.
          </div>
        )}
        {error && (
          <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-6 py-4 text-sm font-bold text-rose-700">
            {error}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {tiers.map((tier) => {
          const isLoading = purchaseLoadingTier === tier.risk;

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

              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${tier.iconClass}`}>
                {tier.icon}
              </div>

              <h3 className="text-2xl font-black text-slate-900">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mt-2 mb-8">
                <span className="text-4xl font-black text-slate-900">₹{tier.price}</span>
                <span className="text-slate-400 font-bold">/week</span>
              </div>

              <ul className="space-y-4 mb-10">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <Check className="text-emerald-500" size={18} /> {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onPurchase(tier.risk)}
                disabled={isLoading || hasActivePolicy}
                className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${
                  tier.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : hasActivePolicy ? (
                  'Shield Already Active'
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
    </div>
  );
};

export default PolicyMarket;
