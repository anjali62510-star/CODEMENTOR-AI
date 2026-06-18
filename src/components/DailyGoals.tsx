import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { CheckSquare, Square, Target, Award, ArrowUpRight, Sparkles, Code, FileText, MessageSquareCode, Calendar } from 'lucide-react';
import { triggerConfetti, triggerXpGain } from './Celebration';

interface DailyGoalItem {
  id: string;
  title: string;
  description: string;
  category: string;
  xpReward: number;
  icon: any;
  completed: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export const DailyGoals: React.FC = () => {
  const { user, apiFetch, refreshUser } = useAuth();
  const [goals, setGoals] = useState<DailyGoalItem[]>([]);
  const [animatedIndex, setAnimatedIndex] = useState<number | null>(null);

  // Parse today's date to keep local storage partitioned
  const todayStr = new Date().toISOString().split('T')[0];

  // Fetch or construct goals list on mount/user change
  useEffect(() => {
    // Check if user did their daily streak check-in
    const checkedInToday = user?.weeklyXp?.some(() => {
      // If we checked in today, our activity state is logged.
      // We can also check details from the DSA profile.
      return false; 
    }) || false;

    // Load custom goals from localStorage or fallback
    const storageKey = `daily_goals_${user?._id || 'guest'}_${todayStr}`;
    const savedGoalsJson = localStorage.getItem(storageKey);

    const defaultGoals: DailyGoalItem[] = [
      {
        id: 'streak_checkin',
        title: 'Consecutive Streak Check-In',
        description: 'Secure your daily developer streak check-in to boost career readiness.',
        category: 'streak',
        xpReward: 15,
        icon: Calendar,
        completed: false, // Will be computed or checked off
        actionLabel: 'Go to Streak Tracker'
      },
      {
        id: 'dsa_sandbox',
        title: 'High-Yield DSA Sandbox',
        description: 'Examine and successfully compile at least 1 algorithmic or tree data structure query.',
        category: 'dsa',
        xpReward: 35,
        icon: Code,
        completed: false,
        actionLabel: 'Solve on Sandbox'
      },
      {
        id: 'resume_scan',
        title: 'STAR Format Resume Scan',
        description: 'Examine your professional resume structures using the semantic parser filters.',
        category: 'resume',
        xpReward: 25,
        icon: FileText,
        completed: false,
        actionLabel: 'Analyze Resume'
      },
      {
        id: 'mock_interview',
        title: 'Mock Simulator Conversation',
        description: 'Initiate and finish at least 1 interactive interview prepping dialogue module.',
        category: 'interview',
        xpReward: 50,
        icon: MessageSquareCode,
        completed: false,
        actionLabel: 'Enter Simulation Room'
      }
    ];

    if (savedGoalsJson) {
      try {
        const parsed = JSON.parse(savedGoalsJson);
        // Make sure icons are re-mapped
        const mapped = defaultGoals.map(dg => {
          const match = parsed.find((p: any) => p.id === dg.id);
          return {
            ...dg,
            completed: match ? match.completed : false
          };
        });
        setGoals(mapped);
      } catch (err) {
        setGoals(defaultGoals);
      }
    } else {
      setGoals(defaultGoals);
    }
  }, [user, todayStr]);

  const saveGoals = (updatedGoals: DailyGoalItem[]) => {
    const storageKey = `daily_goals_${user?._id || 'guest'}_${todayStr}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedGoals.map(g => ({ id: g.id, completed: g.completed }))));
    setGoals(updatedGoals);
  };

  const handleToggleGoal = async (goalId: string, index: number) => {
    const updated = goals.map(g => {
      if (g.id === goalId) {
        const targetState = !g.completed;
        
        // If transitioning to COMPLETED, trigger celebratory feedback!
        if (targetState) {
          triggerConfetti(3000);
          triggerXpGain(g.xpReward, `Completed Daily Quest: "${g.title}"`);
          
          // Submit XP gain request to backend to persist XP on active profile
          apiFetch('/api/user/earn-xp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: g.xpReward })
          }).then(() => {
            refreshUser();
          }).catch(err => {
            console.error('Error persisting check-off XP', err);
          });

          // Animation trigger matching design feedback
          setAnimatedIndex(index);
          setTimeout(() => setAnimatedIndex(null), 1000);
        }
        
        return { ...g, completed: targetState };
      }
      return g;
    });

    saveGoals(updated);
  };

  const totalGoals = goals.length;
  const completedGoalsCount = goals.filter(g => g.completed).length;
  const progressPercent = totalGoals > 0 ? Math.round((completedGoalsCount / totalGoals) * 105) : 0;
  const allCompleted = completedGoalsCount === totalGoals && totalGoals > 0;

  return (
    <div className="rounded-3xl border border-slate-200/80 dark:border-[#2D2D30]/60 bg-white dark:bg-[#1E293B]/40 p-6 shadow-xs relative overflow-hidden transition-all duration-300">
      {/* Background radial gradient decoration */}
      <div className="absolute top-0 right-0 h-44 w-44 rounded-full bg-emerald-500/5 dark:bg-emerald-500/5 blur-3xl pointer-events-none" />
      
      {/* Header bar section with active checklist counters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 border-b border-slate-100 dark:border-[#1E1E22] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-emerald-500 animate-pulse" />
            <h2 className="font-display text-base font-black tracking-tight text-slate-800 dark:text-white">
              Daily Career Milestones
            </h2>
          </div>
          <p className="text-[11px] text-slate-450 dark:text-[#8E8E93] font-semibold mt-0.5">
            Check off key preparation tasks to receive immediate XP multipliers
          </p>
        </div>

        {/* Quest progress counters - Animated Circular Progress Ring */}
        <div className="flex items-center gap-4 shrink-0 bg-slate-50/50 dark:bg-[#1C1C1E]/30 px-4 py-2.5 rounded-2xl border border-slate-150 dark:border-[#2D2D30]/40">
          <div className="relative flex items-center justify-center w-12 h-12">
            <svg className="w-full h-full transform -rotate-90">
              <defs>
                <linearGradient id="goalsProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
              {/* Secondary gray/slate indicator track */}
              <circle
                cx="24"
                cy="24"
                r="20"
                className="stroke-slate-150 dark:stroke-[#2D2D30]/80 fill-transparent"
                strokeWidth="3.5"
              />
              {/* Primary active animated progress track */}
              <motion.circle
                cx="24"
                cy="24"
                r="20"
                stroke="url(#goalsProgressGradient)"
                className="fill-transparent"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 20}
                initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
                animate={{ strokeDashoffset: (2 * Math.PI * 20) * (1 - (totalGoals > 0 ? completedGoalsCount / totalGoals : 0)) }}
                transition={{ duration: 0.85, ease: "easeOut" }}
              />
            </svg>
            {/* Center label displaying ratio or percentage */}
            <div className="absolute inset-x-0 inset-y-0 flex flex-col items-center justify-center font-mono leading-none">
              <span className="text-xs font-black text-slate-805 dark:text-white">
                {completedGoalsCount}
              </span>
              <span className="text-[8px] text-slate-400 dark:text-slate-500 font-bold border-t border-slate-200 dark:border-slate-800/80 mt-0.5 pt-0.5 w-3 text-center">
                {totalGoals}
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[10px] font-mono font-black tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
              Quest Progress
            </span>
            <span className="text-[9px] text-slate-400 dark:text-[#8E8E93] font-semibold mt-0.5">
              {totalGoals > 0 ? Math.round((completedGoalsCount / totalGoals) * 100) : 0}% Tasks Complete
            </span>
          </div>
        </div>
      </div>

      {allCompleted && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-between gap-4 relative overflow-hidden"
        >
          <div className="absolute right-2 top-2 pointer-events-none">
            <Sparkles className="h-20 w-20 text-emerald-500/10 rotate-12" />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <div>
              <h4 className="font-display font-black text-emerald-600 dark:text-emerald-400 text-xs">A Perfect Day!</h4>
              <p className="text-[10px] text-slate-500 dark:text-[#8E8E93] font-medium leading-normal mt-0.5">
                Every priority career milestone completed. Tomorrow brings fresh quests to conquer.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-black uppercase bg-emerald-500 text-white px-2.5 py-1 rounded-full shadow-sm tracking-wider">
            +125 Bonus XP Secured
          </span>
        </motion.div>
      )}

      {/* Checklist grid list */}
      <div className="space-y-3.5">
        {goals.map((goal, index) => {
          const GoalIcon = goal.icon;
          const isCompleted = goal.completed;
          const isJustChecked = animatedIndex === index;

          return (
            <motion.div
              layout
              key={goal.id}
              whileHover={{ y: -1 }}
              className={`p-4 rounded-2xl border transition-all duration-200 flex items-start justify-between gap-4 relative ${
                isCompleted
                  ? 'bg-emerald-500/5 border-emerald-500/10 dark:bg-emerald-500/3'
                  : 'bg-slate-50/20 border-slate-150 hover:bg-slate-50/60 dark:bg-[#121214]/20 dark:border-[#1F1F24] dark:hover:bg-[#121214]/50'
              }`}
            >
              <div className="flex items-start gap-3.5 max-w-[80%]">
                {/* Custom glowing interactive checkbox */}
                <button
                  type="button"
                  onClick={() => handleToggleGoal(goal.id, index)}
                  className="mt-0.5 shrink-0 select-none cursor-pointer focus:outline-hidden group"
                >
                  <AnimatePresence mode="wait">
                    {isCompleted ? (
                      <motion.div
                        key="checked"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 350, damping: 20 }}
                        className="text-emerald-500 dark:text-emerald-400"
                      >
                        <CheckSquare className="h-5 w-5 fill-emerald-500/10" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="unchecked"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="text-slate-400 group-hover:text-emerald-500 transition-colors"
                      >
                        <Square className="h-5 w-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-sans font-extrabold text-xs transition-colors ${
                      isCompleted ? 'text-slate-500 dark:text-slate-450 line-through' : 'text-slate-800 dark:text-white'
                    }`}>
                      {goal.title}
                    </span>
                    <span className="text-[9px] font-mono font-black uppercase text-violet-500 dark:text-violet-400 bg-violet-500/5 px-1.5 py-0.5 rounded-md">
                      +{goal.xpReward} XP
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-[#8E8E93] font-medium leading-relaxed">
                    {goal.description}
                  </p>
                </div>
              </div>

              {/* Action Category Link Badge */}
              <div className="flex flex-col items-end justify-between h-full space-y-3 shrink-0">
                <div className={`h-8 w-8 rounded-xl flex items-center justify-center transition-all ${
                  isCompleted 
                    ? 'bg-emerald-500/10 text-emerald-500' 
                    : 'bg-slate-100 text-slate-400 dark:bg-[#1C1C1F] dark:text-slate-500'
                }`}>
                  <GoalIcon className="h-4.5 w-4.5" />
                </div>
              </div>

              {isJustChecked && (
                <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none rounded-2xl animate-pulse flex items-center justify-center">
                  <motion.div 
                    initial={{ y: 0, opacity: 1 }} 
                    animate={{ y: -30, opacity: 0 }} 
                    transition={{ duration: 0.8 }} 
                    className="font-display font-black text-emerald-500 text-xs"
                  >
                    🎉 +{goal.xpReward} XP Earned!
                  </motion.div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
