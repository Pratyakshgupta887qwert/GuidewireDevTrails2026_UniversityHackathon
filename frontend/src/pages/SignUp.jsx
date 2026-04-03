import React, { useState } from 'react';
import { ShieldCheck, User, Phone, MapPin, CreditCard, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { apiRequest } from '../lib/api';

const SignUp = ({ onRegister, onNavigateToSignIn }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', phone: '', password: '', zone: '', upi: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await apiRequest('/api/signup', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      onRegister();
    } catch(err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6 relative overflow-hidden z-10 py-12">
      {/* Background Decorative Blurs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] opacity-80 pointer-events-none -translate-y-1/4 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] opacity-80 pointer-events-none translate-y-1/4 -translate-x-1/4"></div>

      <div className="max-w-[700px] w-full bg-slate-800/40 backdrop-blur-md rounded-[40px] shadow-2xl shadow-black/20 p-8 md:p-12 border border-slate-700/50 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border border-slate-700/50 shadow-lg shadow-black/20 group transition-transform hover:scale-105">
            <ShieldCheck className="text-blue-400 w-8 h-8 drop-shadow-md" />
          </div>
          <h2 className="text-3xl font-black text-slate-100 tracking-tight">Partner Registration</h2>
          <p className="text-slate-400 mt-2 font-medium">Join AegisAI and secure your gig income today.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-8">
          
          {/* Section 1: Personal Details */}
          <div className="bg-slate-900/40 p-6 rounded-[24px] border border-slate-700/50">
            <h4 className="text-sm font-black text-slate-200 uppercase tracking-widest mb-4 flex items-center gap-2">
              <User size={16} className="text-blue-400" /> Account Details
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                <input required name="name" value={formData.name} onChange={handleChange} type="text" placeholder="Rahul Kumar" className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:border-blue-500 outline-none transition-all font-bold text-slate-200 placeholder:text-slate-600" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Mobile Number</label>
                <div className="relative group">
                   <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><Phone size={16}/></div>
                   <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="+91 98765 43210" className="w-full pl-9 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:border-blue-500 outline-none transition-all font-bold text-slate-200 placeholder:text-slate-600" />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Secure Password</label>
                <div className="relative group">
                   <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><Lock size={16}/></div>
                   <input required name="password" value={formData.password} onChange={handleChange} type="password" placeholder="••••••••" className="w-full pl-9 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:border-blue-500 outline-none transition-all font-bold text-slate-200 placeholder:text-slate-600" />
                </div>
              </div>
            </div>
          </div>

           {/* Section 2: Work Info */}
           <div className="bg-slate-900/40 p-6 rounded-[24px] border border-slate-700/50">
            <h4 className="text-sm font-black text-slate-200 uppercase tracking-widest mb-4 flex items-center gap-2">
              <MapPin size={16} className="text-rose-400" /> Work Profile
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Primary Zone</label>
                <select required name="zone" value={formData.zone} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:border-blue-500 outline-none transition-all font-bold text-slate-200 cursor-pointer appearance-none">
                  <option value="" disabled className="text-slate-500">Select Zone</option>
                  <option value="Sector 62, Noida" className="bg-slate-900 text-slate-200">Sector 62, Noida</option>
                  <option value="Connaught Place, Delhi" className="bg-slate-900 text-slate-200">Connaught Place, Delhi</option>
                  <option value="Cyber Hub, Gurgaon" className="bg-slate-900 text-slate-200">Cyber Hub, Gurgaon</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">UPI ID (For Payouts)</label>
                <div className="relative group">
                   <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><CreditCard size={16}/></div>
                   <input required name="upi" value={formData.upi} onChange={handleChange} type="text" placeholder="username@upi" className="w-full pl-9 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:border-blue-500 outline-none transition-all font-bold text-slate-200 placeholder:text-slate-600" />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black text-lg hover:bg-blue-500 hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:translate-y-0 mt-8"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                Complete Registration
                <ArrowRight size={22} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
            <p className="text-slate-400 font-bold text-sm">
               Already have an account? {' '}
               <button onClick={onNavigateToSignIn} className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4">Sign in here</button>
            </p>
        </div>

        {/* Footer info */}
        <div className="mt-10 pt-8 border-t border-slate-700/50 flex items-center justify-center gap-2 text-slate-400">
          <CheckCircle2 size={16} className="text-emerald-500" />
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">End-to-End Encrypted Handshake</p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
