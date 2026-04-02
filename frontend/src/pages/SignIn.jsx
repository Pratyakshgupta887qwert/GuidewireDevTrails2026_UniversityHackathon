import React, { useState } from 'react';
import { ShieldCheck, Phone, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';

const SignIn = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API delay for "High-Tech" feel
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Blurs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-[120px] opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-100 rounded-full blur-[120px] opacity-50"></div>

      <div className="max-w-[480px] w-full bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 p-10 md:p-12 border border-white relative z-10">
        {/* Logo Section */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 bg-slate-900 rounded-[24px] flex items-center justify-center mb-6 shadow-xl shadow-slate-200 group transition-transform hover:scale-105">
            <ShieldCheck className="text-blue-500 w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Secure Partner Login</h2>
          <p className="text-slate-500 mt-2 font-medium">Enter your credentials to access your protection dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Mobile Number Input */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Mobile Number</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <Phone size={20} />
              </div>
              <input 
                required
                type="tel" 
                placeholder="98765 43210"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 placeholder:font-normal"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Password</label>
              <a href="#" className="text-xs font-bold text-blue-600 hover:underline">Forgot?</a>
            </div>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <Lock size={20} />
              </div>
              <input 
                required
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-3 ml-1">
            <input type="checkbox" id="remember" className="w-5 h-5 rounded-lg border-2 border-slate-200 text-blue-600 focus:ring-blue-600 cursor-pointer" />
            <label htmlFor="remember" className="text-sm font-bold text-slate-500 cursor-pointer">Stay protected for 30 days</label>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-slate-200 disabled:bg-slate-400"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                Access Dashboard
                <ArrowRight size={22} />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400">
          <CheckCircle2 size={16} className="text-emerald-500" />
          <p className="text-xs font-bold uppercase tracking-widest">Bank-Grade 256-bit Encryption</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;