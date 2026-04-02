import React from 'react';
import { Bell, CloudRain, Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';

const Notifications = () => {
  const notificationsList = [
    {
      id: 1,
      type: 'alert',
      icon: <CloudRain size={20} className="text-blue-500" />,
      title: "Weather Alert: Heavy Rain Expected",
      message: "Monsoon level rain detected in your vicinity. Extended shield coverage activated automatically.",
      time: "10 mins ago",
      bgColor: "bg-blue-50",
      unread: true
    },
    {
      id: 2,
      type: 'payout',
      icon: <Zap size={20} className="text-orange-500" />,
      title: "Automatic Payout Dispatched",
      message: "₹450 has been credited to your wallet for Rain Compensation.",
      time: "1 hour ago",
      bgColor: "bg-orange-50",
      unread: true
    },
    {
      id: 3,
      type: 'system',
      icon: <ShieldCheck size={20} className="text-emerald-500" />,
      title: "Policy Tier Upgraded",
      message: "You have successfully moved to the 'Gold Partner' tier. Enjoy increased baseline compensation.",
      time: "Yesterday, 3:00 PM",
      bgColor: "bg-emerald-50",
      unread: false
    },
    {
      id: 4,
      type: 'success',
      icon: <CheckCircle2 size={20} className="text-slate-500" />,
      title: "Delivery #9021 Completed",
      message: "Job completed successfully. Customer gave a 5-star rating.",
      time: "Yesterday, 1:15 PM",
      bgColor: "bg-slate-100",
      unread: false
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-800">Notifications</h2>
          <p className="text-slate-500 font-medium">Stay updated on alerts, payouts, and system messages</p>
        </div>
        <button className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors">
          Mark All as Read
        </button>
      </div>

      <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm">
        <div className="space-y-4">
          {notificationsList.map((note) => (
            <div 
              key={note.id} 
              className={`flex gap-5 p-5 rounded-2xl transition-all border ${note.unread ? 'border-blue-100 bg-blue-50/30' : 'border-transparent hover:bg-slate-50'}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${note.bgColor}`}>
                {note.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-base font-black ${note.unread ? 'text-slate-900' : 'text-slate-700'}`}>
                    {note.title}
                  </h4>
                  <span className="text-xs font-bold text-slate-400 whitespace-nowrap ml-4">{note.time}</span>
                </div>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                  {note.message}
                </p>
              </div>
              {note.unread && (
                <div className="flex items-center justify-center w-8 shrink-0">
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.5)]"></div>
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
