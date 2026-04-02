import React, { useState } from 'react';
import LandingPage from './pages/Landing';
import SignIn from './pages/SignIn';
import WorkerDashboard from './pages/WorkerDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  
  // NEW: This state controls the sidebar navigation inside the Dashboard
  const [activeTab, setActiveTab] = useState('overview'); 

  const [isDisrupted, setIsDisrupted] = useState(false);
  const [rainLevel, setRainLevel] = useState(0);

  const [user] = useState({
    name: "Rahul Kumar",
    zone: "New Delhi - Sector 62",
    balance: 1250,
    isProtected: true
  });

  const navigateTo = (page) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onStart={() => navigateTo('signin')} />;
      
      case 'signin':
        return <SignIn onLogin={() => navigateTo('dashboard')} />;
      
      case 'dashboard':
        return (
          <WorkerDashboard 
            user={user} 
            isDisrupted={isDisrupted} 
            rainLevel={rainLevel}
            activeTab={activeTab}         // PASSING THIS
            setActiveTab={setActiveTab}   // PASSING THIS
            onLogout={() => {
                setActiveTab('overview'); // Reset tab on logout
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
            {isDisrupted ? "☀️ Reset Weather" : "🌧️ Simulate Heavy Rain"}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;