import React from 'react';
import { motion } from 'motion/react';
import { Compass, Anchor, Navigation } from 'lucide-react';

interface CareerCompassProps {
  score: number;
  direction: string;
  title: string;
  alert: string;
  recommendedDestination: string;
}

export const CareerCompass: React.FC<CareerCompassProps> = ({
  score,
  direction,
  title,
  alert,
  recommendedDestination,
}) => {
  // Map score 0-100 to needle rotation -135° (SW) to +45° (NE)
  const needleRotation = -135 + (score / 100) * 180;

  return (
    <div className="flex flex-col items-center text-center relative">
      <div className="w-full flex items-center justify-between text-[10px] font-mono font-bold tracking-wider text-[#5C768D] dark:text-cyan-400 border-b border-slate-100 dark:border-[#123456]/40 pb-2 mb-4">
        <span>COMPASS BEARING</span>
        <span>{direction}</span>
      </div>

      {/* Animated compass dial */}
      <div className="relative w-[170px] h-[170px] my-2">
        <svg viewBox="0 0 170 170" className="w-full h-full">
          <defs>
            <radialGradient id="compassFace" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--bg-secondary)" />
              <stop offset="100%" stopColor="var(--bg-tertiary)" />
            </radialGradient>
            <linearGradient id="needleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
          </defs>

          {/* Outer ring */}
          <circle cx="85" cy="85" r="78" fill="url(#compassFace)" stroke="var(--border-color)" strokeWidth="2" />
          <circle cx="85" cy="85" r="70" fill="none" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />

          {/* Cardinal marks */}
          {['N', 'E', 'S', 'W'].map((label, i) => {
            const angle = i * 90 - 90;
            const rad = (angle * Math.PI) / 180;
            const x = 85 + Math.cos(rad) * 62;
            const y = 85 + Math.sin(rad) * 62;
            return (
              <text
                key={label}
                x={x}
                y={y + 4}
                textAnchor="middle"
                fill={label === 'N' ? '#EF4444' : 'var(--text-muted)'}
                fontSize="11"
                fontWeight="800"
                fontFamily="var(--font-mono)"
              >
                {label}
              </text>
            );
          })}

          {/* Tick marks */}
          {Array.from({ length: 36 }).map((_, i) => {
            const angle = i * 10 - 90;
            const rad = (angle * Math.PI) / 180;
            const inner = i % 9 === 0 ? 58 : 64;
            const outer = 70;
            return (
              <line
                key={i}
                x1={85 + Math.cos(rad) * inner}
                y1={85 + Math.sin(rad) * inner}
                x2={85 + Math.cos(rad) * outer}
                y2={85 + Math.sin(rad) * outer}
                stroke="var(--text-muted)"
                strokeWidth={i % 9 === 0 ? 1.5 : 0.5}
                opacity={i % 9 === 0 ? 0.7 : 0.3}
              />
            );
          })}

          {/* Animated needle group */}
          <motion.g
            animate={{ rotate: needleRotation }}
            transition={{ type: 'spring', stiffness: 40, damping: 12 }}
            style={{ transformOrigin: '85px 85px' }}
          >
            {/* North needle (red) */}
            <polygon points="85,28 80,85 85,78 90,85" fill="url(#needleGrad)" />
            {/* South needle (white/silver) */}
            <polygon points="85,142 80,85 85,92 90,85" fill="var(--text-muted)" opacity="0.6" />
          </motion.g>

          {/* Center hub */}
          <circle cx="85" cy="85" r="6" fill="var(--accent-primary)" stroke="var(--bg-secondary)" strokeWidth="2" />
          <circle cx="85" cy="85" r="2.5" fill="var(--bg-secondary)" />
        </svg>

        {/* Score overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-display text-2xl font-black text-[#0A2540] dark:text-white leading-none mt-8">
            {score}
          </span>
          <span className="font-mono text-[7px] tracking-wider text-[#5C768D] dark:text-cyan-400 uppercase font-extrabold">
            bearing
          </span>
        </div>

        {/* Compass icon badge */}
        <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-cyan-400 border flex items-center justify-center border-slate-200 shadow-xs">
          <Compass className="h-3 w-3 text-white" />
        </div>
      </div>

      <div className="mt-4 space-y-1.5 w-full relative z-10">
        <h3 className="font-display font-black text-[#0A2540] dark:text-white text-base flex items-center justify-center gap-1.5">
          <Navigation className="h-5 w-5 text-[#00B8D9]" />
          <span>Career Compass</span>
        </h3>
        <p className="text-xs font-bold text-[#0F4C81] dark:text-cyan-300">Bearing: {title}</p>
        <p className="text-[11.5px] text-[#5C768D] dark:text-slate-400 leading-relaxed font-semibold">{alert}</p>
      </div>

      <div className="w-full mt-4 bg-slate-50 dark:bg-[#030D18]/50 rounded-xl p-3 border border-[#D2E1ED]/50 dark:border-[#123456]/30 text-left">
        <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-cyan-500 block">
          Recommended Destination
        </span>
        <span className="text-xs font-bold text-[#0A2540] dark:text-cyan-100 flex items-center gap-1.5 mt-0.5">
          <Anchor className="h-3.5 w-3.5 text-[#00B8D9]" />
          <span>{recommendedDestination}</span>
        </span>
      </div>
    </div>
  );
};

export default CareerCompass;
