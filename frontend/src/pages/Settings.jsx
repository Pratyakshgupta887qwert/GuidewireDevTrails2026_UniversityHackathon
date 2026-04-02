import React from 'react';
import { User, Shield, CreditCard, Bell, Map, ChevronRight, Camera } from 'lucide-react';

const Settings = ({ user }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-800">Account Settings</h2>
          <p className="text-slate-500 font-medium">Manage your profile and protection preferences</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[40px] p-8 border border-slate-200 shadow-sm text-center">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                className="rounded-full border-4 border-slate-50 shadow-lg"
                alt="Profile"
              />
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-xl border-4 border-white shadow-lg">
                <Camera size={18} />
              </button>
            </div>
            <h3 className="text-xl font-black text-slate-900">{user.name}</h3>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Gold Partner</p>
            <div className="mt-6 pt-6 border-t border-slate-50 flex justify-around">
               <div>
                  <p className="text-lg font-black text-slate-900">4.9</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Rating</p>
               </div>
               <div className="border-x border-slate-100 px-8">
                  <p className="text-lg font-black text-slate-900">2.4k</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Trips</p>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Options List */}
        <div className="lg:col-span-2 space-y-4">
          <SettingsItem 
            icon={<User size={20} />} 
            title="Personal Information" 
            desc="Update your name, phone number, and address" 
          />
          <SettingsItem 
            icon={<Shield size={20} />} 
            title="KYC & Documents" 
            desc="Driving License, Aadhaar, and Vehicle RC" 
            status="Verified"
          />
          <SettingsItem 
            icon={<CreditCard size={20} />} 
            title="Payout Methods" 
            desc="Primary UPI: rahul@upi" 
          />
          <SettingsItem 
            icon={<Bell size={20} />} 
            title="Notification Toggles" 
            desc="Rain alerts, Payout sounds, System updates" 
          />
          <SettingsItem 
            icon={<Map size={20} />} 
            title="Operating Zone" 
            desc="Currently assigned to: Sector 62, Noida" 
          />
        </div>
      </div>
    </div>
  );
};

const SettingsItem = ({ icon, title, desc, status }) => (
  <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex items-center justify-between hover:border-blue-600 transition-all cursor-pointer group">
    <div className="flex items-center gap-5">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
        {icon}
      </div>
      <div>
        <h4 className="font-black text-slate-800">{title}</h4>
        <p className="text-sm font-bold text-slate-400">{desc}</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      {status && <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">{status}</span>}
      <ChevronRight className="text-slate-300 group-hover:translate-x-1 transition-transform" />
    </div>
  </div>
);

export default Settings;