import React, { useState } from 'react';
import { Briefcase, CheckCircle2, MapPin, Save, Shield, Truck, User, Wallet } from 'lucide-react';
import { apiRequest } from '../lib/api';
import { SUPPORTED_CITIES, formatCurrency } from '../lib/insurance';

const Settings = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    city: user.city || '',
    pan_card: user.pan_card || '',
    vehicle_number: user.vehicle_number || '',
    partner_platform: user.partner_platform || '',
    avg_daily_income: user.avg_daily_income || 1200,
    working_hours: user.working_hours || 10,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue = (name === 'pan_card' || name === 'vehicle_number') ? value.toUpperCase() : value;
    setFormData((current) => ({
      ...current,
      [name]: nextValue,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage('');
    setError('');

    try {
      const data = await apiRequest('/api/user/update', {
        method: 'PUT',
        body: JSON.stringify({
          id: user.id,
          phone: user.phone,
          ...formData,
        }),
      });

      setUser?.(data.user);
      setMessage('Settings saved successfully.');
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h2 className="text-3xl font-black text-slate-100">Settings</h2>
        <p className="text-slate-400 font-medium mt-2">
          Fine-tune your city profile and income assumptions used for premium and payout calculations.
        </p>
      </div>

      <div className="grid xl:grid-cols-[0.9fr_1.1fr] gap-8">
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 shadow-2xl shadow-black/20 rounded-[36px] p-8">
          <div className="w-24 h-24 rounded-full bg-slate-900 border border-slate-700/50 overflow-hidden mx-auto">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" />
          </div>
          <div className="text-center mt-5">
            <h3 className="text-2xl font-black text-slate-100">{user.name}</h3>
            <p className="text-sm font-bold text-slate-400 mt-2">{user.phone}</p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700/50 bg-slate-900/40">
              <Shield size={16} className={user.aadhaar_verified ? 'text-emerald-400' : 'text-amber-400'} />
              <span className={`text-xs font-black uppercase tracking-[0.18em] ${user.aadhaar_verified ? 'text-emerald-400' : 'text-amber-400'}`}>
                {user.aadhaar_verified ? 'Aadhaar Verified' : 'Aadhaar Pending'}
              </span>
            </div>
          </div>

          <div className="grid gap-4 mt-8">
            <MiniStat icon={<MapPin size={18} />} label="City" value={user.city || 'Not selected'} />
            <MiniStat icon={<Truck size={18} />} label="Vehicle" value={user.vehicle_number || 'Not added'} />
            <MiniStat icon={<Briefcase size={18} />} label="Partner" value={user.partner_platform || 'Not added'} />
            <MiniStat icon={<Wallet size={18} />} label="Daily Income" value={formatCurrency(user.avg_daily_income || 0)} />
            <MiniStat icon={<User size={18} />} label="Working Hours" value={`${Number(user.working_hours || 0)} hrs`} />
          </div>
        </div>

        <form onSubmit={handleSave} className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 shadow-2xl shadow-black/20 rounded-[36px] p-8 space-y-6">
          <SettingField label="Full Name">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-4 py-4 text-sm font-bold text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </SettingField>

          <SettingField label="PAN Card">
            <input
              name="pan_card"
              value={formData.pan_card}
              onChange={handleChange}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-4 py-4 text-sm font-bold text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </SettingField>

          <SettingField label="City">
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-4 py-4 text-sm font-bold text-slate-200 focus:outline-none focus:border-blue-500"
            >
              {SUPPORTED_CITIES.map((city) => (
                <option key={city} value={city} className="bg-slate-900 text-slate-200">
                  {city}
                </option>
              ))}
            </select>
          </SettingField>
          
          <div className="grid md:grid-cols-2 gap-4">
            <SettingField label="Vehicle Number">
              <input
                name="vehicle_number"
                value={formData.vehicle_number}
                onChange={handleChange}
                placeholder="UP00 AB 1234"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-4 py-4 text-sm font-bold text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </SettingField>
            
            <SettingField label="Delivery Partner">
              <select
                name="partner_platform"
                value={formData.partner_platform}
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-4 py-4 text-sm font-bold text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="" disabled>Select partner</option>
                {['Swiggy', 'Zomato', 'Amazon', 'Flipkart', 'Zepto', 'Other'].map((p) => (
                  <option key={p} value={p} className="bg-slate-900 text-slate-200">{p}</option>
                ))}
              </select>
            </SettingField>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <SettingField label="Average Daily Income">
              <input
                type="number"
                name="avg_daily_income"
                value={formData.avg_daily_income}
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-4 py-4 text-sm font-bold text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </SettingField>
            <SettingField label="Working Hours">
              <input
                type="number"
                name="working_hours"
                value={formData.working_hours}
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-4 py-4 text-sm font-bold text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </SettingField>
          </div>

          <div className="rounded-[24px] border border-slate-700/50 bg-slate-900/40 px-5 py-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Why this matters</p>
            <p className="text-sm text-slate-300 mt-3">
              Hourly income is calculated as average daily income divided by working hours. Simulated payouts use hourly income multiplied by disruption hours and 0.75.
            </p>
          </div>

          {message && (
            <div className="rounded-[20px] border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-300 flex items-center gap-2">
              <CheckCircle2 size={18} /> {message}
            </div>
          )}

          {error && (
            <div className="rounded-[20px] border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-bold text-rose-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black transition-all hover:bg-blue-500 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Save size={18} /> Save Settings
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const MiniStat = ({ icon, label, value }) => (
  <div className="rounded-[24px] border border-slate-700/50 bg-slate-900/40 px-5 py-4 flex items-center gap-4">
    <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700/50 text-slate-300 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="text-lg font-black text-slate-100 mt-1">{value}</p>
    </div>
  </div>
);

const SettingField = ({ label, children }) => (
  <div className="space-y-2">
    <label className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 block">{label}</label>
    {children}
  </div>
);

export default Settings;
