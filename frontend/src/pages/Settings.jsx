import React, { useState } from 'react';
import { User, Shield, CreditCard, Bell, Map, ChevronRight, ChevronDown, Camera, CheckCircle2, Save } from 'lucide-react';

const Settings = ({ user, setUser }) => {
  const [activeEditId, setActiveEditId] = useState(null);
  const [showToast, setShowToast] = useState(false);

  // States for form fields
  const [formData, setFormData] = useState({
    name: user.name || "Unknown",
    phone: user.phone || "+91 00000 00000",
    address: "B-42, Sector 62, Noida, UP", // Placeholder until DB has address
    upiId: user.upi_id || "unlinked",
    zone: user.zone || "Unassigned"
  });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/update-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: user.phone, // Needed by DB to identify user
          name: formData.name,
          zone: formData.zone,
          upi_id: formData.upiId
        })
      });
      if (response.ok) {
        const data = await response.json();
        const updatedSession = { ...user, ...data.user, balance: user.balance, isProtected: user.isProtected };
        if (setUser) setUser(updatedSession);
        localStorage.setItem('aegis_user_data', JSON.stringify(updatedSession));
        
        setActiveEditId(null);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
           <div className="bg-slate-900/90 backdrop-blur-xl text-white px-6 py-4 rounded-[20px] shadow-[0_20px_50px_rgba(16,185,129,0.2)] flex items-center gap-4 border border-emerald-500/30">
              <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                 <CheckCircle2 size={24} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(16,185,129,0.4)]">Update Successful</p>
                 <p className="text-base font-bold text-slate-200">Your settings have been saved.</p>
              </div>
           </div>
        </div>
      )}

      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-100">Account Settings</h2>
          <p className="text-slate-400 font-medium mt-1">Manage your profile and protection preferences</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 relative items-start">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6 sticky top-28">
          <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 shadow-2xl shadow-black/20 rounded-[40px] p-8 text-center transition-all duration-300">
            <div className="relative w-32 h-32 mx-auto mb-6 group cursor-pointer">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`} 
                className="rounded-full border-4 border-slate-800 shadow-lg transition-transform duration-300 group-hover:scale-110"
                alt="Profile"
              />
              <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-2xl border-4 border-slate-900 transition-all">
                <Camera size={18} />
              </button>
            </div>
            <h3 className="text-xl font-black text-slate-100">{formData.name}</h3>
            <p className="text-sm font-bold text-emerald-400 uppercase tracking-widest mt-1">Gold Partner</p>
            <div className="mt-6 pt-6 border-t border-slate-700/50 flex justify-around">
               <div>
                  <p className="text-lg font-black text-slate-100">4.9</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rating</p>
               </div>
               <div className="border-x border-slate-700/50 px-8">
                  <p className="text-lg font-black text-slate-100">2.4k</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trips</p>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Options List */}
        <div className="lg:col-span-2 space-y-4">
          <SettingsItem 
            id="personal"
            activeEditId={activeEditId}
            onToggle={() => setActiveEditId(activeEditId === 'personal' ? null : 'personal')}
            icon={<User size={20} />} 
            title="Personal Information" 
            desc="Update your name, phone number, and address" 
          >
            <form onSubmit={handleSave} className="space-y-4 mt-4 pt-4 border-t border-slate-700/50">
               <div className="grid grid-cols-2 gap-4">
                 <div className="col-span-2 md:col-span-1">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Full Name</label>
                   <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-200 focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-500" />
                 </div>
                 <div className="col-span-2 md:col-span-1">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Phone Number</label>
                   <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-200 focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-500" />
                 </div>
               </div>
               <div>
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Home Address</label>
                 <textarea name="address" value={formData.address} onChange={handleChange} rows="2" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-200 focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-500"></textarea>
               </div>
               <div className="flex justify-end pt-2">
                 <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all">
                   <Save size={18} /> Save Changes
                 </button>
               </div>
            </form>
          </SettingsItem>

          <SettingsItem 
            id="kyc"
            activeEditId={activeEditId}
            onToggle={() => setActiveEditId(activeEditId === 'kyc' ? null : 'kyc')}
            icon={<Shield size={20} />} 
            title="KYC & Documents" 
            desc="Driving License, Aadhaar, and Vehicle RC" 
            status="Verified"
          >
            <div className="mt-4 pt-4 border-t border-slate-800 p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-[20px] flex items-start gap-4 shadow-inner">
               <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 size={24} />
               </div>
               <div>
                 <p className="font-black text-emerald-400 text-lg drop-shadow-[0_0_5px_rgba(16,185,129,0.2)]">Documents Verified</p>
                 <p className="text-sm font-bold text-emerald-500/70 mt-1 leading-relaxed">Your identity and vehicle documents have been officially authenticated. To update these, please file a manual request with the support team.</p>
               </div>
            </div>
          </SettingsItem>

          <SettingsItem 
            id="payout"
            activeEditId={activeEditId}
            onToggle={() => setActiveEditId(activeEditId === 'payout' ? null : 'payout')}
            icon={<CreditCard size={20} />} 
            title="Payout Methods" 
            desc={`Primary UPI: ${formData.upiId}`}
          >
             <form onSubmit={handleSave} className="space-y-4 mt-4 pt-4 border-t border-slate-800">
               <div>
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Primary UPI ID</label>
                 <input type="text" name="upiId" value={formData.upiId} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner placeholder:text-slate-600" />
               </div>
               <div className="flex justify-end pt-2">
                 <button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 border border-blue-500/30 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                   <Save size={18} /> Update Wallet
                 </button>
               </div>
            </form>
          </SettingsItem>

          <SettingsItem 
            id="notifs"
            activeEditId={activeEditId}
            onToggle={() => setActiveEditId(activeEditId === 'notifs' ? null : 'notifs')}
            icon={<Bell size={20} />} 
            title="Notification Toggles" 
            desc="Rain alerts, Payout sounds, System updates" 
          >
             <form onSubmit={handleSave} className="space-y-4 mt-4 pt-4 border-t border-slate-800">
               <div className="grid sm:grid-cols-2 gap-3">
                 {['Push Notifications', 'Email Alerts', 'SMS Updates', 'Auto-Payout Sounds'].map((lbl, idx) => (
                    <label key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/50 hover:bg-white/5 cursor-pointer transition-colors border border-slate-800 hover:border-slate-700 shadow-inner">
                      <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900 cursor-pointer" />
                      <span className="text-sm font-black text-slate-300">{lbl}</span>
                    </label>
                 ))}
               </div>
               <div className="flex justify-end pt-4">
                 <button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 border border-blue-500/30 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                   <Save size={18} /> Save Preferences
                 </button>
               </div>
            </form>
          </SettingsItem>

          <SettingsItem 
            id="zone"
            activeEditId={activeEditId}
            onToggle={() => setActiveEditId(activeEditId === 'zone' ? null : 'zone')}
            icon={<Map size={20} />} 
            title="Operating Zone" 
            desc={`Currently assigned to: ${formData.zone}`}
            status="Locked"
          >
            <div className="space-y-4 mt-4 pt-4 border-t border-slate-800">
               <div>
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Assigned Zone</label>
                 <select disabled name="zone" value={formData.zone} className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 focus:outline-none transition-all shadow-inner appearance-none cursor-not-allowed">
                    <option value="Sector 62, Noida" className="bg-slate-900">Sector 62, Noida</option>
                    <option value="Connaught Place, Delhi" className="bg-slate-900">Connaught Place, Delhi</option>
                    <option value="Cyber Hub, Gurgaon" className="bg-slate-900">Cyber Hub, Gurgaon</option>
                    <option value="Indiranagar, Bangalore" className="bg-slate-900">Indiranagar, Bangalore</option>
                 </select>
                 <p className="text-xs mt-3 text-rose-400 font-bold">* Zone transfers represent a high-risk change and are currently locked by the administration protocol.</p>
               </div>
            </div>
          </SettingsItem>
        </div>
      </div>
    </div>
  );
};

const SettingsItem = ({ id, activeEditId, onToggle, icon, title, desc, status, children }) => {
  const isOpen = activeEditId === id;
  return (
    <div className={`bg-slate-800/40 backdrop-blur-md p-6 rounded-[32px] border transition-all duration-300 shadow-2xl shadow-black/20 ${isOpen ? 'border-blue-500 scale-[1.01] relative z-10' : 'border-slate-700/50 hover:border-slate-600 relative z-0'}`}>
      <div 
        onClick={onToggle}
        className="flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-5">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all border ${isOpen ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-400 border-slate-700 group-hover:bg-slate-700'}`}>
            {icon}
          </div>
          <div>
            <h4 className={`text-lg font-black transition-colors ${isOpen ? 'text-slate-100' : 'text-slate-200 group-hover:text-slate-100'}`}>{title}</h4>
            <p className="text-sm font-bold text-slate-400 line-clamp-1 mt-0.5">{desc}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {status && <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full">{status}</span>}
          <div className={`p-2 rounded-lg transition-transform duration-300 border ${isOpen ? 'bg-blue-500/10 border-blue-500/30 -rotate-180 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-500 group-hover:text-slate-300'}`}>
             <ChevronDown size={20} />
          </div>
        </div>
      </div>

      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'}`}>
         <div className="overflow-hidden">
            {children}
         </div>
      </div>
    </div>
  );
};

export default Settings;