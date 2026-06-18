import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DSAPicture } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Star, Zap, Trophy, Calendar, Sparkles, Anchor, Waves } from 'lucide-react';
import { triggerConfetti, triggerXpGain, triggerBadgeUnlock } from './Celebration';

interface DailyStreakProps {
  onStreakUpdate?: (updatedDsa: DSAPicture) => void;
}

export const DailyStreak: React.FC<DailyStreakProps> = ({ onStreakUpdate }) => {
  const { apiFetch, refreshUser } = useAuth();
  const [dsaData, setDsaData] = useState<DSAPicture | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number } | null>(null);

  const fetchDsaData = async () => {
    try {
      const data = await apiFetch('/api/dsa/profile');
      if (data.dsa) {
        setDsaData(data.dsa);
        if (onStreakUpdate) onStreakUpdate(data.dsa);
      }
    } catch (err) {
      console.error('Error fetching DSA profile for streak', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDsaData();
  }, []);

  const handleCheckIn = async () => {
    if (checkInLoading) return;
    setCheckInLoading(true);

    try {
      const response = await apiFetch('/api/dsa/checkin', {
        method: 'POST'
      });

      if (response.dsa) {
        setDsaData(response.dsa);
        if (onStreakUpdate) onStreakUpdate(response.dsa);
        
        if (response.success) {
          try {
            await apiFetch('/api/user/earn-xp', {
              method: 'POST',
              body: JSON.stringify({ amount: 15 })
            });
            await refreshUser();
          } catch (xpErr) {
            console.error('Failed to update weekly XP on check-in', xpErr);
          }

          triggerConfetti(3500);
          triggerXpGain(15, 'Lighthouse beacon activated! Daily streak secured.');
          
          const newStreak = response.dsa.currentStreak || 0;
          if (newStreak === 7) {
            triggerBadgeUnlock('7-Day Beacon Catalyst', 'Sparked the coastal lighthouse beacon for 7 consecutive days.', 'flame');
          } else if (newStreak === 14) {
            triggerBadgeUnlock('Deep Sea Navigator', 'Navigated through rough algorithms with a mighty 14-day beacon streak.', 'trophy');
          }
        }
      }
    } catch (err) {
      console.error('Error logging daily check-in', err);
    } finally {
      setCheckInLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-[#D2E1ED] dark:border-[#123456]/60 bg-white dark:bg-[#061524]/40 p-6 shadow-xs animate-pulse">
        <div className="h-6 w-1/3 bg-slate-250 dark:bg-slate-800 rounded-lg mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-28 bg-slate-100 dark:bg-slate-800/50 rounded-2xl col-span-1" />
          <div className="h-28 bg-slate-100 dark:bg-slate-800/50 rounded-2xl col-span-2" />
        </div>
      </div>
    );
  }

  const streak = dsaData?.currentStreak || 5;
  const activityDates = dsaData?.activityDates || [];

  // Determine Lighthouse level: e.g. Level 1 for 1-4 days, Level 2 for 5-9 days, etc.
  const lighthouseLevel = Math.floor(streak / 5) + 1;

  // Determine next milestone
  let prevMilestone = 0;
  let nextMilestone = 7;
  if (streak >= 7 && streak < 14) {
    prevMilestone = 7;
    nextMilestone = 14;
  } else if (streak >= 14 && streak < 30) {
    prevMilestone = 14;
    nextMilestone = 30;
  } else if (streak >= 30) {
    prevMilestone = 30;
    nextMilestone = streak + (7 - (streak % 7));
  }

  const milestoneRange = nextMilestone - prevMilestone;
  const milestoneProgress = Math.min(
    100,
    Math.max(0, ((streak - prevMilestone) / milestoneRange) * 100)
  );

  const getHeatmapDays = () => {
    const list = [];
    const today = new Date();
    for (let i = 27; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const str = d.toISOString().split('T')[0];
      const count = activityDates.filter(date => date === str).length;
      list.push({
        dateStr: str,
        displayDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        count,
        dayOfWeek: d.getDay()
      });
    }
    return list;
  };

  const heatmapDays = getHeatmapDays();
  const checkedInToday = activityDates.includes(new Date().toISOString().split('T')[0]);

  return (
    <div className="premium-card rounded-3xl p-6 relative overflow-hidden transition-all duration-300">
      {/* Background marine pulse visual */}
      <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-[#00B8D9]/5 dark:bg-[#00B8D9]/5 blur-3xl pointer-events-none" />
      
      {/* Header bar */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-[#123456]/40 pb-3">
        <div className="flex items-center gap-2">
          {/* Custom SVG lighthouse flashing tower */}
          <div className="relative h-6 w-6 flex items-center justify-center text-[#00B8D9]">
            <span className="absolute h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <Anchor className="h-5 w-5 text-[#00B8D9]" />
          </div>
          <h2 className="font-display text-base font-black tracking-tight text-[#0A2540] dark:text-white">Lighthouse Streak Tracker</h2>
        </div>
        
        {checkedInToday ? (
          <span className="text-[10px] uppercase font-mono font-black tracking-wider text-teal-650 dark:text-[#2DD4BF] bg-teal-50 dark:bg-teal-950/30 border border-teal-200/50 dark:border-teal-500/20 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-ping" />
            Beacon Secured
          </span>
        ) : (
          <span className="text-[10px] uppercase font-mono font-black tracking-wider text-[#0F4C81] dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200/50 dark:border-cyan-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
            Keeper Pending Check-in
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left column: Numeric Lighthouse status & Beautiful Glowing SVG tower */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-4">
          <div className="flex items-center gap-4">
            {/* Massive modern circular nautical badge */}
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-[#0F4C81] to-[#00B8D9] flex flex-col items-center justify-center text-white shadow-md border border-cyan-400/20 shrink-0 relative overflow-hidden">
              <span className="text-[7.5px] font-mono font-extrabold uppercase tracking-widest leading-none mb-1 opacity-80">BEACON</span>
              <span className="font-display text-xl font-black leading-none">LVL {lighthouseLevel}</span>
              <div className="absolute bottom-0 inset-x-0 h-1 bg-[#2DD4BF]" />
            </div>
            
            <div className="flex-1">
              <span className="text-xs text-[#5C768D] dark:text-cyan-300 font-semibold leading-relaxed block">
                Consistency Strength Indicator:
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-display font-black text-[#0A2540] dark:text-white text-base flex items-center justify-center gap-1.5">
              Lighthouse Level {lighthouseLevel}
            </span>
            <span className="text-xs text-amber-500 font-semibold">({streak} days of consistent beacon light)</span>
              </div>
            </div>
          </div>

          {/* Majestic Interactive SVG Lighthouse Vector Illustration with actual sweeping beams */}
          <div className="rounded-2xl bg-gradient-to-b from-[#EAF2F8]/40 to-[#F8FAFC]/10 dark:from-[#061524]/60 dark:to-transparent border border-[#D2E1ED]/40 dark:border-[#123456]/40 p-4 relative w-full overflow-hidden min-h-[160px] flex items-center justify-center">
            
            {/* Rotating Beams of Light */}
            <div 
              className="absolute top-[28px] left-[50%] w-64 h-12 origin-left bg-gradient-to-r from-cyan-300/60 via-cyan-300/10 to-transparent blur-[2px] pointer-events-none"
              style={{
                animation: 'sweep 8s linear infinite',
                opacity: checkedInToday ? 1 : 0.35,
              }}
            />
            <div 
              className="absolute top-[28px] left-[50%] w-64 h-12 origin-left bg-gradient-to-r from-cyan-300/60 via-cyan-300/10 to-transparent blur-[2px] pointer-events-none"
              style={{
                animation: 'sweep-opp 8s linear infinite',
                opacity: checkedInToday ? 1 : 0.35,
              }}
            />

            {/* Custom SVG Lighthouse tower drawing */}
            <svg width="60" height="110" viewBox="0 0 60 110" fill="none" className="relative z-10 filter drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              {/* Beacon light bloom layer */}
              <circle cx="30" cy="22" r="9" className="fill-cyan-300/40 animate-pulse" />
              <circle cx="30" cy="22" r="5" className="fill-white" />

              {/* Lantern Roof and Cap */}
              <path d="M22,14 C22,10 38,10 38,14 Z" fill="#0A2540" className="dark:fill-[#67E8F9]" />
              <rect x="24" y="14" width="12" height="2" fill="#0A2540" className="dark:fill-[#67E8F9]" />
              
              {/* Lantern Room frame rods */}
              <rect x="24" y="16" width="12" height="8" fill="#00B8D9" opacity="0.25" rx="1" />
              <line x1="25" y1="16" x2="25" y2="24" stroke="#0A2540" strokeWidth="1" className="dark:stroke-[#67E8F9]" />
              <line x1="30" y1="16" x2="30" y2="24" stroke="#0A2540" strokeWidth="1" className="dark:stroke-[#67E8F9]" />
              <line x1="35" y1="16" x2="35" y2="24" stroke="#0A2540" strokeWidth="1" className="dark:stroke-[#67E8F9]" />

              {/* Gallery Deck handrail */}
              <rect x="18" y="24" width="24" height="3" rx="1.5" fill="#0A2540" className="dark:fill-[#67E8F9]" />

              {/* Conical Tower shaft with Red Nautical stripes */}
              <path d="M22,27 L38,27 L42,85 L18,85 Z" fill="#FFFFFF" stroke="#0A2540" strokeWidth="1.5" className="dark:stroke-[#123456]" />
              {/* Nautical Stripes */}
              <path d="M20.5,42 L39.5,42 L40.3,53 L19.7,53 Z" fill="#EF4444" />
              <path d="M19.2,65 L40.8,65 L41.5,74 L18.5,74 Z" fill="#EF4444" />

              {/* Foundation Masonry block elements */}
              <rect x="14" y="85" width="32" height="6" rx="1.5" fill="#5C768D" />
              <rect x="10" y="91" width="40" height="8" rx="2" fill="#0A2540" />
            </svg>

            {/* Embedded styles to guarantee instant isolated compilation */}
            <style>{`
              @keyframes sweep {
                0% { transform: translate(-30px, -6px) rotate(0deg); }
                100% { transform: translate(-30px, -6px) rotate(360deg); }
              }
              @keyframes sweep-opp {
                0% { transform: translate(-30px, -6px) rotate(180deg); }
                100% { transform: translate(-30px, -6px) rotate(540deg); }
              }
            `}</style>
          </div>

          {/* Target Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-[#0F4C81] dark:text-cyan-300 flex items-center gap-1">
                <Trophy className="h-3.5 w-3.5 text-yellow-500 fill-yellow-450" />
                <span>Next Lighthouse upgrade target</span>
              </span>
              <span className="text-[#00B8D9] dark:text-[#2DD4BF] font-black">
                {streak}/{nextMilestone} Days
              </span>
            </div>
            
            {/* Glowing bar */}
            <div className="h-2 w-full bg-slate-100 dark:bg-[#030D18] rounded-full overflow-hidden border border-slate-200/40 dark:border-[#123456] relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${milestoneProgress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-[#0F4C81] via-[#00B8D9] to-[#2DD4BF] shadow-sm animate-pulse"
              />
            </div>
            
            <span className="text-[10px] text-[#5C768D] dark:text-[#84A9C8] font-semibold block leading-normal">
              Accumulate {nextMilestone - streak} more consecutive check-ins to unlock upgraded Lighthouse light projection optics.
            </span>
          </div>

          {/* Action check-in button */}
          <div>
            <motion.button
              whileHover={{ scale: checkedInToday ? 1 : 1.02 }}
              whileTap={{ scale: checkedInToday ? 1 : 0.98 }}
              onClick={handleCheckIn}
              disabled={checkedInToday || checkInLoading}
              className={`w-full py-2 px-4 rounded-xl font-bold font-sans text-xs flex items-center justify-center gap-2 transition-all relative cursor-pointer ${
                checkedInToday
                  ? 'bg-[#EAF2F8] dark:bg-[#0A2035] text-slate-400 dark:text-[#5C768D] border border-slate-200/50 dark:border-[#123456]/50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#00B8D9] to-[#0F4C81] scale-100 hover:scale-101 hover:brightness-105 text-white shadow-md'
              }`}
            >
              {checkInLoading ? (
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : checkedInToday ? (
                <>
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span>Nautical Beacon Fired Successfully!</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 text-cyan-200" />
                  <span>Ignite Lighthouse Beacon (+15 Dev XP)</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Right column: 7x4 Calendar Heatmap / Depth Map */}
        <div className="lg:col-span-7 flex flex-col justify-between h-full bg-slate-50/50 dark:bg-[#061524]/60 p-4 rounded-2xl border border-[#D2E1ED] dark:border-[#123456]">
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0F4C81] dark:text-cyan-400 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>Sea Lane Activity Depth Map (Last 28 Days)</span>
            </span>
            
            {/* Tooltip display */}
            <div className="h-5 flex items-center">
              <AnimatePresence mode="wait">
                {hoveredDay ? (
                  <motion.div
                    key={hoveredDay.date}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-[10px] font-mono font-extrabold text-[#00B8D9]"
                  >
                    {hoveredDay.date}: <span className="text-slate-800 dark:text-cyan-100">{hoveredDay.count} voyages log</span>
                  </motion.div>
                ) : (
                  <span className="text-[9px] text-[#5C768D] dark:text-slate-400 font-semibold">Hover cells for maritime details</span>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Grid visual */}
          <div className="flex flex-col gap-1.5">
            {/* Column labels */}
            <div className="grid grid-cols-7 gap-1 text-center font-mono text-[9px] font-black text-[#5C768D] dark:text-[#84A9C8]">
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
              <span>S</span>
            </div>

            {/* Squares rendering using beautiful blue/cyan depth color schemes */}
            <div className="grid grid-cols-7 gap-1">
              {heatmapDays.map((day, idx) => {
                let cellColor = 'bg-[#F1F5F9] dark:bg-[#030D18] border-[#D2E1ED] dark:border-[#123456] hover:border-cyan-300 dark:hover:border-cyan-500';
                if (day.count === 1) {
                  cellColor = 'bg-[#E0F7FA] dark:bg-[#0F4C81]/25 border-cyan-200 text-[#00B8D9]';
                } else if (day.count === 2) {
                  cellColor = 'bg-[#B2EBF2] dark:bg-[#0F4C81]/50 border-cyan-400 text-white';
                } else if (day.count >= 3) {
                  cellColor = 'bg-gradient-to-r from-[#00B8D9] to-[#0F4C81] text-white border-transparent shadow-xs';
                }

                const isToday = day.dateStr === new Date().toISOString().split('T')[0];
                const ringStyle = isToday 
                  ? 'ring-2 ring-[#00B8D9] z-10 scale-[1.05]' 
                  : '';

                return (
                  <button
                    key={`${day.dateStr}-${idx}`}
                    onMouseEnter={() => setHoveredDay({ date: day.displayDate, count: day.count })}
                    onMouseLeave={() => setHoveredDay(null)}
                    type="button"
                    className={`aspect-square w-full rounded-[4px] border transition-all duration-150 transform hover:scale-[1.12] ${cellColor} ${ringStyle} cursor-help`}
                  />
                );
              })}
            </div>
          </div>

          {/* Legend and sea details */}
          <div className="flex items-center justify-between text-[8px] font-mono text-[#5C768D] dark:text-[#84A9C8] font-bold mt-4 border-t border-slate-100 dark:border-[#123456]/40 pt-2.5">
            <span className="flex items-center gap-1">
              <span>* Ship silhouette marks today</span>
            </span>
            <div className="flex items-center gap-1">
              <span>Shallow depth</span>
              <span className="h-2 w-2 rounded-[2px] bg-[#F1F5F9] dark:bg-[#030D18] border border-cyan-100 dark:border-[#123456]" />
              <span className="h-2 w-2 rounded-[2px] bg-[#E0F7FA] dark:bg-[#0F4C81]/25" />
              <span className="h-2 w-2 rounded-[2px] bg-[#B2EBF2] dark:bg-[#0F4C81]/50" />
              <span className="h-2 w-2 rounded-[2px] bg-[#00B8D9]" />
              <span>Deep Sea</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
