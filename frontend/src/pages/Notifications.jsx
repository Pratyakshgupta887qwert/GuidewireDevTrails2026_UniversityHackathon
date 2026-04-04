import React from 'react';
import { Bell, CheckCircle2, CloudRain, ShieldCheck, Zap } from 'lucide-react';

const Notifications = () => {
  const notificationsList = [
    {
      id: 1,
      icon: <CloudRain size={18} className="text-blue-400" />,
      title: 'Weather risk spike detected',
      message: 'Rain intensity in your city is contributing strongly to this week’s dynamic premium multiplier.',
      time: '10 mins ago',
      accent: 'bg-blue-500/10 border-blue-500/20',
      unread: true,
    },
    {
      id: 2,
      icon: <ShieldCheck size={18} className="text-emerald-400" />,
      title: 'Aadhaar unlocks policy activation',
      message: 'Finish Aadhaar OTP verification to unlock plan selection and automated claim eligibility.',
      time: '35 mins ago',
      accent: 'bg-emerald-500/10 border-emerald-500/20',
      unread: true,
    },
    {
      id: 3,
      icon: <Zap size={18} className="text-amber-400" />,
      title: 'Heavy rain simulation ready',
      message: 'Use the floating action button to test the payout formula against your active weekly shield.',
      time: 'Today',
      accent: 'bg-amber-500/10 border-amber-500/20',
      unread: false,
    },
    {
      id: 4,
      icon: <CheckCircle2 size={18} className="text-slate-300" />,
      title: 'Profit dashboard synced',
      message: 'Premium paid, payout received, and net profit now update automatically from the claims ledger.',
      time: 'Today',
      accent: 'bg-slate-700/40 border-slate-700/50',
      unread: false,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-100">Notifications</h2>
          <p className="text-slate-400 font-medium mt-2">
            AI risk alerts, verification reminders, and payout updates for your insurance dashboard
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/50 bg-slate-900/40 px-4 py-2">
          <Bell size={16} className="text-slate-400" />
          <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Live feed</span>
        </div>
      </div>

      <div className="bg-slate-800/40 backdrop-blur-md rounded-[32px] p-8 border border-slate-700/50 shadow-2xl shadow-black/20">
        <div className="space-y-4">
          {notificationsList.map((note) => (
            <div
              key={note.id}
              className={`flex gap-5 p-5 rounded-2xl transition-all border ${note.unread ? 'border-blue-500/20 bg-blue-500/5' : 'border-slate-700/50 bg-slate-900/40'}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${note.accent}`}>
                {note.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start gap-4 mb-1">
                  <h4 className={`text-base font-black ${note.unread ? 'text-slate-100' : 'text-slate-200'}`}>
                    {note.title}
                  </h4>
                  <span className="text-xs font-bold text-slate-500 whitespace-nowrap">{note.time}</span>
                </div>
                <p className="text-sm font-medium text-slate-400 leading-relaxed">
                  {note.message}
                </p>
              </div>
              {note.unread && (
                <div className="flex items-center justify-center w-8 shrink-0">
                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
