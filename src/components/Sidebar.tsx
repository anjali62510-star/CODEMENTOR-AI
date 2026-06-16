import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { SidebarLogo } from './Logo';
import { 
  LayoutDashboard, 
  Github, 
  Code2, 
  Map, 
  Flame, 
  MessageSquareCode, 
  FileSearch, 
  User as UserIcon, 
  Settings as SettingsIcon,
  LogOut,
  X,
  Bot,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isOpen, setIsOpen }) => {
  const { user, logout, updateSettings } = useAuth();

  const currentTheme = user?.settings?.theme || 'dark';

  const toggleTheme = async () => {
    if (!user) return;
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    try {
      await updateSettings({
        theme: nextTheme,
        emailNotifications: user?.settings?.emailNotifications !== false
      });
    } catch (err) {
      console.error('Failed to toggle theme:', err);
    }
  };

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      gradient: 'from-violet-500 to-fuchsia-500',
      glow: 'shadow-violet-500/25 dark:shadow-violet-500/40',
      textColor: 'text-violet-500'
    },
    { 
      id: 'github', 
      label: 'GitHub Analyzer', 
      icon: Github,
      gradient: 'from-sky-500 to-blue-600',
      glow: 'shadow-sky-500/25 dark:shadow-sky-500/40',
      textColor: 'text-sky-500'
    },
    { 
      id: 'dsa', 
      label: 'DSA Tracker', 
      icon: Code2,
      gradient: 'from-emerald-400 to-teal-500',
      glow: 'shadow-emerald-500/25 dark:shadow-emerald-500/40',
      textColor: 'text-emerald-500'
    },
    { 
      id: 'roadmap', 
      label: 'AI Roadmap', 
      icon: Map,
      gradient: 'from-amber-400 to-orange-500',
      glow: 'shadow-amber-500/25 dark:shadow-amber-500/40',
      textColor: 'text-amber-500'
    },
    { 
      id: 'coach', 
      label: 'AI Career Coach', 
      icon: Bot,
      gradient: 'from-pink-400 to-rose-500',
      glow: 'shadow-pink-500/25 dark:shadow-pink-500/40',
      textColor: 'text-pink-500'
    },
    { 
      id: 'opensource', 
      label: 'Open Source', 
      icon: Flame,
      gradient: 'from-orange-500 to-red-600',
      glow: 'shadow-orange-500/25 dark:shadow-orange-500/40',
      textColor: 'text-orange-500'
    },
    { 
      id: 'interview', 
      label: 'Interview Prep', 
      icon: MessageSquareCode,
      gradient: 'from-cyan-400 to-blue-500',
      glow: 'shadow-cyan-500/25 dark:shadow-cyan-500/40',
      textColor: 'text-cyan-500'
    },
    { 
      id: 'resume', 
      label: 'Resume Analyzer', 
      icon: FileSearch,
      gradient: 'from-indigo-500 to-purple-600',
      glow: 'shadow-indigo-500/25 dark:shadow-indigo-500/40',
      textColor: 'text-indigo-500'
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: UserIcon,
      gradient: 'from-fuchsia-500 to-pink-600',
      glow: 'shadow-fuchsia-500/25 dark:shadow-fuchsia-500/40',
      textColor: 'text-fuchsia-500'
    },
  ];

  const handleNav = (id: string) => {
    setActivePage(id);
    setIsOpen(false);
  };

  const readinessScore = user?.scores?.careerReadiness || 0;

  // Level System
  const getLevel = (score: number) => {
    if (score < 25) return { name: 'Beginner', lvl: 1, color: 'text-violet-500 bg-violet-500/10' };
    if (score < 50) return { name: 'Explorer', lvl: 10, color: 'text-sky-500 bg-sky-500/10' };
    if (score < 75) return { name: 'Builder', lvl: 25, color: 'text-amber-500 bg-amber-500/10' };
    return { name: 'Future Engineer', lvl: 50, color: 'text-emerald-500 bg-emerald-500/10' };
  };

  const userLevel = getLevel(readinessScore);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 dark:bg-black/75 md:hidden backdrop-blur-xs transition-opacity duration-300"
          id="sidebar-backdrop"
        />
      )}

      {/* Main Sidebar Container */}
      <aside 
        id="sidebar-container"
        className={`
          fixed top-0 bottom-0 left-0 z-50 flex w-66 flex-col border-r border-slate-200/80 dark:border-[#1E293B] bg-white dark:bg-[#0E0E10] text-slate-800 dark:text-[#E5E5E7] transition-all duration-300 ease-in-out
          md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header Logo & Theme Toggle */}
        <div className="flex h-18 items-center justify-between px-5 border-b border-slate-100 dark:border-[#1C1C1E]">
          <SidebarLogo />

          <div className="flex items-center gap-1">
            {/* Animated Theme Toggle Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              id="theme-toggle-button"
              type="button"
              aria-label="Toggle Theme"
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#1C1C1E] dark:hover:bg-[#2D2D30] text-slate-700 dark:text-amber-400 cursor-pointer transition-colors"
              title={`Switch to ${currentTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {currentTheme === 'dark' ? (
                <Sun className="h-4.5 w-4.5 text-amber-400 animate-pulse" />
              ) : (
                <Moon className="h-4.5 w-4.5 text-violet-600" />
              )}
            </motion.button>

            <button 
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1C1C1E] hover:text-slate-800 dark:hover:text-white md:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Gamification Level Stats Card at top of Sidebar */}
        {user?.onboarded && (
          <div className="px-5 pt-4 pb-2 border-b border-slate-100 dark:border-[#1C1C1E] bg-slate-50/50 dark:bg-[#09090B]/40">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs shadow-xs shrink-0 font-bold">
                🔥
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${userLevel.color}`}>
                    Level {userLevel.lvl}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold truncate">
                    {userLevel.name}
                  </span>
                </div>
                <p className="text-[9px] text-[#8E8E93] truncate">12 Day Coding Streak 🔥</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Middle */}
        <nav className="flex-1 space-y-1.5 px-3 py-5 overflow-y-auto" id="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                id={`nav-${item.id}`}
                onClick={() => handleNav(item.id)}
                className={`
                  relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold tracking-tight transition-all duration-300 group cursor-pointer
                  ${isActive 
                    ? 'text-slate-900 dark:text-white font-extrabold bg-slate-100 dark:bg-[#1C1C1E] border border-slate-200/50 dark:border-[#2D2D30]/60' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#151518]/60 hover:text-slate-800 dark:hover:text-white'
                  }
                `}
              >
                {/* Active Indicator Slide and Glow */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className={`absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full bg-gradient-to-b ${item.gradient} shadow-[0_0_10px_rgba(139,92,246,0.5)]`}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                {/* Rounded, animated, and colorful icon container */}
                <div className={`
                  flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-300 shrink-0
                  ${isActive 
                    ? `bg-gradient-to-br ${item.gradient} text-white shadow-md ${item.glow}` 
                    : `bg-slate-100 dark:bg-[#18181B] text-slate-500 dark:text-slate-400 group-hover:scale-105 group-hover:text-slate-800 dark:group-hover:text-white`
                  }
                `}>
                  <Icon className="h-4 w-4 transition-transform duration-300 group-hover:rotate-6" />
                </div>

                <span className="truncate">{item.label}</span>

                {isActive && (
                  <span className="ml-auto flex h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-sm" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Dynamic Metric Display card inside Sidebar */}
        {user?.onboarded && (
          <div className="px-4 py-4 mx-4 mb-3 rounded-2xl border border-slate-150 dark:border-[#2D2D30] bg-[#F8FAFC]/90 dark:bg-[#141416]/40 shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9.5px] font-mono tracking-wider text-slate-500 dark:text-[#8E8E93] uppercase font-bold flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-violet-500" />
                <span>Readiness Score</span>
              </span>
              <span className="text-xs font-black text-violet-600 dark:text-emerald-400 font-mono">{readinessScore}%</span>
            </div>
            {/* Linear Progress Indicator */}
            <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-[#1C1C1E] overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-violet-500 via-sky-400 to-emerald-400 transition-all duration-1000"
                style={{ width: `${readinessScore}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer Settings & Logout */}
        <div className="border-t border-slate-100 dark:border-[#1C1C1E] p-4 flex flex-col gap-1 bg-slate-50 dark:bg-[#0A0A0C]">
          <button
            type="button"
            id="nav-settings"
            onClick={() => handleNav('settings')}
            className={`
              flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer transition-colors duration-200
              ${activePage === 'settings' 
                ? 'bg-slate-200 dark:bg-[#1C1C1E] text-violet-600 dark:text-emerald-400' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#151518] hover:text-slate-800 dark:hover:text-[#E5E5E7]'
              }
            `}
          >
            <SettingsIcon className="h-4 w-4" />
            <span>Settings</span>
          </button>
          
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 cursor-pointer transition-colors duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>

          {/* Connected User Summary */}
          {user && (
            <div className="flex items-center gap-2.5 mt-2 pt-2.5 border-t border-slate-200/60 dark:border-[#1C1C1E]/55 px-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 font-bold text-white text-xs shadow-xs shrink-0 uppercase">
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-extrabold text-slate-850 dark:text-white truncate max-w-[140px]">{user.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-[#8E8E93] truncate max-w-[140px]">{user.email}</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
