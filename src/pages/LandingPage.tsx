import React, { useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { CodeMentorLogo } from '../components/Logo';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Github, 
  Code2, 
  FileCheck, 
  Sparkles, 
  TrendingUp, 
  Map, 
  MessageSquareCode, 
  Rocket, 
  Star, 
  Award, 
  CheckCircle2, 
  Bot, 
  LineChart, 
  Terminal,
  Activity,
  Layers,
  Sparkle
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const featuresRef = useRef<HTMLDivElement>(null);

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

  const handleScrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Motion variants for smooth fade-in slide-up
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 20 } 
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0E0E10] text-slate-900 dark:text-[#E5E5E7] selection:bg-violet-500 selection:text-white transition-colors duration-300 relative overflow-hidden">
      
      {/* SaaS Style Glowing Orbs & Subtle Gradients */}
      <div className="absolute top-[-200px] left-[-100px] h-[600px] w-[600px] rounded-full bg-violet-300/15 dark:bg-violet-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-100px] h-[500px] w-[500px] rounded-full bg-sky-200/20 dark:bg-sky-500/5 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[20%] h-[400px] w-[400px] rounded-full bg-emerald-200/10 dark:bg-emerald-500/5 blur-[130px] pointer-events-none" />

      {/* Floating Animated Coding Backdrop Elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Floating Rocket */}
        <motion.div 
          animate={{ 
            y: [0, -25, 0], 
            rotate: [15, 20, 15],
            x: [0, 10, 0]
          }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute top-[18%] left-[6%] opacity-20 dark:opacity-30 text-violet-500 hidden md:block"
        >
          <Rocket className="h-10 w-10" />
        </motion.div>

        {/* Floating Code Bracket */}
        <motion.div 
          animate={{ 
            y: [0, 20, 0], 
            rotate: [-10, 10, -10]
          }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute top-[45%] left-[4%] opacity-25 dark:opacity-30 text-emerald-500 hidden md:block"
        >
          <Code2 className="h-11 w-11" />
        </motion.div>

        {/* Floating Medal/Award */}
        <motion.div 
          animate={{ 
            scale: [1, 1.15, 1],
            rotate: [0, 15, 0]
          }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          className="absolute bottom-[28%] left-[8%] opacity-20 dark:opacity-25 text-yellow-500 hidden md:flex items-center gap-1"
        >
          <Award className="h-9 w-9" />
        </motion.div>

        {/* Floating Yellow Star */}
        <motion.div 
          animate={{ 
            scale: [0.8, 1.3, 0.8],
            opacity: [0.3, 0.9, 0.3]
          }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute top-[12%] right-[12%] text-yellow-400 hidden lg:block"
        >
          <Star className="h-6 w-6 fill-current" />
        </motion.div>

        {/* Floating GitHub Logo */}
        <motion.div 
          animate={{ 
            y: [0, -15, 0],
            rotate: [360, 340, 360]
          }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          className="absolute top-[52%] right-[5%] opacity-20 dark:opacity-30 text-sky-500 hidden lg:block"
        >
          <Github className="h-10 w-10" />
        </motion.div>

        {/* Floating Sparkling Stars */}
        <motion.div 
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute top-[32%] left-[45%] text-pink-400 hidden xl:block"
        >
          <Sparkle className="h-5 w-5 fill-current" />
        </motion.div>
      </div>

      {/* Navigation Header */}
      <header className="mx-auto max-w-7xl px-6 md:px-8 relative z-10 transition-all duration-300">
        <div className="flex h-20 items-center justify-between border-b border-slate-200/60 dark:border-slate-800/50">
          <div className="flex items-center gap-3">
            <CodeMentorLogo size={38} animated={true} />
            <div className="flex flex-col">
              <span className="font-display font-black tracking-tight text-slate-850 dark:text-white text-base">CodeMentor</span>
              <span className="text-violet-600 dark:text-violet-400 font-extrabold px-1.5 py-0.2 rounded-md bg-violet-500/10 border border-violet-400/20 text-[9px] mt-0.5 tracking-wider uppercase font-mono w-fit">AI</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              type="button"
              onClick={() => onNavigate('login')}
              className="text-sm font-bold text-slate-600 dark:text-[#8E8E93] hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button 
              type="button"
              onClick={handleStart}
              className="rounded-2xl border-b-4 border-violet-750 dark:border-violet-800 bg-violet-600 hover:bg-violet-500 text-white text-xs font-black px-5 py-2.5 transition-all cursor-pointer hover:translate-y-[1px] active:translate-y-[3px] active:border-b-0 shadow-md hover:shadow-violet-600/15"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </header>

      {/* Main SaaS Responsive Hero Split */}
      <main className="mx-auto max-w-7xl px-6 py-12 md:py-20 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Side Info Section */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 text-left space-y-6"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 rounded-full border border-violet-500/15 dark:border-violet-500/25 bg-violet-500/8 dark:bg-violet-500/5 px-4.5 py-1.5 font-sans text-xs font-bold tracking-wide text-violet-600 dark:text-violet-400"
            >
              <Sparkles className="h-3.5 w-3.5 text-violet-500 animate-pulse" />
              <span>Next-Gen Career Optimization Platform</span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="font-display text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl leading-[1.12]"
            >
              Learn Smarter.<br />
              Build Faster.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-sky-500 to-emerald-500 dark:from-violet-400 dark:via-sky-400 dark:to-emerald-400">Get Hired. 🚀</span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-base sm:text-lg text-slate-600 dark:text-[#8E8E93] max-w-2xl leading-relaxed font-normal"
            >
              Track your DSA journey, analyze your GitHub profile, improve your resume, discover open-source opportunities, and get personalized AI career guidance—all in one platform.
            </motion.p>

            {/* Action Buttons styled like modern Duolingo/SaaS widgets */}
            <motion.div 
              variants={itemVariants}
              className="pt-2 flex flex-col sm:flex-row items-center gap-4 max-w-md sm:max-w-none"
            >
              <button 
                type="button"
                onClick={handleStart}
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border-b-4 border-emerald-600 bg-emerald-500 hover:bg-emerald-450 text-white font-black text-sm px-8 py-4 transition-all cursor-pointer hover:translate-y-[1px] active:translate-y-[3px] active:border-b-0 shadow-lg hover:shadow-emerald-500/20"
              >
                <span>Get Started Now</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </button>
              
              <button 
                type="button"
                onClick={handleScrollToFeatures}
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-[#202024] bg-white dark:bg-[#141416]/70 hover:bg-slate-50 dark:hover:bg-[#1C1C1E] font-bold text-sm px-8 py-4 text-slate-705 dark:text-[#E2E2E2] transition-all hover:translate-y-[-1.5px] cursor-pointer shadow-xs"
              >
                <span>Explore Features</span>
              </button>
            </motion.div>

            {/* Micro Indicators */}
            <motion.div 
              variants={itemVariants}
              className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/65 dark:border-slate-800/40 text-left max-w-lg"
            >
              <div>
                <span className="block text-2xl font-black text-violet-600 dark:text-violet-400">100%</span>
                <span className="text-[10.5px] font-bold text-slate-400 dark:text-[#8E8E93] uppercase tracking-wider">Official API Analytics</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-sky-500">Real-Time</span>
                <span className="text-[10.5px] font-bold text-slate-400 dark:text-[#8E8E93] uppercase tracking-wider">DSA Compilation</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-emerald-500">Gemini</span>
                <span className="text-[10.5px] font-bold text-slate-400 dark:text-[#8E8E93] uppercase tracking-wider">Coaching Intelligence</span>
              </div>
            </motion.div>

          </motion.div>

          {/* Right Side Stunning Dashboard Preview - SaaS style */}
          <motion.div 
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
            className="lg:col-span-5 relative"
          >
            {/* Visual Glass Card Container */}
            <div className="relative rounded-3xl border border-slate-200 dark:border-[#2D2D30]/75 bg-white dark:bg-[#101012]/95 p-5 md:p-6 shadow-[0_20px_60px_rgba(109,40,217,0.07)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.65)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/2 to-cyan-500/2 pointer-events-none" />

              {/* Mac Mock Window Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1C1C1E] pb-3.5 mb-5 select-none">
                <div className="flex items-center gap-1.5ClassName lg:gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-2 font-mono text-[10px] font-bold text-slate-400 dark:text-[#8E8E93]">codementor_analytics_v4</span>
                </div>
                {/* Active Score Badge */}
                <span className="rounded-lg bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[9px] font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400 border border-emerald-500/15 animate-pulse">
                  STREAK: 12 DAYS 🔥
                </span>
              </div>

              {/* Mock Dashboard Layout Contents */}
              <div className="space-y-4">
                
                {/* Component 1: GitHub Stats Card */}
                <div className="rounded-2xl border border-slate-150 dark:border-[#232326] bg-slate-50/50 dark:bg-[#16161A]/60 p-3.5 flex items-center justify-between gap-3 transform transition-transform duration-300 hover:translate-y-[-2px]">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
                      <Github className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800 dark:text-white leading-tight">GitHub Analytics Score</h4>
                      <p className="text-[10.5px] font-semibold text-slate-400 dark:text-[#8E8E93] mt-0.5">Verified public repositories</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-violet-600 dark:text-violet-400 block">88%</span>
                    <span className="text-[9px] font-extrabold tracking-wider text-emerald-500 uppercase">Excellent</span>
                  </div>
                </div>

                {/* Component 2: DSA Tracker Timeline with interactive checks */}
                <div className="rounded-2xl border border-slate-150 dark:border-[#232326] bg-slate-50/50 dark:bg-[#16161A]/60 p-3.5 transform transition-transform duration-300 hover:translate-y-[-2px]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Code2 className="h-4.5 w-4.5 text-sky-500" />
                      <span className="text-xs font-black text-slate-800 dark:text-white">DSA Milestone Progress</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-sky-550 dark:text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md">8 / 10 Milestones complete</span>
                  </div>
                  
                  {/* Progress Line */}
                  <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-850 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "80%" }}
                      transition={{ duration: 1.2, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-sky-400 to-sky-550 rounded-full"
                    />
                  </div>
                </div>

                {/* Component 3: AI Insights Bubble */}
                <div className="rounded-2xl border border-violet-100 dark:border-violet-950/50 bg-violet-500/5 p-3.5 relative flex gap-3 transform transition-transform duration-300 hover:translate-y-[-2px]">
                  <div className="h-7 w-7 rounded-lg bg-violet-100 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="h-4 w-4 animate-bounce" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-slate-800 dark:text-[#E2E2E2]">AICareerCoach recommendation:</p>
                    <p className="text-[10px] text-slate-500 dark:text-[#8E8E93] leading-relaxed font-medium">
                      "Complete 2 dynamic-programming loops today or configure GitHub Actions to elevate your Readiness Index!"
                    </p>
                  </div>
                </div>

                {/* Component 4: Achievement Badges Row */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="rounded-xl border border-slate-150 dark:border-[#232326] bg-slate-50/50 dark:bg-[#16161A]/40 p-2.5 flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-950/20 text-yellow-500 flex items-center justify-center text-xs">
                      🏆
                    </div>
                    <div>
                      <span className="block text-[10.5px] font-black text-slate-800 dark:text-white leading-tight">DSA Warrior</span>
                      <span className="text-[9px] font-bold text-slate-400 dark:text-[#8E8E93] uppercase">Unlocked</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-150 dark:border-[#232326] bg-slate-50/50 dark:bg-[#16161A]/40 p-2.5 flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-sky-100 dark:bg-sky-950/20 text-sky-500 flex items-center justify-center text-xs">
                      💎
                    </div>
                    <div>
                      <span className="block text-[10.5px] font-black text-slate-800 dark:text-white leading-tight">GIT Explorer</span>
                      <span className="text-[9px] font-bold text-slate-400 dark:text-[#8E8E93] uppercase">Unlocked</span>
                    </div>
                  </div>
                </div>

              </div>
              
              {/* Overlapping Absolute Micro Icons */}
              <div className="absolute bottom-4 right-4 h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md text-xs font-bold animate-bounce scale-110">
                ⭐
              </div>
            </div>

            {/* Glowing Background Radial Ring */}
            <div className="absolute -inset-1.5 rounded-[40px] bg-gradient-to-r from-violet-500 to-sky-500 opacity-20 blur-xl -z-10 group-hover:opacity-30 transition-all duration-500" />
          </motion.div>

        </div>
      </main>

      {/* Structured Features List Element to Scroll Down To */}
      <section 
        id="features-section" 
        ref={featuresRef} 
        className="scroll-mt-6 border-t border-slate-200/70 dark:border-[#202022] bg-white/60 dark:bg-[#0C0C0E] py-20 px-6 transition-colors duration-300"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <label className="text-[10px] font-black tracking-widest text-violet-600 dark:text-violet-400 uppercase bg-violet-500/10 dark:bg-violet-500/5 border border-violet-500/10 px-3.5 py-1 rounded-full">
              Full Spectrum Engineering Suite
            </label>
            <h2 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              Professional Tools For Aspiring Engineers
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-[#8E8E93]">
              CodeMentor AI continuously audits profiles across multiple technical axes to compose a recruiting-ready diagnostic review.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            
            {/* Box 1 */}
            <div className="rounded-2xl border border-slate-150 dark:border-[#222224] bg-white dark:bg-[#111113] p-7 shadow-xs hover:border-violet-500/45 dark:hover:border-violet-500/25 transition-all duration-300 hover:scale-[1.015]">
              <div className="h-11 w-11 rounded-xl bg-violet-100 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-5 border border-violet-500/10">
                <Github className="h-5.5 w-5.5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-850 dark:text-white">GitHub Audit Engine</h3>
              <p className="text-xs text-slate-500 dark:text-[#8E8E93] mt-3 leading-relaxed font-medium">
                Uses public REST APIs to evaluate file staging, license compliance, testing blocks, and code complexity scores. No fictional placeholders allowed.
              </p>
            </div>

            {/* Box 2 */}
            <div className="rounded-2xl border border-slate-150 dark:border-[#222224] bg-white dark:bg-[#111113] p-7 shadow-xs hover:border-sky-500/45 dark:hover:border-sky-500/25 transition-all duration-300 hover:scale-[1.015]">
              <div className="h-11 w-11 rounded-xl bg-sky-100 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-5 border border-sky-500/10">
                <Code2 className="h-5.5 w-5.5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-850 dark:text-white">DSA Interactive Sandbox</h3>
              <p className="text-xs text-slate-500 dark:text-[#8E8E93] mt-3 leading-relaxed font-medium">
                Submit and compile high-complexity algorithms inside an isolated diagnostic panel. Instantly assess runtime parameters and space complexity.
              </p>
            </div>

            {/* Box 3 */}
            <div className="rounded-2xl border border-slate-150 dark:border-[#222224] bg-white dark:bg-[#111113] p-7 shadow-xs hover:border-emerald-500/45 dark:hover:border-emerald-500/25 transition-all duration-300 hover:scale-[1.015]">
              <div className="h-11 w-11 rounded-xl bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 border border-emerald-500/10">
                <FileCheck className="h-5.5 w-5.5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-850 dark:text-white">Star Resume Refactorer</h3>
              <p className="text-xs text-slate-500 dark:text-[#8E8E93] mt-3 leading-relaxed font-medium">
                Upload or copy resume bullets. The system evaluates ATS scoring index and leverages Gemini to construct metrics-oriented action statements.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Band */}
      <section className="border-t border-slate-200 dark:border-slate-800/60 bg-white/40 dark:bg-[#0E0E10]/40 py-12 text-center relative z-10 transition-colors duration-300">
        <label className="font-mono text-[9px] tracking-widest text-slate-450 dark:text-[#8E8E93] uppercase font-bold">Built using advanced intelligence</label>
        <div className="mx-auto mt-5 flex flex-wrap max-w-4xl justify-center gap-x-12 gap-y-4 px-6 font-display font-extrabold text-sm sm:text-base text-slate-400 dark:text-[#5E5E65] cursor-default select-none">
          <span className="hover:text-violet-600 dark:hover:text-white transition-colors">Gemini Models</span>
          <span className="hover:text-violet-600 dark:hover:text-white transition-colors">TypeScript 5.0</span>
          <span className="hover:text-violet-600 dark:hover:text-white transition-colors">Express CJS</span>
          <span className="hover:text-violet-600 dark:hover:text-white transition-colors">Vite Engine</span>
          <span className="hover:text-violet-600 dark:hover:text-white transition-colors">Local MongoDB JSON Store</span>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="border-t border-slate-200 dark:border-[#202022] py-8 text-center bg-slate-100/30 dark:bg-[#0E0E10] text-[10.5px] text-slate-450 dark:text-[#5E5E65] font-semibold relative z-10 transition-colors duration-300">
        <p>&copy; {new Date().getFullYear()} CodeMentor AI. Structured for premium cloud engineering guidance.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
