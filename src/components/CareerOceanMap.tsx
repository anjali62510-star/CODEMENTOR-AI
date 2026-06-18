import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  MapPin, 
  Ship, 
  Waves, 
  CloudRain, 
  Sun, 
  CloudFog, 
  Sparkles, 
  Anchor, 
  ArrowRight,
  Info 
} from 'lucide-react';

interface DestinationNode {
  id: string;
  name: string;
  x: number; // percentage
  y: number; // percentage
  minScore: number;
  targetPage: string;
  description: string;
}

export const CareerOceanMap: React.FC<{ setActivePage: (page: string) => void }> = ({ setActivePage }) => {
  const { user } = useAuth();
  const [selectedNode, setSelectedNode] = useState<DestinationNode | null>(null);
  
  if (!user) return null;

  const score = user.scores.careerReadiness;
  const streak = user.streak || 0;

  // 1. Map Destinations
  const destinations: DestinationNode[] = [
    { id: 'beginner', name: '⚓ Beginner Bay', x: 10, y: 75, minScore: 0, targetPage: 'onboarding', description: 'Calm shores where early sailors prepare their credentials and load basic ship assets.' },
    { id: 'arrays', name: '🏝 Arrays Reef', x: 22, y: 55, minScore: 10, targetPage: 'dsa', description: 'Shallow coral waters testing fundamental layout index alignments and memory sequences.' },
    { id: 'strings', name: '🏝 Strings Peninsula', x: 34, y: 70, minScore: 25, targetPage: 'dsa', description: 'Breezy delta currents involving token buffers, substring searches, and character pattern routes.' },
    { id: 'linkedlist', name: '🏝 Linked List Harbor', x: 46, y: 45, minScore: 35, targetPage: 'dsa', description: 'Delicate node anchors where sailors coordinate linear pointers and node connections.' },
    { id: 'tree', name: '🏝 Tree Forest Island', x: 58, y: 65, minScore: 45, targetPage: 'dsa', description: 'Ancient mangrove forests containing high-altitude hierarchies, pre-order sweeps, and tree node canopy loops.' },
    { id: 'graph', name: '🏝 Graph Archipelago', x: 70, y: 40, minScore: 55, targetPage: 'dsa', description: 'Tangled volcanic reefs linking countless ports. Demands BFS/DFS coordinate scanning.' },
    { id: 'dp', name: '🏝 Dynamic Programming Abyss', x: 81, y: 70, minScore: 65, targetPage: 'dsa', description: 'Deeper pressure zones where multiple overlapping paths merge into memorized subproblem sequences.' },
    { id: 'opensource', name: '🏝 Open Source Island', x: 88, y: 35, minScore: 75, targetPage: 'opensource', description: 'Bustling international dockyard. Cooperate with merchant vessels and merge your features into main branch vectors.' },
    { id: 'interview', name: '🏝 Interview Peak', x: 94, y: 55, minScore: 85, targetPage: 'interview', description: 'The grand peak above mist horizons. Command AI Mentors and practice verbal tech review audits.' },
    { id: 'dreamjob', name: '🏝 Dream Job Harbor', x: 96, y: 18, minScore: 92, targetPage: 'resume', description: 'The ultimate haven anchorage. Re-theme your resume SONAR to board corporate fleets.' }
  ];

  // 2. Compute Personal Ship Details
  const getShipDetails = (readiness: number) => {
    if (readiness < 20) {
      return { name: 'Canoe', icon: '🛶', style: 'text-amber-650', desc: 'A humble wood shell keeping your early balance.' };
    } else if (readiness >= 20 && readiness < 35) {
      return { name: 'Sailboat', icon: '⛵', style: 'text-cyan-400', desc: 'Harnesses initial industry currents with canvas sheets.' };
    } else if (readiness >= 35 && readiness < 50) {
      return { name: 'Explorer Ship', icon: '🧭⛵', style: 'text-indigo-400', desc: 'Sturdy oak frame equipped with SONAR sensors.' };
    } else if (readiness >= 50 && readiness < 65) {
      return { name: 'Merchant Vessel', icon: '🚢', style: 'text-teal-400', desc: 'Equipped to trade data packages safely across long routes.' };
    } else if (readiness >= 65 && readiness < 80) {
      return { name: 'Warship', icon: '⚓🚢', style: 'text-purple-400', desc: 'Heavy armor plating, easily breaking algorithm barriers.' };
    } else {
      return { name: 'Legendary Fleet', icon: '👑🚢✨', style: 'text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]', desc: 'An undisputed armada commanding respect from far shores.' };
    }
  };
  const ship = getShipDetails(score);

  // Find destination node near current score
  const getCurrentMapPos = () => {
    let current = destinations[0];
    for (const d of destinations) {
      if (score >= d.minScore) {
        current = d;
      }
    }
    return current;
  };
  const shipPos = getCurrentMapPos();

  // 3. Ocean Weather System
  const getWeatherSystem = () => {
    if (streak === 0) {
      return {
        label: 'Coastal Sea Fog',
        icon: CloudFog,
        color: 'from-slate-500/10 via-slate-400/5 to-transparent',
        shadow: 'shadow-[inset_0_0_50px_rgba(148,163,184,0.15)]',
        desc: 'Zero-activity mist restricts sight vectors. Fire daily beacons to lift the Fog-of-War!',
        aesthetic: 'bg-radial-gradient from-transparent via-slate-500/5 to-transparent'
      };
    } else if (streak >= 1 && streak < 6) {
      return {
        label: 'Clear Skies & Sunny Ripples',
        icon: Sun,
        color: 'from-amber-400/5 via-cyan-400/2 to-transparent',
        shadow: 'shadow-[inset_0_0_40px_rgba(56,189,248,0.05)]',
        desc: 'Steady tides and smooth trade winds support active navigation.',
        aesthetic: ''
      };
    } else if (streak >= 6 && streak < 15) {
      return {
        label: 'Celestial Double Rainbow',
        icon: Sparkles,
        color: 'from-purple-500/5 via-amber-400/3 to-transparent',
        shadow: 'shadow-[inset_0_0_50px_rgba(168,85,247,0.1)]',
        desc: 'High progress alignment creates a gleaming prism arc across the horizon.',
        aesthetic: 'shadow-[inset_0_0_30px_rgba(244,63,94,0.06)]'
      };
    } else if (streak >= 15 && streak < 100) {
      return {
        label: 'Plankton Aurora Horizon',
        icon: Compass,
        color: 'from-emerald-400/5 via-cyan-400/5 to-transparent',
        shadow: 'shadow-[inset_0_0_60px_rgba(34,197,94,0.15)]',
        desc: '15+ days consistency rewards you with glowing aurora beams guiding your fleet.',
        aesthetic: 'animate-pulse'
      };
    } else if (streak >= 100) {
      return {
        label: 'Northern Lights Above Ocean',
        icon: Sparkles,
        color: 'from-violet-500/8 via-emerald-400/6 to-cyan-400/4',
        shadow: 'shadow-[inset_0_0_80px_rgba(139,92,246,0.15)]',
        desc: '100-day streak! Celestial northern lights illuminate your entire voyage.',
        aesthetic: 'animate-pulse'
      };
    }
    return {
      label: 'Clear Skies & Sunny Ripples',
      icon: Sun,
      color: 'from-amber-400/5 via-cyan-400/2 to-transparent',
      shadow: 'shadow-[inset_0_0_40px_rgba(56,189,248,0.05)]',
      desc: 'Steady tides and smooth trade winds support active navigation.',
      aesthetic: ''
    };
  };
  const weather = getWeatherSystem();

  // 4. Creature Achievements
  const creatures = [
    { name: '🐬 Active Jumping Dolphin', unlocked: streak >= 3, tip: 'Unlocked: 3-day Consistency Streak', css: 'animate-[swim_20s_linear_infinite] delay-1000' },
    { name: '🐋 Sage Blue Whale', unlocked: score >= 60, tip: 'Unlocked: Career Score 60+', css: 'animate-[whale_32s_linear_infinite]' },
    { name: '🐢 Deep-reef Sea Turtle', unlocked: user.scores.openSource > 0, tip: 'Unlocked: First Open Source Voyage', css: 'animate-[swim-slow_40s_linear_infinite] delay-5000' },
    { name: '🐠 Floating Starfish', unlocked: user.scores.dsa >= 15, tip: 'Unlocked: Solved Algorithms Reef', css: 'absolute bottom-10 right-[40%] text-amber-400/50 hover:text-amber-300 pointer-events-auto cursor-help' },
    { name: '🦈 Midnight Apex Shark', unlocked: user.scores.github >= 65, tip: 'Unlocked: Advanced GitHub SONAR Depth', css: 'animate-[swim-fast_15s_linear_infinite]' }
  ];

  return (
    <div className="rounded-3xl border border-[#D2E1ED] dark:border-[#123456] bg-white dark:bg-[#061524]/60 p-6 shadow-xs relative overflow-hidden flex flex-col gap-6 select-none transition-all duration-300 premium-card">
      
      {/* Dynamic Weather backdrop effects */}
      <div className={`absolute inset-0 bg-gradient-to-br ${weather.color} ${weather.shadow} pointer-events-none transition-all duration-[2000ms]`} />
      
      {/* 1. Header with Compass & Dynamic Meterology */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-light-200/80 dark:border-[#123456]/40 pb-4 relative z-10 gap-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-cyan-100 dark:bg-cyan-950/40 border border-cyan-250 dark:border-cyan-900/30 flex items-center justify-center text-[#00B8D9]">
            <Compass className="h-4.5 w-4.5 animate-spin" style={{ animationDuration: '40s' }} />
          </div>
          <div>
            <h2 className="font-display font-black text-sm text-[#0A2540] dark:text-white leading-tight">Career Ocean Chart</h2>
            <p className="text-[10.5px] text-[#5C768D] dark:text-cyan-300 font-semibold mt-0.5">
              Navigate your vessel {ship.icon} through skill locations matching code diagnostics.
            </p>
          </div>
        </div>

        {/* Dynamic Weather System Monitor */}
        <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-[#030D18]/60 px-3.5 py-1.5 rounded-2xl border border-[#D2E1ED]/50 dark:border-[#123456]/40 text-left hover:border-[#00B8D9]/40 transition">
          <div className="text-[#00B8D9]">
            <weather.icon className={`h-4.5 w-4.5 text-[#00B8D9] ${weather.aesthetic}`} />
          </div>
          <div>
            <span className="block text-[8px] font-mono font-bold text-[#5C768D] dark:text-cyan-500 uppercase tracking-widest leading-none">WEATHER CONDITIONS</span>
            <span className="text-[11px] font-black text-[#0A2540] dark:text-cyan-200 mt-0.5 block leading-none">{weather.label}</span>
          </div>
        </div>
      </div>

      {/* 2. Map Layout Stage */}
      <div className="relative h-[270.5px] bg-[#EAF2F8]/20 dark:bg-[#030D18]/40 border border-[#D2E1ED]/50 dark:border-[#123456]/50 rounded-2xl overflow-hidden p-2">
        {/* Navigational map grids grids */}
        <div className="absolute inset-0 ocean-grid opacity-[0.22] dark:opacity-[0.11] pointer-events-none" />

        {/* Floating Ocean Creatures Ecosystem overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 opacity-70">
          {creatures.map((c, idx) => {
            if (!c.unlocked) return null;
            if (c.name.includes('Starfish')) {
              return (
                <div key={idx} className={c.css} title={c.tip}>
                  ⭐
                </div>
              );
            }
            return (
              <div
                key={idx}
                className={`absolute top-[40%] flex items-center text-base select-none pointer-events-auto cursor-help ${c.css}`}
                title={c.tip}
              >
                {c.name.includes('Dolphin') && '🐬'}
                {c.name.includes('Whale') && '🐋'}
                {c.name.includes('Turtle') && '🐢'}
                {c.name.includes('Shark') && '🦈'}
              </div>
            );
          })}
        </div>

        {/* SVG Drawing connecting nautical pathways */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <path
            d={`M ${destinations.map(d => `${d.x}%,${d.y}%`).join(' L ')}`}
            fill="none"
            stroke="#00B8D9"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            className="opacity-45 dark:opacity-30"
          />
        </svg>

        {/* Render Map Nodes */}
        {destinations.map((node) => {
          const reached = score >= node.minScore;
          const isSelected = selectedNode?.id === node.id;
          const isShipHere = shipPos.id === node.id;

          return (
            <div
              key={node.id}
              className="absolute z-20"
              style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div className="relative group/node">
                {/* Ripple glow ring */}
                {reached && (
                  <span className="absolute inset-[-4px] rounded-full border border-cyan-400 animate-ping opacity-15 pointer-events-none" />
                )}

                {/* Node Interactive Pointer Dot */}
                <button
                  type="button"
                  onClick={() => setSelectedNode(node)}
                  className={`h-5 w-5 rounded-full flex items-center justify-center border-2 transition-all relative z-10 cursor-pointer shadow-sm ${
                    isShipHere
                      ? 'bg-[#00B8D9] border-white dark:border-[#030D18] scale-125'
                      : reached
                      ? 'bg-white text-[#00B8D9] border-[#00B8D9] hover:bg-cyan-50'
                      : 'bg-slate-200/50 border-slate-350 dark:bg-slate-850 dark:border-slate-800'
                  }`}
                >
                  {isShipHere ? (
                    <span className="text-[9.5px]">⚓</span>
                  ) : reached ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00B8D9]" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                  )}
                </button>

                {/* Micro tooltip label name */}
                <span className={`absolute top-6 left-1/2 -translate-x-1/2 shrink-0 font-display text-[9.5px] font-black pointer-events-all ${
                  isShipHere 
                    ? 'text-[#00B8D9] bg-white/90 dark:bg-[#030D18]/90 scale-105 border border-[#00B8D9]/20 px-1.5 py-0.5 rounded-md' 
                    : reached 
                    ? 'text-slate-805 dark:text-[#E2E8F0]' 
                    : 'text-slate-400'
                } opacity-0 group-hover/node:opacity-100 transition duration-200 whitespace-nowrap shadow-xs`}>
                  {node.name}
                </span>

                {/* Anchor ship representation directly overlaying his position! */}
                {isShipHere && (
                  <motion.div 
                    initial={{ y: 0 }}
                    animate={{ y: [-4, 2, -4] }}
                    transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
                    className="absolute top-[-30px] left-1/2 -translate-x-1/2 text-2xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] select-none cursor-pointer text-center z-40"
                    title={`Your Career Vessel: ${ship.name}`}
                  >
                    <span>{ship.icon}</span>
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Navigation Details & Control Console */}
      <AnimatePresence mode="wait">
        {selectedNode ? (
          <motion.div
            key={selectedNode.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-50/70 dark:bg-[#030D18]/50 p-4 rounded-2xl border border-[#D2E1ED]/50 dark:border-[#123456]/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10 transition-all font-sans"
          >
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#0A2540] dark:text-white uppercase font-mono tracking-wide">{selectedNode.name}</span>
                {score >= selectedNode.minScore ? (
                  <span className="text-[8.5px] bg-teal-50 dark:bg-teal-900/30 text-teal-650 border border-teal-200 px-2 py-0.5 rounded-full font-bold uppercase">DISCOVERED</span>
                ) : (
                  <span className="text-[8.5px] bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-full font-bold uppercase">REQS READINESS CLASSIFICATION: {selectedNode.minScore}%</span>
                )}
              </div>
              <p className="text-[11.5px] text-[#5C768D] dark:text-zinc-400 leading-relaxed font-semibold">
                {selectedNode.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                className="px-3.5 py-1.8 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-[#123456]/20 transition cursor-pointer"
              >
                Clear Coordinates
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setActivePage(selectedNode.targetPage);
                }}
                className="px-4 py-2 cursor-pointer bg-gradient-to-r from-[#00B8D9] to-[#0F4C81] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm hover:brightness-105 transition"
              >
                <span>Sail to Destination</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="bg-slate-55/40 dark:bg-[#030D18]/30 p-4 rounded-2xl border border-[#D2E1ED]/20 dark:border-[#123456]/20 flex items-center gap-3 text-xs text-[#5C768D] dark:text-[#84A9C8] font-sans">
            <Info className="h-4.5 w-4.5 text-[#00B8D9] shrink-0" />
            <span className="font-semibold leading-normal">
              Your career ship <strong className="text-[#00B8D9] font-black">{ship.name} {ship.icon}</strong> is currently anchored at <strong className="text-slate-800 dark:text-white font-extrabold">{shipPos.name}</strong>. Drag or click any point of interest island on the marine chart to inspect pathways.
            </span>
          </div>
        )}
      </AnimatePresence>

      {/* Embedded Animations classes specifically matching creatures swim trajectories */}
      <style>{`
        @keyframes swim {
          0% { left: -10%; transform: rotateY(0deg); }
          48% { transform: rotateY(0deg); }
          50% { left: 110%; transform: rotateY(180deg); }
          98% { transform: rotateY(180deg); }
          100% { left: -10%; transform: rotateY(0deg); }
        }
        @keyframes swim-slow {
          0% { left: -12%; transform: rotateY(0deg); }
          48% { transform: rotateY(0deg); }
          50% { left: 112%; transform: rotateY(180deg); }
          98% { transform: rotateY(180deg); }
          100% { left: -12%; transform: rotateY(0deg); }
        }
        @keyframes swim-fast {
          0% { left: -15%; transform: rotateY(0deg); }
          48% { transform: rotateY(0deg); }
          50% { left: 115%; transform: rotateY(180deg); }
          98% { transform: rotateY(180deg); }
          100% { left: -15%; transform: rotateY(0deg); }
        }
        @keyframes whale {
          0% { left: -20%; top: 38%; transform: scale(1) rotate(2deg); opacity: 0; }
          10% { opacity: 0.35; }
          45% { top: 32%; opacity: 0.65; }
          50% { left: 110%; transform: scale(1) rotate(-2deg); opacity: 0; }
          51% { transform: scale(-1, 1) rotate(-2deg); }
          60% { opacity: 0.35; }
          95% { top: 38%; opacity: 0.65; }
          100% { left: -20%; transform: scale(-1, 1) rotate(2deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
