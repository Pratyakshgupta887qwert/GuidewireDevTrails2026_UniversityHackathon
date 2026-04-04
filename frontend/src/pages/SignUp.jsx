import React, { useMemo, useState } from 'react';
import { ArrowRight, Briefcase, CheckCircle2, MapPin, ShieldCheck, Smartphone, Truck, User, WalletCards } from 'lucide-react';
import { apiRequest } from '../lib/api';
import { SUPPORTED_CITIES } from '../lib/insurance';

const DEFAULT_OTP = '123456';

const SignUp = ({ onRegister, onNavigateToSignIn }) => {
  const [step, setStep] = useState('details');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState(DEFAULT_OTP);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pan_card: '',
    city: '',
    vehicle_number: '',
    partner_platform: '',
  });
  const [otp, setOtp] = useState('');

  const canSendOtp = useMemo(
    () => Boolean(formData.name && formData.phone && formData.pan_card && formData.city && formData.vehicle_number && formData.partner_platform),
    [formData]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue = (name === 'pan_card' || name === 'vehicle_number') ? value.toUpperCase() : value;
    setFormData((current) => ({ ...current, [name]: nextValue }));
  };

  const handleSendOtp = () => {
    setError('');
    setSuccess(`OTP sent to ${formData.phone}. Use ${generatedOtp} for the simulation.`);
    setStep('otp');
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (otp !== generatedOtp) {
        throw new Error(`Invalid OTP. Use ${generatedOtp} for the simulation.`);
      }

      await apiRequest('/api/signup', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          otp_verified: true,
        }),
      });

      onRegister?.({
        phone: formData.phone,
        city: formData.city,
      });
    } catch (signupError) {
      setError(signupError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6 relative overflow-hidden z-10 py-12">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] opacity-80 pointer-events-none -translate-y-1/4 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] opacity-80 pointer-events-none translate-y-1/4 -translate-x-1/4"></div>

      <div className="max-w-[760px] w-full bg-slate-800/40 backdrop-blur-md rounded-[40px] shadow-2xl shadow-black/20 p-8 md:p-12 border border-slate-700/50 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border border-slate-700/50 shadow-lg shadow-black/20">
            <ShieldCheck className="text-blue-400 w-8 h-8 drop-shadow-md" />
          </div>
          <h2 className="text-3xl font-black text-slate-100 tracking-tight">AI Insurance Signup</h2>
          <p className="text-slate-400 mt-2 font-medium">
            Register once, verify fast, and unlock weekly income protection based on your city risk.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-8">
          <div className="bg-slate-900/40 p-6 rounded-[24px] border border-slate-700/50">
            <h4 className="text-sm font-black text-slate-200 uppercase tracking-widest mb-4 flex items-center gap-2">
              <User size={16} className="text-blue-400" /> Signup Details
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Full Name" icon={<User size={16} />} name="name" value={formData.name} onChange={handleChange} placeholder="Aman Verma" />
              <Field label="Phone Number" icon={<Smartphone size={16} />} name="phone" value={formData.phone} onChange={handleChange} placeholder="9876543210" />
              <Field label="PAN Card" icon={<WalletCards size={16} />} name="pan_card" value={formData.pan_card} onChange={handleChange} placeholder="ABCDE1234F" />
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">City</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><MapPin size={16} /></div>
                  <select
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:border-blue-500 outline-none transition-all font-bold text-slate-200 cursor-pointer appearance-none"
                  >
                    <option value="" disabled>Select your city</option>
                    {SUPPORTED_CITIES.map((city) => (
                      <option key={city} value={city} className="bg-slate-900 text-slate-200">{city}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Field label="Vehicle Number" icon={<Truck size={16} />} name="vehicle_number" value={formData.vehicle_number} onChange={handleChange} placeholder="UP16 AB 1234" />
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Delivery Partner</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><Briefcase size={16} /></div>
                  <select
                    required
                    name="partner_platform"
                    value={formData.partner_platform}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:border-blue-500 outline-none transition-all font-bold text-slate-200 cursor-pointer appearance-none"
                  >
                    <option value="" disabled>Select partner</option>
                    {['Swiggy', 'Zomato', 'Amazon', 'Flipkart', 'Zepto', 'Other'].map((p) => (
                      <option key={p} value={p} className="bg-slate-900 text-slate-200">{p}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-[24px] border border-slate-700/50">
            <h4 className="text-sm font-black text-slate-200 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Smartphone size={16} className="text-emerald-400" /> OTP Simulation
            </h4>
            <div className="grid md:grid-cols-[1fr_auto] gap-4 items-end">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Enter OTP</label>
                <input
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  disabled={step !== 'otp'}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:border-blue-500 outline-none transition-all font-bold text-slate-200 placeholder:text-slate-600 disabled:opacity-60"
                />
              </div>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={!canSendOtp}
                className="px-5 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-black uppercase tracking-wider text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send OTP
              </button>
            </div>
            <p className="text-xs text-slate-500 font-bold mt-3 uppercase tracking-wider">
              This demo uses OTP {generatedOtp} for quick simulation.
            </p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || step !== 'otp'}
            className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black text-lg hover:bg-blue-500 hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                Complete Signup
                <ArrowRight size={22} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-400 font-bold text-sm">
            Already have an account?{' '}
            <button onClick={onNavigateToSignIn} className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4">
              Sign in here
            </button>
          </p>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-700/50 flex items-center justify-center gap-2 text-slate-400">
          <CheckCircle2 size={16} className="text-emerald-500" />
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Fast mock KYC handshake for demo onboarding</p>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, icon, name, value, onChange, placeholder }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{icon}</div>
      <input
        required
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:border-blue-500 outline-none transition-all font-bold text-slate-200 placeholder:text-slate-600"
      />
    </div>
  </div>
);

export default SignUp;