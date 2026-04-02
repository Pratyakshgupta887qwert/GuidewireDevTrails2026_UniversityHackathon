import React, { useState } from 'react';
import { ShieldCheck, Phone, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';

const SignIn = ({ onLogin, onNavigateToSignUp }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      onLogin(data.user);
    } catch(err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6 relative overflow-hidden z-10">
      {/* Background Decorative Blurs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] opacity-80 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] opacity-80 pointer-events-none"></div>

      <div className="max-w-[480px] w-full bg-slate-800/40 backdrop-blur-md rounded-[40px] shadow-2xl shadow-black/20 p-10 md:p-12 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 relative z-10">
        {/* Logo Section */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 bg-slate-800 rounded-[24px] flex items-center justify-center mb-6 border border-slate-700/50 shadow-lg shadow-black/20 group transition-transform hover:scale-105">
            <ShieldCheck className="text-blue-400 w-10 h-10 drop-shadow-md" />
          </div>
          <h2 className="text-3xl font-black text-slate-100 tracking-tight">Secure Partner Login</h2>
          <p className="text-slate-400 mt-2 font-medium">Enter your credentials to access your protection dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Mobile Number Input */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 ml-1 uppercase tracking-wider">Mobile Number</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                <Phone size={20} />
              </div>
              <input 
                required
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98765 43210"
                className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border-2 border-slate-700 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold text-slate-200 placeholder:text-slate-600 placeholder:font-normal"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Password</label>
              <a href="#" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">Forgot?</a>
            </div>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                <Lock size={20} />
              </div>
              <input 
                required
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 bg-slate-900/50 border-2 border-slate-700 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold text-slate-200 placeholder:text-slate-600"
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
            <input type="checkbox" id="remember" className="w-5 h-5 rounded border-2 border-slate-700 bg-slate-900/50 text-blue-500 focus:ring-blue-500/50 cursor-pointer" />
            <label htmlFor="remember" className="text-sm font-bold text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">Stay protected for 30 days</label>
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
            className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black text-lg hover:bg-blue-500 hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:translate-y-0"
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

        <div className="mt-8 text-center border-b border-slate-700/50 pb-8">
            <p className="text-slate-400 font-bold text-sm">
               Don't have an account? {' '}
               <button onClick={onNavigateToSignUp} className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4">Sign up here</button>
            </p>
        </div>

        {/* Footer info */}
        <div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
          <CheckCircle2 size={16} className="text-emerald-500" />
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Bank-Grade 256-bit Encryption</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;