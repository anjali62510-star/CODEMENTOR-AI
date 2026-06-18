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
  Compass, 
  Ship, 
  Sun, 
  Moon,
  Anchor,
  Radio,
  Waves
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { user, theme, toggleTheme } = useAuth();
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

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', stiffness: 90, damping: 18 } 
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#030D18] text-[#0A2540] dark:text-[#F8FAFC] selection:bg-[#00B8D9] selection:text-white transition-colors duration-300 relative overflow-hidden font-sans">
      
      {/* Ocean Current Matrix Overlay */}
      <div className="absolute inset-0 ocean-grid opacity-80 pointer-events-none" />

      {/* Cinematic Depth Glows */}
      <div className="absolute top-0 left-1/4 h-[550px] w-[550px] rounded-full bg-[#00B8D9]/10 dark:bg-[#67E8F9]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/12 h-[450px] w-[450px] rounded-full bg-[#2DD4BF]/10 dark:bg-[#2DD4BF]/5 blur-[100px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="mx-auto max-w-7xl px-6 md:px-8 relative z-20">
        <div className="flex h-20 items-center justify-between border-b border-[#D2E1ED] dark:border-[#123456]">
          <div className="flex items-center gap-3">
            <CodeMentorLogo size={38} animated={true} />
            <div className="flex flex-col">
              <span className="font-display font-black tracking-tight text-[#0A2540] dark:text-white text-base">Ocean Explorer</span>
              <span className="text-[#0F4C81] dark:text-[#67E8F9] font-extrabold px-1.5 py-0.2 rounded bg-cyan-100/60 dark:bg-cyan-500/10 border border-cyan-200/50 dark:border-cyan-450/20 text-[8px] mt-0.5 tracking-wider uppercase font-mono w-fit">COMMAND DECK</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Minimalist Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              type="button"
              className="p-2.5 rounded-xl border border-[#D2E1ED] dark:border-[#123456] bg-white dark:bg-[#061524] text-[#5C768D] dark:text-cyan-400 hover:text-[#00B8D9] dark:hover:text-white hover:bg-[#EAF2F8] dark:hover:bg-[#123456]/40 transition-all cursor-pointer shadow-xs focus:outline-hidden"
              title={`Switch target to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <Sun className="h-4.5 w-4.5 text-cyan-400 animate-pulse" />
              ) : (
                <Moon className="h-4.5 w-4.5 text-[#0F4C81]" />
              )}
            </button>

            <button 
              type="button"
              onClick={() => onNavigate('login')}
              className="text-xs font-bold text-[#0F4C81] dark:text-cyan-400 hover:text-[#00B8D9] dark:hover:text-white transition-colors cursor-pointer px-3 py-1.5"
            >
              Log In
            </button>
            <button 
              type="button"
              onClick={handleStart}
              className="rounded-xl bg-gradient-to-r from-[#00B8D9] to-[#2DD4BF] text-white text-xs font-bold px-5 py-2.5 transition-all cursor-pointer shadow-xs hover:shadow-cyan-500/30 hover:translate-y-[-1px] active:translate-y-0"
            >
              ⚓ Start Your Voyage
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero Split Area */}
      <main className="mx-auto max-w-7xl px-6 py-16 md:py-24 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Side Content Column */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 space-y-6 text-left"
          >
            <motion.div 
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-500/15 dark:border-cyan-400/20 bg-cyan-500/10 dark:bg-cyan-500/5 px-4 py-1.5 text-xs font-semibold text-[#0F4C81] dark:text-cyan-300"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#00B8D9]" />
              <span>NAVIGATE YOUR JOURNEY TO SUCCESS</span>
            </motion.div>

            <motion.h1 
              variants={fadeUp}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-[#0A2540] dark:text-white"
            >
              Navigate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B8D9] via-[#0F4C81] to-[#2DD4BF] dark:from-[#67E8F9] dark:via-cyan-400 dark:to-teal-300">
                Developer Journey.
              </span>
            </motion.h1>

            <motion.p 
              variants={fadeUp}
              className="text-base sm:text-lg text-[#5C768D] dark:text-cyan-100 max-w-xl leading-relaxed"
            >
              Track your DSA progress, analyze your GitHub profile, improve your resume, discover open-source opportunities, and receive AI-powered career guidance—all from one intelligent ocean-inspired platform.
            </motion.p>

            {/* Actions Block */}
            <motion.div 
              variants={fadeUp}
              className="pt-2 flex flex-col sm:flex-row items-center gap-4 max-w-md sm:max-w-none"
            >
              <button 
                type="button"
                onClick={handleStart}
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00B8D9] to-[#0F4C81] text-white font-bold text-sm px-7 py-3.5 transition-all cursor-pointer shadow-md hover:shadow-cyan-500/20 hover:scale-102 active:scale-100"
              >
                <Anchor className="h-4.5 w-4.5 text-cyan-200" />
                <span>⚓ Start Your Journey</span>
                <ArrowRight className="h-4.5 w-4.5 text-cyan-300" />
              </button>
              
              <button 
                type="button"
                onClick={handleScrollToFeatures}
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-[#D2E1ED] dark:border-[#123456] bg-white dark:bg-[#061524] hover:bg-[#EAF2F8] dark:hover:bg-[#123456]/40 font-bold text-[#0F4C81] dark:text-cyan-400 text-sm px-7 py-3.5 transition-all cursor-pointer shadow-xs"
              >
                <Compass className="h-4.5 w-4.5 text-[#00B8D9]" />
                <span>🧭 Explore Features</span>
              </button>
            </motion.div>

            {/* Marine Navigation Reading Coordinates */}
            <motion.div 
              variants={fadeUp}
              className="pt-8 grid grid-cols-3 gap-6 border-t border-[#D2E1ED] dark:border-[#123456]/60 max-w-lg font-mono"
            >
              <div>
                <span className="block text-xl sm:text-2xl font-black text-[#00B8D9] dark:text-cyan-400">04° 12' N</span>
                <span className="text-[9px] font-bold text-[#5C768D] dark:text-cyan-300 uppercase tracking-widest mt-1 block">Ocean Latitude</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-black text-[#2DD4BF]">73° 50' W</span>
                <span className="text-[9px] font-bold text-[#5C768D] dark:text-cyan-300 uppercase tracking-widest mt-1 block">Course Heading</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-black text-[#0F4C81] dark:text-cyan-300">98% KPI</span>
                <span className="text-[9px] font-bold text-[#5C768D] dark:text-cyan-300 uppercase tracking-widest mt-1 block">Voyage Yield</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side IMMERSIVE CINEMATIC OCEAN & LIGHTHOUSE INTERACTIVE VISUAL */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 relative flex items-center justify-center min-h-[400px] lg:min-h-[500px]"
          >
            {/* Cinematic background compass mesh */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 dark:opacity-30">
              <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" className="max-w-[400px] animate-spin" style={{ animationDuration: '60s' }}>
                <circle cx="200" cy="200" r="180" stroke="#00B8D9" strokeWidth="1" strokeDasharray="5,15" />
                <circle cx="200" cy="200" r="140" stroke="#2DD4BF" strokeWidth="1.5" strokeDasharray="2,8" />
                <line x1="200" y1="0" x2="200" y2="400" stroke="#00B8D9" strokeWidth="0.5" />
                <line x1="0" y1="200" x2="400" y2="200" stroke="#00B8D9" strokeWidth="0.5" />
              </svg>
            </div>

            {/* Simulated Marine Canvas with Lighthouse, Sea Current, and Sailing Vessel */}
            <div className="w-full relative rounded-3xl border border-[#D2E1ED] dark:border-[#123456] bg-gradient-to-b from-[#EAF2F8] to-[#FFFFFF] dark:from-[#061524] dark:to-[#030D18] p-6 shadow-2xl overflow-hidden min-h-[380px] flex flex-col justify-between">
              
              {/* Oceanic Coordinates Display */}
              <div className="flex justify-between items-center text-[10px] font-mono text-[#5C768D] dark:text-cyan-400/80 border-b border-[#D2E1ED]/50 dark:border-[#123456]/40 pb-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>BEACON_FEED_ONLINE</span>
                </div>
                <span>SATELLITE SECTOR: 4-DSA</span>
              </div>

              {/* Lighthouse & Wave Center Stage Art */}
              <div className="relative py-12 flex items-center justify-center">
                {/* Flashing Lighthouse Laser Compass Beam */}
                <motion.div 
                  className="absolute left-[30%] top-[25%] h-[80px] w-[300px] origin-left bg-gradient-to-r from-cyan-400/30 via-transparent to-transparent -z-10"
                  animate={{ rotate: [0, 360] }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  style={{ transformOrigin: "0% 50%" }}
                />

                {/* Animated Sailboat floating on the wave */}
                <motion.div 
                  className="absolute left-[38%] top-[45%] text-[#00B8D9] z-10"
                  animate={{ 
                    y: [1, -5, 1], 
                    rotate: [2, -4, 2] 
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Ship className="h-10 w-10 text-[#00B8D9] drop-shadow-[0_0_15px_rgba(0,184,217,0.4)]" />
                </motion.div>

                {/* Highly Stylized SVG Lighthouse Illustration */}
                <div className="absolute left-[15%] top-[10%] flex flex-col items-center">
                  {/* Glowing Beacon Crown */}
                  <motion.div 
                    className="h-6 w-6 rounded-full bg-cyan-300 dark:bg-cyan-200 blur-md"
                    animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  {/* Lighthouse Cap */}
                  <div className="h-2 w-5 bg-[#0F4C81] dark:bg-[#67E8F9] rounded-t-sm" />
                  {/* Gallery Deck */}
                  <div className="h-1.5 w-8 bg-[#0A2540] dark:bg-[#00B8D9] rounded-xs" />
                  {/* Cabin Screen */}
                  <div className="h-4 w-4 bg-yellow-200 border border-[#0A2540]" />
                  {/* Tower Body */}
                  <div className="h-24 w-7 bg-gradient-to-b from-white via-[#0F4C81]/20 to-[#0A2540] border-l border-r border-[#D2E1ED]" />
                  {/* Rocks Base */}
                  <div className="h-6 w-14 bg-[#50667C] dark:bg-[#123456] rounded-t-xl" />
                </div>
              </div>

              {/* Dynamic Coastal Voyage Progress Track widget */}
              <div className="space-y-3 relative z-15 bg-[#F8FAFC]/50 dark:bg-[#061524]/80 p-4 rounded-xl border border-[#D2E1ED] dark:border-[#123456]">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#0F4C81] dark:text-cyan-300 flex items-center gap-2">
                    <Waves className="h-4 w-4 text-[#00B8D9]" />
                    <span>Current Crossing: React to Python Island</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#00B8D9] font-black">74% Charted</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-[#123456]/65 rounded-full overflow-hidden">
                  <div className="h-full w-[74%] bg-gradient-to-r from-[#0F4C81] to-[#00B8D9] rounded-full animate-pulse" />
                </div>
              </div>

            </div>

             {/* Dynamic Glow aura behind the frame */}
             <div className="absolute -inset-2 rounded-[36px] bg-gradient-to-r from-[#00B8D9] to-[#2DD4BF] opacity-10 dark:opacity-20 blur-xl -z-10 pointer-events-none" />
          </motion.div>

        </div>
      </main>

      {/* Structured Features Segment - Handcrafted Ocean Grid */}
      <section 
        id="features-section" 
        ref={featuresRef} 
        className="scroll-mt-8 border-t border-[#D2E1ED] dark:border-[#123456] bg-white dark:bg-[#061524] py-20 px-6 transition-colors duration-300"
      >
        <div className="mx-auto max-w-7xl">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-[10px] font-extrabold tracking-widest text-[#00B8D9] uppercase bg-cyan-100/60 dark:bg-[#0A2540] border border-cyan-200/50 dark:border-cyan-500/20 px-4 py-1.5 rounded-full">
              ⚓ IMMERSIVE VOYAGE SUITE
            </span>
            <h2 className="font-display text-3xl font-black text-[#0A2540] dark:text-white sm:text-4xl tracking-tight">
              Chart Your Technical Navigation Route
            </h2>
            <p className="text-sm font-semibold text-[#5C768D] dark:text-[#84A9C8] leading-relaxed">
              We replace trivial status dials with ocean-inspired diagnostic telemetry. Analyze your public code currents and map skills as interactive physical islands.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Feature 1: GitHub / Code Ocean Analytics */}
            <div className="premium-card p-8 space-y-5 transition-all text-left">
              <div className="h-10 w-10 rounded-xl bg-cyan-100 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-900/20 text-[#00B8D9] flex items-center justify-center">
                <Github className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0A2540] dark:text-white">Code Ocean Analytics</h3>
                <p className="text-xs text-[#5C768D] dark:text-cyan-100 font-semibold mt-2.5 leading-relaxed">
                  Analyze your public sea currents and repo density. Get reports detailing repository clarity, commit velocity, and missing license documentation coordinates.
                </p>
              </div>
            </div>

            {/* Feature 2: Sea Lane Tracker */}
            <div className="premium-card p-8 lg:translate-y-4 space-y-5 transition-all border-cyan-500/10 dark:border-cyan-500/5 hover:border-cyan-500/30 text-left">
              <div className="h-10 w-10 rounded-xl bg-teal-100 dark:bg-teal-950/40 border border-teal-250 dark:border-teal-900/20 text-[#2DD4BF] flex items-center justify-center">
                <Code2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0A2540] dark:text-white">Sea Lane DSA Tracker</h3>
                <p className="text-xs text-[#5C768D] dark:text-cyan-100 font-semibold mt-2.5 leading-relaxed">
                  Solve algorithms across arrays reefs and tree forest islands. Record compiler latency ratings as you navigate deep optimization sea layers.
                </p>
              </div>
            </div>

            {/* Feature 3: Recruiter Radar */}
            <div className="premium-card p-8 space-y-5 transition-all text-left">
              <div className="h-10 w-10 rounded-xl bg-blue-105 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/20 text-[#0F4C81] flex items-center justify-center">
                <FileCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0A2540] dark:text-white">Recruiter Radar ATS</h3>
                <p className="text-xs text-[#5C768D] dark:text-cyan-100 font-semibold mt-2.5 leading-relaxed">
                  Scans resumes via nautical diagnostic sonar to discover missing career signals, ATS keyword blockages, and target tech industry coordinates.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Bottom Core Technologies */}
      <section className="border-t border-[#D2E1ED] dark:border-[#123456] bg-slate-50 dark:bg-[#030D18]/80 py-12 text-center transition-colors">
        <label className="text-[10px] font-bold tracking-widest text-[#5C768D] dark:text-cyan-400 uppercase font-mono">Ocean Explorer Fleet Core</label>
        <div className="mx-auto mt-4.5 flex flex-wrap max-w-4xl justify-center gap-x-12 gap-y-4 px-6 font-display font-extrabold text-xs sm:text-sm text-[#0F4C81] sm:text-[#5C768D] dark:text-slate-400 select-none">
          <span className="hover:text-cyan-500 transition-colors">⚓ Gemini Models Command</span>
          <span className="hover:text-cyan-500 transition-colors">🌊 Sea currents telemetry</span>
          <span className="hover:text-cyan-500 transition-colors">🧭 Marine Compass Engine</span>
          <span className="hover:text-cyan-500 transition-colors">⛵ Lighthouse Node Stack</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#D2E1ED] dark:border-[#123456] py-8 text-center bg-white dark:bg-[#030D18] text-[10px] text-[#5C768D] font-bold">
        <p>&copy; {new Date().getFullYear()} Ocean Explorer - Navigate Your Developer Voyage. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
