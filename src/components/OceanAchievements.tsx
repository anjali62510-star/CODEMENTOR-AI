import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Fish, Sparkles } from 'lucide-react';
import { FloatingPanel } from './FloatingPanel';

interface Creature {
  id: string;
  emoji: string;
  name: string;
  requirement: string;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const OceanAchievements: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const streak = user.streak ?? 0;
  const dsaScore = user.scores.dsa;
  const githubScore = user.scores.github;
  const openSourceScore = user.scores.openSource;

  const creatures: Creature[] = [
    {
      id: 'first-repo',
      emoji: '🐠',
      name: 'First Repository',
      requirement: 'Analyze your GitHub profile',
      unlocked: githubScore > 0,
      rarity: 'common',
    },
    {
      id: 'dsa-streak',
      emoji: '🐬',
      name: '10-Day DSA Streak',
      requirement: 'Maintain a 10-day coding streak',
      unlocked: streak >= 10,
      rarity: 'rare',
    },
    {
      id: 'first-pr',
      emoji: '🐢',
      name: 'First Open Source PR',
      requirement: 'Log your first open source contribution',
      unlocked: openSourceScore > 0,
      rarity: 'rare',
    },
    {
      id: '100-problems',
      emoji: '🦈',
      name: '100 Problems Solved',
      requirement: 'Reach 65% DSA readiness score',
      unlocked: dsaScore >= 65,
      rarity: 'epic',
    },
    {
      id: '500-problems',
      emoji: '🐋',
      name: '500 Problems Solved',
      requirement: 'Reach 90% DSA readiness score',
      unlocked: dsaScore >= 90,
      rarity: 'legendary',
    },
    {
      id: 'rainbow',
      emoji: '🌈',
      name: 'Rainbow Horizon',
      requirement: 'Hit a major career milestone (75%+ readiness)',
      unlocked: user.scores.careerReadiness >= 75,
      rarity: 'epic',
    },
    {
      id: 'aurora',
      emoji: '✨',
      name: 'Northern Lights',
      requirement: '100-day consistency streak',
      unlocked: streak >= 100,
      rarity: 'legendary',
    },
    {
      id: 'octopus',
      emoji: '🐙',
      name: 'Multi-Skill Master',
      requirement: 'Score 50%+ in all 5 readiness pillars',
      unlocked: Object.values(user.scores).filter((s) => typeof s === 'number' && s >= 50).length >= 5,
      rarity: 'legendary',
    },
  ];

  const unlockedCount = creatures.filter((c) => c.unlocked).length;

  const rarityColors = {
    common: 'border-slate-200 dark:border-slate-700',
    rare: 'border-cyan-300 dark:border-cyan-700',
    epic: 'border-purple-300 dark:border-purple-700',
    legendary: 'border-amber-300 dark:border-amber-600 shadow-[0_0_12px_rgba(251,191,36,0.15)]',
  };

  return (
    <FloatingPanel className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-[#123456]/40 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <Fish className="h-5 w-5 text-[#00B8D9]" />
          <div>
            <h2 className="font-display font-black text-sm text-[#0A2540] dark:text-white">Ocean Creatures</h2>
            <p className="text-[10.5px] text-[#5C768D] dark:text-cyan-300 font-semibold">
              Your ocean grows more alive as you progress
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-black uppercase tracking-wider bg-cyan-100/60 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-450/25 text-[#0F4C81] dark:text-cyan-400 px-3 py-1.5 rounded-full">
          {unlockedCount}/{creatures.length} Discovered
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {creatures.map((creature, idx) => (
          <motion.div
            key={creature.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className={`relative rounded-2xl border p-3 text-center transition-all ${
              creature.unlocked
                ? `${rarityColors[creature.rarity]} bg-white dark:bg-[#061524]/80`
                : 'border-slate-200/60 dark:border-[#123456]/40 bg-slate-50/50 dark:bg-[#030D18]/40 opacity-50 grayscale'
            }`}
            title={creature.unlocked ? creature.name : creature.requirement}
          >
            {creature.unlocked && creature.rarity === 'legendary' && (
              <Sparkles className="absolute top-1.5 right-1.5 h-3 w-3 text-amber-400 animate-pulse" />
            )}
            <motion.span
              animate={creature.unlocked ? { y: [0, -3, 0] } : {}}
              transition={{ repeat: Infinity, duration: 3 + idx * 0.3, ease: 'easeInOut' }}
              className="text-2xl block mb-1.5"
            >
              {creature.unlocked ? creature.emoji : '❓'}
            </motion.span>
            <span className="text-[10px] font-black text-[#0A2540] dark:text-white block leading-tight">{creature.name}</span>
            <span className="text-[8px] font-mono text-[#5C768D] dark:text-cyan-400 mt-0.5 block leading-snug">
              {creature.unlocked ? 'Discovered!' : creature.requirement}
            </span>
          </motion.div>
        ))}
      </div>
    </FloatingPanel>
  );
};

export default OceanAchievements;
