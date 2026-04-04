import React, { useState } from 'react';
import { Shield, Terminal, Lock, Phone, Eye, EyeOff, AlertTriangle, ChevronRight } from 'lucide-react';

import { API_BASE_URL } from '../lib/api';

const AdminLogin = ({ onAdminLogin, onBack }) => {
  const [phone,    setPhone]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');
      onAdminLogin(data.admin);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">

      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* Glow orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/6 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[440px] relative z-10">

        {/* Top badge */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-[0.3em]">Restricted Access Zone</span>
          </div>
        </div>

        {/* Main card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/60 rounded-[32px] p-10 shadow-2xl shadow-black/60">

          {/* Logo */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-[22px] flex items-center justify-center shadow-xl shadow-black/40">
                <Shield className="text-blue-400 drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]" size={38} />
              </div>
              {/* Corner indicator */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full border-2 border-[#020617] flex items-center justify-center">
                <Terminal size={10} className="text-black" />
              </div>
            </div>
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.35em] mb-1">AegisAI</p>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">Admin Command Access</h1>
            <p className="text-slate-500 text-sm font-bold mt-2 leading-relaxed">
              High-privilege terminal. Authorised personnel only.
            </p>
          </div>

          {/* Warning strip */}
          <div className="flex items-center gap-2 bg-amber-500/5 border border-amber-500/15 rounded-xl px-4 py-2.5 mb-8">
            <AlertTriangle size={14} className="text-amber-400 shrink-0" />
            <p className="text-[10px] font-bold text-amber-400/80">
              All access attempts are logged and monitored.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Admin Mobile ID</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-colors">
                  <Phone size={18} />
                </div>
                <input
                  id="admin-phone"
                  required type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Admin Mobile Number"
                  className="w-full pl-11 pr-4 py-4 bg-slate-800/60 border-2 border-slate-700/80 rounded-2xl focus:border-blue-500/60 outline-none transition-all font-bold text-slate-200 placeholder:text-slate-600 placeholder:font-normal text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Access Code</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  id="admin-password"
                  required
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full pl-11 pr-12 py-4 bg-slate-800/60 border-2 border-slate-700/80 rounded-2xl focus:border-blue-500/60 outline-none transition-all font-bold text-slate-200 placeholder:text-slate-600 text-sm"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl text-xs font-bold">
                <AlertTriangle size={14} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black text-sm tracking-wide shadow-lg shadow-blue-900/30 transition-all flex items-center justify-center gap-3 disabled:opacity-60 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Terminal size={18} /> Authenticate & Enter
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Back link */}
          <div className="mt-8 text-center">
            <button onClick={onBack}
              className="text-xs font-bold text-slate-600 hover:text-slate-400 transition-colors">
              ← Back to Worker Login
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-slate-700 font-bold mt-6 uppercase tracking-widest">
          AegisAI · Admin Control Layer · v3.0
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
