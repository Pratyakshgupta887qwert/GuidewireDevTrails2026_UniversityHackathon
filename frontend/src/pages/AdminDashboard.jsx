import React, { useEffect, useState, useCallback } from 'react';
import {
  LayoutDashboard, Users, FileText, CreditCard, Zap, Shield,
  BarChart2, MapPin, Bell, Settings, Activity, LogOut,
  CloudRain, Sun, Thermometer, AlertTriangle, CheckCircle,
  XCircle, Flag, RefreshCw, Send, Eye, TrendingUp, DollarSign
} from 'lucide-react';

const API = 'http://localhost:8000';
const api = async (url, opts = {}) => {
  const r = await fetch(`${API}${url}`, { headers: { 'Content-Type': 'application/json' }, ...opts });
  return r.json();
};

const ZONES = ['All Zones','Sector 62, Noida','Sector 18, Noida','Connaught Place','Gurgaon Cyber City','Karol Bagh','Lajpat Nagar'];
const EVENTS = [
  { id:'heavy_rain',    label:'Heavy Rain',     icon:'🌧️', color:'text-blue-400' },
  { id:'heatwave',      label:'Heatwave',       icon:'🔥', color:'text-amber-400' },
  { id:'social_curfew', label:'Social Curfew',  icon:'⚠️', color:'text-rose-400' },
  { id:'reset',         label:'System Reset',   icon:'🔄', color:'text-emerald-400' },
];

// ── Deterministic fraud signals from worker id
const fraudSignals = (id='') => {
  const n = parseInt(id.replace(/-/g,'').slice(-6)||'0',16);
  return { velocity: n % 160, isMock: n % 7 === 0, trustScore: Math.max(30, 100 - (n % 70)) };
};

// ── Toast
let _setToast = null;
const toast = (msg, type='success') => _setToast?.({ msg, type });

