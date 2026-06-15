import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight } from 'lucide-react';

interface SignupProps {
  onNavigate: (route: string) => void;
}

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
      setError('Please fill in complete coordinates');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await signup(name, email, password);
      onNavigate('onboarding'); // Immediately route to Onboarding workflow on registration
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Signup request was rejected');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-[#09090B] text-[#E5E5E7] py-12 sm:px-6 lg:px-8 relative selection:bg-emerald-500 selection:text-black">
      {/* Background glow highlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-[#10B981]/5 blur-[100px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div 
          onClick={() => onNavigate('landing')}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xl cursor-pointer"
        >
          C
        </div>
        <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-white font-sans sm:text-3xl">
          Create platform credentials
        </h2>
        <p className="mt-1.5 text-xs text-[#8E8E93]">
          Initialize your profile and track structural career readiness
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div className="bg-[#141416]/85 border border-[#2D2D30] rounded-xl py-8 px-6 sm:px-8 shadow-[2px_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
          {error && (
            <div className="mb-5 rounded-lg border border-rose-500/20 bg-rose-500/5 p-3.5 text-xs text-rose-400 flex items-start gap-2">
              <span className="font-bold">Error:</span>
              <p className="flex-1">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-[#AEAEB2] mb-1.5">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                className="w-full bg-[#1C1C1E] border border-[#2D2D30] rounded-lg px-3.5 py-2 text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-[#AEAEB2] mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ada@example.com"
                className="w-full bg-[#1C1C1E] border border-[#2D2D30] rounded-lg px-3.5 py-2 text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-mono uppercase tracking-wider text-[#AEAEB2] mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-[#1C1C1E] border border-[#2D2D30] rounded-lg px-3.5 py-2 text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black py-2.5 text-xs font-semibold tracking-wide transition-all duration-200 shadow-[0_0_15px_rgba(16,185,129,0.15)] disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Registering Account...</span>
              ) : (
                <>
                  <span>Create Account & Onboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#1C1C1E] text-center text-xs">
            <span className="text-[#8E8E93]">Already registered?</span>{' '}
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Sign In Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Signup;
