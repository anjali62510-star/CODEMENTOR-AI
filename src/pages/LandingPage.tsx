import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowRight, 
  Terminal, 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  Github, 
  Code2, 
  FileCheck 
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  const handleStart = () => {
    if (user) {
      if (user.onboarded) {
        onNavigate('dashboard');
      } else {
        onNavigate('onboarding');
      }
    } else {
      onNavigate('signup');
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-[#E5E5E7] selection:bg-emerald-500 selection:text-black">
      {/* Background Gradients */}
      <div className="absolute top-0 right-1/4 h-[350px] w-[350px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-1/4 h-[400px] w-[400px] rounded-full bg-[#10B981]/5 blur-[150px] pointer-events-none" />

      {/* Ribbon Navigation */}
      <header className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="flex h-18 items-center justify-between border-b border-[#1C1C1E]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-lg">
              C
            </div>
            <span className="font-sans font-bold tracking-tight text-white text-base">CodeMentor<span className="text-emerald-400 font-mono ml-1 text-xs">AI</span></span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              type="button"
              onClick={() => onNavigate('login')}
              className="text-sm font-medium text-[#8E8E93] hover:text-white transition-colors duration-200"
            >
              Sign In
            </button>
            <button 
              type="button"
              onClick={handleStart}
              className="rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#09090B] text-xs font-semibold px-4 py-2 transition-all duration-200 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
            >
              Go to Sandbox
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-5xl px-6 py-20 text-center md:py-28 md:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 font-mono text-[10px] font-medium tracking-wide text-emerald-400 uppercase">
          <Sparkles className="h-3 w-3" />
          <span>Next Generation career guidance engine</span>
        </div>

        <h1 className="mt-8 font-sans text-4xl font-extrabold tracking-tight text-white sm:text-6xl max-w-4xl mx-auto leading-[1.12]">
          Build your credentials and bridge the gap to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400">FAANG & SaaS</span> Teams
        </h1>

        <p className="mt-6 text-base text-[#8E8E93] max-w-2xl mx-auto leading-relaxed">
          Stop relying on generic course certificates. CodeMentor AI conducts structural audits on your actual GitHub, DSA submissions, and resumes to compile your real-time Readiness Index.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            type="button"
            onClick={handleStart}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm px-6 py-3.5 transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.01]"
          >
            <span>Start Building Today</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button 
            type="button"
            onClick={() => onNavigate('login')}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-[#2D2D30] bg-[#141416]/50 hover:bg-[#1C1C1E] font-medium text-sm px-6 py-3.5 transition-all text-[#E5E5E7] duration-200"
          >
            Log In with Credentials
          </button>
        </div>

        {/* Dynamic visual mockup */}
        <div className="mt-20 rounded-2xl border border-[#262626] bg-[#0E0E10] p-4 md:p-6 shadow-[2px_12px_45px_rgba(0,0,0,0.7)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-[#10B981]/1 to-transparent opacity-80 pointer-events-none" />
          
          {/* Header mimic */}
          <div className="flex items-center justify-between border-b border-[#1C1C1E] pb-3 mb-4 font-mono text-[10px] text-[#8E8E93]">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/20" />
              <span className="h-3 w-3 rounded-full bg-amber-500/20" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/20" />
              <span className="ml-2">codementor_ai_sandbox_v4.5</span>
            </div>
            <span className="text-emerald-400/90 font-semibold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">ONLINE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="rounded-xl border border-[#1C1C1E] bg-[#141416] p-4 flex flex-col gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-500/15 border border-emerald-500/10 text-emerald-400">
                <Github className="h-4 w-4" />
              </div>
              <h3 className="font-sans font-bold text-white text-sm">GitHub Analyzer</h3>
              <p className="text-xs text-[#8E8E93] leading-relaxed">Runs dynamic algorithmic audits on repository README formatting and commit patterns to boost open-source credentials.</p>
            </div>

            <div className="rounded-xl border border-[#1C1C1E] bg-[#141416] p-4 flex flex-col gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-500/15 border border-emerald-500/10 text-emerald-400">
                <Code2 className="h-4 w-4" />
              </div>
              <h3 className="font-sans font-bold text-white text-sm">DSA Problem Sandbox</h3>
              <p className="text-xs text-[#8E8E93] leading-relaxed">Paste TypeScript solutions and let our compiler-grade AI evaluate space/time complexity and identify hidden boundary failures.</p>
            </div>

            <div className="rounded-xl border border-[#1C1C1E] bg-[#141416] p-4 flex flex-col gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-500/15 border border-emerald-500/10 text-emerald-400">
                <FileCheck className="h-4 w-4" />
              </div>
              <h3 className="font-sans font-bold text-white text-sm">Resume Bullet STAR Improver</h3>
              <p className="text-xs text-[#8E8E93] leading-relaxed">Instantly convert generic achievements into high-precision, metrics-oriented performance bullets that hook top-tier recruiters.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Trust elements */}
      <section className="border-t border-[#1C1C1E] bg-[#0A0A0C] py-16 text-center">
        <label className="font-mono text-[10px] tracking-widest text-[#8E8E93] uppercase">Powered by advanced intelligence</label>
        <div className="mx-auto mt-6 flex flex-wrap max-w-4xl justify-center gap-x-12 gap-y-6 px-6 font-semibold text-lg text-[#5E5E65] cursor-default select-none">
          <span className="hover:text-[#E5E5E7] transition-colors duration-200">Gemini 3.5</span>
          <span className="hover:text-[#E5E5E7] transition-colors duration-200">TypeScript</span>
          <span className="hover:text-[#E5E5E7] transition-colors duration-200">Express Node</span>
          <span className="hover:text-[#E5E5E7] transition-colors duration-200">Local MongoDB Model</span>
        </div>
      </section>

      {/* Clean elegant footer */}
      <footer className="border-t border-[#1C1C1E] py-8 text-center bg-[#09090B] text-xs text-[#5E5E65]">
        <p>&copy; {new Date().getFullYear()} CodeMentor AI. Structured for premium cloud guidance services.</p>
      </footer>
    </div>
  );
};
export default LandingPage;
