import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Smartphone } from 'lucide-react';
import { apiRequest } from '../lib/api';

const DEMO_OTP = '123456';

const SignIn = ({ onLogin, onNavigateToSignUp }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleSendOtp = () => {
    setError('');
    if (!phone) {
      setError('Enter your phone number first.');
      return;
    }

    setOtpSent(true);
    setInfo(`OTP sent to ${phone}. Use ${DEMO_OTP} for this simulation.`);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (otp !== DEMO_OTP) {
        throw new Error(`Invalid OTP. Use ${DEMO_OTP} for the simulation.`);
      }

      const data = await apiRequest('/api/signin', {
        method: 'POST',
        body: JSON.stringify({ phone }),
      });

      onLogin?.(data.user, phone);
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <div>
      <b>For the worker dashboard</b><br></br> you can create a new account by clicking on “Sign up here.” Once registered, simply log in to access your dashboard.<br></br>
      <b>And for Admin Dashboard </b> <br></br> you can sign in directly only with the mobile number 9998887776 and then click on SEND OTP and write otp 123456 .

    </div>
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6 relative overflow-hidden z-10">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] opacity-80 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] opacity-80 pointer-events-none"></div>

      <div className="max-w-[500px] w-full bg-slate-800/40 backdrop-blur-md rounded-[40px] shadow-2xl shadow-black/20 p-10 md:p-12 border border-slate-700/50 relative z-10">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 bg-slate-800 rounded-[24px] flex items-center justify-center mb-6 border border-slate-700/50 shadow-lg shadow-black/20">
            <ShieldCheck className="text-blue-400 w-10 h-10 drop-shadow-md" />
          </div>
          <h2 className="text-3xl font-black text-slate-100 tracking-tight">Sign In With OTP</h2>
          <p className="text-slate-400 mt-2 font-medium">
            Quick simulated login for your insurance dashboard.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 ml-1 uppercase tracking-wider">Phone Number</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Smartphone size={20} />
              </div>
              <input
                required
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="9876543210"
                className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border-2 border-slate-700 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold text-slate-200 placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 ml-1 uppercase tracking-wider">OTP</label>
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <input
                required
                type="text"
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                disabled={!otpSent}
                className="w-full px-4 py-4 bg-slate-900/50 border-2 border-slate-700 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold text-slate-200 placeholder:text-slate-600 disabled:opacity-60"
              />
              <button
                type="button"
                onClick={handleSendOtp}
                className="px-4 py-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-black uppercase tracking-wider text-xs"
              >
                Send OTP
              </button>
            </div>
          </div>

          {info && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center">
              {info}
            </div>
          )}

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !otpSent}
            className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black text-lg hover:bg-blue-500 hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
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
            Don&apos;t have an account?{' '}
            <button onClick={onNavigateToSignUp} className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4">
              Sign up here
            </button>
          </p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
          <CheckCircle2 size={16} className="text-emerald-500" />
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Demo OTP: 123456</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default SignIn;