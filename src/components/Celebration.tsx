import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Sparkles, Flame, Star, Award, Zap, BookOpen, Target, Rocket, Anchor, Compass } from 'lucide-react';

// Custom Event Triggers for easy integration
export const triggerConfetti = (duration = 3000) => {
  window.dispatchEvent(new CustomEvent('trigger-confetti', { detail: { duration } }));
};

export const triggerBadgeUnlock = (badgeName: string, description: string, iconType: string) => {
  window.dispatchEvent(new CustomEvent('trigger-badge', { detail: { badgeName, description, iconType } }));
};

export const triggerXpGain = (amount: number, reason: string) => {
  window.dispatchEvent(new CustomEvent('trigger-xp', { detail: { amount, reason } }));
};

// 1. Confetti Particle Emitter Component
interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  emoji?: string;
  angle: number;
  speed: number;
  spin: number;
  size: number;
}

export const ConfettiEmitter: React.FC = () => {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);

  useEffect(() => {
    const handleConfettiEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      const duration = customEvent.detail?.duration || 3000;
      const emojis = ['🐠', '🐬', '🐢', '🦈', '🐋', '⚓', '🌊', '✨', '🏝️', '🚢'];
      const colors = ['#00B8D9', '#2DD4BF', '#0F4C81', '#67E8F9', '#10B981', '#06B6D4', '#0891B2'];

      const newParticles: ConfettiParticle[] = Array.from({ length: 60 }).map((_, idx) => {
        const isEmoji = Math.random() > 0.4;
        return {
          id: Date.now() + idx + Math.random(),
          x: Math.random() * 100, // percentage from left
          y: -10, // start above screen
          color: colors[Math.floor(Math.random() * colors.length)],
          emoji: isEmoji ? emojis[Math.floor(Math.random() * emojis.length)] : undefined,
          angle: Math.random() * 360,
          speed: Math.random() * 4 + 2,
          spin: Math.random() * 720 - 360,
          size: Math.random() * 15 + 12
        };
      });

      setParticles(prev => [...prev, ...newParticles]);

      // Remove after duration
      setTimeout(() => {
        setParticles(prev => prev.filter(p => !newParticles.includes(p)));
      }, duration + 1000);
    };

    window.addEventListener('trigger-confetti', handleConfettiEvent);
    return () => window.removeEventListener('trigger-confetti', handleConfettiEvent);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ 
            left: `${p.x}vw`, 
            top: `${p.y}vh`, 
            opacity: 1, 
            scale: 0.5, 
            rotate: 0 
          }}
          animate={{
            top: '110vh',
            left: `${p.x + (Math.sin(p.angle) * 10)}vw`,
            opacity: [1, 1, 0.8, 0],
            scale: [0.5, 1.2, 1, 0.7],
            rotate: p.spin
          }}
          transition={{
            duration: p.speed,
            ease: 'easeOut'
          }}
          className="absolute"
          style={{ fontSize: p.size }}
        >
          {p.emoji ? (
            <span>{p.emoji}</span>
          ) : (
            <div 
              className="rounded-full shadow-xs" 
              style={{ 
                width: `${p.size / 2}px`, 
                height: `${p.size / 2}px`, 
                backgroundColor: p.color 
              }} 
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};


// 2. XP Counter Animation Component
export const AnimatedCountUp: React.FC<{ value: number; duration?: number; suffix?: string }> = ({ 
  value, 
  duration = 1,
  suffix = ''
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setCount(end);
      return;
    }

    const totalMiliseconds = duration * 1000;
    const stepTime = Math.max(Math.floor(totalMiliseconds / Math.max(end, 1)), 15);
    
    const timer = setInterval(() => {
      start += Math.ceil(end / (totalMiliseconds / stepTime));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}{suffix}</span>;
};


// 3. Motivational sliding Banner Marquee System
export const MotivationalBanner: React.FC = () => {
  const [activeMessageIdx, setActiveMessageIdx] = useState(0);
  const messages = [
    { text: "⚓ One wave closer to your dream harbor. Chart your next learning destination!", icon: Anchor, color: 'text-cyan-500' },
    { text: "🔥 Lighthouse Level rising! Your career compass bearing exceeds 82% of peers.", icon: Flame, color: 'text-orange-500' },
    { text: "🌊 Keep your coding streak alive — sail through 2 more algorithm reefs today!", icon: Sparkles, color: 'text-cyan-400' },
    { text: "🧭 Captain Mentor: Resume SONAR grade upgraded to 'Excellent' depth rating.", icon: Compass, color: 'text-teal-500 font-extrabold' },
    { text: "🏝️ Learn. Build. Explore. Grow your skill island archipelago.", icon: Star, color: 'text-emerald-500' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMessageIdx(prev => (prev + 1) % messages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = messages[activeMessageIdx].icon;

  return (
    <div className="w-full overflow-hidden border border-[#D2E1ED] dark:border-[#123456]/60 bg-white dark:bg-[#061524]/60 rounded-2xl py-3 px-6 shadow-xs flex items-center justify-between select-none relative premium-card">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMessageIdx}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex items-center gap-3 font-sans text-xs md:text-sm font-semibold text-slate-700 dark:text-[#E5E5E7] pr-8"
        >
          <CurrentIcon className={`h-4.5 w-4.5 animate-bounce ${messages[activeMessageIdx].color}`} />
          <span>{messages[activeMessageIdx].text}</span>
        </motion.div>
      </AnimatePresence>

      <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[9px] font-black uppercase text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800/40 px-2.5 py-1 rounded-lg">
        <Sparkles className="h-3 w-3 text-cyan-500 animate-pulse" />
        <span>Ocean Guide Live</span>
      </span>
    </div>
  );
};


// 4. Floating Mascot & Help Desk Component
export const FloatingMascot: React.FC = () => {
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const captainQuotes = [
    "⚓ Ahoy! Your career compass bearing is strong — keep sailing toward deeper waters!",
    "🧭 Tip: Solve a recursion puzzle at Arrays Reef to boost your DSA tide level!",
    "🌊 Your commit currents look great this week. Maintain that velocity, sailor!",
    "🏝️ Just 1 interview prep session will unlock the next harbor milestone!",
    "🐬 Every algorithm you solve adds life to your ocean. The dolphins approve!",
    "🚢 Your skill islands are growing — chart course for the AI/ML archipelago next!"
  ];

  const handleMascotClick = () => {
    const randomQuote = captainQuotes[Math.floor(Math.random() * captainQuotes.length)];
    setBubbleText(randomQuote);
    setShowSpeechBubble(true);
    triggerConfetti(1500);

    setTimeout(() => {
      setShowSpeechBubble(false);
    }, 5500);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setBubbleText("⚓ Ahoy! I'm Captain Mentor, your Ocean Guide. Click me for navigation tips!");
      setShowSpeechBubble(true);
      setTimeout(() => setShowSpeechBubble(false), 6000);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Speech Bubble */}
      <AnimatePresence>
        {showSpeechBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="mb-3 max-w-[240px] bg-white dark:bg-[#061524] border border-cyan-200 dark:border-[#123456] p-3.5 rounded-2xl rounded-br-none shadow-[2px_8px_20px_rgba(0,184,217,0.12)] text-[11px] font-sans font-extrabold text-[#0A2540] dark:text-cyan-100 select-text relative"
          >
            {bubbleText}
            <div className="absolute right-[14px] bottom-[-6px] w-3 h-3 bg-white dark:bg-[#061524] border-r border-b border-cyan-200 dark:border-[#123456] rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.12, rotate: [0, -3, 3, 0] }}
        whileTap={{ scale: 0.92 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleMascotClick}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#0F4C81] via-[#00B8D9] to-[#2DD4BF] text-white flex items-center justify-center shadow-lg cursor-pointer hover:shadow-cyan-500/25 relative focus:outline-hidden group border border-cyan-300/30"
        title="Captain Mentor — Ocean Guide AI"
      >
        <span className="text-2xl group-hover:animate-bounce">⚓</span>
        <div className="absolute inset-0 rounded-full bg-cyan-400 opacity-15 animate-ping pointer-events-none" />
        <span className="absolute -top-1 -right-1 text-sm bg-[#0F4C81] text-cyan-300 p-0.5 rounded-full shadow-xs border border-cyan-400/30">🧭</span>
      </motion.button>
    </div>
  );
};


// 5. XP Toast Flyout Alerts
interface XpToast {
  id: string;
  amount: number;
  reason: string;
}

export const XpGainToaster: React.FC = () => {
  const [toasts, setToasts] = useState<XpToast[]>([]);

  useEffect(() => {
    const handleXpEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { amount, reason } = customEvent.detail;
      const newToast: XpToast = {
        id: Math.random().toString(36).substring(2, 9),
        amount,
        reason
      };

      setToasts(prev => [...prev, newToast]);

      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 4000);
    };

    window.addEventListener('trigger-xp', handleXpEvent);
    return () => window.removeEventListener('trigger-xp', handleXpEvent);
  }, []);

  return (
    <div className="fixed bottom-24 right-5 z-40 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className="bg-[#061524] border border-cyan-500/30 text-white rounded-xl py-2.5 px-4 flex items-center gap-3 shadow-md font-sans text-xs select-none"
          >
            <div className="bg-cyan-500/20 text-cyan-400 p-1.5 rounded-lg border border-cyan-500/30">
              <Zap className="h-4 w-4 fill-cyan-400" />
            </div>
            <div>
              <div className="font-extrabold text-cyan-100 flex items-center gap-1.5">
                <span className="text-[#2DD4BF]">+{t.amount} XP</span> Earned
              </div>
              <span className="text-[10px] text-[#8E8E93] font-bold">{t.reason}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};


// 6. Badges & Milestones Grand Unlocks Alert Popup Modal
interface BadgeData {
  badgeName: string;
  description: string;
  iconType: string;
}

export const BadgeUnlockModal: React.FC = () => {
  const [activeBadge, setActiveBadge] = useState<BadgeData | null>(null);

  useEffect(() => {
    const handleBadgeEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { badgeName, description, iconType } = customEvent.detail;
      setActiveBadge({ badgeName, description, iconType });
      // Burst confetti initially
      triggerConfetti(3500);
    };

    window.addEventListener('trigger-badge', handleBadgeEvent);
    return () => window.removeEventListener('trigger-badge', handleBadgeEvent);
  }, []);

  if (!activeBadge) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative"
        >
          {/* Sparkles background effects */}
          <div className="absolute top-2 left-4 text-orange-400 text-lg animate-pulse">✨</div>
          <div className="absolute bottom-2 right-4 text-violet-400 text-lg animate-ping">⭐</div>

          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-500 via-indigo-600 to-amber-500 p-0.5 shadow-md flex items-center justify-center mb-5 animate-bounce">
            <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center text-white">
              {activeBadge.iconType === 'rocket' ? <Rocket className="h-7 w-7 text-sky-400" /> :
               activeBadge.iconType === 'flame' ? <Flame className="h-7 w-7 text-orange-500" /> :
               activeBadge.iconType === 'star' ? <Star className="h-7 w-7 text-yellow-400" /> :
               activeBadge.iconType === 'award' ? <Award className="h-7 w-7 text-fuchsia-400" /> :
               activeBadge.iconType === 'target' ? <Target className="h-7 w-7 text-rose-500" /> :
               <Award className="h-7 w-7 text-violet-400" />}
            </div>
          </div>

          <span className="block text-[10px] font-mono tracking-widest text-violet-500 dark:text-violet-400 font-extrabold uppercase">Milestone Achieved</span>
          <h2 className="text-xl font-display font-black tracking-tight text-slate-850 dark:text-white mt-1.5">{activeBadge.badgeName}</h2>
          <p className="text-xs text-slate-500 dark:text-[#8E8E93] leading-relaxed mt-2 font-semibold">
            {activeBadge.description}
          </p>

          {/* Reward highlights */}
          <div className="my-5 rounded-2xl bg-violet-500/10 border border-violet-500/15 py-3.5 px-4 flex items-center justify-between text-left">
            <div className="flex items-center gap-2">
              <Zap className="h-4.5 w-4.5 text-amber-500 fill-amber-500 animate-pulse" />
              <div>
                <span className="block text-[9px] font-mono font-bold text-slate-400 dark:text-[#8E8E93] uppercase">Claimed Reward</span>
                <span className="text-xs font-extrabold text-slate-850 dark:text-white font-sans">+250 CodeMentor XP</span>
              </div>
            </div>
            <Award className="h-5 w-5 text-violet-500 animate-spin" style={{ animationDuration: '6s' }} />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => {
              setActiveBadge(null);
              // Small extra confettiburst on dismiss for fun
              triggerConfetti(1000);
            }}
            className="w-full bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer"
          >
            Brilliant, let's keep building! 🚀
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


// 7. Mini typing effect component for headers & announcements
export const TypewriterText: React.FC<{ text: string; delay?: number; className?: string }> = ({ 
  text, 
  delay = 50, 
  className = "" 
}) => {
  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    let index = 0;
    setCurrentText('');
    const interval = setInterval(() => {
      if (index < text.length) {
        setCurrentText(prev => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, delay);

    return () => clearInterval(interval);
  }, [text, delay]);

  return <span className={className}>{currentText}</span>;
};
