import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { GitHubAnalyzer } from './pages/GitHubAnalyzer';
import { DSATracker } from './pages/DSATracker';
import { AIRoadmap } from './pages/AIRoadmap';
import { OpenSource } from './pages/OpenSource';
import { InterviewPrep } from './pages/InterviewPrep';
import { ResumeAnalyzer } from './pages/ResumeAnalyzer';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { Menu } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState('landing');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If initial auth session is validating, show simple spinner
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090B] font-mono text-xs text-[#8E8E93]">
        Initial security handshake verifying...
      </div>
    );
  }

  // Not Authenticated Routing Layer
  if (!user) {
    // If they got lost, redirect them to a valid un-auth screen
    if (!['landing', 'login', 'signup'].includes(activePage)) {
      setActivePage('landing');
    }

    switch (activePage) {
      case 'login':
        return <Login onNavigate={setActivePage} />;
      case 'signup':
        return <Signup onNavigate={setActivePage} />;
      case 'landing':
      default:
        return <LandingPage onNavigate={setActivePage} />;
    }
  }

  // Authenticated Rules: Onboarding takes absolute priority
  if (!user.onboarded) {
    return <Onboarding onNavigate={setActivePage} />;
  }

  // If onboarded, landing redirects directly to main metrics dashboard
  if (activePage === 'landing' || activePage === 'signup' || activePage === 'login') {
    setActivePage('dashboard');
  }

  // Render proper sub-page inside dashboard container
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard setActivePage={setActivePage} />;
      case 'github':
        return <GitHubAnalyzer />;
      case 'dsa':
        return <DSATracker />;
      case 'roadmap':
        return <AIRoadmap />;
      case 'opensource':
        return <OpenSource />;
      case 'interview':
        return <InterviewPrep />;
      case 'resume':
        return <ResumeAnalyzer />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-[#E5E5E7] select-none selection:bg-emerald-500 selection:text-black">
      {/* Sidebar navigation */}
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />

      {/* Main app contents layer on Desktop has sidebar offsets */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        {/* Mobile Header Bar */}
        <header className="flex h-16 items-center justify-between border-b border-[#1C1C1E] bg-[#0E0E10] px-6 md:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-sm">
              C
            </div>
            <span className="font-sans font-bold tracking-tight text-white text-sm">CodeMentor AI</span>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded p-1.5 text-[#8E8E93] hover:bg-[#1C1C1E] hover:text-white"
          >
            <Menu className="h-5.5 w-5.5" />
          </button>
        </header>

        {/* Dynamic page content wrapper */}
        <main className="flex-1 px-4 py-8 md:px-10 md:py-10">
          <div className="mx-auto max-w-6xl">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
