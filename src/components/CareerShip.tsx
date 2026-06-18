import React from 'react';
import { motion } from 'motion/react';

export interface ShipTier {
  name: string;
  icon: string;
  minScore: number;
  desc: string;
}

export const SHIP_TIERS: ShipTier[] = [
  { name: 'Canoe', icon: '🛶', minScore: 0, desc: 'A humble vessel for coastal exploration.' },
  { name: 'Sailboat', icon: '⛵', minScore: 20, desc: 'Canvas sails catch the first strong currents.' },
  { name: 'Explorer Ship', icon: '🧭⛵', minScore: 35, desc: 'Equipped with SONAR for deep knowledge waters.' },
  { name: 'Merchant Vessel', icon: '🚢', minScore: 50, desc: 'Carries portfolio cargo across trade routes.' },
  { name: 'Warship', icon: '⚓🚢', minScore: 65, desc: 'Breaks through algorithm barriers with ease.' },
  { name: 'Legendary Fleet', icon: '👑🚢✨', minScore: 80, desc: 'An undisputed armada commanding all seas.' },
];

export const getShipTier = (readiness: number): ShipTier => {
  let tier = SHIP_TIERS[0];
  for (const t of SHIP_TIERS) {
    if (readiness >= t.minScore) tier = t;
  }
  return tier;
};

interface CareerShipProps {
  readiness: number;
  compact?: boolean;
}

export const CareerShip: React.FC<CareerShipProps> = ({ readiness, compact = false }) => {
  const ship = getShipTier(readiness);
  const nextTier = SHIP_TIERS.find((t) => t.minScore > readiness);
  const progressToNext = nextTier
    ? ((readiness - ship.minScore) / (nextTier.minScore - ship.minScore)) * 100
    : 100;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <motion.span
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="text-lg"
        >
          {ship.icon}
        </motion.span>
        <div className="overflow-hidden">
          <span className="text-[11px] text-[#0A2540] dark:text-cyan-300 font-bold truncate block">{ship.name}</span>
          <span className="text-[9px] text-[#5C768D] dark:text-cyan-400 font-semibold">{readiness}% voyage</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#D2E1ED] dark:border-[#123456] bg-gradient-to-b from-cyan-50/30 to-white dark:from-[#030D18]/60 dark:to-[#061524]/40 p-4 relative overflow-hidden">
      <div className="absolute bottom-0 inset-x-0 h-6 overflow-hidden opacity-20 pointer-events-none">
        <svg className="w-[200%] h-full fill-cyan-400 animate-[wave-slow_10s_ease-in-out_infinite]" viewBox="0 0 200 12" preserveAspectRatio="none">
          <path d="M0,6 C40,10 80,2 120,6 C160,10 180,4 200,6 L200,12 L0,12 Z" />
        </svg>
      </div>

      <div className="flex items-center gap-3 relative z-10">
        <motion.div
          animate={{ y: [0, -3, 0], rotate: [0, 1, -1, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="text-3xl filter drop-shadow-md"
        >
          {ship.icon}
        </motion.div>
        <div className="flex-1 min-w-0">
          <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#5C768D] dark:text-cyan-500 block">
            Your Career Ship
          </span>
          <span className="font-display font-black text-sm text-[#0A2540] dark:text-white block truncate">{ship.name}</span>
          <span className="text-[9px] text-[#5C768D] dark:text-cyan-300 font-semibold block truncate">{ship.desc}</span>
        </div>
      </div>

      {nextTier && (
        <div className="mt-3 relative z-10">
          <div className="flex justify-between text-[8px] font-mono font-bold text-[#5C768D] dark:text-cyan-400 mb-1">
            <span>Upgrade to {nextTier.name} {nextTier.icon}</span>
            <span>{readiness}/{nextTier.minScore}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 dark:bg-[#0A2540] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#0F4C81] via-[#00B8D9] to-[#2DD4BF] transition-all duration-1000"
              style={{ width: `${Math.min(100, progressToNext)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerShip;
