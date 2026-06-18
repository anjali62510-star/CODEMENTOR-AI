import React from 'react';
import { motion } from 'motion/react';

interface LogoProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

export const CodeMentorLogo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 40, 
  animated = true 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      <defs>
        {/* Ocean Gradient Definitions */}
        <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00B8D9" />   {/* Ocean Cyan */}
          <stop offset="50%" stopColor="#67E8F9" />  {/* Aqua */}
          <stop offset="100%" stopColor="#2DD4BF" /> {/* Seafoam Green */}
        </linearGradient>
        <linearGradient id="waveGrad" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#0F4C81" stopOpacity="0.8" /> {/* Atlantic Blue */}
          <stop offset="100%" stopColor="#00B8D9" stopOpacity="0.9" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Compass Outer Ring */}
      <circle 
        cx="50" 
        cy="50" 
        r="40" 
        stroke="url(#oceanGrad)" 
        strokeWidth="3.5" 
        strokeDasharray="4, 4" 
        className="opacity-70"
      />

      {/* Rotating Degree Markers */}
      <motion.circle 
        cx="50" 
        cy="50" 
        r="44" 
        stroke="url(#oceanGrad)" 
        strokeWidth="1.5" 
        strokeDasharray="1, 8"
        animate={animated ? { rotate: 360 } : {}}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "50px 50px" }}
      />

      {/* Sea Ocean Waves in the Lower Arc */}
      <motion.path 
        d="M 22 58 Q 36 48, 50 58 T 78 58" 
        stroke="url(#waveGrad)" 
        strokeWidth="4" 
        strokeLinecap="round" 
        fill="none"
        animate={animated ? {
          d: [
            "M 22 58 Q 36 48, 50 58 T 78 58",
            "M 22 55 Q 36 62, 50 55 T 78 55",
            "M 22 58 Q 36 48, 50 58 T 78 58"
          ]
        } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.path 
        d="M 25 66 Q 38 72, 50 64 T 75 66" 
        stroke="#00B8D9" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        fill="none"
        className="opacity-60"
        animate={animated ? {
          d: [
            "M 25 66 Q 38 72, 50 64 T 75 66",
            "M 25 68 Q 38 58, 50 68 T 75 68",
            "M 25 66 Q 38 72, 50 64 T 75 66"
          ]
        } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Code Sailing Mast & Growth Arrow (Start point of the explorer compass center pointer) */}
      <motion.path 
        d="M 50 15 L 34 45 L 50 38 L 66 45 Z" 
        fill="url(#oceanGrad)"
        filter="url(#glow)"
        animate={animated ? {
          y: [-2, 2, -2]
        } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Interactive Compass Needle pointing North-East */}
      <motion.g
        animate={animated ? {
          rotate: [15, 25, 12, 18, 15]
        } : {}}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "50px 50px" }}
      >
        {/* Needle North Point (Cyan) */}
        <path d="M 50 50 L 53 30 L 50 18 Z" fill="#00B8D9" />
        <path d="M 50 50 L 47 30 L 50 18 Z" fill="#67E8F9" />
        
        {/* Needle South Point (Dark Atlantic Blue) */}
        <path d="M 50 50 L 53 70 L 50 82 Z" fill="#0F4C81" />
        <path d="M 50 50 L 47 70 L 50 82 Z" fill="#0A2540" />

        {/* Center Pivot bead */}
        <circle cx="50" cy="50" r="4" fill="#F8FAFC" stroke="#0F4C81" strokeWidth="1.5" />
      </motion.g>

      {/* Compass Directions Markers */}
      <text x="47" y="11" fill="#00B8D9" className="text-[9px] font-sans font-extrabold select-none pointer-events-none">N</text>
      <text x="47" y="96" fill="#0F4C81" className="text-[9px] font-sans font-extrabold select-none pointer-events-none">S</text>
    </svg>
  );
};

export const SidebarLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative">
        <CodeMentorLogo size={36} animated={true} />
        {/* Water ring flow aura */}
        <span className="absolute -inset-1 rounded-full border border-cyan-500/10 pointer-events-none animate-pulse" />
      </div>
      <div className="flex flex-col">
        <span className="font-display font-black tracking-tight text-slate-900 dark:text-white text-sm leading-none flex items-center gap-1">
          Ocean Explorer
        </span>
        <span className="text-cyan-500 dark:text-cyan-400 font-extrabold px-1.5 py-0.2 rounded bg-cyan-100/60 dark:bg-cyan-500/10 border border-cyan-200/50 dark:border-cyan-450/20 text-[8px] mt-0.5 tracking-wider uppercase font-mono w-fit">
          COMMAND DECK
        </span>
      </div>
    </div>
  );
};

export const FaviconLogo: React.FC = () => {
  return <CodeMentorLogo size={16} animated={false} />;
};

export const LoadingScreenLogo: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <div className="relative">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          className="absolute -inset-5 rounded-full border border-dashed border-cyan-500/20 dark:border-cyan-400/40"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          className="absolute -inset-8 rounded-full border border-dotted border-teal-500/10"
        />
        <CodeMentorLogo size={76} animated={true} />
      </div>
      <div className="text-center mt-3">
        <h2 className="font-display text-xl font-black tracking-tight text-slate-900 dark:text-white leading-none">Ocean Explorer</h2>
        <p className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 mt-2 uppercase tracking-widest font-extrabold">Charting your developer sea lanes...</p>
      </div>
    </div>
  );
};
