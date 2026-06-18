import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import {
  OceanAuthLayout,
  OceanFormCard,
  OceanInput,
  OceanButton,
  OceanErrorBanner,
} from '../components/ocean/OceanUI';

interface SignupProps {
  onNavigate: (route: string) => void;
}

const UNLOCK_PREVIEWS = [
  { emoji: '🏝️', label: 'Skill Islands', desc: 'React, Python, AI archipelago' },
  { emoji: '⚓', label: 'Career Ship', desc: 'Canoe → Legendary Fleet' },
  { emoji: '🧭', label: 'Career Compass', desc: 'Direction & readiness bearing' },
  { emoji: '🐬', label: 'Ocean Creatures', desc: 'Achievement ecosystem' },
];

export const Signup: React.FC<SignupProps> = ({ onNavigate }) => {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all voyage credentials');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await signup(name, email, password);
      onNavigate('onboarding');
    } catch (err: any) {
      setError(err.message || 'Signup request was rejected');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OceanAuthLayout
      title="Begin Your Voyage"
      subtitle="Chart your course to a dream software engineering career."
      badge="NEW EXPLORER"
      onLogoClick={() => onNavigate('landing')}
      sideContent={
        <div className="space-y-5">
          <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#00B8D9]">
            What you'll unlock
          </p>
          <div className="grid grid-cols-2 gap-3">
            {UNLOCK_PREVIEWS.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-[#D2E1ED] dark:border-[#123456] bg-white/60 dark:bg-[#061524]/60 p-3"
              >
                <span className="text-xl block mb-1">{item.emoji}</span>
                <span className="text-[10px] font-black text-[#0A2540] dark:text-white block">{item.label}</span>
                <span className="text-[9px] text-[#5C768D] dark:text-cyan-400 font-semibold">{item.desc}</span>
              </motion.div>
            ))}
          </div>
          {/* Animated route map dots */}
          <svg viewBox="0 0 300 60" className="w-full h-12 opacity-50">
            <path d="M10,30 Q80,10 150,30 T290,30" fill="none" stroke="#00B8D9" strokeWidth="1.5" strokeDasharray="4 4" />
            {['⚓', '🏝️', '🧭', '🚢'].map((e, i) => (
              <text key={i} x={10 + i * 90} y="35" fontSize="14" textAnchor="middle">{e}</text>
            ))}
          </svg>
        </div>
      }
    >
      <OceanFormCard>
        {error && <OceanErrorBanner message={error} />}
        <form onSubmit={handleSubmit} className="space-y-5">
          <OceanInput
            id="name"
            label="Explorer Name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Captain Ada Lovelace"
          />
          <OceanInput
            id="email"
            label="Harbor Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="explorer@ocean.dev"
          />
          <OceanInput
            id="password"
            label="Voyage Passkey"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 6 characters"
          />
          <OceanButton type="submit" loading={isSubmitting}>
            <span>Launch Your Expedition</span>
            <ArrowRight className="h-4 w-4" />
          </OceanButton>
        </form>
        <div className="mt-6 pt-5 border-t border-[#D2E1ED] dark:border-[#123456] text-center text-xs">
          <span className="text-[#5C768D] dark:text-cyan-400">Already sailing?</span>{' '}
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="font-bold text-[#00B8D9] hover:text-[#2DD4BF] transition-colors"
          >
            Welcome Back, Captain →
          </button>
        </div>
      </OceanFormCard>
    </OceanAuthLayout>
  );
};

export default Signup;
