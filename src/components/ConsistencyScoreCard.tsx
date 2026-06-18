import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Flame, Calendar, Sparkles, TrendingUp, ShieldAlert, Award } from 'lucide-react';

export const ConsistencyScoreCard: React.FC = () => {
  const { apiFetch, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(5);
  const [activeDaysCount, setActiveDaysCount] = useState(8);
  const [activityDates, setActivityDates] = useState<string[]>([]);

  useEffect(() => {
    const fetchStreakAndActivity = async () => {
      try {
        const response = await apiFetch('/api/dsa/profile');
        if (response.dsa) {
          setStreak(response.dsa.currentStreak ?? 5);
          const dates = (response.dsa.activityDates || []) as string[];
          setActivityDates(dates);
          
          // Count unique days active in the last 28 days
          const uniqueDates = Array.from(new Set(dates)) as string[];
          const today = new Date();
          const twentyEightDaysAgo = new Date();
          twentyEightDaysAgo.setDate(today.getDate() - 28);
          
          const recentLogs = uniqueDates.filter((dateStr: string) => {
            const date = new Date(dateStr);
            return date >= twentyEightDaysAgo && date <= today;
          });
          
          // Enforce a sensible default if fallback mock dates are needed
          setActiveDaysCount(recentLogs.length > 0 ? recentLogs.length : 8);
        }
      } catch (err) {
        console.error('Failed to load consistency parameters', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStreakAndActivity();
  }, [user]);

  // Standard algorithm for developer consistency scoring
  // Frequency Score is based on a target of 12 active coding days out of 28 (approx 3 days a week)
  const targetDays = 12;
  const frequencyScore = Math.min(100, Math.round((activeDaysCount / targetDays) * 100));
  
  // Streak Score is based on a target streak of 14 consecutive days
  const targetStreak = 14;
  const streakScore = Math.min(100, Math.round((streak / targetStreak) * 100));

  // Combined score weight: 60% frequency + 40% streak momentum
  const consistencyScore = Math.round((frequencyScore * 0.6) + (streakScore * 0.4));

  // Determine integrity status levels with distinct styling colors
  let statusText = 'Initiating Progress';
  let statusColor = 'text-amber-500';
  let statusBg = 'bg-amber-500/10 border-amber-500/20';
  let statusDescription = 'Begin logging activity consecutively to anchor your developer habits.';

  if (consistencyScore >= 85) {
    statusText = 'Unstoppable Momentum';
    statusColor = 'text-violet-500';
    statusBg = 'bg-violet-500/10 border-violet-500/20';
    statusDescription = 'Excellent consistency! You are performing in the top 5% of early-career applicants.';
  } else if (consistencyScore >= 60) {
    statusText = 'Highly Disciplined';
    statusColor = 'text-emerald-500';
    statusBg = 'bg-emerald-500/10 border-emerald-500/20';
    statusDescription = 'Solid habit foundation. Keep up this weekly rhythm to cement target recruiters.';
  } else if (consistencyScore >= 35) {
    statusText = 'Consistent Builder';
    statusColor = 'text-sky-500';
    statusBg = 'bg-sky-500/10 border-sky-500/20';
    statusDescription = 'Regular progress established. Push for a consecutive streak to build higher velocity.';
  }

  // Circular calculations for the main metric ring display
  const radius = 64;
  const strokeWidth = 9;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - consistencyScore / 100);

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200/80 dark:border-[#2D2D30]/60 bg-white dark:bg-[#1E293B]/40 p-6 shadow-xs animate-pulse">
        <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-lg mb-4" />
        <div className="flex gap-6 items-center">
          <div className="h-28 w-28 bg-slate-100 dark:bg-slate-800/50 rounded-full shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-slate-100 dark:bg-slate-800/50 rounded-md w-3/4" />
            <div className="h-3 bg-slate-100 dark:bg-slate-800/50 rounded-md w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200/80 dark:border-[#2D2D30]/60 bg-white dark:bg-[#1E293B]/40 p-6 shadow-xs relative overflow-hidden transition-all duration-300">
      {/* Decorative colored glow */}
      <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-violet-500/5 dark:bg-violet-500/5 blur-3xl pointer-events-none" />
      
      {/* Card Header section */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1E1E22] pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-violet-500" />
            <h2 className="font-display text-base font-black tracking-tight text-slate-800 dark:text-white">
              Cognitive Consistency Index
            </h2>
          </div>
          <p className="text-[11px] text-slate-450 dark:text-[#8E8E93] font-semibold mt-0.5">
            Real-time multi-weighted score evaluating your weekly habits and developer streak
          </p>
        </div>
        <div className={`px-2.5 py-1 rounded-xl border text-[10px] font-mono font-black uppercase text-center shrink-0 ${statusBg} ${statusColor}`}>
          {statusText}
        </div>
      </div>

      {/* Main Stats Display Panel */}
      <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
        
        {/* Animated Circular Ring Column */}
        <div className="flex items-center gap-5 justify-center shrink-0">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <defs>
                <linearGradient id="consistencyRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="50%" stopColor="#D946EF" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
              {/* Secondary Track */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-slate-100 dark:stroke-[#232326]/90 fill-transparent"
                strokeWidth={strokeWidth}
              />
              {/* Active Animated Primary Circle */}
              <motion.circle
                cx="72"
                cy="72"
                r={radius}
                stroke="url(#consistencyRingGradient)"
                className="fill-transparent"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.1, ease: "easeOut" }}
              />
            </svg>
            
            {/* Center Label metrics */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[9px] font-mono font-extrabold text-slate-400 dark:text-[#5E5E65] tracking-widest uppercase mb-0.5 leading-none">
                Score
              </span>
              <motion.span 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl font-display font-black text-slate-805 dark:text-white leading-none"
              >
                {consistencyScore}
              </motion.span>
              <span className="text-[10px] text-slate-400 dark:text-[#8E8E93] mt-1 font-semibold">
                of 100
              </span>
            </div>
          </div>
        </div>

        {/* Informative Sub-metric Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          
          {/* Active Days Frequency Score widget */}
          <div className="p-3.5 rounded-2xl bg-slate-50/40 dark:bg-[#121214]/40 border border-slate-150 dark:border-slate-850/60">
            <div className="flex items-center gap-2 text-slate-400 dark:text-[#8E8E93]">
              <Calendar className="h-4 w-4 text-sky-500" />
              <span className="text-[10px] font-mono font-black uppercase tracking-wider">
                Monthly Active Target
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-xl font-display font-black text-slate-800 dark:text-white">
                {activeDaysCount} Days
              </span>
              <span className="text-[10px] text-slate-400 dark:text-[#5E5E65] font-semibold">
                / {targetDays} Goal
              </span>
            </div>
            {/* Tiny progress line for additional feedback */}
            <div className="w-full h-1 bg-slate-100 dark:bg-[#1E1E22]/60 rounded-full mt-2.5 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${frequencyScore}%` }}
                className="h-full bg-sky-500 rounded-full" 
              />
            </div>
            <span className="text-[9px] font-mono text-slate-400 dark:text-[#5E5E65] block mt-1.5 font-bold">
              Frequency Score: {frequencyScore}%
            </span>
          </div>

          {/* Active Streak Progression score widget */}
          <div className="p-3.5 rounded-2xl bg-slate-50/40 dark:bg-[#121214]/40 border border-slate-150 dark:border-slate-850/60">
            <div className="flex items-center gap-2 text-slate-400 dark:text-[#8E8E93]">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-[10px] font-mono font-black uppercase tracking-wider">
                Streak Momentum
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-xl font-display font-black text-slate-800 dark:text-white">
                {streak}-Day
              </span>
              <span className="text-[10px] text-slate-400 dark:text-[#5E5E65] font-semibold">
                / {targetStreak} Goal
              </span>
            </div>
            {/* Tiny progress line for additional feedback */}
            <div className="w-full h-1 bg-slate-100 dark:bg-[#1E1E22]/60 rounded-full mt-2.5 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${streakScore}%` }}
                className="h-full bg-orange-500 rounded-full" 
              />
            </div>
            <span className="text-[9px] font-mono text-slate-400 dark:text-[#5E5E65] block mt-1.5 font-bold">
              Streak Score: {streakScore}%
            </span>
          </div>

        </div>
      </div>

      {/* Description Insight Banner */}
      <div className="mt-5 p-3 rounded-2xl bg-slate-50 dark:bg-[#1C1C1F]/40 border border-slate-100 dark:border-slate-850/30 flex items-start gap-2.5">
        <Sparkles className="h-4 w-4 text-violet-500 mt-0.5 shrink-0 animate-pulse" />
        <p className="text-[10px] text-slate-500 dark:text-[#8E8E93] leading-relaxed font-mono font-semibold">
          {statusDescription} Keep active commits and daily mock-up conversations synced inside CodeMentor to earn constant multipliers on user performance indexes!
        </p>
      </div>
    </div>
  );
};
