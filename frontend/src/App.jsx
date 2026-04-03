import React, { useState } from 'react';
import LandingPage from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import WorkerDashboard from './pages/WorkerDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem('aegis_current_page');
    return saved === 'dashboard' ? 'dashboard' : 'landing';
  });
  
  // NEW: This state controls the sidebar navigation inside the Dashboard
  const [activeTab, setActiveTab] = useState('overview'); 

  const [isDisrupted, setIsDisrupted] = useState(false);
  const [rainLevel, setRainLevel] = useState(0);

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('aegis_user_data');
    return saved ? JSON.parse(saved) : {
      name: "Guest User",
      zone: "Unknown",
      balance: 0,
      isProtected: false
    };
  });

  const navigateTo = (page) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
    localStorage.setItem('aegis_current_page', page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onStart={() => navigateTo('signin')} />;
      
      case 'signin':
        return <SignIn 
           onLogin={(userData) => {
             const sessionUser = { 
               ...userData, 
               balance: 1250, 
               isProtected: true,
               zone: userData.zone || "Sector 62, Noida"
             };
             setUser(sessionUser);
             localStorage.setItem('aegis_user_data', JSON.stringify(sessionUser));
             navigateTo('dashboard');
           }} 
           onNavigateToSignUp={() => navigateTo('signup')} 
        />;
      
      case 'signup':
        return <SignUp 
          onRegister={() => navigateTo('signin')} 
          onNavigateToSignIn={() => navigateTo('signin')} 
        />;
      
      case 'dashboard':
        return (
          <WorkerDashboard 
            user={user} 
            setUser={setUser}
            isDisrupted={isDisrupted} 
            rainLevel={rainLevel}
            activeTab={activeTab}         // PASSING THIS
            setActiveTab={setActiveTab}   // PASSING THIS
            onLogout={() => {
                setActiveTab('overview'); // Reset tab on logout
                localStorage.removeItem('aegis_user_data');
                setUser({ name: "Guest User", zone: "Unknown", balance: 0, isProtected: false });
                navigateTo('landing');
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

      {/* Simulation Toggle */}
      {currentPage === 'dashboard' && (
        <div className="fixed bottom-4 right-4 z-[100] flex gap-2">
           <button 
            onClick={() => {
              const nextState = !isDisrupted;
              setIsDisrupted(nextState);
              setRainLevel(nextState ? 12 : 0);
            }}
            className={`px-6 py-3 rounded-2xl text-xs font-black shadow-2xl transition-all uppercase tracking-widest ${
              isDisrupted ? 'bg-emerald-500 text-white' : 'bg-red-600 text-white animate-pulse'
            }`}
          >
            {isDisrupted ? "☀️ Reset Weather" : "🌧️ { CLICK HERE TO SEE } Simulate Heavy Rain (ONLY FOR DEMO AS WE don't have a real-time weather satellite or IoT sensors connected"}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;