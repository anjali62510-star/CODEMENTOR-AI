import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';

interface FloatingPanelProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}

export const FloatingPanel: React.FC<FloatingPanelProps> = ({
  children,
  className = '',
  delay = 0,
  id,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rippleId = Date.now();
    setRipples((prev) => [...prev, { id: rippleId, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 900);
  };

  return (
    <motion.div
      ref={panelRef}
      id={id}
      onMouseEnter={handleMouseEnter}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`premium-card relative overflow-hidden ${className}`}
    >
      {/* Water reflection shadow beneath card */}
      <div className="absolute -bottom-2 left-[8%] right-[8%] h-3 rounded-[50%] bg-cyan-500/8 dark:bg-cyan-400/5 blur-md pointer-events-none" />

      {/* Ripple effects on hover */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="water-ripple pointer-events-none absolute rounded-full border border-cyan-400/40 dark:border-cyan-300/30"
          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default FloatingPanel;
