import React, { useEffect, useState } from 'react';
import { 
  Shield, 
  Zap, 
  ArrowRight, 
  ChevronRight, 
  Activity, 
  BarChart3, 
  CheckCircle2, 
  Globe,
  MapPin
} from 'lucide-react';

const LandingPage = ({ onStart }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans selection:bg-blue-500/30 selection:text-white overflow-x-hidden">
      
      {/* --- 1. PREMIUM NAVIGATION --- */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 border-slate-700/50 ${scrolled ? 'bg-[#0F172A]/80 backdrop-blur-xl border-b' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <Shield className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-widest text-white uppercase">AEGIS<span className="text-blue-500">AI</span></span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
            <a href="#how" onClick={(e) => scrollTo(e, 'how')} className="hover:text-blue-400 transition-colors">Technology</a>
            <a href="#risk" onClick={(e) => scrollTo(e, 'risk')} className="hover:text-amber-400 transition-colors">Risk Engine</a>
            <a href="#coverage" onClick={(e) => scrollTo(e, 'coverage')} className="hover:text-emerald-400 transition-colors">Coverage</a>
          </div>

          <button 
            onClick={onStart}
            className="group relative px-6 py-2.5 bg-white text-[#0A0B10] rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">Launch App <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></span>
          </button>
        </div>
      </nav>

      {/* --- 2. HERO SECTION --- */}
      <section className="pt-48 pb-32 px-6 relative flex flex-col items-center justify-center min-h-[90vh]">
        {/* Abstract Dark Mode Glow Elements */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-blue-300 text-[10px] font-black uppercase tracking-widest mb-10 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping relative"><span className="absolute inset-0 bg-blue-400 rounded-full"></span></div>
            Next-Gen Gig Economy Protection
          </div>
          
          <h1 className="text-6xl md:text-[8rem] font-black leading-[0.85] tracking-tighter mb-10 text-white">
            Income that <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 drop-shadow-sm">
              Never Stops.
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-slate-400 font-medium leading-relaxed mb-14">
            Parametric insurance powered by AI. When severe weather hits, our smart contract triggers extreme-instant payouts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={onStart}
              className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-black text-base uppercase tracking-widest hover:shadow-[0_0_40px_rgba(79,70,229,0.4)] transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              Start Earning Safely
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* --- 3. THE RISK ENGINE (BENTO GRID) --- */}
      <section id="risk" className="py-32 px-6 max-w-7xl mx-auto relative scroll-mt-24">
        <div className="absolute left-[-20%] top-[40%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] -z-10"></div>
        <h2 className="text-xs font-black text-amber-500 uppercase tracking-[0.25em] mb-4 text-center">Core Technology</h2>
        <h3 className="text-4xl md:text-6xl font-black text-white text-center mb-16 tracking-tighter">The Live Risk Engine.</h3>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:auto-rows-[340px]">
          
          {/* Big Feature: The Risk Engine */}
          <div className="md:col-span-8 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-[40px] p-12 relative overflow-hidden group hover:border-slate-600 transition-all hover:-translate-y-2 shadow-2xl shadow-black/20">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center mb-10 border border-slate-700 backdrop-blur-md">
                  <Activity className="text-blue-400" size={32} />
                </div>
                <h4 className="text-4xl md:text-5xl font-black text-slate-100 mb-6 leading-none tracking-tighter">Hyper-Local <br/>Intelligence</h4>
                <p className="text-slate-400 text-lg max-w-sm leading-relaxed">
                  Ingesting massive API streams from OpenWeather and live geospatial sensors to detect danger in a 500m radius.
                </p>
              </div>
            </div>
            {/* Visual Decoration */}
            <div className="absolute right-[-10%] bottom-[-20%] w-[500px] h-[500px] bg-gradient-to-t from-blue-600/20 to-transparent rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700 pointer-events-none"></div>
            <div className="absolute right-10 bottom-10 opacity-20 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none text-blue-500">
               <Globe size={280} strokeWidth={0.5} />
            </div>
          </div>

          {/* Small Feature: Automated */}
          <div className="md:col-span-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[40px] p-12 text-white flex flex-col justify-between group relative overflow-hidden hover:-translate-y-2 transition-transform hover:shadow-[0_20px_40px_rgba(16,185,129,0.3)]">
            <div className="absolute right-0 top-0 w-40 h-40 bg-white/20 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center border border-white/30 backdrop-blur-md mb-8 shadow-inner">
              <Zap className="text-white fill-white" size={32} />
            </div>
            <div>
              <h4 className="text-4xl font-black mb-4 text-white tracking-tighter leading-none">Instant <br/>Payouts</h4>
              <p className="text-emerald-50 font-bold opacity-90 leading-relaxed text-sm">Smart contracts bypass human verification, processing claims in 2 minutes.</p>
            </div>
          </div>

          {/* Bottom Row Features */}
          <div className="md:col-span-4 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 shadow-2xl shadow-black/20 rounded-[40px] p-12 hover:-translate-y-2 transition-all hover:border-slate-600 flex flex-col justify-between">
             <div>
               <div className="w-14 h-14 bg-slate-800 text-amber-400 rounded-xl border border-slate-700 flex items-center justify-center mb-8">
                 <BarChart3 size={28} />
               </div>
               <h4 className="text-2xl font-black text-slate-100 mb-3 tracking-tighter">Dynamic Pricing</h4>
               <p className="text-slate-400 text-sm leading-relaxed">Risk premiums automatically adjust in real-time based on your zone's immediate historical safety score.</p>
             </div>
          </div>

          {/* Testimonial Feature */}
          <div className="md:col-span-8 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 shadow-2xl shadow-black/20 rounded-[40px] p-12 flex flex-col justify-center relative overflow-hidden hover:border-slate-600 transition-colors">
             <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-indigo-500/10 to-transparent pointer-events-none"></div>
             <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
               <div className="max-w-md">
                  <h4 className="text-2xl md:text-3xl font-black text-slate-100 italic leading-snug">"AEGIS completely changed the game for me during the monsoon."</h4>
                  <p className="text-indigo-400 mt-6 font-black uppercase tracking-widest text-[10px]">Rahul S. / Verified Partner</p>
               </div>
               <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <img key={i} className="w-16 h-16 rounded-full border-4 border-[#0F172A] shadow-lg grayscale group-hover:grayscale-0 transition-all hover:z-10 hover:scale-110" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="user" />
                  ))}
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-black border-4 border-[#0F172A] shadow-lg z-0">
                    +8k
                  </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- 4. COVERAGE PLANS --- */}
      <section id="coverage" className="py-32 px-6 bg-white/[0.02] border-y border-white/5 scroll-mt-24">
        <div className="max-w-7xl mx-auto mb-20 text-center">
          <h2 className="text-xs font-black text-emerald-500 uppercase tracking-[0.25em] mb-4">Adaptive Coverage</h2>
          <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Choose Your Shield.</h3>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <CoverageCard 
             title="Basic Shield"
             price="₹15"
             desc="Baseline protection for light weather disruptions."
             features={["Rain Detection (>10mm)", "Map Fallback Integration", "24/7 AI Support"]}
          />
          <CoverageCard 
             title="Gold Standard"
             price="₹25"
             desc="Comprehensive shield with immediate priority."
             features={["Extreme Rain (>5mm)", "AQI Disruption Tracker", "Priority Claim Engine", "Traffic Delay Bonus"]}
             popular
          />
          <CoverageCard 
             title="Max Protect"
             price="₹35"
             desc="Total immunity. No revenue lost ever."
             features={["All Disruptions Covered", "Zero Wait Smart Contracts", "Unlimited Claim Caps", "Accident API Alerting"]}
          />
        </div>
      </section>

      {/* --- 5. HOW IT WORKS --- */}
      <section id="how" className="py-32 px-6 max-w-7xl mx-auto scroll-mt-24">
        <div className="text-center mb-24">
          <h2 className="text-xs font-black text-blue-500 uppercase tracking-[0.25em] mb-4">Workflow</h2>
          <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Simple 3-Step Setup.</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-[40%] left-[10%] right-[10%] h-px bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 -translate-y-1/2 z-0"></div>
          
          <StepCard 
            num="01" 
            title="Activate Shield" 
            desc="Subscribe to a micro-premium plan directly from your verified worker wallet." 
            icon={<Shield size={28} />}
          />
          <StepCard 
            num="02" 
            title="Drive Confidently" 
            desc="Connect to our GPS API wrapper. The Risk Engine scans your exact coordinates." 
            icon={<MapPin size={28} />}
          />
          <StepCard 
            num="03" 
            title="Instant Deposit" 
            desc="If a threshold is breached, compensation is vaulted to your UPI automatically." 
            icon={<Zap size={28} />}
          />
        </div>
      </section>

      {/* --- 6. CALL TO ACTION FOOTER --- */}
      <footer className="py-24 px-6 border-t border-slate-800 relative bg-[#090E17] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-[#090E17] to-[#090E17] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[48px] p-16 md:p-28 text-center text-white relative shadow-[0_0_80px_rgba(79,70,229,0.2)] border border-blue-500/50 group scroll-mt-24">
          <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent mix-blend-overlay rounded-[48px]"></div>
          <div className="relative z-10 w-full flex flex-col items-center">
            <h2 className="text-5xl md:text-[5.5rem] font-black leading-[0.9] tracking-tighter mb-12 text-white drop-shadow-lg">
               Stop letting weather <br/>dictate your pay.
            </h2>
            <button 
              onClick={onStart}
              className="bg-white text-[#05060A] px-12 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-4 shadow-2xl"
            >
              Initialize Dashboard
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-24 flex flex-col md:flex-row justify-between items-center text-slate-600 font-black text-[10px] uppercase tracking-[0.25em] relative z-10 px-6 gap-8 md:gap-0">
           <div className="flex items-center gap-3">
              <Shield size={18} className="text-blue-600" />
              <p>AEGIS AI SYSTEMS © 2026</p>
           </div>
           <div className="flex gap-10 hover:*:text-slate-300 transition-colors">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">API Protocol</a>
           </div>
        </div>
      </footer>
    </div>
  );
};

