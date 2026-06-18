import React from 'react';
import { motion } from 'motion/react';
import { Anchor, CheckCircle } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface SkillIslandVisualProps {
  id: string;
  name: string;
  coordinates: string;
  progress: number;
  unlocked: boolean;
  color: string;
  icon: LucideIcon;
  onClick: () => void;
}

const getIslandStage = (progress: number, unlocked: boolean) => {
  if (!unlocked) return { stage: 'fog', label: 'Fog Standard', emoji: '🌫️', size: 'h-8' };
  if (progress < 25) return { stage: 'sandbank', label: 'Tiny Sandbank', emoji: '🏖️', size: 'h-10' };
  if (progress < 50) return { stage: 'small', label: 'Small Island', emoji: '🏝️', size: 'h-14' };
  if (progress < 75) return { stage: 'medium', label: 'Growing Island', emoji: '🏝️', size: 'h-18' };
  if (progress < 100) return { stage: 'large', label: 'Tropical Island', emoji: '🌴', size: 'h-22' };
  return { stage: 'full', label: 'Full Archipelago', emoji: '🏝️🌴', size: 'h-24' };
};

export const SkillIslandVisual: React.FC<SkillIslandVisualProps> = ({
  name,
  coordinates,
  progress,
  unlocked,
  color,
  icon: IconComponent,
  onClick,
}) => {
  const stage = getIslandStage(progress, unlocked);

  return (
    <motion.button
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={onClick}
      type="button"
      className={`flex flex-col text-left p-4 rounded-2xl border transition-all relative overflow-hidden cursor-pointer select-none aspect-3/4 min-h-[160px] justify-between group ${
        unlocked
          ? 'bg-gradient-to-b from-white to-[#EAF2F8] dark:from-[#061524] dark:to-[#030D18] border-[#D2E1ED] dark:border-[#123456] shadow-sm'
          : 'bg-slate-150/40 dark:bg-[#040E1B] border-slate-200 dark:border-[#123456]/40 opacity-55'
      }`}
    >
      {/* Animated water beneath island */}
      {unlocked && (
        <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden pointer-events-none">
          <svg className="w-[200%] h-full fill-cyan-400/15 animate-[wave-slow_8s_ease-in-out_infinite]" viewBox="0 0 200 20" preserveAspectRatio="none">
            <path d="M0,10 C30,15 70,5 100,10 C130,15 170,5 200,10 L200,20 L0,20 Z" />
          </svg>
        </div>
      )}

      {/* Island visual */}
      <div className="flex flex-col items-center justify-center flex-1 relative z-10">
        <motion.div
          animate={unlocked ? { y: [0, -2, 0] } : {}}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className={`${stage.size} flex items-end justify-center text-2xl filter drop-shadow-md`}
        >
          {unlocked ? stage.emoji : '🌫️'}
        </motion.div>
        {unlocked && (
          <div className={`mt-1 h-6 w-6 rounded-lg flex items-center justify-center bg-gradient-to-br ${color} text-white shadow-xs`}>
            <IconComponent className="h-3.5 w-3.5" />
          </div>
        )}
      </div>

      <div className="relative z-10 space-y-1">
        <div className="flex items-start justify-between">
          <h4 className="font-display font-black text-sm text-[#0A2540] dark:text-white leading-tight">{name}</h4>
          <span
            className={`text-[7px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border shrink-0 ${
              unlocked
                ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 border-teal-200'
                : 'bg-slate-150 dark:bg-slate-800/80 text-slate-500 border-slate-200'
            }`}
          >
            {stage.label}
          </span>
        </div>
        <span className="block text-[8px] font-mono text-[#5C768D] dark:text-cyan-400 leading-none truncate">{coordinates}</span>

        {/* Growth progress tide bar */}
        {unlocked && (
          <div className="h-1.5 w-full bg-slate-100 dark:bg-[#030D18] rounded-full overflow-hidden mt-1">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#00B8D9] to-[#2DD4BF] transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="font-mono text-[9px] text-[#5C768D] dark:text-cyan-300">
          {unlocked ? (
            <span className="text-teal-650 dark:text-teal-300 font-extrabold flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-teal-500" />
              <span>{progress}% explored</span>
            </span>
          ) : (
            <span className="text-slate-400 flex items-center gap-1">
              <Anchor className="h-3 w-3" />
              <span>Chart course to unlock</span>
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
};

export default SkillIslandVisual;
