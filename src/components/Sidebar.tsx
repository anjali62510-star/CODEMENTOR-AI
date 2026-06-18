import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { SidebarLogo } from './Logo';
import { CareerShip } from './CareerShip';
import { 
  Anchor, 
  Waves, 
  Compass, 
  Ship, 
  Radio, 
  Flame, 
  MessageSquareCode, 
  FileSearch, 
  User as UserIcon, 
  Settings as SettingsIcon,
  LogOut,
  X,
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
  const { user, logout, theme, toggleTheme } = useAuth();

  const currentTheme = theme;

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Command Deck', 
      icon: Anchor,
      gradient: 'from-[#0A2540] to-[#0F4C81]',
      glow: 'shadow-[#00B8D9]/25 dark:shadow-[#00B8D9]/40',
      textColor: 'text-cyan-500'
    },
    { 
      id: 'github', 
      label: 'Code Ocean Analytics', 
      icon: Waves,
      gradient: 'from-[#0F4C81] to-[#00B8D9]',
      glow: 'shadow-cyan-500/25 dark:shadow-cyan-500/40',
      textColor: 'text-cyan-400'
    },
    { 
      id: 'dsa', 
      label: 'Sea Lane Tracker', 
      icon: Compass,
      gradient: 'from-[#00B8D9] to-[#2DD4BF]',
      glow: 'shadow-teal-500/25 dark:shadow-teal-500/40',
      textColor: 'text-teal-400'
    },
    { 
      id: 'roadmap', 
      label: 'Navigation Route', 
      icon: Ship,
      gradient: 'from-[#67E8F9] to-[#00B8D9]',
      glow: 'shadow-cyan-500/25 dark:shadow-cyan-500/40',
      textColor: 'text-cyan-400'
    },
    { 
      id: 'coach', 
      label: 'Ocean Guide AI', 
      icon: Radio,
      gradient: 'from-[#0F4C81] to-[#67E8F9]',
      glow: 'shadow-cyan-500/25 dark:shadow-cyan-500/40',
      textColor: 'text-cyan-500'
    },
    { 
      id: 'opensource', 
      label: 'Voyage Discoveries', 
      icon: Flame,
      gradient: 'from-orange-400 to-amber-500',
      glow: 'shadow-orange-500/25 dark:shadow-orange-500/40',
      textColor: 'text-orange-500'
    },
    { 
      id: 'interview', 
      label: 'Harbor Interview Prep', 
      icon: MessageSquareCode,
      gradient: 'from-sky-400 to-[#0F4C81]',
      glow: 'shadow-blue-500/25 dark:shadow-blue-500/40',
      textColor: 'text-sky-400'
    },
    { 
      id: 'resume', 
      label: 'Recruiter Radar', 
      icon: FileSearch,
      gradient: 'from-[#0F4C81] to-[#2DD4BF]',
      glow: 'shadow-teal-500/25 dark:shadow-teal-500/40',
      textColor: 'text-teal-500'
    },
    { 
      id: 'profile', 
      label: 'Explorer Log', 
      icon: UserIcon,
      gradient: 'from-cyan-500 to-blue-600',
      glow: 'shadow-cyan-500/25 dark:shadow-cyan-500/40',
      textColor: 'text-cyan-500'
    },
  ];

  const handleNav = (id: string) => {
    setActivePage(id);
    setIsOpen(false);
  };

  const readinessScore = user?.scores?.careerReadiness || 0;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-[#0A2540]/40 dark:bg-black/75 md:hidden backdrop-blur-xs transition-opacity duration-300"
          id="sidebar-backdrop"
        />
      )}

      {/* Main Sidebar Container */}
      <aside 
        id="sidebar-container"
        className={`
          fixed top-0 bottom-0 left-0 z-50 flex w-66 flex-col border-r border-[#D2E1ED] dark:border-[#123456] bg-white dark:bg-[#061524] text-slate-800 dark:text-[#E5E5E7] transition-all duration-300 ease-in-out
          md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header Logo & Theme Toggle */}
        <div className="flex h-18 items-center justify-between px-5 border-b border-[#D2E1ED] dark:border-[#123456]">
          <SidebarLogo />

          <div className="flex items-center gap-1">
            {/* Animated Theme Toggle Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              id="theme-toggle-button"
              type="button"
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#0A2540] dark:hover:bg-[#123456] text-slate-700 dark:text-cyan-400 cursor-pointer transition-colors"
              title={`Switch to ${currentTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {currentTheme === 'dark' ? (
                <Sun className="h-4.5 w-4.5 text-cyan-400 animate-pulse" />
              ) : (
                <Moon className="h-4.5 w-4.5 text-[#0F4C81]" />
              )}
            </motion.button>

            <button 
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#123456] hover:text-slate-800 dark:hover:text-white md:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Gamification Level Stats Card at top of Sidebar */}
        {user?.onboarded && (
          <div className="px-5 pt-4 pb-2 border-b border-[#D2E1ED] dark:border-[#123456] bg-teal-50/20 dark:bg-[#030D18]/40">
            <CareerShip readiness={readinessScore} compact />
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
                    ? 'text-slate-900 dark:text-white font-extrabold bg-[#EAF2F8]/80 dark:bg-[#123456]/40 border border-[#D2E1ED] dark:border-[#123456]' 
                    : 'text-[#5C768D] dark:text-[#84A9C8] hover:bg-teal-50/20 dark:hover:bg-[#0A2540]/40 hover:text-cyan-600 dark:hover:text-cyan-400'
                  }
                `}
              >
                {/* Active Indicator Slide and Glow */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className={`absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full bg-gradient-to-b ${item.gradient} shadow-[0_0_10px_rgba(0,184,217,0.5)]`}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                {/* Rounded, animated, and colorful icon container */}
                <div className={`
                  flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-300 shrink-0
                  ${isActive 
                    ? `bg-gradient-to-br ${item.gradient} text-white shadow-md ${item.glow}` 
                    : `bg-slate-100 dark:bg-[#0A2540] text-slate-500 dark:text-[#84A9C8] group-hover:scale-105 group-hover:text-[#00B8D9] dark:group-hover:text-cyan-400`
                  }
                `}>
                  <Icon className="h-4 w-4 transition-transform duration-300 group-hover:rotate-6" />
                </div>

                <span className="truncate">{item.label}</span>

                {isActive && (
                  <span className="ml-auto flex h-1.5 w-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 shadow-sm" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Dynamic Metric Display card inside Sidebar */}
        {user?.onboarded && (
          <div className="px-4 py-4 mx-4 mb-3 rounded-2xl border border-[#D2E1ED] dark:border-[#123456] bg-cyan-50/15 dark:bg-[#030D18]/60 shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9.5px] font-mono tracking-wider text-slate-500 dark:text-cyan-400 uppercase font-bold flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-cyan-500" />
                <span>Voyage Route Readiness</span>
              </span>
              <span className="text-xs font-black text-[#0F4C81] dark:text-cyan-400 font-mono">{readinessScore}%</span>
            </div>
            <div className="flex items-center gap-1.5 mb-1">
              <Compass className="h-3 w-3 text-[#00B8D9] animate-pulse" />
              <span className="text-[8px] font-mono text-[#5C768D] dark:text-cyan-400 font-bold">Career Compass Bearing</span>
            </div>
            {/* Linear Progress Indicator */}
            <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-[#0A2540] overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-[#0F4C81] via-[#00B8D9] to-[#2DD4BF] transition-all duration-1000"
                style={{ width: `${readinessScore}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer Settings & Logout */}
        <div className="border-t border-[#D2E1ED] dark:border-[#123456] p-4 flex flex-col gap-1 bg-[#F8FAFC] dark:bg-[#030D18]">
          <button
            type="button"
            id="nav-settings"
            onClick={() => handleNav('settings')}
            className={`
              flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer transition-colors duration-200
              ${activePage === 'settings' 
                ? 'bg-[#EAF2F8] dark:bg-[#123456] text-cyan-600 dark:text-cyan-400' 
                : 'text-[#5C768D] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#0A2540] hover:text-[#00B8D9] dark:hover:text-cyan-400'
              }
            `}
          >
            <SettingsIcon className="h-4 w-4" />
            <span>Deck Settings</span>
          </button>
          
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 cursor-pointer transition-colors duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Abandon Ship</span>
          </button>

          {/* Connected User Summary */}
          {user && (
            <div className="flex items-center gap-2.5 mt-2 pt-2.5 border-t border-[#D2E1ED] dark:border-[#123456] px-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#0F4C81] to-[#00B8D9] font-bold text-white text-xs shadow-xs shrink-0 uppercase">
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-extrabold text-slate-800 dark:text-white truncate max-w-[140px]">{user.name}</p>
                <p className="text-[10px] text-[#5C768D] dark:text-[#84A9C8] truncate max-w-[140px]">{user.email}</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
