import React, { startTransition, useEffect, useRef, useState } from 'react';
import LandingPage from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import WorkerDashboard from './pages/WorkerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { apiRequest } from './lib/api';
import { formatCurrency } from './lib/insurance';

const ADMIN_PHONE = '9998887776';

const GUEST_USER = {
  name: 'Guest User',
  phone: '',
  city: '',
  pan_card: '',
  balance: 0,
  aadhaar_verified: false,
  aadhaar_number: '',
  avg_daily_income: 1200,
  working_hours: 10,
};

const EMPTY_SUMMARY = {
  total_premium_paid: 0,
  total_payout_received: 0,
  profit: 0,
};

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const storedPage = localStorage.getItem('aegis_current_page');
    if (storedPage === 'dashboard' || storedPage === 'admin-dashboard') return storedPage;
    return 'landing';
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('aegis_user_data');
    if (!saved) {
      return GUEST_USER;
    }

    try {
      return { ...GUEST_USER, ...JSON.parse(saved) };
    } catch {
      return GUEST_USER;
    }
  });
  const [activePolicy, setActivePolicy] = useState(null);
  const [claims, setClaims] = useState([]);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [riskSnapshot, setRiskSnapshot] = useState(null);
  const [isEventLoading, setIsEventLoading] = useState(false);
  const [payoutToast, setPayoutToast] = useState(null);
  const payoutToastTimer = useRef(null);

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem('aegis_user_data', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    if (!user?.city) {
      setRiskSnapshot(null);
      return;
    }

    const loadRiskScore = async () => {
      try {
        const data = await apiRequest('/api/risk-score', {
          method: 'POST',
          body: JSON.stringify({ city: user.city }),
        });
        setRiskSnapshot(data);
      } catch (error) {
        console.error('Unable to load risk score', error);
      }
    };

    loadRiskScore();
  }, [user?.city]);

  const updateSessionUser = (incomingUser) => {
    const nextUser = incomingUser?.id ? { ...GUEST_USER, ...incomingUser } : GUEST_USER;
    setUser(nextUser);

    if (!nextUser.id) {
      localStorage.removeItem('aegis_user_data');
    }
  };

  const navigateTo = (page) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
    localStorage.setItem('aegis_current_page', page);
  };

  const refreshProtectionData = async (userId) => {
    if (!userId) {
      setActivePolicy(null);
      setClaims([]);
      setSummary(EMPTY_SUMMARY);
      return;
    }

    const [policyResult, claimsResult, userResult] = await Promise.allSettled([
      apiRequest(`/api/policy/active/${userId}`),
      apiRequest(`/api/claims/${userId}`),
      apiRequest(`/api/user/${userId}`),
    ]);

    setActivePolicy(policyResult.status === 'fulfilled' ? policyResult.value : null);
    setClaims(claimsResult.status === 'fulfilled' ? claimsResult.value.claims || [] : []);
    setSummary(claimsResult.status === 'fulfilled' ? claimsResult.value.summary || EMPTY_SUMMARY : EMPTY_SUMMARY);

    if (userResult.status === 'fulfilled') {
      updateSessionUser(userResult.value.user);
    }
  };

  useEffect(() => {
    refreshProtectionData(user?.id);
  }, [user?.id]);

  const handlePurchasePolicy = async (selectedTier) => {
    if (!user?.id) {
      throw new Error('Please sign in before activating a shield.');
    }

    const data = await apiRequest('/api/policy/purchase', {
      method: 'POST',
      body: JSON.stringify({
        user_id: user.id,
        selected_tier: selectedTier,
      }),
    });

    setActivePolicy(data.policy);
    await refreshProtectionData(user.id);
    return data.policy;
  };

  const handleVerifyAadhaar = async ({ aadhaarNumber, otp }) => {
    const data = await apiRequest('/api/user/verify-aadhaar', {
      method: 'POST',
      body: JSON.stringify({
        user_id: user.id,
        aadhaar_number: aadhaarNumber,
        otp,
      }),
    });

    updateSessionUser(data.user);
    return data.user;
  };

  const handleSimulateEvent = async () => {
    if (!user?.id) {
      return;
    }

    setIsEventLoading(true);

    try {
      const data = await apiRequest('/api/simulate-event', {
        method: 'POST',
        body: JSON.stringify({ user_id: user.id }),
      });

      updateSessionUser(data.user);
      await refreshProtectionData(user.id);

      setPayoutToast({
        payout: data.payout,
        disruptionHours: data.disruption_hours,
        hourlyIncome: data.hourly_income,
      });

      clearTimeout(payoutToastTimer.current);
      payoutToastTimer.current = setTimeout(() => setPayoutToast(null), 4500);
    } catch (error) {
      console.error('Unable to simulate event', error);
      setPayoutToast({
        error: error.message,
      });
      clearTimeout(payoutToastTimer.current);
      payoutToastTimer.current = setTimeout(() => setPayoutToast(null), 4500);
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
            onLogin={(userData, phone) => {
              updateSessionUser(userData);
              if (phone === ADMIN_PHONE) {
                navigateTo('admin-dashboard');
              } else {
                navigateTo('dashboard');
              }
            }}
            onNavigateToSignUp={() => navigateTo('signup')}
          />
        );
      case 'admin-dashboard':
        return (
          <AdminDashboard
            onLogout={() => {
              updateSessionUser(null);
              navigateTo('landing');
            }}
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
            summary={summary}
            riskSnapshot={riskSnapshot}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onPurchasePolicy={handlePurchasePolicy}
            onVerifyAadhaar={handleVerifyAadhaar}
            onRefreshProtection={() => refreshProtectionData(user.id)}
            onLogout={() => {
              setActiveTab('overview');
              setActivePolicy(null);
              setClaims([]);
              setSummary(EMPTY_SUMMARY);
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
            className="px-6 py-3 rounded-2xl text-xs font-black shadow-2xl transition-all uppercase tracking-widest disabled:opacity-60 bg-red-600 text-white"
          >
            {isEventLoading ? 'Processing event...' : 'Simulate Heavy Rain'}
          </button>
        </div>
      )}

      {payoutToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`backdrop-blur-md px-6 py-4 rounded-[20px] shadow-2xl shadow-black/40 border ${
            payoutToast.error
              ? 'bg-rose-950/95 border-rose-500/40'
              : 'bg-emerald-950/95 border-emerald-500/40'
          }`}>
            <p className={`text-[10px] font-black uppercase tracking-widest ${
              payoutToast.error ? 'text-rose-300' : 'text-emerald-400'
            }`}>
              {payoutToast.error ? 'Simulation Blocked' : 'Heavy Rain Payout Processed'}
            </p>
            <p className={`text-sm font-bold mt-1 ${
              payoutToast.error ? 'text-rose-100' : 'text-emerald-100'
            }`}>
              {payoutToast.error
                ? payoutToast.error
                : `${formatCurrency(payoutToast.payout)} credited for ${payoutToast.disruptionHours} disruption hours at ${formatCurrency(payoutToast.hourlyIncome)}/hr`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
