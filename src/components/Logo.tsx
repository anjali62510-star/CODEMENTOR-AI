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
        {/* Colorful Gradient Definitions */}
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" /> {/* Soft Lavender */}
          <stop offset="40%" stopColor="#60A5FA" /> {/* Sky Blue */}
          <stop offset="100%" stopColor="#34D399" /> {/* Mint Green */}
        </linearGradient>
        <linearGradient id="trailGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#F9A8D4" stopOpacity="0" /> {/* Soft Pink */}
          <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Code Brackets: Left & Right surrounding items */}
      <motion.path 
        d="M 22 35 L 10 50 L 22 65" 
        stroke="url(#logoGrad)" 
        strokeWidth="6.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        animate={animated ? {
          x: [-2, 1, -2],
          opacity: [0.8, 1, 0.8]
        } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path 
        d="M 78 35 L 90 50 L 78 65" 
        stroke="url(#logoGrad)" 
        strokeWidth="6.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        animate={animated ? {
          x: [2, -1, 2],
          opacity: [0.8, 1, 0.8]
        } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Styled Brain hemispheres and Growth Graph Trend Combined */}
      {/* Left hemisphere cluster */}
      <motion.path 
        d="M 38 42 C 34 40, 28 44, 30 52 C 28 58, 34 62, 38 60 C 42 62, 46 56, 44 50 C 44 44, 40 40, 38 42 Z" 
        fill="url(#logoGrad)" 
        fillOpacity="0.15"
        stroke="url(#logoGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={animated ? {
          scale: [0.97, 1.03, 0.97],
          rotate: [-1, 2, -1]
        } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Right hemisphere cluster with grid lines showing mathematical growth graph ascending */}
      <motion.path 
        d="M 62 42 C 66 40, 72 44, 70 52 C 72 58, 66 62, 62 60 C 58 62, 54 56, 56 50 C 56 44, 60 40, 62 42 Z" 
        fill="url(#logoGrad)" 
        fillOpacity="0.15"
        stroke="url(#logoGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={animated ? {
          scale: [1.03, 0.97, 1.03],
          rotate: [2, -1, 2]
        } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Real-time Growth Graph ascending line inside the layout */}
      <motion.path 
        d="M 34 56 L 46 48 L 54 52 L 66 40" 
        stroke="#34D399" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        animate={animated ? {
          pathLength: [0.3, 1, 0.3],
          opacity: [0.6, 1, 0.6]
        } : {}}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Target Dot for Growth climax */}
      <motion.circle 
        cx="66" 
        cy="40" 
        r="4.5" 
        fill="#FCD34D"
        animate={animated ? {
          scale: [1, 1.4, 1],
          opacity: [0.7, 1, 0.7]
        } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* High-acceleration Rocket launching vertically from center */}
      <g>
        {/* Rocket Flame / exhaust trail */}
        <path d="M 50 63 L 47 75 H 53 L 50 63 Z" fill="url(#trailGrad)" />
        <motion.circle 
          cx="50" 
          cy="75" 
          r="2.5" 
          fill="#F9A8D4" 
          animate={animated ? {
            y: [0, 4, 0],
            scale: [0.8, 1.3, 0.8],
            opacity: [0.4, 1, 0.4]
          } : {}}
          transition={{ duration: 0.8, repeat: Infinity }}
        />

        {/* Rocket Body */}
        <motion.path 
          d="M 50 44 L 54 52 L 53 62 L 47 62 L 46 52 Z" 
          fill="#FFFFFF" 
          stroke="url(#logoGrad)" 
          strokeWidth="3"
          strokeLinejoin="round"
          animate={animated ? {
            y: [-1.5, 1.5, -1.5]
          } : {}}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Left Fin */}
        <path d="M 47 57 L 43 62 L 47 61 Z" fill="url(#logoGrad)" strokeLinejoin="round" />
        {/* Right Fin */}
        <path d="M 53 57 L 57 62 L 53 61 Z" fill="url(#logoGrad)" strokeLinejoin="round" />
        {/* Rocket window */}
        <circle cx="50" cy="52" r="1.5" fill="#60A5FA" />
      </g>
    </svg>
  );
};

export const SidebarLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-2.5">
      <CodeMentorLogo size={34} animated={true} />
      <div className="flex flex-col">
        <span className="font-display font-extrabold tracking-tight text-slate-800 dark:text-white text-sm leading-none">CodeMentor</span>
        <span className="text-violet-600 dark:text-violet-400 font-bold px-1 py-0.2 rounded bg-violet-100/60 dark:bg-violet-500/10 border border-violet-200/50 dark:border-violet-400/20 text-[8.5px] mt-0.5 tracking-wider uppercase font-mono w-fit">AI</span>
      </div>
    </div>
  );
};

export const FaviconLogo: React.FC = () => {
  return <CodeMentorLogo size={16} animated={false} />;
};

export const LoadingScreenLogo: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          className="absolute -inset-4 rounded-full border border-dashed border-violet-500/20 dark:border-violet-400/30"
        />
        <CodeMentorLogo size={70} animated={true} />
      </div>
      <div className="text-center mt-3">
        <h2 className="font-display text-lg font-black tracking-tight text-slate-800 dark:text-white leading-none">CodeMentor AI</h2>
        <p className="text-[10px] font-mono text-slate-450 dark:text-[#8E8E93] mt-1.5 uppercase tracking-widest font-bold">Synchronizing career engines...</p>
      </div>
    </div>
  );
};
