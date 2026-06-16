import React from 'react';
import { LucideIcon, ArrowRight, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { AnimatedCountUp } from './Celebration';

interface DashboardWidgetProps {
  title: string;
  score: number;
  icon: LucideIcon;
  description: string;
  details: string;
  actionLabel: string;
  id: string;
  onClick: () => void;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  title,
  score,
  icon: Icon,
  description,
  details,
  actionLabel,
  onClick,
  id
}) => {
  // Theme and color configuration based on module ID
  const getConfig = (widgetId: string) => {
    switch (widgetId) {
      case 'github':
        return {
          gradient: 'from-sky-400 via-[#60A5FA] to-blue-500',
          bgLight: 'bg-sky-50 dark:bg-sky-500/10',
          textHover: 'group-hover:text-sky-500 dark:group-hover:text-sky-300',
          textAccent: 'text-sky-500 dark:text-sky-400',
          borderLight: 'border-sky-100 dark:border-sky-500/20',
          badge: 'GitHub Explorer ⭐️'
        };
      case 'dsa':
        return {
          gradient: 'from-emerald-400 via-teal-400 to-emerald-500',
          bgLight: 'bg-emerald-50 dark:bg-emerald-500/10',
          textHover: 'group-hover:text-emerald-500 dark:group-hover:text-emerald-300',
          textAccent: 'text-emerald-500 dark:text-emerald-400',
          borderLight: 'border-emerald-100 dark:border-emerald-500/20',
          badge: 'DSA Warrior 🔥'
        };
      case 'resume':
        return {
          gradient: 'from-[#A78BFA] via-[#C084FC] to-purple-600',
          bgLight: 'bg-purple-50 dark:bg-purple-500/10',
          textHover: 'group-hover:text-purple-500 dark:group-hover:text-purple-300',
          textAccent: 'text-purple-500 dark:text-purple-400',
          borderLight: 'border-purple-100 dark:border-purple-500/20',
          badge: 'Resume Master 🏆'
        };
      case 'interview':
        return {
          gradient: 'from-cyan-400 via-sky-400 to-blue-500',
          bgLight: 'bg-cyan-50 dark:bg-cyan-500/10',
          textHover: 'group-hover:text-cyan-500 dark:group-hover:text-cyan-300',
          textAccent: 'text-cyan-500 dark:text-cyan-400',
          borderLight: 'border-cyan-100 dark:border-cyan-500/20',
          badge: 'Interview Champ 👑'
        };
      case 'opensource':
      default:
        return {
          gradient: 'from-orange-400 via-amber-400 to-red-500',
          bgLight: 'bg-orange-50 dark:bg-orange-500/10',
          textHover: 'group-hover:text-orange-500 dark:group-hover:text-orange-300',
          textAccent: 'text-orange-500 dark:text-orange-450',
          borderLight: 'border-orange-100 dark:border-orange-500/20',
          badge: 'OpenSource Hero 🌟'
        };
    }
  };

  const config = getConfig(id);

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      id={`widget-card-${id}`}
      className="flex flex-col rounded-3xl border border-slate-200/80 dark:border-[#2D2D30]/60 bg-white dark:bg-[#1E293B]/40 p-6 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden group mr-0.5"
    >
      {/* Decorative top color accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${config.gradient}`} />

      {/* Floating score badge and module icon */}
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${config.bgLight} border ${config.borderLight} text-slate-700 dark:text-[#E2E8F0] ${config.textHover} transition-all duration-350`}>
          <Icon className="h-5.5 w-5.5" />
        </div>

        {/* Circular score bubble */}
        <div className="relative">
          <div className={`
            flex h-13 w-13 items-center justify-center rounded-full border-3 font-mono text-xs font-extrabold tracking-tight transition-all duration-300 shadow-xs
            bg-slate-50 dark:bg-[#0E0E10] ${config.borderLight} ${config.textAccent}
          `}>
            <AnimatedCountUp value={score} suffix="%" />
          </div>
          {score >= 70 && (
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-white shadow-xs text-[10px] animate-bounce">
              ⭐
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 flex-1 space-y-2">
        {/* Achievement Badge descriptor */}
        <div className="flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#AEAEB2]">
          <Award className={`h-3.5 w-3.5 ${config.textAccent}`} />
          <span>{config.badge}</span>
        </div>

        <h3 className={`font-sans font-extrabold text-base text-slate-800 dark:text-white leading-snug tracking-tight ${config.textHover} transition-colors duration-200`}>
          {title}
        </h3>
        
        <p className="text-[12px] leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
          {description}
        </p>

        {/* Dynamic metadata row */}
        <div className="pt-2">
          <span className="font-mono text-[9.5px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/40 px-2.5 py-1 rounded-md border border-slate-150 dark:border-slate-800/60 inline-block">
            {details}
          </span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#2D2D30]/60">
        <motion.button
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={onClick}
          className={`flex w-full items-center justify-center gap-2.5 rounded-full py-2.5 text-xs font-bold transition-all duration-300 cursor-pointer
            bg-slate-100 dark:bg-[#1E293B]/90 hover:bg-gradient-to-r ${config.gradient} text-slate-800 dark:text-[#E5E5E7] hover:text-white hover:shadow-md
          `}
        >
          <span>{actionLabel}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </motion.button>
      </div>
    </motion.div>
  );
};
export default DashboardWidget;
