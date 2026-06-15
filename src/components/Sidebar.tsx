import React from 'react';
import { useAuth } from '../context/AuthContext';
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
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'github', label: 'GitHub Analyzer', icon: Github },
    { id: 'dsa', label: 'DSA Tracker', icon: Code2 },
    { id: 'roadmap', label: 'AI Roadmap', icon: Map },
    { id: 'opensource', label: 'Open Source', icon: Flame },
    { id: 'interview', label: 'Interview Prep', icon: MessageSquareCode },
    { id: 'resume', label: 'Resume Analyzer', icon: FileSearch },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  const handleNav = (id: string) => {
    setActivePage(id);
    setIsOpen(false); // Close drawer on mobile click
  };

  const readinessScore = user?.scores?.careerReadiness || 0;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      {/* Main Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-[#262626] bg-[#0E0E10] text-[#E5E5E7] transition-all duration-300 ease-in-out
        md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-[#1C1C1E]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-lg shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              C
            </div>
            <div>
              <span className="font-sans font-bold tracking-tight text-white">CodeMentor</span>
              <span className="text-emerald-400 font-semibold px-1 rounded bg-emerald-500/10 border border-emerald-400/10 text-[9px] ml-1.5 uppercase font-mono tracking-widest">AI</span>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded p-1 text-[#8E8E93] hover:bg-[#1C1C1E] hover:text-white md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Middle */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`
                  flex w-full items-center gap-3.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 group
                  ${isActive 
                    ? 'bg-[#1C1C1E] border border-[#2D2D30] text-emerald-400 shadow-[2px_2px_12px_rgba(0,0,0,0.3)]' 
                    : 'text-[#8E8E93] hover:bg-[#151518] hover:text-white'
                  }
                `}
              >
                <Icon className={`h-4.5 w-4.5 transition-colors duration-200 ${isActive ? 'text-emerald-400' : 'text-[#8E8E93] group-hover:text-white'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Dynamic Metric Display card inside Sidebar */}
        {user?.onboarded && (
          <div className="px-4 py-4 mx-4 mb-4 rounded-xl border border-[#2D2D30] bg-[#141416]/50 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono tracking-wider text-[#8E8E93] uppercase">Overall Readiness</span>
              <span className="text-xs font-semibold text-emerald-400 font-mono">{readinessScore}%</span>
            </div>
            {/* Linear Progress Indicator */}
            <div className="h-2 w-full rounded-full bg-[#1C1C1E] overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)] transition-all duration-500"
                style={{ width: `${readinessScore}%` }}
              />
            </div>
            <p className="mt-2 text-[10px] text-[#8E8E93] leading-relaxed">
              Complete DSA questions and analyze your GitHub to raise your readiness index.
            </p>
          </div>
        )}

        {/* Footer Settings & Logout */}
        <div className="border-t border-[#1C1C1E] p-4 flex flex-col gap-1.5 bg-[#0A0A0C]">
          <button
            type="button"
            onClick={() => handleNav('settings')}
            className={`
              flex w-full items-center gap-3.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-200
              ${activePage === 'settings' 
                ? 'bg-[#1C1C1E] text-emerald-400' 
                : 'text-[#8E8E93] hover:bg-[#151518] hover:text-[#E5E5E7]'
              }
            `}
          >
            <SettingsIcon className="h-4.5 w-4.5" />
            <span>Settings</span>
          </button>
          
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3.5 rounded-lg px-4 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-colors duration-200"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Sign Out</span>
          </button>

          {/* Connected User Summary */}
          {user && (
            <div className="flex items-center gap-2.5 mt-3 pt-3 border-t border-[#1C1C1E]/55 px-1.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 font-semibold text-white text-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate max-w-[150px]">{user.name}</p>
                <p className="text-[10px] text-[#8E8E93] truncate max-w-[150px]">{user.email}</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
