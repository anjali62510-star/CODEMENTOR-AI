import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TransitionProps {
  trigger: string;
  fromPage?: string;
  children: React.ReactNode;
}

type TransitionType = 'wave' | 'current' | 'emerge';

const getTransitionType = (from: string, to: string): TransitionType => {
  const waveRoutes: [string, string][] = [
    ['dashboard', 'dsa'],
    ['dsa', 'dashboard'],
    ['dashboard', 'github'],
    ['github', 'dashboard'],
  ];
  const currentRoutes: [string, string][] = [
    ['dsa', 'github'],
    ['github', 'dsa'],
    ['roadmap', 'coach'],
    ['coach', 'roadmap'],
    ['opensource', 'interview'],
    ['interview', 'opensource'],
  ];

  if (waveRoutes.some(([a, b]) => a === from && b === to)) return 'wave';
  if (currentRoutes.some(([a, b]) => a === from && b === to)) return 'current';
  return 'emerge';
};

export const WaterFlowTransition: React.FC<TransitionProps> = ({ trigger, fromPage, children }) => {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [animating, setAnimating] = useState(false);
  const [transitionType, setTransitionType] = useState<TransitionType>('emerge');
  const prevPageRef = useRef(trigger);

  useEffect(() => {
    if (trigger !== prevPageRef.current) {
      const type = getTransitionType(prevPageRef.current, trigger);
      setTransitionType(type);
      prevPageRef.current = trigger;
      setAnimating(true);

      const swapTimer = setTimeout(() => setDisplayChildren(children), 350);
      const finishTimer = setTimeout(() => setAnimating(false), 850);

      return () => {
        clearTimeout(swapTimer);
        clearTimeout(finishTimer);
      };
    } else {
      setDisplayChildren(children);
    }
  }, [trigger, children]);

  const renderOverlay = () => {
    if (transitionType === 'wave') {
      return (
        <>
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: ['-100%', '0%', '100%'] }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.85, ease: 'easeInOut' }}
            className="fixed inset-y-0 left-0 w-full bg-gradient-to-r from-[#0F4C81] via-[#00B8D9] to-cyan-500 z-[99999] pointer-events-none"
            style={{ clipPath: 'polygon(0% 0%, 100% 0%, 93% 50%, 100% 100%, 0% 100%)' }}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: ['-100%', '0%', '100%'] }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.85, ease: 'easeInOut', delay: 0.06 }}
            className="fixed inset-y-0 left-0 w-full bg-gradient-to-r from-cyan-300/90 via-[#2DD4BF] to-teal-200/80 z-[99999] pointer-events-none"
            style={{ clipPath: 'polygon(0% 0%, 100% 0%, 96% 50%, 100% 100%, 0% 100%)' }}
          />
        </>
      );
    }

    if (transitionType === 'current') {
      return (
        <>
          <motion.div
            initial={{ x: '-100%', rotate: -2 }}
            animate={{ x: ['-100%', '0%', '100%'], rotate: [-2, 0, 2] }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-y-0 left-0 w-full z-[99999] pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(15,76,129,0.95) 30%, rgba(0,184,217,0.9) 50%, rgba(45,212,191,0.85) 70%, transparent 100%)',
              clipPath: 'polygon(0% 20%, 100% 0%, 100% 80%, 0% 100%)',
            }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 0.9 }}
            className="fixed inset-0 bg-[#030D18]/20 z-[99998] pointer-events-none"
          />
        </>
      );
    }

    // emerge — page rises from beneath water surface
    return (
      <>
        <motion.div
          initial={{ y: '100%', opacity: 0.8 }}
          animate={{ y: ['100%', '0%', '-100%'] }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.85, ease: 'easeInOut' }}
          className="fixed inset-x-0 bottom-0 h-full bg-gradient-to-t from-[#0F4C81] via-[#00B8D9]/80 to-transparent z-[99999] pointer-events-none"
        />
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 0.85, ease: 'easeInOut' }}
          className="fixed inset-x-0 top-1/2 h-1 bg-cyan-300/60 z-[99999] pointer-events-none origin-center"
          style={{ boxShadow: '0 0 40px 10px rgba(0,184,217,0.3)' }}
        />
      </>
    );
  };

  return (
    <div className="relative overflow-visible">
      <AnimatePresence>{animating && renderOverlay()}</AnimatePresence>

      <motion.div
        key={trigger}
        initial={
          transitionType === 'emerge'
            ? { opacity: 0, y: 30, scale: 0.98 }
            : { opacity: 0, y: 15 }
        }
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.28 }}
      >
        {displayChildren}
      </motion.div>
    </div>
  );
};

export default WaterFlowTransition;
