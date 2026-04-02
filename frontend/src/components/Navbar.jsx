import React from 'react';
import { Shield, Bell, User } from 'lucide-react';

const Navbar = ({ userName }) => (
  <nav className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-50">
    <div className="flex items-center gap-2">
      <Shield className="text-blue-600" size={28} />
      <span className="text-xl font-black tracking-tighter">AEGIS<span className="text-blue-600">AI</span></span>
    </div>
    <div className="flex items-center gap-5">
      <div className="bg-slate-100 p-2.5 rounded-xl text-slate-400 cursor-pointer">
        <Bell size={20} />
      </div>
      <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
        <p className="text-sm font-black text-slate-800">{userName || 'Partner'}</p>
        <div className="w-10 h-10 bg-blue-100 rounded-full border-2 border-white shadow-sm overflow-hidden">
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="user" />
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;