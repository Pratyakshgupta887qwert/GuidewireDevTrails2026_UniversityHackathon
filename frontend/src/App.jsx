import React, { startTransition, useEffect, useState } from 'react';
import LandingPage from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import WorkerDashboard from './pages/WorkerDashboard';
import { apiRequest } from './lib/api';

const GUEST_USER = {
  name: 'Guest User',
  zone: 'Unknown',
  balance: 0,
  isProtected: false,
  aadhaar_verified: false
};

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem('aegis_current_page');
    return saved === 'dashboard' ? 'dashboard' : 'landing';
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [isDisrupted, setIsDisrupted] = useState(false);
  const [rainLevel, setRainLevel] = useState(0);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('aegis_user_data');
    return saved ? { ...GUEST_USER, ...JSON.parse(saved) } : GUEST_USER;
  });
  const [activePolicy, setActivePolicy] = useState(null);
  const [claims, setClaims] = useState([]);
  const [isEventLoading, setIsEventLoading] = useState(false);

  useEffect(() => {
    const loadRiskStatus = async () => {
      try {
        const data = await apiRequest('/api/risk-status');
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

      if (user?.id) {
        await refreshProtectionData(user.id);
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
    </div>
  );
}

export default App;
