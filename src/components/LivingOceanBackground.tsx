import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const LivingOceanBackground: React.FC = () => {
  const { theme } = useAuth();
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; size: number; duration: number; delay: number }[]
  >([]);
  const [seagulls, setSeagulls] = useState<{ id: number; y: number; delay: number; scale: number }[]>([]);
  const [distantShips, setDistantShips] = useState<{ id: number; y: number; delay: number; speed: number }[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1.5,
        duration: Math.random() * 8 + 5,
        delay: Math.random() * -12,
      }))
    );
    setSeagulls(
      Array.from({ length: 4 }).map((_, i) => ({
        id: i,
        y: Math.random() * 25 + 8,
        delay: i * 10 + Math.random() * 5,
        scale: Math.random() * 0.35 + 0.5,
      }))
    );
    setDistantShips(
      Array.from({ length: 2 }).map((_, i) => ({
        id: i,
        y: 55 + i * 8,
        delay: i * 20,
        speed: 45 + i * 15,
      }))
    );
  }, []);

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden select-none transition-colors duration-1000">
      {/* Base ocean gradient */}
      <div className="absolute inset-0 bg-[#F8FAFC] dark:bg-[#030D18] transition-colors duration-1000" />

      {/* Midnight moon reflection (dark mode only) */}
      {isDark && (
        <>
          <div className="absolute top-[6%] right-[12%] w-16 h-16 rounded-full bg-slate-200/8 blur-sm" />
          <div className="absolute top-[6%] right-[12%] w-14 h-14 rounded-full bg-white/5" />
          <div
            className="absolute top-[18%] right-[10%] w-1 h-32 bg-gradient-to-b from-white/4 to-transparent blur-sm"
            style={{ transform: 'rotate(8deg)' }}
          />
        </>
      )}

      {/* Underwater light rays */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-cyan-400/5 via-cyan-500/0 to-transparent dark:from-cyan-900/12 pointer-events-none opacity-40 dark:opacity-55" />

      {/* Aurora / northern lights above horizon (dark mode) */}
      <div
        className="absolute top-[-15%] left-[-10%] right-[-10%] h-[50%] rounded-full opacity-0 dark:opacity-100 blur-[80px] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.06), rgba(45,212,191,0.08), rgba(0,184,217,0.05), transparent)',
          animation: 'pulse 14s ease-in-out infinite',
        }}
      />

      {/* Lighthouse beam sweep (dark mode, very subtle) */}
      {isDark && (
        <div className="absolute top-[30%] left-[5%] w-96 h-2 lighthouse-beam opacity-[0.06] bg-gradient-to-r from-cyan-300/40 to-transparent blur-md origin-left" />
      )}

      {/* Glowing plankton particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full plankton-particle bg-[#00B8D9]/15 dark:bg-cyan-300/35 blur-[0.5px]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            ['--plankton-duration' as string]: `${p.duration}s`,
            ['--plankton-delay' as string]: `${p.delay}s`,
          }}
        />
      ))}

      {/* Distant ships on horizon */}
      <div className="absolute inset-x-0 top-[45%] h-20 overflow-hidden opacity-20 dark:opacity-12">
        {distantShips.map((ship) => (
          <div
            key={ship.id}
            className="absolute left-[-8%] text-lg animate-[fly_linear_infinite]"
            style={{
              top: `${ship.y - 45}%`,
              animationDuration: `${ship.speed}s`,
              animationDelay: `${ship.delay}s`,
            }}
          >
            🚢
          </div>
        ))}
      </div>

      {/* Flying seagulls */}
      <div className="absolute inset-x-0 top-0 h-1/2 overflow-hidden">
        {seagulls.map((g) => (
          <div
            key={g.id}
            className="absolute left-[-10%] flex items-center animate-[fly_30s_linear_infinite]"
            style={{
              top: `${g.y}%`,
              animationDelay: `${g.delay}s`,
              transform: `scale(${g.scale})`,
            }}
          >
            <svg
              width="24"
              height="12"
              viewBox="0 0 24 12"
              fill="none"
              stroke={isDark ? '#5C8BB8' : '#5C768D'}
              strokeWidth="1.2"
              className="opacity-20 dark:opacity-12"
            >
              <path d="M1,6 Q6,1 12,6 Q18,1 23,6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        ))}
      </div>

      {/* Animated ocean horizon waves */}
      <div className="absolute bottom-0 inset-x-0 h-64 overflow-hidden opacity-25 dark:opacity-15 pointer-events-none">
        <svg
          className="absolute bottom-[-10px] w-full h-32 text-cyan-200 dark:text-[#123456] fill-current animate-[wave-slow_12s_ease-in-out_infinite]"
          viewBox="0 0 1440 74"
          preserveAspectRatio="none"
        >
          <path d="M0,32 C240,48 480,16 720,32 C960,48 1200,16 1440,32 L1440,74 L0,74 Z" />
        </svg>
        <svg
          className="absolute bottom-[-20px] w-full h-32 text-cyan-300/60 dark:text-[#0A2540] fill-current animate-[wave-fast_8s_ease-in-out_infinite]"
          viewBox="0 0 1440 74"
          preserveAspectRatio="none"
        >
          <path d="M0,24 C320,8 640,40 960,24 C1280,8 1360,24 1440,24 L1440,74 L0,74 Z" />
        </svg>
        <svg
          className="absolute bottom-[-30px] w-full h-24 text-cyan-400/30 dark:text-[#061524] fill-current animate-[wave-slow_16s_ease-in-out_infinite]"
          viewBox="0 0 1440 74"
          preserveAspectRatio="none"
          style={{ animationDelay: '-4s' }}
        >
          <path d="M0,40 C360,20 720,50 1080,35 C1260,28 1380,38 1440,40 L1440,74 L0,74 Z" />
        </svg>
      </div>

      <style>{`
        @keyframes fly {
          0% { left: -10%; }
          100% { left: 110%; }
        }
      `}</style>
    </div>
  );
};

export default LivingOceanBackground;
