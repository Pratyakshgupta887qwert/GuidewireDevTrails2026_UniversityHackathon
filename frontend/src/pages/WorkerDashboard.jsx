import React, { useEffect, useRef, useState } from 'react';
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  CloudRain,
  CreditCard,
  History,
  LayoutDashboard,
  LogOut,
  MapPin,
  Settings,
  Shield,
  Wallet,
  Zap,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import PolicyTiers from './PolicyTiers';
import PayoutHistory from './PayoutHistory';
import SettingsPage from './Settings';
import NotificationsPage from './Notifications';
import { formatCurrency, getRiskTone } from '../lib/insurance';

const WorkerDashboard = ({
  user,
  setUser,
  activePolicy,
  claims,
  summary,
  riskSnapshot,
  activeTab,
  setActiveTab,
  onPurchasePolicy,
  onVerifyAadhaar,
  onRefreshProtection,
  onLogout,
  onPolicyActivated,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [aadhaarForm, setAadhaarForm] = useState({ aadhaar: user.aadhaar_number || '', otp: '' });
  const [aadhaarInfo, setAadhaarInfo] = useState('');
  const [aadhaarError, setAadhaarError] = useState('');
  const [aadhaarLoading, setAadhaarLoading] = useState(false);

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    setAadhaarForm({
      aadhaar: user.aadhaar_number || '',
      otp: '',
    });
  }, [user.aadhaar_number]);

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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const metricChartData = riskSnapshot ? [
    { label: 'Rain', value: riskSnapshot.componentScores?.rainScore || 0 },
    { label: 'Heat', value: riskSnapshot.componentScores?.heatScore || 0 },
    { label: 'AQI', value: riskSnapshot.componentScores?.aqiScore || 0 },
    { label: 'Traffic', value: riskSnapshot.componentScores?.trafficScore || 0 },
  ] : [];

  const earningsBreakdown = [
    { name: 'Premium Paid', value: summary.total_premium_paid || 0, color: '#334155' },
    { name: 'Payout Received', value: summary.total_payout_received || 0, color: '#10B981' },
  ];

  const latestClaim = claims[0];

  const handleAadhaarSendOtp = () => {
    setAadhaarError('');
    setAadhaarInfo('OTP sent. Use 123456 for Aadhaar verification.');
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    setAadhaarLoading(true);
    setAadhaarError('');
    setAadhaarInfo('');

    try {
      await onVerifyAadhaar({
        aadhaarNumber: aadhaarForm.aadhaar,
        otp: aadhaarForm.otp,
      });
      await onRefreshProtection?.();
      setAadhaarInfo('Aadhaar verified successfully. Weekly plan activation is now unlocked.');
    } catch (error) {
      setAadhaarError(error.message);
    } finally {
      setAadhaarLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex">
      <aside className="hidden lg:flex w-72 bg-[#0B1222] flex-col p-6 sticky top-0 h-screen border-r border-slate-700/50">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <Shield className="text-slate-100" size={22} />
          </div>
          <span className="text-xl font-black text-slate-100 tracking-tighter uppercase">AegisAI</span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <SidebarItem icon={<Shield size={20} />} label="Policy Tiers" active={activeTab === 'policy'} onClick={() => setActiveTab('policy')} />
          <SidebarItem icon={<History size={20} />} label="Payout History" active={activeTab === 'payouts'} onClick={() => setActiveTab('payouts')} />
          <SidebarItem icon={<Bell size={20} />} label="Notifications" active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
          <SidebarItem icon={<Wallet size={20} />} label="Earnings" active={activeTab === 'earnings'} onClick={() => setActiveTab('overview')} />
          <SidebarItem icon={<Settings size={20} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <button
          onClick={onLogout}
          className="mt-auto flex items-center gap-3 px-4 py-4 text-slate-500 font-bold hover:text-slate-100 transition-colors border-t border-slate-700/50"
        >
          <LogOut size={20} /> Sign Out
        </button>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-20 bg-[#0B1222]/80 backdrop-blur-md border-b border-slate-700/50 px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-black text-slate-100">Welcome, {user.name}</h2>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Active Partner
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setShowNotificationsMenu((current) => !current)}
                className="relative cursor-pointer p-2 hover:bg-slate-800/50 rounded-full transition-colors"
              >
                <Bell className="text-slate-400 hover:text-slate-100 transition-colors" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-[#0B1222] text-[10px] text-white flex items-center justify-center font-bold">3</span>
              </button>

              {showNotificationsMenu && (
                <div className="absolute right-0 mt-3 w-80 bg-slate-800/90 backdrop-blur-md rounded-[24px] shadow-2xl shadow-black/40 border border-slate-700/50 p-4 z-50">
                  <div className="space-y-3">
                    <NotificationItem title="Dynamic pricing updated" text={`Risk multiplier for ${user.city} is ${riskSnapshot?.multiplier || 1}x this week.`} />
                    <NotificationItem title="Aadhaar unlocks plan purchase" text={user.aadhaar_verified ? 'You can activate any weekly shield now.' : 'Verify Aadhaar to unlock plan activation.'} />
                    <NotificationItem title="Heavy rain simulation" text="Use the red floating button to test automated claim payout." />
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu((current) => !current)}
                className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700/50 shadow-sm overflow-hidden"
              >
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-64 bg-slate-800/90 backdrop-blur-md rounded-[24px] shadow-2xl shadow-black/40 border border-slate-700/50 p-4 z-50">
                  <div className="text-center pb-4 border-b border-slate-700/50 mb-4">
                    <div className="w-16 h-16 rounded-full bg-slate-800 border-4 border-slate-700/50 overflow-hidden mx-auto mb-2">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" />
                    </div>
                    <h4 className="font-black text-slate-100">{user.name}</h4>
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-1 bg-emerald-500/10 border border-emerald-500/20 inline-block px-2 py-0.5 rounded-full">
                      Active Partner
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 mt-2">{user.city}</p>
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
              <div className="grid xl:grid-cols-[1.6fr_1fr] gap-8">
                <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 shadow-2xl shadow-black/20 rounded-[36px] p-8">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">AI Risk Engine</p>
                  <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mt-4">
                    <div>
                      <h3 className="text-4xl font-black text-slate-100 leading-tight">
                        Dynamic risk protection for {user.city}
                      </h3>
                      <p className="text-slate-400 font-medium mt-4 max-w-2xl">
                        Premiums and coverage adjust automatically using live-style environmental data for rain, heat, AQI, and traffic.
                      </p>
                    </div>
                    <div className={`inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-black uppercase tracking-[0.18em] border ${getRiskTone(riskSnapshot?.risk_level)}`}>
                      {riskSnapshot?.risk_level || 'Low'} risk
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 mt-8">
                    <MetricCard label="Risk Score" value={riskSnapshot?.risk_score || 0} helper="Weighted score" />
                    <MetricCard label="Multiplier" value={`${riskSnapshot?.multiplier || 1}x`} helper="Price adjustment" />
                    <MetricCard label="City Rain" value={`${riskSnapshot?.environmentalData?.rain || 0} mm`} helper="Mock weather data" />
                    <MetricCard label="Traffic Speed" value={`${riskSnapshot?.environmentalData?.trafficSpeed || 0} km/h`} helper="Mobility pressure" />
                  </div>
                </div>

                <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 shadow-2xl shadow-black/20 rounded-[36px] p-8">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">Net Benefit</p>
                  <div className="mt-4 space-y-4">
                    <SummaryRow label="Total Premium Paid" value={formatCurrency(summary.total_premium_paid)} />
                    <SummaryRow label="Total Payout Received" value={formatCurrency(summary.total_payout_received)} highlight />
                    <SummaryRow label="Net Profit" value={formatCurrency(summary.profit)} large />
                  </div>
                  <div className="h-48 mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={earningsBreakdown}
                          dataKey="value"
                          innerRadius={50}
                          outerRadius={72}
                          paddingAngle={4}
                        >
                          {earningsBreakdown.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                <Card title="Active Plan">
                  {activePolicy ? (
                    <div className="space-y-4">
                      <ShieldStat label="Plan" value={activePolicy.tier_name} />
                      <ShieldStat label="Premium" value={`${formatCurrency(activePolicy.premium)}/week`} />
                      <ShieldStat label="Coverage" value={formatCurrency(activePolicy.coverage)} />
                      <ShieldStat label="Risk Level" value={activePolicy.risk_level} />
                      <ShieldStat label="Days Remaining" value={`${activePolicy.days_remaining}`} />
                    </div>
                  ) : (
                    <EmptyState text="No active protection. Verify Aadhaar, then activate a weekly shield from Policy Tiers." />
                  )}
                </Card>

                <Card title="Aadhaar Verification Status">
                  {user.aadhaar_verified ? (
                    <div className="space-y-4">
                      <div className="rounded-[24px] border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 flex items-start gap-4">
                        <div className="w-11 h-11 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                          <CheckCircle2 size={22} />
                        </div>
                        <div>
                          <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-400">Verified</p>
                          <p className="text-sm font-bold text-emerald-100 mt-2">
                            Aadhaar ending in {user.aadhaar_number?.slice(-4) || 'XXXX'} has unlocked policy activation and claim processing.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleVerify} className="space-y-4">
                      <FieldLabel>12-digit Aadhaar Number</FieldLabel>
                      <input
                        value={aadhaarForm.aadhaar}
                        onChange={(event) => setAadhaarForm((current) => ({ ...current, aadhaar: event.target.value.replace(/\D/g, '').slice(0, 12) }))}
                        placeholder="123412341234"
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-4 py-4 text-sm font-bold text-slate-200 focus:outline-none focus:border-blue-500"
                      />

                      <div className="grid grid-cols-[1fr_auto] gap-3">
                        <input
                          value={aadhaarForm.otp}
                          onChange={(event) => setAadhaarForm((current) => ({ ...current, otp: event.target.value.replace(/\D/g, '').slice(0, 6) }))}
                          placeholder="OTP"
                          className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-4 py-4 text-sm font-bold text-slate-200 focus:outline-none focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={handleAadhaarSendOtp}
                          className="px-4 py-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-black uppercase tracking-wider text-xs"
                        >
                          Send OTP
                        </button>
                      </div>

                      {aadhaarInfo && <Message tone="emerald" text={aadhaarInfo} />}
                      {aadhaarError && <Message tone="rose" text={aadhaarError} />}

                      <div className="rounded-[24px] border border-amber-500/20 bg-amber-500/10 px-5 py-4">
                        <p className="text-sm font-black text-amber-400 uppercase tracking-[0.18em]">Plans Locked</p>
                        <p className="text-sm text-amber-100 mt-2">
                          Only after Aadhaar OTP verification can you activate a weekly plan.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={aadhaarLoading}
                        className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black transition-all hover:bg-blue-500 disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {aadhaarLoading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          'Verify Aadhaar'
                        )}
                      </button>
                    </form>
                  )}
                </Card>

                <Card title="Claim Automation Info">
                  <div className="space-y-4">
                    <InfoBlock
                      label="Eligibility"
                      value={user.aadhaar_verified ? 'Unlocked' : 'Locked'}
                      helper={user.aadhaar_verified ? 'Your identity is verified.' : 'Verify Aadhaar to unlock claims.'}
                    />
                    <InfoBlock
                      label="Heavy Rain Flow"
                      value={activePolicy ? 'Ready' : 'Waiting'}
                      helper={activePolicy ? 'A weekly shield is active for payout simulation.' : 'No active weekly shield yet.'}
                    />
                    <InfoBlock
                      label="Latest Payout"
                      value={latestClaim ? formatCurrency(latestClaim.payout_amount) : formatCurrency(0)}
                      helper={latestClaim ? `Processed for ${latestClaim.event_type.replace(/_/g, ' ')}` : 'No payouts processed yet.'}
                    />
                  </div>
                </Card>
              </div>

              <div className="grid xl:grid-cols-[1.2fr_1fr] gap-8">
                <Card title="Environmental Score Map">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={metricChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.6} />
                            <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                        <XAxis dataKey="label" stroke="#64748B" />
                        <YAxis stroke="#64748B" />
                        <Tooltip />
                        <Area type="monotone" dataKey="value" stroke="#3B82F6" fill="url(#riskGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card title="City Signals">
                  <div className="space-y-4">
                    <InfoBlock label="Rain" value={`${riskSnapshot?.environmentalData?.rain || 0} mm`} helper="Rain score normalization drives 35% of risk." />
                    <InfoBlock label="Temperature" value={`${riskSnapshot?.environmentalData?.temp || 0}°C`} helper="Heat contributes 25% of your weighted risk score." />
                    <InfoBlock label="AQI" value={riskSnapshot?.environmentalData?.aqi || 0} helper="Air quality contributes 20% of the score." />
                    <InfoBlock label="Traffic Speed" value={`${riskSnapshot?.environmentalData?.trafficSpeed || 0} km/h`} helper="Slow traffic increases disruption probability." />
                  </div>
                </Card>
              </div>
            </>
          )}

          {activeTab === 'policy' && (
            <PolicyTiers
              user={user}
              activePolicy={activePolicy}
              onPurchasePolicy={onPurchasePolicy}
              onPolicyActivated={onPolicyActivated}
            />
          )}

          {activeTab === 'payouts' && (
            <PayoutHistory claims={claims} activePolicy={activePolicy} summary={summary} />
          )}

          {activeTab === 'notifications' && <NotificationsPage />}

          {activeTab === 'settings' && (
            <SettingsPage user={user} setUser={setUser} />
          )}
        </main>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, active = false, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl cursor-pointer transition-all ${
      active
        ? 'bg-slate-800/50 text-blue-400 border-r-4 border-blue-500 font-bold'
        : 'text-slate-400 hover:bg-slate-800/30 hover:text-slate-200 border-r-4 border-transparent'
    }`}
  >
    <div className="flex items-center gap-4">
      <div>{icon}</div>
      <span className="text-sm tracking-wide">{label}</span>
    </div>
  </button>
);

const Card = ({ title, children }) => (
  <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 shadow-2xl shadow-black/20 rounded-[32px] p-8">
    <h4 className="font-black text-slate-100 uppercase tracking-widest text-sm mb-6">{title}</h4>
    {children}
  </div>
);

const MetricCard = ({ label, value, helper }) => (
  <div className="rounded-[24px] border border-slate-700/50 bg-slate-900/40 px-5 py-4">
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</p>
    <p className="text-2xl font-black text-slate-100 mt-2">{value}</p>
    <p className="text-xs text-slate-400 mt-2">{helper}</p>
  </div>
);

const ShieldStat = ({ label, value }) => (
  <div className="rounded-[24px] border border-slate-700/50 bg-slate-900/40 px-5 py-4">
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</p>
    <p className="text-lg font-black text-slate-100 mt-2 capitalize">{value}</p>
  </div>
);

const SummaryRow = ({ label, value, highlight = false, large = false }) => (
  <div className="rounded-[24px] border border-slate-700/50 bg-slate-900/40 px-5 py-4">
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</p>
    <p className={`${large ? 'text-3xl' : 'text-lg'} font-black mt-2 ${highlight || large ? 'text-emerald-400' : 'text-slate-100'}`}>
      {value}
    </p>
  </div>
);

const InfoBlock = ({ label, value, helper }) => (
  <div className="rounded-[24px] border border-slate-700/50 bg-slate-900/40 px-5 py-4">
    <div className="flex items-center justify-between gap-4">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="text-sm font-black text-slate-100">{value}</p>
    </div>
    <p className="text-sm text-slate-400 mt-2">{helper}</p>
  </div>
);

const EmptyState = ({ text }) => (
  <div className="rounded-[24px] border border-dashed border-slate-700 bg-slate-900/40 px-6 py-8">
    <p className="text-sm font-bold text-slate-300">{text}</p>
  </div>
);

const FieldLabel = ({ children }) => (
  <label className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 block">{children}</label>
);

const Message = ({ tone, text }) => (
  <div className={`rounded-[20px] border px-4 py-3 text-sm font-bold ${tone === 'emerald' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/30 bg-rose-500/10 text-rose-400'}`}>
    {text}
  </div>
);

const NotificationItem = ({ title, text }) => (
  <div className="rounded-[18px] border border-slate-700/50 bg-slate-900/40 px-4 py-4">
    <p className="text-sm font-black text-slate-100">{title}</p>
    <p className="text-xs text-slate-400 mt-2 leading-5">{text}</p>
  </div>
);

export default WorkerDashboard;
