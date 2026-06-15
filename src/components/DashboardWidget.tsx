import React from 'react';
import { LucideIcon } from 'lucide-react';

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
  onClick
}) => {
  // Determine color coding categories based on scores
  const getScoreColor = (num: number) => {
    if (num === 0) return 'text-[#8E8E93]';
    if (num < 45) return 'text-amber-400';
    if (num < 75) return 'text-emerald-400';
    return 'text-teal-400';
  };

  const getProgressStroke = (num: number) => {
    if (num === 0) return 'border-[#1C1C1E] bg-[#141416]';
    if (num < 45) return 'border-amber-500/30 bg-amber-500/5';
    return 'border-emerald-500/20 bg-emerald-500/5';
  };

  return (
    <div className="flex flex-col rounded-xl border border-[#2D2D30] bg-[#141416]/70 p-5 shadow-xs backdrop-blur-md transition-all duration-300 hover:translate-y-[-2px] hover:border-[#3D3D42] hover:bg-[#18181B]/95 group">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1C1C1E] border border-[#2D2D30] text-[#E5E5E7] group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-all duration-300">
          <Icon className="h-5 w-5" />
        </div>

        {/* Mini circular progress indicator inside widget */}
        <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 font-mono text-sm font-semibold tracking-tight transition-all duration-300 ${getScoreColor(score)} ${getProgressStroke(score)}`}>
          {score}%
        </div>
      </div>

      <div className="mt-4 flex-1">
        <h3 className="font-sans text-base font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors duration-200">{title}</h3>
        <p className="mt-1.5 text-xs text-[#8E8E93] leading-relaxed line-clamp-2">{description}</p>
        <p className="mt-3 font-mono text-[9.5px] uppercase tracking-wider text-[#AEAEB2] truncate">{details}</p>
      </div>

      <div className="mt-5 pt-4 border-t border-[#1C1C1E]">
        <button
          type="button"
          onClick={onClick}
          className="flex w-full items-center justify-center rounded-lg bg-[#1C1C1E] hover:bg-emerald-500 hover:text-black py-2 text-xs font-semibold text-[#E5E5E7] transition-all duration-200"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
};
