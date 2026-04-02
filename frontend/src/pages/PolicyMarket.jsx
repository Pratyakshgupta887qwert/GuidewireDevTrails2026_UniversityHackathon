import React from 'react';
import { Check, Zap, Shield, Crown, ArrowRight } from 'lucide-react';

const PolicyMarket = ({ onPurchase }) => {
  const tiers = [
    {
      name: "Basic",
      price: "15",
      risk: "Low",
      color: "blue",
      icon: <Shield />,
      features: ["Rain Coverage (>10mm)", "Traffic Delay Protection", "24/7 Support"]
    },
    {
      name: "Standard",
      price: "25",
      risk: "Medium",
      color: "emerald",
      icon: <Zap />,
      popular: true,
      features: ["Rain Coverage (>5mm)", "AQI Pollution Protection", "Priority Payouts", "Traffic Delay Protection"]
    },
    {
      name: "Extended",
      price: "35",
      risk: "High",
      color: "indigo",
      icon: <Crown />,
      features: ["All Disruptions Covered", "Max Payout Limits", "Hospitalization Buffer", "Accident Cover Add-on"]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-black text-slate-900 mb-4">Choose Your Weekly Shield</h2>
        <p className="text-slate-500 font-medium max-w-xl mx-auto">
          Flexible coverage tailored to your zone's risk level. Stay protected for the next 7 days.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {tiers.map((tier) => (
          <div key={tier.name} className={`relative bg-white rounded-[40px] p-8 border-2 transition-all hover:scale-105 ${tier.popular ? 'border-blue-600 shadow-2xl shadow-blue-100' : 'border-slate-100 shadow-xl'}`}>
            {tier.popular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                Most Popular
              </span>
            )}
            
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-${tier.color}-100 text-${tier.color}-600`}>
              {tier.icon}
            </div>
            
            <h3 className="text-2xl font-black text-slate-900">{tier.name}</h3>
            <div className="flex items-baseline gap-1 mt-2 mb-8">
              <span className="text-4xl font-black text-slate-900">₹{tier.price}</span>
              <span className="text-slate-400 font-bold">/week</span>
            </div>

            <ul className="space-y-4 mb-10">
              {tier.features.map(f => (
                <li key={f} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                  <Check className="text-emerald-500" size={18} /> {f}
                </li>
              ))}
            </ul>

            <button 
              onClick={onPurchase}
              className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 ${
                tier.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              Activate Shield <ArrowRight size={18}/>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PolicyMarket;