import React, { startTransition, useEffect, useRef, useState } from 'react';
import LandingPage from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import WorkerDashboard from './pages/WorkerDashboard';
import { apiRequest } from './lib/api';

// UUID v4 pattern – used to detect stale integer-based sessions
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const isValidUUID = (v) => UUID_RE.test(String(v ?? ''));

const GUEST_USER = {
  name: 'Guest User',
  zone: 'Unknown',
  balance: 0,
  isProtected: false,
  aadhaar_verified: false
};

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    // If there's a stale session with a non-UUID id, start on landing
    const saved = localStorage.getItem('aegis_user_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.id && !isValidUUID(parsed.id)) {
          // Stale integer-based session from old backend – clear it
          localStorage.removeItem('aegis_user_data');
          localStorage.removeItem('aegis_current_page');
          return 'signin';
        }
      } catch { /* ignore */ }
    }
    const page = localStorage.getItem('aegis_current_page');
    return page === 'dashboard' ? 'dashboard' : 'landing';
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [isDisrupted, setIsDisrupted] = useState(false);
  const [rainLevel, setRainLevel] = useState(0);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('aegis_user_data');
    if (!saved) return GUEST_USER;
    try {
      const parsed = JSON.parse(saved);
      // Guard: reject stale integer IDs
      if (parsed?.id && !isValidUUID(parsed.id)) return GUEST_USER;
      return { ...GUEST_USER, ...parsed };
    } catch { return GUEST_USER; }
  });
  const [activePolicy, setActivePolicy] = useState(null);
  const [claims, setClaims] = useState([]);
  const [isEventLoading, setIsEventLoading] = useState(false);
  const [payoutToast, setPayoutToast] = useState(null); // { count, amount }
  const payoutToastTimer = useRef(null);

  useEffect(() => {
    const loadRiskStatus = async () => {
      try {
        const data = await apiRequest('/api/risk/status');
        setIsDisrupted(Boolean(data.isDisrupted));
        setRainLevel(Number(data.rainLevel || 0));
      } catch (error) {
        console.error('Unable to load risk status', error);
      }
    };

    loadRiskStatus();
  }, []);

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem('aegis_user_data', JSON.stringify(user));
    }
  }, [user]);

  const updateSessionUser = (incomingUser) => {
    const nextUser = incomingUser?.id
      ? {
          ...GUEST_USER,
          ...incomingUser,
          balance: incomingUser.balance ?? 1250,
          zone: incomingUser.zone || 'Sector 62, Noida'
        }
      : GUEST_USER;

    setUser(nextUser);

    if (!nextUser.id) {
      localStorage.removeItem('aegis_user_data');
    }
  };

  const refreshProtectionData = async (userId) => {
    if (!userId) {
      setActivePolicy(null);
      setClaims([]);
      return;
    }

    const [policyResult, claimsResult] = await Promise.allSettled([
      apiRequest(`/api/policy/active/${userId}`),
      apiRequest(`/api/claims/${userId}`)
    ]);

    const nextPolicy = policyResult.status === 'fulfilled' ? policyResult.value : null;
    const nextClaims = claimsResult.status === 'fulfilled' ? claimsResult.value.claims || [] : [];

    setActivePolicy(nextPolicy);
    setClaims(nextClaims);
    setUser((currentUser) => (
      currentUser?.id === userId
        ? { ...currentUser, isProtected: Boolean(nextPolicy) }
        : currentUser
    ));
  };

  useEffect(() => {
    refreshProtectionData(user?.id);
  }, [user?.id]);

  const navigateTo = (page) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
    localStorage.setItem('aegis_current_page', page);
  };

  const handlePurchasePolicy = async (selectedTier) => {
    if (!user?.id) {
      throw new Error('Please sign in again before activating a shield.');
    }
    if (!isValidUUID(user.id)) {
      // Stale session detected at purchase time – force re-login
      localStorage.removeItem('aegis_user_data');
      updateSessionUser(null);
      throw new Error('Your session has expired. Please sign out and sign back in.');
    }

    const data = await apiRequest('/api/policy/purchase', {
      method: 'POST',
      body: JSON.stringify({
        user_id: user.id,
        selected_tier: selectedTier
      })
    });

    setActivePolicy(data.policy);
    setUser((currentUser) => ({ ...currentUser, isProtected: true }));
    await refreshProtectionData(user.id);
    return data.policy;
  };

  const handleVerifyAadhaar = async (aadhaarNumber) => {
    const data = await apiRequest('/api/user/verify-aadhaar', {
      method: 'POST',
      body: JSON.stringify({
        user_id: user.id,
        aadhaar_number: aadhaarNumber
      })
    });

    updateSessionUser({ ...user, ...data.user });
    return data.user;
  };

  const handleSimulateEvent = async () => {
    setIsEventLoading(true);
    try {
      const payload = isDisrupted
        ? { event_type: 'heavy_rain', rain: 0, disruption_hours: 0, hourly_rate: 150 }
        : { event_type: 'heavy_rain', rain: 12, disruption_hours: 3, hourly_rate: 150 };

      const data = await apiRequest('/api/admin/trigger-event', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      setIsDisrupted(Boolean(data.isDisrupted));
      setRainLevel(Number(data.rainLevel || 0));

      // Show payout toast if claims were auto-generated
      const realClaims = (data.claimsGenerated || []).filter(c => !c.note);
      if (data.isDisrupted && realClaims.length > 0) {
        const totalPayout = realClaims.reduce((sum, c) => sum + (c.payout_amount || 0), 0);
        setPayoutToast({ count: realClaims.length, amount: totalPayout });
        clearTimeout(payoutToastTimer.current);
        payoutToastTimer.current = setTimeout(() => setPayoutToast(null), 5000);
      }

      // Refresh protection data + fetch fresh user (with updated balance)
      if (user?.id && isValidUUID(user.id)) {
        setTimeout(async () => {
          await refreshProtectionData(user.id);
          // Fetch updated balance from DB
          try {
            const freshData = await apiRequest(`/api/user/${user.id}`);
            if (freshData?.user) {
              setUser(prev => ({ ...prev, balance: freshData.user.balance }));
            }
          } catch { /* non-critical */ }
        }, 600);
      }
    } catch (error) {
      console.error('Unable to trigger event', error);
    } finally {
      setIsEventLoading(false);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onStart={() => navigateTo('signin')} />;

      case 'signin':
        return (
          <SignIn
            onLogin={(userData) => {
              updateSessionUser({
                ...userData,
                balance: 1250,
                isProtected: false,
                zone: userData.zone || 'Sector 62, Noida'
              });
              navigateTo('dashboard');
            }}
            onNavigateToSignUp={() => navigateTo('signup')}
          />
        );

      case 'signup':
        return (
          <SignUp
            onRegister={() => navigateTo('signin')}
            onNavigateToSignIn={() => navigateTo('signin')}
          />
        );

      case 'dashboard':
        return (
          <WorkerDashboard
            user={user}
            setUser={updateSessionUser}
            activePolicy={activePolicy}
            claims={claims}
            isDisrupted={isDisrupted}
            rainLevel={rainLevel}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onPurchasePolicy={handlePurchasePolicy}
            onVerifyAadhaar={handleVerifyAadhaar}
            onRefreshProtection={() => refreshProtectionData(user.id)}
            onLogout={() => {
              setActiveTab('overview');
              setActivePolicy(null);
              setClaims([]);
              updateSessionUser(null);
              navigateTo('landing');
            }}
            onPolicyActivated={() => {
              startTransition(() => setActiveTab('overview'));
              navigateTo('dashboard');
            }}
          />
        );

      default:
        return <LandingPage onStart={() => navigateTo('signin')} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans selection:bg-blue-500/30 relative z-0">
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] -z-10 pointer-events-none"></div>

      {renderPage()}

      {currentPage === 'dashboard' && (
        <div className="fixed bottom-4 right-4 z-[100] flex gap-2">
          <button
            onClick={handleSimulateEvent}
            disabled={isEventLoading}
            className={`px-6 py-3 rounded-2xl text-xs font-black shadow-2xl transition-all uppercase tracking-widest disabled:opacity-60 ${
              isDisrupted ? 'bg-emerald-500 text-white' : 'bg-red-600 text-white animate-pulse'
            }`}
          >
            {isEventLoading
              ? 'Processing event...'
              : isDisrupted
                ? 'Reset Weather'
                : 'Simulate Heavy Rain'}
          </button>
        </div>
      )}

      {/* Auto-payout toast – appears after simulate generates claims */}
      {payoutToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-emerald-950/95 border border-emerald-500/40 backdrop-blur-md px-6 py-4 rounded-[20px] shadow-2xl shadow-black/40 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <span className="text-emerald-400 text-lg">⚡</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Auto-Payout Processed</p>
              <p className="text-sm font-bold text-emerald-100 mt-0.5">
                ₹{payoutToast.amount.toFixed(0)} credited across {payoutToast.count} policy{payoutToast.count > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
