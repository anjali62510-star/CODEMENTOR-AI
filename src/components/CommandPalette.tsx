import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Sparkles, 
  Settings, 
  User as UserIcon, 
  LogOut, 
  Sun, 
  Moon, 
  Github, 
  Code2, 
  Map, 
  Bot, 
  Flame, 
  MessageSquareCode, 
  FileSearch, 
  LayoutDashboard,
  CornerDownLeft,
  Terminal,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface CommandPaletteProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

interface CommandItem {
  id: string;
  label: string;
  description: string;
  category: 'Navigation' | 'Actions' | 'Settings & Identity';
  icon: React.ComponentType<any>;
  keywords: string[];
  action: () => void;
  shortcut?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ activePage, setActivePage }) => {
  const { user, logout, theme, toggleTheme } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const overlayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Define Command Palette list
  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-dashboard',
      label: 'Go to Command Deck',
      description: 'Overview of your carrier readiness and milestones',
      category: 'Navigation',
      icon: LayoutDashboard,
      keywords: ['dashboard', 'home', 'main', 'overview', 'readiness', 'deck', 'command'],
      action: () => {
        setActivePage('dashboard');
        setIsOpen(false);
      }
    },
    {
      id: 'nav-github',
      label: 'Go to Code Ocean Analytics',
      description: 'Audit your public repositories and contribution heatmap',
      category: 'Navigation',
      icon: Github,
      keywords: ['github', 'analytics', 'portfolio', 'repos', 'pulls', 'commit', 'wave', 'current'],
      action: () => {
        setActivePage('github');
        setIsOpen(false);
      }
    },
    {
      id: 'nav-dsa',
      label: 'Go to Sea Lane Tracker',
      description: 'Track coding problems, milestones, and space boundaries',
      category: 'Navigation',
      icon: Code2,
      keywords: ['dsa', 'leetcode', 'algorithms', 'structure', 'milestone', 'compile', 'sea', 'reef'],
      action: () => {
        setActivePage('dsa');
        setIsOpen(false);
      }
    },
    {
      id: 'nav-roadmap',
      label: 'Go to Learning Voyage',
      description: 'Adaptive dynamic computer science study paths',
      category: 'Navigation',
      icon: Map,
      keywords: ['roadmap', 'study', 'tracks', 'skills', 'learn', 'path', 'voyage', 'ship'],
      action: () => {
        setActivePage('roadmap');
        setIsOpen(false);
      }
    },
    {
      id: 'nav-coach',
      label: 'Go to Ocean Guide AI',
      description: 'Chat with personalized mentoring companion',
      category: 'Navigation',
      icon: Bot,
      keywords: ['coach', 'chat', 'guidance', 'career', 'advice', 'mentor', 'ai', 'captain'],
      action: () => {
        setActivePage('coach');
        setIsOpen(false);
      }
    },
    {
      id: 'nav-opensource',
      label: 'Go to Open Source Voyager',
      description: 'Discover curated active community repositories',
      category: 'Navigation',
      icon: Flame,
      keywords: ['opensource', 'open-source', 'community', 'contribute', 'good first issue', 'voyager', 'tide', 'shallows'],
      action: () => {
        setActivePage('opensource');
        setIsOpen(false);
      }
    },
    {
      id: 'nav-interview',
      label: "Go to Captain's Audit Gate",
      description: 'Conduct customized full mock interviews',
      category: 'Navigation',
      icon: MessageSquareCode,
      keywords: ['interview', 'prep', 'mock', 'questions', 'technical', 'answers', 'captain', 'audit', 'gate'],
      action: () => {
        setActivePage('interview');
        setIsOpen(false);
      }
    },
    {
      id: 'nav-resume',
      label: 'Go to Recruiter Radar',
      description: 'Upload and improvise resume bullets format',
      category: 'Navigation',
      icon: FileSearch,
      keywords: ['resume', 'bullet', 'ats', 'star', 'achievement', 'portfolio', 'radar', 'recruiter'],
      action: () => {
        setActivePage('resume');
        setIsOpen(false);
      }
    },
    {
      id: 'nav-profile',
      label: 'Go to Profile Page',
      description: 'Review your credentials and credentials index page',
      category: 'Navigation',
      icon: UserIcon,
      keywords: ['profile', 'user', 'credentials', 'account', 'me'],
      action: () => {
        setActivePage('profile');
        setIsOpen(false);
      }
    },
    {
      id: 'nav-settings',
      label: 'Go to Settings',
      description: 'Configure layout parameters and profile preferences',
      category: 'Navigation',
      icon: Settings,
      keywords: ['settings', 'preferences', 'theme', 'config', 'setup'],
      action: () => {
        setActivePage('settings');
        setIsOpen(false);
      }
    },
    
    // Quick Actions
    {
      id: 'act-github',
      label: 'Action: Search Code Ocean Analytics',
      description: 'Directly analyze active codebases and readiness',
      category: 'Actions',
      icon: Sparkles,
      keywords: ['search', 'find', 'locate', 'audit', 'repos'],
      action: () => {
        setActivePage('github');
        setIsOpen(false);
      }
    },
    {
      id: 'act-dsa',
      label: 'Action: Check Sea Lane Progress',
      description: 'Evaluate compiled milestones and open algorithms',
      category: 'Actions',
      icon: Code2,
      keywords: ['check', 'grade', 'progress', 'completed', 'leetcode'],
      action: () => {
        setActivePage('dsa');
        setIsOpen(false);
      }
    },
    {
      id: 'act-coach',
      label: 'Action: Consult Ocean Guide AI',
      description: 'Initiate mentoring session inside coach terminal',
      category: 'Actions',
      icon: Bot,
      keywords: ['consult', 'ask', 'talk', 'chat', 'advise'],
      action: () => {
        setActivePage('coach');
        setIsOpen(false);
      }
    },

    // Settings & Identity
    {
      id: 'uti-theme',
      label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      description: 'Toggles light/dark palette for active interfaces',
      category: 'Settings & Identity',
      icon: theme === 'dark' ? Sun : Moon,
      keywords: ['theme', 'dark', 'light', 'contrast', 'color', 'toggle'],
      action: () => {
        toggleTheme();
        setIsOpen(false);
      }
    },
    {
      id: 'uti-logout',
      label: 'Log Out Profile',
      description: 'Sign out and secure current workspace session',
      category: 'Settings & Identity',
      icon: LogOut,
      keywords: ['logout', 'exit', 'signout', 'leave'],
      action: () => {
        logout();
        setIsOpen(false);
      }
    }
  ];

  // Filter commands by search input
  const filteredCommands = commands.filter((cmd) => {
    const term = search.toLowerCase();
    return (
      cmd.label.toLowerCase().includes(term) ||
      cmd.description.toLowerCase().includes(term) ||
      cmd.keywords.some(kw => kw.includes(term)) ||
      cmd.category.toLowerCase().includes(term)
    );
  });

  // Listen for global Ctrl/Cmd + K hotkey inputs
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, []);

  // Sync index to stay within boundaries after filtering changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Handle dialog navigation keys when keyboard is focused
  useEffect(() => {
    if (!isOpen) return;

    const handleKeys = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev >= filteredCommands.length - 1 ? 0 : prev + 1
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev <= 0 ? filteredCommands.length - 1 : prev - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [isOpen, selectedIndex, filteredCommands]);

  // Auto-scroll list to keep selected command fully visible
  useEffect(() => {
    if (!isOpen) return;
    const selectedEl = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex, isOpen]);

  // Autofocus input on open
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Header indicator badge styled like a modern SaaS navigation menu */}
      {user && (
        <div className="fixed bottom-6 right-6 z-40 hidden md:block select-none">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-[#2C2C30]/80 bg-white/90 dark:bg-[#101012]/90 backdrop-blur-md shadow-lg text-slate-600 dark:text-[#AEAEB2] hover:text-violet-600 dark:hover:text-white transition-all hover:scale-[1.03] cursor-pointer"
            title="Open Command Palette (Ctrl+K)"
          >
            <Terminal className="h-4 w-4 text-violet-500 dark:text-violet-400" />
            <span className="text-xs font-bold font-sans">Command Palette</span>
            <div className="flex items-center gap-0.5 ml-1 bg-slate-100 dark:bg-slate-800 text-[10px] font-mono px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700/50">
              <span>⌘</span><span>K</span>
            </div>
          </button>
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <div 
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 bg-slate-950/40 dark:bg-black/60 backdrop-blur-xs overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-2xl rounded-2xl border border-slate-200/90 dark:border-[#2D2D31]/80 bg-white dark:bg-[#111113] shadow-2xl overflow-hidden shadow-slate-900/10 dark:shadow-black/70"
            >
              {/* Search Header Bar */}
              <div className="flex items-center gap-3.5 px-4 py-4 border-b border-slate-150 dark:border-[#1E1E22]">
                <Search className="h-5 w-5 text-slate-400 dark:text-[#8E8E93] shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a command or search keywords..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent border-0 ring-0 outline-hidden text-[#0F172A] dark:text-[#E5E5E7] text-[14px] placeholder-slate-400 dark:placeholder-[#5E5E65] font-sans font-medium"
                />
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-[10px] font-mono font-bold text-slate-400 dark:text-[#8E8E93] bg-slate-100 dark:bg-[#1C1C1E] px-2 py-1 rounded-md border border-slate-200/60 dark:border-[#2C2C30]"
                >
                  ESC
                </button>
              </div>

              {/* Commands List Container */}
              <div 
                ref={listRef}
                className="max-h-[360px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800"
              >
                {filteredCommands.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                    <Terminal className="h-8 w-8 text-slate-350 dark:text-[#5E5E65] mb-2" />
                    <span className="text-xs font-bold text-slate-700 dark:text-[#E2E2E2]">No matching commands found</span>
                    <span className="text-[10.5px] text-slate-450 dark:text-[#8E8E93] mt-1 font-medium">Try searching for simple items like "dsa", "git", or "theme"</span>
                  </div>
                ) : (
                  <div>
                    {/* Dynamic grouping of commands */}
                    {['Navigation', 'Actions', 'Settings & Identity'].map((category) => {
                      const categoryCmds = filteredCommands.filter(c => c.category === category);
                      if (categoryCmds.length === 0) return null;

                      return (
                        <div key={category} className="mb-3 last:mb-0">
                          {/* Section Label */}
                          <div className="px-3 py-1.5 text-[9.5px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest leading-none font-mono">
                            {category}
                          </div>
                          
                          <div className="mt-1 space-y-0.5">
                            {categoryCmds.map((cmd) => {
                              const overallIndex = filteredCommands.findIndex(c => c.id === cmd.id);
                              const isSelected = overallIndex === selectedIndex;
                              const Icon = cmd.icon;

                              return (
                                <button
                                  key={cmd.id}
                                  data-index={overallIndex}
                                  onClick={cmd.action}
                                  onMouseEnter={() => setSelectedIndex(overallIndex)}
                                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-150 relative border ${
                                    isSelected 
                                      ? 'bg-violet-500/10 border-violet-500/20 text-violet-600 dark:bg-violet-500/10 dark:border-violet-500/40 dark:text-white' 
                                      : 'bg-transparent border-transparent text-slate-700 dark:text-[#AEAEB2]'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border ${
                                      isSelected
                                        ? 'bg-gradient-to-tr from-violet-500 to-fuchsia-500 text-white border-violet-500/30'
                                        : 'bg-slate-100 dark:bg-[#1A1A1E] text-slate-500 dark:text-[#8E8E93] border-slate-200 dark:border-slate-800/40'
                                    }`}>
                                      <Icon className="h-4 w-4" />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[12.5px] font-bold leading-tight select-none">
                                        {cmd.label}
                                      </span>
                                      <span className="text-[10px] text-slate-450 dark:text-[#8E8E93] mt-0.5 leading-none select-none">
                                        {cmd.description}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Right Indicator (Keyboard execute hint) */}
                                  {isSelected && (
                                    <div className="flex items-center gap-1 text-[10px] text-violet-600 dark:text-violet-400 font-bold select-none mr-1">
                                      <span>Select</span>
                                      <CornerDownLeft className="h-3 w-3 shrink-0" />
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bottom Instructions Footer */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-[#151517] border-t border-slate-150 dark:border-[#1E1E22] text-[10px] text-slate-450 dark:text-[#5E5E65] font-semibold">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="bg-white dark:bg-[#232328] border border-slate-250 dark:border-slate-800 px-1 py-0.2 rounded-md shadow-2xs font-mono text-[9px]">↑</span>
                    <span className="bg-white dark:bg-[#232328] border border-slate-250 dark:border-slate-800 px-1 py-0.2 rounded-md shadow-2xs font-mono text-[9px]">↓</span>
                    <span>to navigate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="bg-white dark:bg-[#232328] border border-slate-250 dark:border-slate-800 px-1 py-0.2 rounded-md shadow-2xs font-mono text-[9px]">⏎</span>
                    <span>to select</span>
                  </div>
                </div>
                <span>Press ESC to leave</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
