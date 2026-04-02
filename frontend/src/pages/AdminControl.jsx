import React from 'react';
import { Settings, Zap, CloudRain, Wind, AlertOctagon, RefreshCcw } from 'lucide-react';

const AdminControl = ({ setRain, setDisrupted, isDisrupted }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
            <Settings size={28} />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">AegisAI Simulation Engine</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Weather Controls */}
          <div className="bg-slate-800 p-8 rounded-[32px] border border-slate-700">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CloudRain className="text-blue-400" /> Weather Triggers
            </h3>
            <div className="space-y-6">
              <button 
                onClick={() => { setRain(15); setDisrupted(true); }}
                className="w-full py-4 bg-blue-600 rounded-2xl font-bold hover:bg-blue-500 transition-all flex items-center justify-center gap-3"
              >
                Trigger Heavy Rain (15mm/hr)
              </button>
              <button 
                onClick={() => { setRain(0); setDisrupted(false); }}
                className="w-full py-4 bg-slate-700 rounded-2xl font-bold hover:bg-slate-600 transition-all flex items-center justify-center gap-3"
              >
                <RefreshCcw size={18} /> Reset to Clear Skies
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-slate-800 p-8 rounded-[32px] border border-slate-700">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Zap className="text-yellow-400" /> Live System State
            </h3>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-700 flex flex-col items-center justify-center text-center">
              <div className={`w-4 h-4 rounded-full mb-2 animate-pulse ${isDisrupted ? 'bg-red-500 shadow-[0_0_15px_red]' : 'bg-emerald-500 shadow-[0_0_15px_emerald]'}`}></div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">Engine Status</p>
              <p className="text-2xl font-black mt-1">{isDisrupted ? "DISRUPTION ACTIVE" : "MONITORING..."}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminControl;