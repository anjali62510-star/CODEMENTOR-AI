import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MetricLineChart } from '../components/DashboardCharts';
import { DashboardWidget } from '../components/DashboardWidget';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Github, 
  Code2, 
  Flame, 
  MessageSquareCode, 
  FileSearch, 
  Compass, 
  Sparkles, 
  TrendingUp, 
  CheckCircle,
  Clock,
  Award,
  Zap,
  Ship,
  Waves,
  Anchor,
  Navigation,
  BookOpen,
  ArrowRight,
  X
} from 'lucide-react';
import { MotivationalBanner } from '../components/Celebration';
import { DailyStreak } from '../components/DailyStreak';
import { WeeklyXpChart } from '../components/WeeklyXpChart';
import { DailyGoals } from '../components/DailyGoals';
import { ConsistencyScoreCard } from '../components/ConsistencyScoreCard';
import { CareerOceanMap } from '../components/CareerOceanMap';
import { FloatingPanel } from '../components/FloatingPanel';
import { CareerCompass } from '../components/CareerCompass';
import { SkillIslandVisual } from '../components/SkillIslandVisual';
import { OceanAchievements } from '../components/OceanAchievements';
import { CareerShip } from '../components/CareerShip';
import { useOceanSettings } from '../hooks/useOceanSettings';

interface DashboardProps {
  setActivePage: (page: string) => void;
}

