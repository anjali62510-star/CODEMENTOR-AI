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
          gradient: 'from-[#00B8D9] via-[#0F4C81] to-[#0A2540]',
          bgLight: 'bg-cyan-50 dark:bg-cyan-950/20',
          textHover: 'group-hover:text-cyan-500 dark:group-hover:text-cyan-300',
          textAccent: 'text-[#00B8D9]',
          borderLight: 'border-cyan-100 dark:border-[#123456]',
          badge: 'Ocean Current Analyst 🌊'
        };
      case 'dsa':
        return {
          gradient: 'from-[#2DD4BF] via-[#00B8D9] to-[#0F4C81]',
          bgLight: 'bg-teal-50 dark:bg-teal-950/20',
          textHover: 'group-hover:text-teal-500 dark:group-hover:text-teal-300',
          textAccent: 'text-[#2DD4BF]',
          borderLight: 'border-teal-150 dark:border-[#123456]',
          badge: 'Arrays Reef Navigator 🧭'
        };
      case 'resume':
        return {
          gradient: 'from-[#0F4C81] via-[#00B8D9] to-[#67E8F9]',
          bgLight: 'bg-blue-50 dark:bg-blue-950/20',
          textHover: 'group-hover:text-[#0F4C81] dark:group-hover:text-cyan-200',
          textAccent: 'text-[#0F4C81] dark:text-cyan-300',
          borderLight: 'border-blue-100 dark:border-[#123456]',
          badge: 'ATS Sonar Master 📡'
        };
      case 'interview':
        return {
          gradient: 'from-[#67E8F9] via-[#00B8D9] to-[#2DD4BF]',
          bgLight: 'bg-cyan-50 dark:bg-cyan-950/20',
          textHover: 'group-hover:text-cyan-600 dark:group-hover:text-cyan-200',
          textAccent: 'text-cyan-500 dark:text-cyan-300',
          borderLight: 'border-cyan-150 dark:border-[#123456]',
          badge: 'Captain Mentor Companion 🎓'
        };
      case 'opensource':
      default:
        return {
          gradient: 'from-amber-400 via-[#2DD4BF] to-[#0F4C81]',
          bgLight: 'bg-amber-50 dark:bg-[#123456]/20',
          textHover: 'group-hover:text-amber-500 dark:group-hover:text-amber-300',
          textAccent: 'text-amber-500 dark:text-amber-450',
          borderLight: 'border-amber-100 dark:border-[#123456]',
          badge: 'Nautical Contributor ⚓'
        };
    }
  };

  const config = getConfig(id);

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      id={`widget-card-${id}`}
      className="premium-card flex flex-col p-6 relative overflow-hidden group mr-0.5"
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
