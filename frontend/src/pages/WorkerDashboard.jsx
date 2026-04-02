import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, Wallet, TrendingUp, Clock, MapPin, 
  Bell, Settings, LogOut, CloudRain, Zap, 
  ChevronRight, Activity, AlertTriangle, LayoutDashboard,
  ShieldAlert, History
} from 'lucide-react';

import PolicyTiers from './PolicyTiers';
import PayoutHistory from './PayoutHistory';
import SettingsPage from './Settings';
import NotificationsPage from './Notifications';

const WorkerDashboard = ({ user, isDisrupted, rainLevel, activeTab, setActiveTab, onLogout }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotificationsMenu(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-transparent flex">
      
      {/* --- SIDEBAR (Desktop) --- */}
      <aside className="hidden lg:flex w-72 bg-[#0B1222] flex-col p-6 sticky top-0 h-screen border-r border-slate-700/50">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <ShieldCheck className="text-slate-100" size={24} />
          </div>
          <span className="text-xl font-black text-slate-100 tracking-tighter uppercase">AegisAI</span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem icon={<LayoutDashboard size={20}/>} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <SidebarItem icon={<ShieldAlert size={20}/>} label="Policy Tiers" active={activeTab === 'policy'} onClick={() => setActiveTab('policy')} />
          <SidebarItem icon={<History size={20}/>} label="Payout History" active={activeTab === 'payouts'} onClick={() => setActiveTab('payouts')} />
          <SidebarItem icon={<Bell size={20}/>} label="Notifications" badge="3" active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
          <SidebarItem icon={<Wallet size={20}/>} label="Earnings" active={activeTab === 'earnings'} onClick={() => setActiveTab('earnings')} />
          <SidebarItem icon={<Settings size={20}/>} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <button 
          onClick={onLogout}
          className="mt-auto flex items-center gap-3 px-4 py-4 text-slate-500 font-bold hover:text-slate-100 transition-colors border-t border-slate-700/50"
        >
          <LogOut size={20} /> Sign Out
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col">
        
        {/* Top Navbar */}
        <header className="h-20 bg-[#0B1222]/80 backdrop-blur-md border-b border-slate-700/50 px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
             <h2 className="text-xl font-black text-slate-100">Welcome, {user.name}</h2>
             <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.1)]">Active Partner</span>
          </div>
          <div className="flex items-center gap-6">
             
             {/* Notifications Dropdown */}
             <div className="relative" ref={notificationsRef}>
                 <div 
                    onClick={() => setShowNotificationsMenu(!showNotificationsMenu)}
                    className="relative cursor-pointer p-2 hover:bg-slate-800/50 rounded-full transition-colors"
                 >
                    <Bell className="text-slate-400 hover:text-slate-100 transition-colors" />
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-[#0B1222] text-[10px] text-white flex items-center justify-center font-bold">3</span>
                 </div>

                 {showNotificationsMenu && (
                   <div className="absolute right-0 mt-3 w-80 bg-slate-800/90 backdrop-blur-md rounded-[24px] shadow-2xl shadow-black/40 border border-slate-700/50 p-4 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
                      <div className="flex justify-between items-center mb-4 px-2">
                         <h4 className="font-black text-slate-100">Notifications</h4>
                         <span className="text-xs font-bold text-blue-400 cursor-pointer hover:underline" onClick={() => setShowNotificationsMenu(false)}>Mark all read</span>
                      </div>
                      <div className="space-y-2 mb-4">
                         <div className="flex gap-3 items-start p-2 rounded-xl hover:bg-slate-700/30 transition-colors cursor-pointer border border-transparent hover:border-slate-700/50">
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/20">
                               <CloudRain size={14}/>
                            </div>
                            <div>
                               <p className="text-sm font-bold text-slate-200">Heavy Rain Expected</p>
                               <p className="text-[11px] font-medium text-slate-400 mt-0.5 line-clamp-1">Monsoon level rain detected...</p>
                            </div>
                         </div>
                         <div className="flex gap-3 items-start p-2 rounded-xl hover:bg-slate-700/30 transition-colors cursor-pointer border border-transparent hover:border-slate-700/50">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20">
                               <Zap size={14}/>
                            </div>
                            <div>
                               <p className="text-sm font-bold text-slate-200">Payout Dispatched</p>
                               <p className="text-[11px] font-medium text-slate-400 mt-0.5 line-clamp-1">₹450 credited to wallet.</p>
                            </div>
                         </div>
                      </div>
                      <button 
                         onClick={() => { setActiveTab('notifications'); setShowNotificationsMenu(false); }}
                         className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold rounded-xl transition-colors border border-slate-700/50"
                      >
                         View All Notifications
                      </button>
                   </div>
                 )}
             </div>

             <div className="relative" ref={profileRef}>
                <div 
                   onClick={() => setShowProfileMenu(!showProfileMenu)}
                   className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700/50 shadow-sm overflow-hidden cursor-pointer hover:border-blue-500/50 transition-colors"
                >
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" />
                </div>
                
                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-64 bg-slate-800/90 backdrop-blur-md rounded-[24px] shadow-2xl shadow-black/40 border border-slate-700/50 p-4 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="text-center pb-4 border-b border-slate-700/50 mb-4">
                      <div className="w-16 h-16 rounded-full bg-slate-800 border-4 border-slate-700/50 shadow-sm overflow-hidden mx-auto mb-2">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" />
                      </div>
                      <h4 className="font-black text-slate-100">{user.name}</h4>
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-1 bg-emerald-500/10 border border-emerald-500/20 inline-block px-2 py-0.5 rounded-full">Active Partner</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-2">{user.zone}</p>
                    </div>
                    <div className="space-y-1">
                      <button 
                         onClick={() => { setActiveTab('settings'); setShowProfileMenu(false); }}
                         className="w-full text-left px-4 py-3 text-sm font-bold text-slate-300 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-colors"
                      >
                         Account Settings
                      </button>
                      <button 
                         onClick={onLogout}
                         className="w-full text-left px-4 py-3 text-sm font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                      >
                         Sign Out
                      </button>
                    </div>
                  </div>
                )}
             </div>
          </div>
        </header>

        <main className="p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {activeTab === 'overview' && (
            <>
          {/* 1. DISRUPTION BANNER */}
          <div className={`relative overflow-hidden rounded-[40px] p-10 transition-all duration-700 border backdrop-blur-md shadow-2xl shadow-black/20 ${
            isDisrupted 
            ? 'bg-gradient-to-br from-rose-900/40 to-slate-900 border-rose-500/30' 
            : 'bg-slate-800/40 border-slate-700/50'
          }`}>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05] mix-blend-overlay"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
               <div className="text-center md:text-left">
                  <p className={`font-bold uppercase tracking-[0.2em] text-xs mb-2 ${isDisrupted ? 'text-rose-400' : 'text-blue-400'}`}>Global Risk Intelligence</p>
                  <h3 className="text-4xl md:text-5xl font-black mb-4 leading-tight text-slate-100 drop-shadow-md">
                    {isDisrupted ? "Automatic Claim \nProcessing..." : "Real-time Income \nProtection Active"}
                  </h3>
                  <div className="flex gap-4 justify-center md:justify-start">
                     <div className={`backdrop-blur-md px-4 py-2 rounded-xl border ${isDisrupted ? 'bg-rose-500/10 border-rose-500/20' : 'bg-slate-800/50 border-slate-700/50'}`}>
                        <p className="text-[10px] font-bold opacity-80 uppercase text-slate-400">Rain Intensity</p>
                        <p className={`text-xl font-black ${isDisrupted ? 'text-rose-400' : 'text-blue-400'}`}>{rainLevel} mm/hr</p>
                     </div>
                     <div className={`backdrop-blur-md px-4 py-2 rounded-xl border ${isDisrupted ? 'bg-rose-500/10 border-rose-500/20' : 'bg-slate-800/50 border-slate-700/50'}`}>
                        <p className="text-[10px] font-bold opacity-80 uppercase text-slate-400">Current Zone</p>
                        <p className={`text-xl font-black ${isDisrupted ? 'text-rose-400' : 'text-blue-400'}`}>{user.zone.split('-')[1]}</p>
                     </div>
                  </div>
               </div>
               <div className="relative">
                  <div className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-1000 border ${
                    isDisrupted 
                    ? 'bg-rose-500/10 border-rose-500/30 animate-pulse shadow-[0_0_40px_rgba(225,29,72,0.3)]' 
                    : 'bg-blue-500/5 border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]'
                  }`}>
                    {isDisrupted 
                      ? <Zap className="text-rose-500 drop-shadow-[0_0_10px_rgba(225,29,72,0.5)]" size={64} fill="currentColor" /> 
                      : <ShieldCheck className="text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]" size={64} />
                    }
                  </div>
               </div>
            </div>
            {/* Background pattern */}
            <div className={`absolute top-0 right-0 opacity-[0.03] translate-x-1/4 -translate-y-1/4 ${isDisrupted ? 'text-rose-500' : 'text-slate-100'}`}>
               <Activity size={400} />
            </div>
          </div>

          {/* 2. STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <DashStat icon={<Wallet/>} iconColor="text-blue-400" label="Total Balance" value={`₹${user.balance}`} trend="+12%" />
            <DashStat icon={<TrendingUp/>} iconColor="text-emerald-400" label="Today's Earned" value="₹740" trend="+4%" />
            <DashStat icon={<Clock/>} iconColor="text-amber-400" label="Online Hours" value="08:42" />
            <DashStat icon={<AlertTriangle/>} iconColor={isDisrupted ? "text-rose-500" : "text-blue-400"} label="Risk Score" value={isDisrupted ? "9.2/10" : "1.4/10"} />
          </div>

          {/* 3. LOWER CONTENT GRID */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Live Data Feed */}
            <div className="lg:col-span-2 space-y-6">
               <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 shadow-2xl shadow-black/20 rounded-[32px] p-8 overflow-hidden relative">
                  <div className="flex justify-between items-center mb-8">
                     <h4 className="font-black text-slate-100 uppercase tracking-widest text-sm">Zone 62 Mobility Heatmap</h4>
                     <div className="flex gap-2 items-center">
                        <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>
                        <span className="text-xs font-bold text-slate-400 uppercase">Live Sensor Feed</span>
                     </div>
                  </div>
                  {/* Mock Map UI */}
                  <div className="h-64 bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-700/50 flex items-center justify-center flex-col relative overflow-hidden group">
                     {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/5 to-transparent"></div> */}
                     <MapPin size={48} className="text-slate-600 group-hover:scale-110 group-hover:text-blue-400 transition-all z-10" />
                     <p className="text-slate-400 font-bold mt-4 z-10 transition-colors group-hover:text-slate-300">Initializing Geospatial Engine...</p>
                     {isDisrupted && (
                        <div className="absolute inset-0 bg-rose-900/10 backdrop-blur-[2px] flex items-center justify-center overflow-hidden">
                           <div className="grid grid-cols-8 gap-10">
                              {[...Array(32)].map((_, i) => <CloudRain key={i} className="text-rose-500/20 animate-bounce" style={{animationDelay: `${i*0.2}s`}} />)}
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* Recent Payouts List */}
            <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 shadow-2xl shadow-black/20 rounded-[32px] p-8 flex flex-col h-full">
               <h4 className="font-black text-slate-100 uppercase tracking-widest text-sm mb-8">System Ledger</h4>
               <div className="space-y-8 flex-1">
                  <LedgerItem label="Heavy Rain Comp." date="Today, 2:40 PM" amount="+₹450" status="AUTO-PAID" type="payout" />
                  <LedgerItem label="Delivery #9021" date="Today, 1:15 PM" amount="+₹120" status="COMPLETED" type="earning" />
                  <LedgerItem label="Weekly Premium" date="Yesterday" amount="-₹25" status="SETTLED" type="premium" />
               </div>
               <button className="w-full py-4 bg-slate-800 text-slate-300 border border-slate-700 font-bold rounded-2xl mt-8 hover:bg-slate-700/80 hover:text-slate-100 flex items-center justify-center gap-2 transition-colors">
                  View All Transactions <ChevronRight size={18}/>
               </button>
            </div>
          </div>
            </>
          )}

          {activeTab === 'policy' && <PolicyTiers />}

          {activeTab === 'payouts' && <PayoutHistory />}

          {activeTab === 'notifications' && <NotificationsPage />}

          {activeTab === 'settings' && <SettingsPage user={user} />}

        </main>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const SidebarItem = ({ icon, label, active = false, onClick, badge }) => (
  <div onClick={onClick} className={`flex items-center justify-between px-4 py-3.5 rounded-xl cursor-pointer transition-all ${
    active ? 'bg-slate-800/50 text-blue-400 border-r-4 border-blue-500 font-bold' : 'text-slate-400 hover:bg-slate-800/30 hover:text-slate-200 border-r-4 border-transparent'
  }`}>
    <div className="flex items-center gap-4">
      <div>{icon}</div>
      <span className="text-sm tracking-wide">{label}</span>
    </div>
    {badge && (
      <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{badge}</span>
    )}
  </div>
);

const DashStat = ({ icon, iconColor, label, value, trend }) => (
  <div className="bg-slate-800/40 backdrop-blur-md p-6 rounded-[28px] border border-slate-700/50 shadow-2xl shadow-black/20 hover:border-slate-600 transition-all duration-300">
     <div className={`w-12 h-12 bg-slate-800 border border-slate-700/50 rounded-xl flex items-center justify-center mb-4 ${iconColor}`}>{icon}</div>
     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
     <div className="flex items-end justify-between mt-1">
        <h4 className="text-2xl font-black text-slate-100">{value}</h4>
        {trend && <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg">{trend}</span>}
     </div>
  </div>
);

const LedgerItem = ({ label, date, amount, status, type }) => (
  <div className="flex justify-between items-start group cursor-pointer">
     <div className="flex gap-4 items-center">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
          type === 'payout' 
            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
            : 'bg-slate-800 text-slate-400 border-slate-700'
        }`}>
           {type === 'payout' ? <Zap size={18}/> : <Activity size={18}/>}
        </div>
        <div>
           <p className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{label}</p>
           <p className="text-[10px] font-bold text-slate-400 mt-0.5">{date}</p>
        </div>
     </div>
     <div className="text-right">
        <p className={`text-sm font-black ${amount.startsWith('+') ? 'text-emerald-400' : 'text-slate-200'}`}>{amount}</p>
        <p className="text-[9px] font-black text-slate-500 tracking-widest mt-1">{status}</p>
     </div>
  </div>
);

export default WorkerDashboard;