// Sub-components
const CoverageCard = ({ title, price, desc, features, popular }) => (
   <div className={`p-10 rounded-[40px] border transition-all duration-300 relative bg-[#0A0B10] hover:-translate-y-2 flex flex-col ${popular ? 'border-blue-500/50 shadow-[0_0_40px_rgba(59,130,246,0.15)] md:-translate-y-4 md:hover:-translate-y-6 z-10' : 'border-white/10 hover:border-white/20 z-0'}`}>
     {popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.25em] px-6 py-2 rounded-full shadow-lg">Most Popular</div>}
     <h4 className="text-2xl font-black text-white tracking-tighter">{title}</h4>
     <div className="mt-4 mb-6 text-white flex items-baseline gap-2">
        <span className="text-6xl font-black tracking-tighter">{price}</span>
        <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">/ week</span>
     </div>
     <p className="text-slate-400 font-medium text-sm mb-10 leading-relaxed border-b border-white/10 pb-10">{desc}</p>
     <ul className="space-y-5 flex-1">
       {features.map((f, i) => (
         <li key={i} className="flex gap-4 items-start">
            <CheckCircle2 size={20} className={popular ? "text-blue-400 shrink-0" : "text-emerald-500 shrink-0"} />
            <span className="text-sm font-bold text-slate-300">{f}</span>
         </li>
       ))}
     </ul>
   </div>
);

const StepCard = ({ num, title, desc, icon }) => (
  <div className="relative z-10 group p-12 bg-[#0A0B10] rounded-[40px] border border-white/10 hover:border-blue-500/40 transition-all hover:-translate-y-2 text-center h-full flex flex-col items-center">
    <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center text-blue-400 mb-10 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all shadow-inner">
       {icon}
    </div>
    <div className="absolute -top-4 -right-4 text-[120px] font-black text-white/[0.02] group-hover:text-white/[0.04] transition-colors pointer-events-none tracking-tighter leading-none">
      {num}
    </div>
    <h4 className="text-2xl font-black text-white mb-4 relative z-10 tracking-tighter">{title}</h4>
    <p className="text-slate-400 font-medium leading-relaxed relative z-10 text-sm max-w-[250px] mx-auto">{desc}</p>
  </div>
);

export default LandingPage;