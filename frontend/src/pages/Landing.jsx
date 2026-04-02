import React from 'react';
import { 
  Shield, 
  Zap, 
  CloudRain, 
  ArrowRight, 
  ChevronRight, 
  Activity, 
  BarChart3, 
  CheckCircle2, 
  Globe 
} from 'lucide-react';

const LandingPage = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      
      {/* --- 1. PREMIUM NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-[100] bg-white/70 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Shield className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter">AEGIS<span className="text-blue-600">AI</span></span>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-500 uppercase tracking-widest">
            <a href="#how" className="hover:text-blue-600 transition-colors">Technology</a>
            <a href="#risk" className="hover:text-blue-600 transition-colors">Risk Engine</a>
            <a href="#coverage" className="hover:text-blue-600 transition-colors">Coverage</a>
          </div>

          <button 
            onClick={onStart}
            className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-slate-200"
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* --- 2. HERO SECTION --- */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-50/50 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-widest mb-8 border border-blue-100">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            Next-Gen Gig Economy Protection
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8">
            Income that <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500">
              Never Stops.
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-slate-500 font-medium leading-relaxed mb-12">
            Parametric insurance for delivery partners. When heavy rain or extreme AQI stops your work, our AI triggers instant payouts to your wallet.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onStart}
              className="group w-full sm:w-auto px-10 py-5 bg-blue-600 text-white rounded-[24px] font-black text-xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 flex items-center justify-center gap-3"
            >
              Start Earning Safely
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-slate-100 text-slate-900 rounded-[24px] font-black text-xl hover:bg-slate-50 transition-all">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* --- 3. THE "BENTO" GRID (Information Section) --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
          
          {/* Big Feature: The Risk Engine */}
          <div className="md:col-span-8 bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/30">
                <Activity className="text-blue-400" size={32} />
              </div>
              <h2 className="text-4xl font-black mb-4">Hyper-Local <br/>Risk Intelligence</h2>
              <p className="text-slate-400 max-w-md text-lg">
                Our engine ingests API data from OpenWeather and Google Maps to detect disruption thresholds within a 500m radius of your location.
              </p>
            </div>
            {/* Visual Decoration */}
            <div className="absolute right-[-10%] bottom-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] group-hover:bg-blue-600/40 transition-all duration-700"></div>
            <div className="absolute right-10 bottom-10 opacity-20 group-hover:opacity-100 transition-opacity duration-700">
               <Globe size={200} className="text-blue-500" />
            </div>
          </div>

          {/* Small Feature: Automated */}
          <div className="md:col-span-4 bg-emerald-500 rounded-[40px] p-10 text-white flex flex-col justify-between group">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30">
              <Zap className="text-white fill-white" size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black mb-2 leading-tight text-white">Instant <br/>Payouts</h2>
              <p className="text-emerald-100 font-medium">Smart contracts process your claim in &lt; 2 minutes.</p>
            </div>
          </div>

          {/* Bottom Row Features */}
          <div className="md:col-span-4 bg-blue-50 rounded-[40px] p-10 border border-blue-100">
             <BarChart3 className="text-blue-600 mb-4" size={40} />
             <h3 className="text-2xl font-black text-slate-900">Dynamic Pricing</h3>
             <p className="text-slate-500 mt-2">Premiums adjust based on your zone's live safety score.</p>
          </div>

          <div className="md:col-span-8 bg-white border border-slate-100 rounded-[40px] p-10 flex flex-col md:flex-row items-center justify-between shadow-sm">
             <div className="max-w-xs">
                <h3 className="text-2xl font-black text-slate-900 italic">"SafeGig changed the game for me during monsoon."</h3>
                <p className="text-slate-400 mt-4 font-bold text-sm">— Rahul S., Delivery Partner</p>
             </div>
             <div className="flex -space-x-4 mt-6 md:mt-0">
                {[1,2,3,4].map(i => (
                  <img key={i} className="w-14 h-14 rounded-full border-4 border-white shadow-lg" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="user" />
                ))}
                <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold border-4 border-white shadow-lg">
                  +2k
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- 4. STEP-BY-STEP PROCESS --- */}
      <section id="how" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-black mb-4">How it works?</h2>
          <p className="text-slate-500 font-medium">Simple 3-step automation for the modern worker.</p>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <StepCard 
            num="01" 
            title="Choose a Tier" 
            desc="Select from Basic, Standard, or Extended coverage for the week." 
          />
          <StepCard 
            num="02" 
            title="Go Online" 
            desc="Work as usual. Our AI monitors rain, traffic, and AQI in the background." 
          />
          <StepCard 
            num="03" 
            title="Get Paid" 
            desc="If a disruption hits your zone, we transfer money to you automatically." 
          />
        </div>
      </section>

      {/* --- 5. CALL TO ACTION FOOTER --- */}
      <footer className="py-20 px-6">
        <div className="max-w-7xl mx-auto bg-blue-600 rounded-[48px] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-300">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-8">Ready to secure <br/>your daily wage?</h2>
            <button 
              onClick={onStart}
              className="bg-white text-blue-600 px-12 py-5 rounded-[24px] font-black text-xl hover:bg-slate-100 transition-all flex items-center gap-3 mx-auto"
            >
              Get Protected Now
              <ChevronRight />
            </button>
          </div>
          {/* Abstract circle in footer */}
          <div className="absolute top-[-50%] left-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 flex flex-col md:flex-row justify-between items-center text-slate-400 font-bold text-sm uppercase tracking-widest px-6">
           <p>© 2026 AEGIS AI SYSTEMS</p>
           <div className="flex gap-8 mt-4 md:mt-0">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">API Documentation</a>
           </div>
        </div>
      </footer>
    </div>
  );
};

const StepCard = ({ num, title, desc }) => (
  <div className="relative group p-10 bg-white rounded-[32px] shadow-sm hover:shadow-xl transition-all border border-slate-100">
    <div className="text-7xl font-black text-slate-100 absolute top-4 right-8 group-hover:text-blue-50 transition-colors tracking-tighter">
      {num}
    </div>
    <div className="relative z-10">
      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6">
         <CheckCircle2 size={24} />
      </div>
      <h3 className="text-2xl font-black mb-4">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default LandingPage;