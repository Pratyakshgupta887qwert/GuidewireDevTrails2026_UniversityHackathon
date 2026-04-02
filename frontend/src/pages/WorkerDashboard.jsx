import React, { useState } from 'react';
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
  return (
    <div className="min-h-screen bg-[#F0F2F5] flex">
      
      {/* --- SIDEBAR (Desktop) --- */}
      <aside className="hidden lg:flex w-72 bg-slate-900 flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <span className="text-xl font-black text-white tracking-tighter uppercase">AegisAI</span>
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
          className="mt-auto flex items-center gap-3 px-4 py-4 text-slate-400 font-bold hover:text-white transition-colors border-t border-slate-800"
        >
          <LogOut size={20} /> Sign Out
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col">
        
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
             <h2 className="text-xl font-black text-slate-800">Welcome, {user.name}</h2>
             <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Active Partner</span>
          </div>
          <div className="flex items-center gap-6">
             
             {/* Notifications Dropdown */}
             <div className="relative">
                 <div 
                    onClick={() => setShowNotificationsMenu(!showNotificationsMenu)}
                    className="relative cursor-pointer p-2 hover:bg-slate-50 rounded-full transition-colors"
                 >
                    <Bell className="text-slate-400" />
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[10px] text-white flex items-center justify-center font-bold">3</span>
                 </div>

                 {showNotificationsMenu && (
                   <div className="absolute right-0 mt-3 w-80 bg-white rounded-[24px] shadow-2xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
                      <div className="flex justify-between items-center mb-4 px-2">
                         <h4 className="font-black text-slate-900">Notifications</h4>
                         <span className="text-xs font-bold text-blue-600 cursor-pointer hover:underline" onClick={() => setShowNotificationsMenu(false)}>Mark all read</span>
                      </div>
                      <div className="space-y-2 mb-4">
                         <div className="flex gap-3 items-start p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                               <CloudRain size={14}/>
                            </div>
                            <div>
                               <p className="text-sm font-bold text-slate-800">Heavy Rain Expected</p>
                               <p className="text-[11px] font-medium text-slate-500 mt-0.5 line-clamp-1">Monsoon level rain detected...</p>
                            </div>
                         </div>
                         <div className="flex gap-3 items-start p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                               <Zap size={14}/>
                            </div>
                            <div>
                               <p className="text-sm font-bold text-slate-800">Payout Dispatched</p>
                               <p className="text-[11px] font-medium text-slate-500 mt-0.5 line-clamp-1">₹450 credited to wallet.</p>
                            </div>
                         </div>
                      </div>
                      <button 
                         onClick={() => { setActiveTab('notifications'); setShowNotificationsMenu(false); }}
                         className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-bold rounded-xl transition-colors"
                      >
                         View All Notifications
                      </button>
                   </div>
                 )}
             </div>

             <div className="relative">
                <div 
                   onClick={() => setShowProfileMenu(!showProfileMenu)}
                   className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden cursor-pointer"
                >
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" />
                </div>
                
                {/* Profile Overview Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-[24px] shadow-2xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="text-center pb-4 border-b border-slate-100 mb-4">
                      <div className="w-16 h-16 rounded-full bg-slate-200 border-4 border-white shadow-sm overflow-hidden mx-auto mb-2">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" />
                      </div>
                      <h4 className="font-black text-slate-900">{user.name}</h4>
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1 bg-emerald-50 inline-block px-2 py-0.5 rounded-full">Active Partner</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-2">{user.zone}</p>
                    </div>
                    <div className="space-y-1">
                      <button 
                         onClick={() => { setActiveTab('settings'); setShowProfileMenu(false); }}
                         className="w-full text-left px-4 py-3 text-sm font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      >
                         Account Settings
                      </button>
                      <button 
                         onClick={onLogout}
                         className="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
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
          <div className={`relative overflow-hidden rounded-[40px] p-10 text-white transition-all duration-700 shadow-2xl ${
            isDisrupted ? 'bg-gradient-to-br from-red-600 via-orange-500 to-red-600' : 'bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700'
          }`}>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
               <div className="text-center md:text-left">
                  <p className="text-white/70 font-bold uppercase tracking-[0.2em] text-xs mb-2">Global Risk Intelligence</p>
                  <h3 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                    {isDisrupted ? "Automatic Claim \nProcessing..." : "Real-time Income \nProtection Active"}
                  </h3>
                  <div className="flex gap-4 justify-center md:justify-start">
                     <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                        <p className="text-[10px] font-bold opacity-60 uppercase">Rain Intensity</p>
                        <p className="text-xl font-black">{rainLevel} mm/hr</p>
                     </div>
                     <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                        <p className="text-[10px] font-bold opacity-60 uppercase">Current Zone</p>
                        <p className="text-xl font-black">{user.zone.split('-')[1]}</p>
                     </div>
                  </div>
               </div>
               <div className="relative">
                  <div className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-1000 ${
                    isDisrupted ? 'bg-white shadow-[0_0_50px_rgba(255,255,255,0.4)] animate-pulse' : 'bg-blue-400/30'
                  }`}>
                    {isDisrupted ? <Zap className="text-orange-500" size={64} fill="currentColor" /> : <ShieldCheck size={64} />}
                  </div>
               </div>
            </div>
            {/* Background pattern */}
            <div className="absolute top-0 right-0 opacity-10 translate-x-1/4 -translate-y-1/4">
               <Activity size={400} />
            </div>
          </div>

          {/* 2. STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <DashStat icon={<Wallet className="text-blue-600"/>} label="Total Balance" value={`₹${user.balance}`} trend="+12%" />
            <DashStat icon={<TrendingUp className="text-emerald-600"/>} label="Today's Earned" value="₹740" trend="+4%" />
            <DashStat icon={<Clock className="text-orange-600"/>} label="Online Hours" value="08:42" />
            <DashStat icon={<AlertTriangle className="text-red-500"/>} label="Risk Score" value={isDisrupted ? "9.2/10" : "1.4/10"} />
          </div>

          {/* 3. LOWER CONTENT GRID */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Live Data Feed */}
            <div className="lg:col-span-2 space-y-6">
               <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm overflow-hidden relative">
                  <div className="flex justify-between items-center mb-8">
                     <h4 className="font-black text-slate-800 uppercase tracking-widest text-sm">Zone 62 Mobility Heatmap</h4>
                     <div className="flex gap-2">
                        <span className="w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                        <span className="text-xs font-bold text-slate-400 uppercase">Live Sensor Feed</span>
                     </div>
                  </div>
                  {/* Mock Map UI */}
                  <div className="h-64 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center flex-col relative overflow-hidden group">
                     <MapPin size={48} className="text-slate-300 group-hover:scale-110 transition-transform" />
                     <p className="text-slate-400 font-bold mt-4">Initializing PostGIS Geospatial Engine...</p>
                     {isDisrupted && (
                        <div className="absolute inset-0 bg-blue-600/5 backdrop-blur-[2px] flex items-center justify-center overflow-hidden">
                           <div className="grid grid-cols-8 gap-10">
                              {[...Array(32)].map((_, i) => <CloudRain key={i} className="text-blue-400/40 animate-bounce" style={{animationDelay: `${i*0.2}s`}} />)}
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* Recent Payouts List */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm flex flex-col h-full">
               <h4 className="font-black text-slate-800 uppercase tracking-widest text-sm mb-8">System Ledger</h4>
               <div className="space-y-8 flex-1">
                  <LedgerItem label="Heavy Rain Comp." date="Today, 2:40 PM" amount="+₹450" status="AUTO-PAID" type="payout" />
                  <LedgerItem label="Delivery #9021" date="Today, 1:15 PM" amount="+₹120" status="COMPLETED" type="earning" />
                  <LedgerItem label="Weekly Premium" date="Yesterday" amount="-₹25" status="SETTLED" type="premium" />
               </div>
               <button className="w-full py-4 bg-slate-50 text-slate-600 font-bold rounded-2xl mt-8 hover:bg-slate-100 flex items-center justify-center gap-2">
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
  <div onClick={onClick} className={`flex items-center justify-between px-4 py-3.5 rounded-2xl cursor-pointer transition-all ${
    active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
  }`}>
    <div className="flex items-center gap-4">
      {icon}
      <span className="font-bold text-sm">{label}</span>
    </div>
    {badge && (
      <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">{badge}</span>
    )}
  </div>
);

const DashStat = ({ icon, label, value, trend }) => (
  <div className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
     <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">{icon}</div>
     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
     <div className="flex items-end justify-between mt-1">
        <h4 className="text-2xl font-black text-slate-900">{value}</h4>
        {trend && <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{trend}</span>}
     </div>
  </div>
);

const LedgerItem = ({ label, date, amount, status, type }) => (
  <div className="flex justify-between items-start group cursor-pointer">
     <div className="flex gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          type === 'payout' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'
        }`}>
           {type === 'payout' ? <Zap size={18}/> : <Activity size={18}/>}
        </div>
        <div>
           <p className="text-sm font-black text-slate-800">{label}</p>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{date}</p>
        </div>
     </div>
     <div className="text-right">
        <p className={`text-sm font-black ${amount.startsWith('+') ? 'text-emerald-600' : 'text-slate-800'}`}>{amount}</p>
        <p className="text-[9px] font-black text-slate-300 tracking-widest">{status}</p>
     </div>
  </div>
);

export default WorkerDashboard;