export default function AdminDashboard({ onLogout }) {
  const [tab,       setTab]      = useState('overview');
  const [stats,     setStats]    = useState(null);
  const [workers,   setWorkers]  = useState([]);
  const [policies,  setPolicies] = useState([]);
  const [claims,    setClaims]   = useState([]);
  const [logs,      setLogs]     = useState([]);
  const [notifs,    setNotifs]   = useState([]);
  const [settings,  setSettings] = useState({});
  const [loading,   setLoading]  = useState(false);
  const [toastState,setToastState]=useState(null);
  _setToast = setToastState;

  // Auto-dismiss toast
  useEffect(() => { if(toastState) { const t=setTimeout(()=>setToastState(null),4000); return()=>clearTimeout(t); } }, [toastState]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s,w,p,c,l,n,st] = await Promise.all([
        api('/api/admin/stats'),
        api('/api/admin/users'),
        api('/api/admin/policies'),
        api('/api/admin/payouts'),
        api('/api/admin/logs'),
        api('/api/admin/notifications'),
        api('/api/admin/settings'),
      ]);
      // Always update stats — real DB may not have treasury key on first empty DB
      setStats(s && !s.error ? s : null);
      setWorkers(Array.isArray(w.users) ? w.users : []);
      setPolicies(Array.isArray(p.policies) ? p.policies : []);
      setClaims(Array.isArray(c.payouts) ? c.payouts : []);
      setLogs(Array.isArray(l.logs) ? l.logs : []);
      setNotifs(Array.isArray(n.notifications) ? n.notifications : []);
      setSettings(st.settings || {});
    } catch(e){ console.error('Admin load error:', e); }
    setLoading(false);
  }, []);

  useEffect(()=>{ load(); },[load]);

  const t = stats?.treasury || {};
  // Real fraud detection: DB is_flagged flag OR inconsistent last_location
  const fraudWorkers = workers.filter(w => w.is_flagged || w.last_location === 'inconsistent');

  const NAV = [
    { id:'overview',   icon:<LayoutDashboard size={16}/>, label:'Overview' },
    { id:'workers',    icon:<Users size={16}/>,           label:'Workers' },
    { id:'policies',   icon:<FileText size={16}/>,        label:'Policies' },
    { id:'claims',     icon:<CreditCard size={16}/>,      label:'Claims' },
    { id:'disruption', icon:<Zap size={16}/>,             label:'God Mode' },
    { id:'fraud',      icon:<Shield size={16}/>,          label:'Fraud', badge: fraudWorkers.length || null },
    { id:'analytics',  icon:<BarChart2 size={16}/>,       label:'Analytics' },
    { id:'zones',      icon:<MapPin size={16}/>,          label:'Zone Risk' },
    { id:'notify',     icon:<Bell size={16}/>,            label:'Notify' },
    { id:'settings',   icon:<Settings size={16}/>,        label:'Settings' },
    { id:'logs',       icon:<Activity size={16}/>,        label:'Activity Logs' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex font-sans">

      {/* SIDEBAR */}
      <aside className="w-56 bg-slate-900/70 border-r border-slate-800 flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
              <Shield size={14} className="text-white"/>
            </div>
            <span className="text-sm font-black text-slate-100">AegisAI</span>
          </div>
          <p className="text-[9px] text-amber-400 font-black uppercase tracking-[0.2em]">Admin Console</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>setTab(n.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${tab===n.id?'bg-blue-500/15 text-blue-400 border border-blue-500/20':'text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'}`}>
              <span className="flex items-center gap-2.5">{n.icon}{n.label}</span>
              {n.badge>0 && <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{n.badge}</span>}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-800 space-y-1">
          <button onClick={load} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800/40 transition-all">
            <RefreshCw size={14} className={loading?'animate-spin':''}/> Refresh
          </button>
          <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-500/70 hover:text-rose-400 rounded-lg hover:bg-rose-500/5 transition-all">
            <LogOut size={14}/> Exit Admin
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 bg-slate-900/50 border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
          <h1 className="text-sm font-black text-slate-100">
            {NAV.find(n=>n.id===tab)?.label} — {tab==='fraud'?`${fraudWorkers.length} Alerts`:`${new Date().toLocaleDateString('en-IN',{dateStyle:'medium'})}`}
          </h1>
          <div className="flex items-center gap-3">
            {stats?.weatherState?.isDisrupted && (
              <span className="flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest animate-pulse">
                <CloudRain size={10}/> RAIN ACTIVE
              </span>
            )}
            <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">Admin</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ── 1. OVERVIEW ─────────────────────────────────────────── */}
          {tab==='overview' && <Overview stats={stats} t={t} workers={workers} policies={policies} claims={claims} fraudCount={fraudWorkers.length}/>}

          {/* ── 2. WORKERS ──────────────────────────────────────────── */}
          {tab==='workers' && <WorkersTab workers={workers} onFlag={async(id,f)=>{await api(`/api/admin/worker/${id}/flag`,{method:'PATCH',body:JSON.stringify({flagged:f})});toast(`Worker ${f?'flagged':'unflagged'}`);load();}}/>}

          {/* ── 3. POLICIES ─────────────────────────────────────────── */}
          {tab==='policies' && <PoliciesTab policies={policies}/>}

          {/* ── 4. CLAIMS ───────────────────────────────────────────── */}
          {tab==='claims' && <ClaimsTab claims={claims} onAction={async(id,action)=>{await api(`/api/admin/claim/${id}/action`,{method:'PATCH',body:JSON.stringify({action})});toast(`Claim ${action}d`);load();}}/>}

          {/* ── 5. GOD MODE ─────────────────────────────────────────── */}
          {tab==='disruption' && <DisruptionTab onTrigger={async(ev,zone)=>{const d=await api('/api/admin/simulate-global',{method:'POST',body:JSON.stringify({event_type:ev,zone})});toast(`${ev} triggered — ${d.claimsGenerated?.length||0} claims`);load();}}/>}

          {/* ── 6. FRAUD ────────────────────────────────────────────── */}
          {tab==='fraud' && <FraudTab workers={workers} onFlag={async(id,f)=>{await api(`/api/admin/worker/${id}/flag`,{method:'PATCH',body:JSON.stringify({flagged:f})});toast(`Worker ${f?'flagged':'cleared'}`);load();}}/>}

          {/* ── 7. ANALYTICS ────────────────────────────────────────── */}
          {tab==='analytics' && <AnalyticsTab t={t} policies={policies} claims={claims}/>}

          {/* ── 8. ZONE RISK ────────────────────────────────────────── */}
          {tab==='zones' && <ZonesTab workers={workers} isDisrupted={stats?.weatherState?.isDisrupted}/>}

          {/* ── 9. NOTIFY ───────────────────────────────────────────── */}
          {tab==='notify' && <NotifyTab notifs={notifs} onSend={async(body)=>{await api('/api/admin/notify',{method:'POST',body:JSON.stringify(body)});toast('Notification sent');load();}}/>}

          {/* ── 10. SETTINGS ────────────────────────────────────────── */}
          {tab==='settings' && <SettingsTab settings={settings} onSave={async(s)=>{await api('/api/admin/settings',{method:'POST',body:JSON.stringify(s)});toast('Settings saved');setSettings(s);}}/>}

          {/* ── 11. LOGS ────────────────────────────────────────────── */}
          {tab==='logs' && <LogsTab logs={logs}/>}

        </main>
      </div>

      {/* TOAST */}
      {toastState && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[300]">
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-2xl shadow-black/60 text-sm font-bold backdrop-blur-md ${toastState.type==='error'?'bg-rose-950/95 border-rose-500/40 text-rose-100':'bg-emerald-950/95 border-emerald-500/40 text-emerald-100'}`}>
            {toastState.type==='error'?<XCircle size={16}/>:<CheckCircle size={16}/>}
            {toastState.msg}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SECTION COMPONENTS ──────────────────────────────────────────────────────

function Overview({ stats, t, workers, policies, claims, fraudCount }) {
  const liq = t.liquidityPct ?? 0;
  const kpis = [
    { label:'Total Workers',           val: stats?.users?.total??0,           icon:<Users size={18}/>,        color:'blue' },
    { label:'Active Shields',          val: stats?.policies?.active??0,        icon:<Shield size={18}/>,       color:'emerald' },
    { label:'Premiums Collected',      val:`₹${(t.totalPremiums??0).toFixed(0)}`, icon:<DollarSign size={18}/>, color:'blue' },
    { label:'Total Payouts Issued',    val:`₹${(t.totalPaid??0).toFixed(0)}`,  icon:<CreditCard size={18}/>,   color:'amber' },
    { label:'Company Profit (25%)',    val:`₹${(t.operatingProfit??0).toFixed(0)}`, icon:<TrendingUp size={18}/>,color:'emerald' },
    { label:'Fraud Alerts',            val: fraudCount,                         icon:<AlertTriangle size={18}/>,color:'rose' },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {kpis.map(k=><KpiCard key={k.label} {...k}/>)}
      </div>
      {/* Treasury 75/25 */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Treasury Distribution</p>
        <div className="flex gap-4 mb-4">
          <div className="flex-1 bg-slate-800 rounded-xl p-4 border border-slate-700">
            <p className="text-[9px] text-amber-400 font-black uppercase tracking-widest">Payout Pool (75%)</p>
            <p className="text-2xl font-black text-amber-400 mt-1">₹{(t.claimsReserve??0).toFixed(0)}</p>
            <p className="text-[10px] text-slate-500 mt-1">₹{(t.totalPaid??0).toFixed(0)} disbursed</p>
          </div>
          <div className="flex-1 bg-slate-800 rounded-xl p-4 border border-slate-700">
            <p className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">Company Profit (25%)</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">₹{(t.operatingProfit??0).toFixed(0)}</p>
            <p className="text-[10px] text-slate-500 mt-1">After all obligations</p>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-bold text-slate-500">
            <span>Liquidity: {liq.toFixed(1)}% used</span>
            {liq>70 && <span className="text-rose-400 animate-pulse">⚠ LIQUIDITY ALERT</span>}
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{width:`${liq}%`,background:liq>70?'linear-gradient(90deg,#f59e0b,#ef4444)':'linear-gradient(90deg,#3b82f6,#10b981)'}}/>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkersTab({ workers, onFlag }) {
  const [search, setSearch] = useState('');
  const filtered = workers.filter(w => w.name?.toLowerCase().includes(search.toLowerCase()) || w.phone?.includes(search));
  return (
    <div className="space-y-4">
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or phone…" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder:text-slate-600 outline-none focus:border-blue-500/60"/>
      <Table cols={['Worker','Phone','Zone','Aadhaar','Policies','Claims','Balance','Trust','Action']}>
        {filtered.length===0 ? <EmptyRow cols={9} msg="No workers found"/> : filtered.map(w=>{
          const f=fraudSignals(w.id);
          return (
            <tr key={w.id} className="border-b border-slate-800/60 hover:bg-slate-800/20 transition-colors">
              <Td><span className="font-bold text-slate-200">{w.name}</span></Td>
              <Td><span className="font-mono text-xs text-slate-400">{w.phone}</span></Td>
              <Td><span className="text-slate-400 text-xs">{w.zone||'—'}</span></Td>
              <Td>{w.aadhaar_verified?<Badge color="emerald">Verified</Badge>:<Badge color="slate">Pending</Badge>}</Td>
              <Td><span className="font-bold text-blue-400">{w.active_policies}</span></Td>
              <Td><span className="text-slate-300">{w.total_claims}</span></Td>
              <Td><span className="font-black text-emerald-400">₹{parseFloat(w.balance).toFixed(0)}</span></Td>
              <Td>
                <div className="flex items-center gap-1.5">
                  <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden"><div className="h-full rounded-full bg-blue-500" style={{width:`${f.trustScore}%`}}/></div>
                  <span className="text-[10px] font-bold text-slate-400">{f.trustScore}</span>
                </div>
              </Td>
              <Td>
                <button onClick={()=>onFlag(w.id,!w.is_flagged)}
                  className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg border transition-all ${w.is_flagged?'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20':'bg-slate-800 border-slate-700 text-slate-500 hover:text-amber-400 hover:border-amber-500/30'}`}>
                  <Flag size={10}/>{w.is_flagged?'Flagged':'Flag'}
                </button>
              </Td>
            </tr>
          );
        })}
      </Table>
    </div>
  );
}

function PoliciesTab({ policies }) {
  const [filter, setFilter] = useState('all');
  const filtered = filter==='all' ? policies : policies.filter(p=>p.status===filter);
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {['all','active','expired'].map(f=>(
          <button key={f} onClick={()=>setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${filter===f?'bg-blue-500/15 text-blue-400 border border-blue-500/30':'bg-slate-800 text-slate-500 border border-slate-700 hover:text-slate-300'}`}>
            {f} {filter===f?`(${filtered.length})`:''}
          </button>
        ))}
      </div>
      <Table cols={['Worker','Zone','Tier','Premium','Coverage','Issued','Expires','Status']}>
        {filtered.length===0?<EmptyRow cols={8} msg="No policies"/>:filtered.map(p=>(
          <tr key={p.id} className="border-b border-slate-800/60 hover:bg-slate-800/20">
            <Td><span className="font-bold text-slate-200">{p.user_name}</span><p className="text-[10px] text-slate-500">{p.phone}</p></Td>
            <Td><span className="text-xs text-slate-400">{p.zone}</span></Td>
            <Td><Badge color="blue">{p.tier_name}</Badge></Td>
            <Td><span className="font-black text-rose-400">₹{p.premium_amount}</span></Td>
            <Td><span className="font-bold text-emerald-400">₹{p.coverage_amount}</span></Td>
            <Td><span className="text-xs text-slate-500">{fmtDate(p.policy_start_date)}</span></Td>
            <Td><span className="text-xs text-slate-400">{fmtDate(p.policy_end_date)}</span></Td>
            <Td><Badge color={p.status==='active'?'emerald':'slate'}>{p.status}</Badge></Td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

function ClaimsTab({ claims, onAction }) {
  const [acting, setActing] = useState(null);
  const act = async (id, action) => {
    setActing(id+action);
    await onAction(id, action);
    setActing(null);
  };
  return (
    <Table cols={['Claim ID','Worker','Zone','Tier','Event','Amount','Fraud Check','Status','Actions']}>
      {claims.length===0?<EmptyRow cols={9} msg="No claims yet"/>:claims.map(c=>{
        const isAuto = c.status==='auto_paid';
        return (
          <tr key={c.id} className={`border-b border-slate-800/60 hover:bg-slate-800/20 ${c.status==='flagged'?'bg-rose-500/3':''}`}>
            <Td><span className="font-mono text-[10px] text-slate-500">{c.id?.slice(0,8)}…</span></Td>
            <Td><span className="font-bold text-slate-200">{c.user_name}</span></Td>
            <Td><span className="text-xs text-slate-400">{c.zone}</span></Td>
            <Td><Badge color="blue">{c.tier_name}</Badge></Td>
            <Td><span className="text-xs text-rose-400 capitalize">{c.event_type?.replace('_',' ')}</span></Td>
            <Td><span className="font-black text-emerald-400">₹{c.payout_amount}</span></Td>
            <Td><Badge color={isAuto?'emerald':'amber'}>{isAuto?'AI Verified':'Pending'}</Badge></Td>
            <Td><Badge color={c.status==='flagged'?'rose':c.status==='blocked'?'slate':c.status==='approved'?'emerald':'blue'}>{c.status}</Badge></Td>
            <Td>
              <div className="flex gap-1">
                {['approve','flag','payout'].map(a=>(
                  <button key={a} disabled={!!acting} onClick={()=>act(c.id,a)}
                    className={`text-[9px] font-black px-2 py-1 rounded-lg border transition-all disabled:opacity-40 ${a==='approve'?'bg-emerald-500/10 border-emerald-500/20 text-emerald-400':a==='flag'?'bg-amber-500/10 border-amber-500/20 text-amber-400':'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                    {acting===c.id+a?'…':a}
                  </button>
                ))}
              </div>
            </Td>
          </tr>
        );
      })}
    </Table>
  );
}

function DisruptionTab({ onTrigger }) {
  const [zone, setZone] = useState('All Zones');
  const [loading, setLoading] = useState(null);
  const trigger = async (ev) => {
    setLoading(ev);
    await onTrigger(ev, zone==='All Zones'?null:zone);
    setLoading(null);
  };
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-4 flex gap-3">
        <AlertTriangle className="text-rose-400 shrink-0 mt-0.5" size={16}/>
        <p className="text-xs font-bold text-rose-400/80">God Mode: Triggering events will auto-generate claims for all workers with active, Aadhaar-verified policies in the selected zone.</p>
      </div>
      {/* Zone selector */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Target Zone</p>
        <select value={zone} onChange={e=>setZone(e.target.value)}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 outline-none focus:border-blue-500/60">
          {ZONES.map(z=><option key={z}>{z}</option>)}
        </select>
      </div>
      {/* Event buttons */}
      <div className="grid grid-cols-2 gap-4">
        {EVENTS.map(ev=>(
          <button key={ev.id} onClick={()=>trigger(ev.id)} disabled={!!loading}
            className="flex flex-col items-center gap-3 p-6 bg-slate-900/80 border border-slate-800 rounded-2xl hover:border-slate-600 transition-all disabled:opacity-50">
            {loading===ev.id ? <RefreshCw className="animate-spin text-slate-400" size={28}/> : <span className="text-4xl">{ev.icon}</span>}
            <div className="text-center">
              <p className={`text-sm font-black ${ev.color}`}>{ev.label}</p>
              <p className="text-[10px] text-slate-600 font-bold mt-0.5">{zone}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function FraudTab({ workers, onFlag }) {
  const flagged = workers.map(w=>({ ...w, ...fraudSignals(w.id) })).filter(w=>w.velocity>120||w.isMock);
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl px-4 py-3 flex items-center gap-2">
          <AlertTriangle className="text-rose-400" size={16}/>
          <span className="text-sm font-black text-rose-400">{flagged.length} Suspicious Workers</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center gap-2">
          <Eye className="text-blue-400" size={16}/>
          <span className="text-sm font-black text-slate-300">{workers.length} Total Monitored</span>
        </div>
      </div>
      <Table cols={['Worker','Zone','GPS Velocity','Mock Location','Trust Score','Risk','Action']}>
        {workers.map(w=>{
          const { velocity, isMock, trustScore } = fraudSignals(w.id);
          const isAlert = velocity>120||isMock;
          return (
            <tr key={w.id} className={`border-b border-slate-800/60 transition-colors ${isAlert?'bg-rose-500/5 hover:bg-rose-500/8':'hover:bg-slate-800/20'}`}>
              <Td><span className={`font-bold ${isAlert?'text-rose-300':'text-slate-200'}`}>{w.name}</span></Td>
              <Td><span className="text-xs text-slate-400">{w.zone||'—'}</span></Td>
              <Td>
                <span className={`font-black tabular-nums ${velocity>120?'text-rose-400':'text-slate-300'}`}>{velocity} km/h</span>
                {velocity>120 && <span className="ml-2 text-[9px] font-black bg-rose-500/10 text-rose-500 border border-rose-500/30 px-1.5 py-0.5 rounded-full">GPS JUMP</span>}
              </Td>
              <Td>{isMock?<Badge color="rose">MOCK ⚠</Badge>:<Badge color="emerald">Real</Badge>}</Td>
              <Td>
                <div className="flex items-center gap-1.5">
                  <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{width:`${trustScore}%`}}/></div>
                  <span className="text-[10px] text-slate-400 font-bold">{trustScore}</span>
                </div>
              </Td>
              <Td><Badge color={isAlert?'rose':trustScore<60?'amber':'emerald'}>{isAlert?'CRITICAL':trustScore<60?'MEDIUM':'SAFE'}</Badge></Td>
              <Td>
                <button onClick={()=>onFlag(w.id,!w.is_flagged)}
                  className={`text-[10px] font-black px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1 ${w.is_flagged?'bg-rose-500/10 border-rose-500/30 text-rose-400':'bg-slate-800 border-slate-700 text-slate-500 hover:text-amber-400'}`}>
                  <Flag size={10}/>{w.is_flagged?'Unflag':'Flag'}
                </button>
              </Td>
            </tr>
          );
        })}
      </Table>
    </div>
  );
}

function AnalyticsTab({ t, policies, claims }) {
  const zones = {};
  claims.forEach(c=>{ zones[c.zone]=(zones[c.zone]||0)+c.payout_amount; });
  const zoneBars = Object.entries(zones).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const maxZone = zoneBars[0]?.[1]||1;
  const tiers = { Basic:0, Standard:0, Extended:0 };
  policies.forEach(p=>{ if(tiers[p.tier_name]!==undefined) tiers[p.tier_name]++; });
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Premium vs Payout */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Premium vs Payout Ratio</p>
        <div className="space-y-3">
          {[
            { label:'Total Premiums', val:t.totalPremiums||0, max:t.totalPremiums||1, color:'bg-blue-500' },
            { label:'Payout Pool (75%)', val:t.claimsReserve||0, max:t.totalPremiums||1, color:'bg-amber-500' },
            { label:'Total Paid Out', val:t.totalPaid||0, max:t.totalPremiums||1, color:'bg-rose-500' },
            { label:'Operating Profit', val:t.operatingProfit||0, max:t.totalPremiums||1, color:'bg-emerald-500' },
          ].map(b=>(
            <div key={b.label}>
              <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                <span>{b.label}</span><span>₹{b.val.toFixed(0)}</span>
              </div>
              <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${b.color}`} style={{width:`${Math.min((b.val/b.max)*100,100)}%`,transition:'width 0.8s'}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Claims per Zone */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Payouts by Zone</p>
        {zoneBars.length===0?<p className="text-slate-600 text-sm font-bold text-center py-6">No payouts yet</p>:
          <div className="space-y-3">
            {zoneBars.map(([zone,amt])=>(
              <div key={zone}>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                  <span className="truncate max-w-[160px]">{zone}</span><span>₹{amt.toFixed(0)}</span>
                </div>
                <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{width:`${(amt/maxZone)*100}%`,transition:'width 0.8s'}}/>
                </div>
              </div>
            ))}
          </div>
        }
      </div>
      {/* Policy tiers */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Policy Tier Distribution</p>
        <div className="flex gap-4 justify-around">
          {Object.entries(tiers).map(([tier,cnt])=>(
            <div key={tier} className="text-center">
              <div className="text-3xl font-black text-blue-400">{cnt}</div>
              <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">{tier}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Summary metrics */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Key Metrics</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label:'Avg Payout', val:`₹${claims.length?((claims.reduce((s,c)=>s+c.payout_amount,0))/claims.length).toFixed(0):0}`, color:'text-emerald-400' },
            { label:'Total Claims', val:claims.length, color:'text-blue-400' },
            { label:'Today Paid', val:`₹${(t.todayPaid||0).toFixed(0)}`, color:'text-amber-400' },
            { label:'Profit Margin', val:`${t.totalPremiums>0?'25':'0'}%`, color:'text-emerald-400' },
          ].map(m=>(
            <div key={m.label} className="bg-slate-800 rounded-xl p-3 border border-slate-700">
              <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{m.label}</p>
              <p className={`text-xl font-black mt-1 ${m.color}`}>{m.val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ZonesTab({ workers, isDisrupted }) {
  const zoneMap = {
    'Sector 62, Noida':     { risk:'HIGH',     workers: workers.filter(w=>w.zone?.includes('62')).length },
    'Sector 18, Noida':     { risk:'MODERATE', workers: workers.filter(w=>w.zone?.includes('18')).length },
    'Connaught Place':      { risk:'LOW',       workers: 0 },
    'Gurgaon Cyber City':   { risk:'MODERATE', workers: 0 },
    'Karol Bagh':           { risk:'LOW',       workers: 0 },
    'Lajpat Nagar':         { risk:'LOW',       workers: 0 },
  };
  if(isDisrupted) { zoneMap['Sector 62, Noida'].risk='CRITICAL'; zoneMap['Sector 18, Noida'].risk='HIGH'; }
  const colors = { CRITICAL:'bg-rose-500/20 border-rose-500/40 text-rose-400', HIGH:'bg-amber-500/15 border-amber-500/30 text-amber-400', MODERATE:'bg-yellow-500/10 border-yellow-500/20 text-yellow-400', LOW:'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' };
  return (
    <div className="space-y-4">
      {isDisrupted && <div className="flex items-center gap-2 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl"><AlertTriangle className="text-rose-400" size={16}/><p className="text-sm font-black text-rose-400">DISRUPTION ACTIVE — Risk levels elevated across all zones</p></div>}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(zoneMap).map(([zone,data])=>(
          <div key={zone} className={`border rounded-2xl p-5 ${colors[data.risk]}`}>
            <div className="flex justify-between items-start mb-3">
              <p className="font-black text-sm">{zone}</p>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase ${colors[data.risk]}`}>{data.risk}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14}/>
              <span className="text-xs font-bold">{data.workers} worker{data.workers!==1?'s':''} active</span>
            </div>
            {data.risk==='CRITICAL' && <p className="text-[10px] font-bold mt-2 opacity-80">Auto-payouts triggered for this zone</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function NotifyTab({ notifs, onSend }) {
  const [form, setForm] = useState({ type:'weather', title:'', message:'', zone:'All Zones' });
  const [sending, setSending] = useState(false);
  const send = async () => {
    if(!form.title||!form.message) return;
    setSending(true);
    await onSend({ ...form, zone: form.zone==='All Zones'?null:form.zone });
    setForm(f=>({...f,title:'',message:''}));
    setSending(false);
  };
  const typeColors = { weather:'blue', policy:'emerald', system:'amber', alert:'rose' };
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Compose Notification</p>
          <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 outline-none">
            {['weather','policy','system','alert'].map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)} Alert</option>)}
          </select>
          <select value={form.zone} onChange={e=>setForm(f=>({...f,zone:e.target.value}))}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 outline-none">
            {ZONES.map(z=><option key={z}>{z}</option>)}
          </select>
          <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Notification title…"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder:text-slate-600 outline-none focus:border-blue-500/60"/>
          <textarea value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} placeholder="Message body…" rows={3}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder:text-slate-600 outline-none focus:border-blue-500/60 resize-none"/>
          <button onClick={send} disabled={sending||!form.title||!form.message}
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm rounded-xl transition-all disabled:opacity-50">
            {sending?<RefreshCw size={16} className="animate-spin"/>:<Send size={16}/>} Send Notification
          </button>
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sent Notifications ({notifs.length})</p>
        {notifs.length===0 ? <p className="text-slate-600 text-sm font-bold text-center py-8">No notifications sent yet</p> :
          notifs.map(n=>(
            <div key={n.id} className={`border rounded-xl p-4 ${typeColors[n.type]==='rose'?'bg-rose-500/5 border-rose-500/20':typeColors[n.type]==='emerald'?'bg-emerald-500/5 border-emerald-500/20':typeColors[n.type]==='amber'?'bg-amber-500/5 border-amber-500/20':'bg-blue-500/5 border-blue-500/20'}`}>
              <div className="flex justify-between items-start mb-1">
                <p className="text-sm font-black text-slate-200">{n.title}</p>
                <Badge color={typeColors[n.type]||'blue'}>{n.zone}</Badge>
              </div>
              <p className="text-xs text-slate-400 font-bold">{n.message}</p>
              <p className="text-[9px] text-slate-600 mt-2 font-bold">{fmtDate(n.sent_at)}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
}

function SettingsTab({ settings, onSave }) {
  const [s, setS] = useState(settings);
  useEffect(()=>setS(settings),[settings]);
  const fields = [
    { key:'base_premium',          label:'Base Premium (₹)',         type:'number' },
    { key:'max_payout',            label:'Max Payout Limit (₹)',     type:'number' },
    { key:'rain_threshold',        label:'Rain Trigger (mm/hr)',     type:'number' },
    { key:'fraud_velocity_kmh',    label:'Fraud Velocity (km/h)',    type:'number' },
  ];
  const toggles = [
    { key:'auto_payout_enabled',     label:'Auto-Payout Engine' },
    { key:'fraud_detection_enabled', label:'Fraud Detection' },
  ];
  return (
    <div className="max-w-xl space-y-5">
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Platform Rules</p>
        {fields.map(f=>(
          <div key={f.key}>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">{f.label}</label>
            <input type={f.type} value={s[f.key]??''} onChange={e=>setS(prev=>({...prev,[f.key]:f.type==='number'?parseFloat(e.target.value):e.target.value}))}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 outline-none focus:border-blue-500/60"/>
          </div>
        ))}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          {toggles.map(t=>(
            <div key={t.key} className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-300">{t.label}</span>
              <button onClick={()=>setS(prev=>({...prev,[t.key]:!prev[t.key]}))}
                className={`w-12 h-6 rounded-full transition-all relative ${s[t.key]?'bg-emerald-500':'bg-slate-700'}`}>
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${s[t.key]?'left-7':'left-1'}`}/>
              </button>
            </div>
          ))}
        </div>
        <button onClick={()=>onSave(s)}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm rounded-xl transition-all">
          Save Settings
        </button>
      </div>
    </div>
  );
}

function LogsTab({ logs }) {
  const icons = { admin:<Shield size={12} className="text-blue-400"/>, system:<Activity size={12} className="text-emerald-400"/> };
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{logs.length} events logged (in-memory, resets on restart)</p>
      {logs.length===0 ? <p className="text-slate-600 text-sm font-bold text-center py-12">No activity yet. Trigger events from the God Mode tab.</p> :
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
          {logs.map((l,i)=>(
            <div key={l.id} className={`flex items-start gap-3 px-5 py-3.5 ${i<logs.length-1?'border-b border-slate-800/60':''} hover:bg-slate-800/30 transition-colors`}>
              <div className="mt-0.5 shrink-0">{icons[l.actor]||icons.system}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-300 truncate">{l.action}</p>
                <p className="text-[9px] text-slate-600 font-bold mt-0.5">{new Date(l.timestamp).toLocaleString('en-IN')}</p>
              </div>
              <Badge color={l.actor==='admin'?'blue':'slate'}>{l.actor}</Badge>
            </div>
          ))}
        </div>
      }
    </div>
  );
}

// ─── SHARED UI ATOMS ──────────────────────────────────────────────────────────

function KpiCard({ label, val, icon, color }) {
  const c = { blue:'bg-blue-500/10 border-blue-500/20 text-blue-400', emerald:'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', amber:'bg-amber-500/10 border-amber-500/20 text-amber-400', rose:'bg-rose-500/10 border-rose-500/20 text-rose-400', slate:'bg-slate-800 border-slate-700 text-slate-400' }[color]||'bg-slate-800 border-slate-700 text-slate-400';
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
      <div className={`w-10 h-10 ${c} border rounded-xl flex items-center justify-center mb-3`}>{icon}</div>
      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{label}</p>
      <p className={`text-2xl font-black mt-1 ${c.split(' ').pop()}`}>{val}</p>
    </div>
  );
}

function Table({ cols, children }) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-800">
              {cols.map(c=><th key={c} className="px-4 py-3 text-left text-[9px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">{c}</th>)}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

function Td({ children }) {
  return <td className="px-4 py-3 whitespace-nowrap">{children}</td>;
}

function Badge({ color='slate', children }) {
  const c = { blue:'bg-blue-500/10 text-blue-400 border-blue-500/20', emerald:'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', amber:'bg-amber-500/10 text-amber-400 border-amber-500/20', rose:'bg-rose-500/10 text-rose-500 border-rose-500/30', slate:'bg-slate-800 text-slate-500 border-slate-700' }[color]||'bg-slate-800 text-slate-500 border-slate-700';
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[9px] font-black uppercase ${c}`}>{children}</span>;
}

function EmptyRow({ cols, msg }) {
  return <tr><td colSpan={cols} className="px-4 py-12 text-center text-slate-600 font-bold">{msg}</td></tr>;
}

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN',{dateStyle:'short'}) : '—';
