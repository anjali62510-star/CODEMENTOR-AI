import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, Terminal } from 'lucide-react';

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
      console.error(err);
      setError(err.message || 'Verification of credentials failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-[#09090B] text-[#E5E5E7] py-12 sm:px-6 lg:px-8 relative selection:bg-emerald-500 selection:text-black">
      {/* Background glow highlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div 
          onClick={() => onNavigate('landing')}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xl cursor-pointer"
        >
          C
        </div>
        <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-white font-sans sm:text-3xl">
          Welcome Back to CodeMentor
        </h2>
        <p className="mt-1.5 text-xs text-[#8E8E93]">
          Connect to your professional AI developmental roadmap
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
              <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-[#AEAEB2] mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@codementor.ai"
                className="w-full bg-[#1C1C1E] border border-[#2D2D30] rounded-lg px-3.5 py-2 text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-mono uppercase tracking-wider text-[#AEAEB2]">
                  Password
                </label>
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1C1C1E] border border-[#2D2D30] rounded-lg px-3.5 py-2 text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black py-2.5 text-xs font-semibold tracking-wide transition-all duration-200 shadow-[0_0_15px_rgba(16,185,129,0.15)] disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Authenticate Session</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#1C1C1E] text-center text-xs">
            <span className="text-[#8E8E93]">New to the platform?</span>{' '}
            <button
              type="button"
              onClick={() => onNavigate('signup')}
              className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Request Access / Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
