import React from 'react';
import { MapPin } from 'lucide-react';

const LiveMap = ({ isDisrupted }) => (
  <div className="w-full h-full bg-slate-50 rounded-[32px] relative overflow-hidden border border-slate-100">
    {/* Grid Background */}
    <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
    
    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20">
      <MapPin size={64} className="text-slate-400 mb-2" />
      <p className="font-black uppercase tracking-widest text-xs">Vector Map Rendering...</p>
    </div>

    {/* Dynamic Overlay */}
    {isDisrupted && (
      <div className="absolute inset-0 bg-blue-500/10 animate-pulse border-4 border-blue-500/20 rounded-[32px]">
        <div className="absolute top-10 left-10 p-3 bg-white rounded-xl shadow-lg border border-red-100 flex items-center gap-2">
           <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
           <span className="text-[10px] font-black text-red-600 uppercase">Hazard: Heavy Rain</span>
        </div>
      </div>
    )}
  </div>
);

export default LiveMap;