interface Island {
  id: string;
  name: string;
  coordinates: string;
  description: string;
  technologies: string[];
  requiredScore: number;
  unlocked: boolean;
  color: string;
  icon: React.ComponentType<any>;
  details: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActivePage }) => {
  const { user } = useAuth();
  const { prefs } = useOceanSettings();
  const [loading, setLoading] = useState(true);
  const [feedItems, setFeedItems] = useState<{ id: string; msg: string; time: string; type: string }[]>([]);
  const [selectedIsland, setSelectedIsland] = useState<Island | null>(null);

  useEffect(() => {
    if (user) {
      const items = [
        { id: '1', msg: 'Anchor weighed. Ocean voyage monitoring initialized on Command Deck.', time: 'Just now', type: 'system' },
        { id: '2', msg: `Sea Lane DSA algorithmic currents synchronized with compiler telemetry.`, time: '1 hour ago', type: 'dsa' },
      ];
      if (user.scores.github > 0) {
        items.unshift({ id: '3', msg: `Code Ocean Analytics compiled: profile stands clear at ${user.scores.github}% depth accuracy.`, time: '10 mins ago', type: 'github' });
      }
      if (user.scores.resume > 15) {
        items.unshift({ id: '4', msg: `Recruiter Radar scanning completed: structural resume keyword alignment at ${user.scores.resume}%.`, time: '2 hours ago', type: 'resume' });
      }
      if (user.scores.openSource > 0) {
        items.unshift({ id: '5', msg: `Anchor point logs recorded: registered collaborative merits from github tides.`, time: 'Yesterday', type: 'opensource' });
      }
      setFeedItems(items);
      setLoading(false);
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex h-64 items-center justify-center font-mono text-xs text-[#5C768D] dark:text-cyan-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#00B8D9] border-t-transparent" />
          <span>Calibrating marine compasses & weighing anchor...</span>
        </div>
      </div>
    );
  }

  // Historic progress line dataset
  const progressHistory = [
    { label: 'Departure', value: 15 },
    { label: 'Mid-Ocean Crossing', value: Math.max(15, user.scores.careerReadiness - 18) },
    { label: 'Shallow Waters', value: Math.max(15, user.scores.careerReadiness - 8) },
    { label: 'Anchored Haven', value: user.scores.careerReadiness }
  ];

  // Dynamically compute Career Compass directions
  const getCompassHeading = (score: number) => {
    if (score < 40) return { direction: 'South-West (SW)', title: 'Shallow Coastal Waters', alert: 'Chart course for deeper knowledge currents.' };
    if (score >= 40 && score < 65) return { direction: 'North-West (NW)', title: 'Open Lagoon Crossing', alert: 'Tides are stable. Increase commit velocity.' };
    if (score >= 65 && score < 85) return { direction: 'North-East (NE)', title: 'High-Sea Gale Navigation', alert: 'Excellent tracking vectors. Approaching safe career harbor.' };
    return { direction: 'Direct North (N 0°)', title: 'Absolute Safe Haven Anchorage', alert: 'Ready for recruiter boarding procedures.' };
  };

  // Skill progress mapping for island growth stages
  const getIslandProgress = (id: string): number => {
    switch (id) {
      case 'react': return Math.min(100, user.scores.dsa);
      case 'nodejs': return Math.min(100, user.scores.resume);
      case 'python': return Math.min(100, user.scores.github);
      case 'aiml': return Math.min(100, user.scores.careerReadiness);
      case 'database': return Math.min(100, user.scores.interviewReadiness);
      default: return 0;
    }
  };

  const recommendedDestination =
    user.scores.dsa < 50 ? 'Arrays Reef Challenge' :
    user.scores.github < 50 ? 'Code Ocean Commits' :
    'Sonar ATS Optimizations';

  const compassHeading = getCompassHeading(user.scores.careerReadiness);

  const skillIslands: Island[] = [
    {
      id: 'react',
      name: 'React Island',
      coordinates: 'Latitude 04° N, Longitude 12° W',
      description: 'Master modular render trees, hook stream optimizations, concurrent fiber reconciliation, and stable responsive states.',
      technologies: ['React 19', 'Zustand', 'Tailwind', 'Vite CSS'],
      requiredScore: 30,
      unlocked: user.scores.dsa >= 30 || user.scores.careerReadiness >= 10,
      color: 'from-cyan-400 to-[#0F4C81]',
      icon: Waves,
      details: 'This island governs the visual horizons of your engineering vessel. Learn to coordinate interface frame updates smoothly without lagging render loops.'
    },
    {
      id: 'nodejs',
      name: 'Node.js Island',
      coordinates: 'Latitude 06° N, Longitude 18° W',
      description: 'Design stateless REST API gates, async non-blocking queues, bundle packaging schemes, and scalable Express middle layers.',
      technologies: ['Express', 'TS Execution', 'ES Modules', 'CI/CD Pipelines'],
      requiredScore: 40,
      unlocked: user.scores.resume >= 30,
      color: 'from-emerald-400 to-[#0F4C81]',
      icon: Anchor,
      details: 'Governs the mechanical engine of your cruise. Non-blocking asynchronous threads keep database requests circulating across the ship deck efficiently.'
    },
    {
      id: 'python',
      name: 'Python Island',
      coordinates: 'Latitude 03° N, Longitude 24° W',
      description: 'Implement dataframe manipulations, scientific algorithms, mathematical matrices, and scientific plotting variables.',
      technologies: ['Numpy', 'Pandas', 'Algorithms', 'Regression Schemes'],
      requiredScore: 30,
      unlocked: user.scores.github >= 30,
      color: 'from-[#00B8D9] to-teal-600',
      icon: Ship,
      details: 'The navigation log island. Formulate raw telemetry measurements into actionable routes and analytical vectors.'
    },
    {
      id: 'aiml',
      name: 'AI/ML Island',
      coordinates: 'Latitude 08° N, Longitude 10° W',
      description: 'Fine-tune self-attention transformer frameworks, design tensor calculations, and integrate intelligent SDK agents.',
      technologies: ['Gemini Models', 'PyTorch Layouts', 'Attention Weights', 'Vector Search'],
      requiredScore: 50,
      unlocked: user.scores.careerReadiness >= 50,
      color: 'from-purple-500 to-[#0A2540]',
      icon: Sparkles,
      details: 'The floating cloud beacon. Bestows automatic course correction formulas onto your boat using state-of-the-art predictive networks.'
    },
    {
      id: 'database',
      name: 'Database Island',
      coordinates: 'Latitude 05° N, Longitude 15° W',
      description: 'Structure clean relational tables, indexed B-Tree indexes, transaction isolation levels, and eventual consistency keys.',
      technologies: ['PostgreSQL', 'SQL windowing', 'Redis caches', 'ACID models'],
      requiredScore: 30,
      unlocked: user.scores.interviewReadiness >= 30,
      color: 'from-amber-400 to-[#0F4C81]',
      icon: Navigation,
      details: 'The anchor locker repository. Guarantees that cargo quantities are accounted for even during massive data storm fluctuations.'
    }
  ];

  // Specific widgets definition mapping
  const widgets = [
    {
      id: 'github',
      title: 'Code Ocean Analytics',
      score: user.scores.github,
      icon: Github,
      description: 'Audit repository file diversity, commit green waves, and license documentation depths.',
      details: user.onboarding?.githubUsername ? `@${user.onboarding.githubUsername}` : 'Course pending',
      actionLabel: 'Analyze Profile',
      onClick: () => setActivePage('github')
    },
    {
      id: 'dsa',
      title: 'Sea Lane DSA Tracker',
      score: user.scores.dsa,
      icon: Code2,
      description: 'Solve technical algorithms across arrays reefs, tree forest lanes, and edge current stacks.',
      details: `${user.scores.dsa > 30 ? '34 Areas Cleared' : '10 Areas Cleared'} • Target: 150`,
      actionLabel: 'Open Sea Lanes',
      onClick: () => setActivePage('dsa')
    },
    {
      id: 'resume',
      title: 'Recruiter Radar',
      score: user.scores.resume,
      icon: FileSearch,
      description: 'Tune ATS resume SONAR trackers to isolate missing industry keyword coordinate markers.',
      details: `AST Match Grade: ${user.scores.resume}%`,
      actionLabel: 'Audit Resume',
      onClick: () => setActivePage('resume')
    },
    {
      id: 'interview',
      title: 'Ocean Guide AI',
      score: user.scores.interviewReadiness,
      icon: MessageSquareCode,
      description: 'Converse with Captain Mentor in simulated voice and chat screen trials.',
      details: user.scores.interviewReadiness > 0 ? `Rating: ${user.scores.interviewReadiness / 10}/10` : 'Keeper standby',
      actionLabel: 'Commence Dialogue',
      onClick: () => setActivePage('interview')
    },
    {
      id: 'opensource',
      title: 'Open Source Merges',
      score: user.scores.openSource,
      icon: Flame,
      description: 'Monitor public pull requests and merges to accumulate collaborative fleet merit points.',
      details: `Merits Logged: ${user.scores.openSource}`,
      actionLabel: 'Chart PR Merges',
      onClick: () => setActivePage('opensource')
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 85,
        damping: 14
      }
    },
    exit: {
      opacity: 0,
      y: -15,
      transition: {
        duration: 0.15
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className="space-y-8 pb-12 text-[#0A2540] dark:text-[#F8FAFC]"
    >
      {/* Sliding banner */}
      <MotivationalBanner />

      {/* Dynamic Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-[#D2E1ED] dark:border-[#123456] pb-6">
        <div>
          <h1 className="font-display text-3xl font-black tracking-tight text-[#0A2540] dark:text-white md:text-4xl">
            Ocean Command Center ⚓
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-[#5C768D] dark:text-cyan-400">
            <span className="font-bold text-[#0F4C81] dark:text-cyan-300 flex items-center gap-1.5 mr-1.5">
              <Ship className="h-4.5 w-4.5 text-[#00B8D9]" />
              <span>Captain {user.name.split(' ')[0]} — Navigate Your Journey to Success</span>
            </span>
            <span className="text-[#00B8D9] dark:text-[#2DD4BF] bg-cyan-100/60 dark:bg-cyan-500/10 border border-cyan-200/50 dark:border-cyan-450/20 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide">
              {user.onboarding?.targetRole || 'Software Engineer'}
            </span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => setActivePage('roadmap')}
          className="flex items-center justify-center gap-2 rounded-full cursor-pointer bg-gradient-to-r from-[#0F4C81] via-[#00B8D9] to-[#2DD4BF] hover:opacity-95 text-white font-bold text-xs px-5 py-3 shadow-md tracking-tight transition-transform"
        >
          <Compass className="h-4.5 w-4.5 animate-spin" style={{ animationDuration: '30s' }} />
          <span>Chart Learning Voyage</span>
        </motion.button>
      </div>

      {/* Immersive Career Ocean Map & Vessel Navigation */}
      <CareerOceanMap setActivePage={setActivePage} />

      {/* Career Ship Status */}
      <CareerShip readiness={user.scores.careerReadiness} />

      {/* Dynamic Career Compass & Journey Analytics */}
      {prefs.showCompass && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <FloatingPanel className="lg:col-span-4 p-6" delay={0.1}>
          <CareerCompass
            score={user.scores.careerReadiness}
            direction={compassHeading.direction}
            title={compassHeading.title}
            alert={compassHeading.alert}
            recommendedDestination={recommendedDestination}
          />
        </FloatingPanel>

        <FloatingPanel className="lg:col-span-8 p-6 flex flex-col justify-between" delay={0.12}>
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-[#123456]/40 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4.5 w-4.5 text-[#00B8D9]" />
              <span className="font-display font-black text-[#0A2540] dark:text-white text-sm">Tide Progress Chart</span>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#5C768D] dark:text-[#84A9C8] font-bold">Ocean Depth Readings</span>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-[170px]">
            <MetricLineChart data={progressHistory} />
          </div>
        </FloatingPanel>
      </div>
      )}

      {/* IMMERSIVE SKILL ISLANDS MAP SECTION */}
      {prefs.showSkillIslands && (
      <FloatingPanel className="p-6" delay={0.14}>
        <div className="absolute inset-0 ocean-grid opacity-30 pointer-events-none rounded-3xl" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-[#123456]/40 pb-4 mb-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <Waves className="h-5 w-5 text-[#00B8D9]" />
              <span className="font-display font-black text-[#0A2540] dark:text-white text-base">
                Skill Islands Archipelago
              </span>
            </div>
            <p className="text-xs text-[#5C768D] dark:text-cyan-300 font-semibold mt-1">
              Build your archipelago — islands grow from sandbanks to tropical paradises as you learn.
            </p>
          </div>
          <span className="text-[10px] font-mono py-1.5 px-3 rounded-full bg-cyan-100/60 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-450/25 text-[#0F4C81] dark:text-cyan-400 font-extrabold uppercase tracking-wider block">
            ⚓ {skillIslands.filter(i => i.unlocked).length} Islands Discovered
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative z-10">
          {skillIslands.map((island) => (
            <SkillIslandVisual
              key={island.id}
              id={island.id}
              name={island.name}
              coordinates={island.coordinates}
              progress={getIslandProgress(island.id)}
              unlocked={island.unlocked}
              color={island.color}
              icon={island.icon}
              onClick={() => setSelectedIsland(island)}
            />
          ))}
        </div>
      </FloatingPanel>
      )}

      {/* Floating Island Treasure Details overlay */}
      <AnimatePresence>
        {selectedIsland && (
          <div className="fixed inset-0 bg-[#030D18]/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#061524] rounded-3xl border border-[#D2E1ED] dark:border-[#123456] max-w-lg w-full p-6 shadow-2xl relative overflow-hidden"
            >
              {/* Compass grid bg inside modal */}
              <div className="absolute inset-0 ocean-grid opacity-30 pointer-events-none" />
              
              <button 
                type="button" 
                onClick={() => setSelectedIsland(null)}
                className="absolute top-4 right-4 rounded-full p-1.5 hover:bg-[#EAF2F8] dark:hover:bg-[#123456]/40 text-[#5C768D] dark:text-cyan-400 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3 border-b border-[#D2E1ED]/55 dark:border-[#123456]/30 pb-3">
                  <div className="h-12 w-12 rounded-xl bg-cyan-100/60 dark:bg-cyan-500/10 border border-cyan-200/50 dark:border-cyan-400/30 flex items-center justify-center text-[#00B8D9]">
                    <selectedIsland.icon className="h-6 w-6 animate-spin" style={{ animationDuration: '45s' }} />
                  </div>
                  <div>
                    <span className="block text-[9.5px] font-mono text-[#00B8D9] font-black uppercase tracking-widest">{selectedIsland.coordinates}</span>
                    <h3 className="font-display font-black text-xl text-[#0A2540] dark:text-white">{selectedIsland.name}</h3>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-mono font-black text-slate-400 dark:text-cyan-400 block">Sailing Assessment:</span>
                  <p className="text-xs text-[#5C768D] dark:text-cyan-100 font-semibold leading-relaxed">
                    {selectedIsland.details}
                  </p>
                  <p className="text-xs text-[#5C768D] dark:text-cyan-100 leading-relaxed font-semibold">
                    {selectedIsland.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-mono font-black text-slate-400 dark:text-cyan-400 block">Required Skill Merits:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedIsland.technologies.map((tech, idx) => (
                      <span key={idx} className="text-[10px] font-mono bg-[#EAF2F8] dark:bg-[#123456]/40 border border-cyan-200/40 dark:border-cyan-450/40 px-2.5 py-1 rounded-md text-[#0F4C81] dark:text-cyan-300 font-black">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-[#123456]/40 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedIsland(null);
                      // Navigate to corresponding area
                      if (selectedIsland.id === 'react' || selectedIsland.id === 'python') setActivePage('github');
                      else if (selectedIsland.id === 'nodejs') setActivePage('dsa');
                      else if (selectedIsland.id === 'aiml') setActivePage('roadmap');
                      else setActivePage('interview');
                    }}
                    className="flex-1 py-2.5 rounded-xl font-bold font-sans text-xs flex items-center justify-center gap-2 transition-all cursor-pointer bg-gradient-to-r from-[#00B8D9] to-[#0F4C81] text-white"
                  >
                    <span>⚓ sail to Island</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedIsland(null)}
                    className="px-4 py-2.5 rounded-xl font-bold font-sans text-xs border border-slate-200 dark:border-[#123456] dark:hover:bg-[#123456]/20 transition-all cursor-pointer"
                  >
                    Hold Course
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <motion.div variants={cardVariants}>
          <DailyGoals />
        </motion.div>
        <motion.div variants={cardVariants}>
          <DailyStreak />
        </motion.div>
      </div>

      {/* Ocean Creatures Achievement System */}
      {prefs.showAchievements && (
      <motion.div variants={cardVariants}>
        <OceanAchievements />
      </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <motion.div variants={cardVariants}>
          <ConsistencyScoreCard />
        </motion.div>
        {prefs.showWeeklyTide && (
        <motion.div variants={cardVariants}>
          <WeeklyXpChart />
        </motion.div>
        )}
      </div>

      {/* Widgets Area Header */}
      <div>
        <h2 className="font-display text-lg font-black tracking-tight text-[#0A2540] dark:text-white mb-5 flex items-center gap-2">
          <span>Hiring Readiness Pillars</span>
          <span className="text-[9.5px] uppercase font-mono tracking-widest font-extrabold bg-cyan-150 text-cyan-800 dark:bg-cyan-500/10 dark:text-cyan-400 px-2.5 py-1 rounded-full border border-cyan-200/30 dark:border-cyan-400/10 transition-colors">
            5 Audited Modules
          </span>
        </h2>

        {/* Grid widgets dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {widgets.map((widget) => (
            <motion.div key={widget.id} variants={cardVariants}>
              <DashboardWidget
                id={widget.id}
                title={widget.title}
                score={widget.score}
                icon={widget.icon}
                description={widget.description}
                details={widget.details}
                actionLabel={widget.actionLabel}
                onClick={widget.onClick}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Low diagnostic logs / activity feed */}
      <motion.div variants={cardVariants}>
        <FloatingPanel className="p-6" delay={0.16}>
        <h3 className="font-display font-black text-[#0A2540] dark:text-white text-sm mb-4 flex items-center gap-2">
          <Clock className="h-4.5 w-4.5 text-[#5C768D]" />
          <span>Real-time Log Currents</span>
        </h3>
        <div className="space-y-3">
          {feedItems.map(item => (
            <div key={item.id} className="flex items-start justify-between border-b border-slate-100 dark:border-[#123456]/30 pb-3 last:border-0 last:pb-0 font-sans text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="h-4.5 w-4.5 text-[#2DD4BF] mt-0.5" />
                <span className="text-[#0F4C81] dark:text-cyan-100 font-semibold leading-normal">{item.msg}</span>
              </div>
              <span className="text-[#5C768D] dark:text-cyan-400 text-[9.5px] font-mono font-bold shrink-0 ml-4">{item.time}</span>
            </div>
          ))}
        </div>
        </FloatingPanel>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
