import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Anchor } from 'lucide-react';
import {
  OceanAuthLayout,
  OceanFormCard,
  OceanInput,
  OceanButton,
  OceanErrorBanner,
} from '../components/ocean/OceanUI';

interface LoginProps {
  onNavigate: (route: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password credentials');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.message || 'Verification of credentials failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OceanAuthLayout
      title="Welcome Back, Captain."
      subtitle="Continue Your Journey."
      onLogoClick={() => onNavigate('landing')}
      sideContent={
        <div className="space-y-4">
          <p className="font-display font-black text-xl text-[#0A2540] dark:text-white leading-tight">
            Your command bridge awaits.
          </p>
          <p className="text-sm text-[#5C768D] dark:text-cyan-300 font-semibold leading-relaxed">
            Resume your voyage across skill islands, track your lighthouse streak, and sail toward your dream harbor.
          </p>
          <div className="flex gap-3 text-2xl opacity-70">
            <span>🏝️</span><span>⚓</span><span>🧭</span><span>🚢</span>
          </div>
        </div>
      }
    >
      <OceanFormCard>
        {error && <OceanErrorBanner message={error} />}
        <form onSubmit={handleSubmit} className="space-y-5">
          <OceanInput
            id="email"
            label="Captain's Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="captain@ocean.dev"
          />
          <OceanInput
            id="password"
            label="Access Key"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <OceanButton type="submit" loading={isSubmitting}>
            <span>Board the Command Deck</span>
            <ArrowRight className="h-4 w-4" />
          </OceanButton>
        </form>
        <div className="mt-6 pt-5 border-t border-[#D2E1ED] dark:border-[#123456] text-center text-xs">
          <span className="text-[#5C768D] dark:text-cyan-400">New explorer?</span>{' '}
          <button
            type="button"
            onClick={() => onNavigate('signup')}
            className="font-bold text-[#00B8D9] hover:text-[#2DD4BF] transition-colors"
          >
            Begin Your Voyage →
          </button>
        </div>
      </OceanFormCard>
    </OceanAuthLayout>
  );
};

export default Login;
