import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  CircularProgress, 
  MetricLineChart 
} from '../components/DashboardCharts';
import { DashboardWidget } from '../components/DashboardWidget';
import { motion } from 'motion/react';
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
  Zap
} from 'lucide-react';
import { MotivationalBanner, AnimatedCountUp } from '../components/Celebration';

interface DashboardProps {
  setActivePage: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActivePage }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [feedItems, setFeedItems] = useState<{ id: string; msg: string; time: string; type: string }[]>([]);

  useEffect(() => {
    if (user) {
      const items = [
        { id: '1', msg: 'CodeMentor AI career path orchestration active.', time: 'Just now', type: 'system' },
        { id: '2', msg: `DSA tracking metrics synced with interactive algorithms engine.`, time: '1 hour ago', type: 'dsa' },
      ];
      if (user.scores.github > 0) {
        items.unshift({ id: '3', msg: `GitHub code coverage evaluated at ${user.scores.github}% alignment.`, time: '10 mins ago', type: 'github' });
      }
      if (user.scores.resume > 15) {
        items.unshift({ id: '4', msg: `Parsed resume achievement statements with ${user.scores.resume}% bullet matching.`, time: '2 hours ago', type: 'resume' });
      }
      if (user.scores.openSource > 0) {
        items.unshift({ id: '5', msg: `Detected open source merges. Adjusted habit ranking points.`, time: 'Yesterday', type: 'opensource' });
      }
      setFeedItems(items);
      setLoading(false);
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex h-64 items-center justify-center font-mono text-xs text-slate-400 dark:text-[#8E8E93]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
          <span>Synchronizing profile variables...</span>
        </div>
      </div>
    );
  }

  // Historic progress line dataset
  const progressHistory = [
    { label: 'Week 1', value: 15 },
    { label: 'Week 2', value: Math.max(15, user.scores.careerReadiness - 18) },
    { label: 'Week 3', value: Math.max(15, user.scores.careerReadiness - 8) },
    { label: 'Current', value: user.scores.careerReadiness }
  ];

  // Specific widgets definition mapping
  const widgets = [
    {
      id: 'github',
      title: 'GitHub Analyzer',
      score: user.scores.github,
      icon: Github,
      description: 'Audit repository files diversity, commit green lines, and documentation depth.',
      details: user.onboarding?.githubUsername ? `@${user.onboarding.githubUsername}` : 'Review pending',
      actionLabel: 'Analyze Profile',
      onClick: () => setActivePage('github')
    },
    {
      id: 'dsa',
      title: 'DSA Sandbox',
      score: user.scores.dsa,
      icon: Code2,
      description: 'Test algorithm approaches on real interactive sandbox coding challenges.',
      details: `${user.scores.dsa > 30 ? '34 Solved' : '10 Solved'} • Target: 150`,
      actionLabel: 'Open Sandbox',
      onClick: () => setActivePage('dsa')
    },
    {
      id: 'resume',
      title: 'Resume Optimizer',
      score: user.scores.resume,
      icon: FileSearch,
      description: 'Review structural keyword ratios and re-formulate bullet actions.',
      details: `AST Match Grade: ${user.scores.resume}%`,
      actionLabel: 'Structure Bullets',
      onClick: () => setActivePage('resume')
    },
    {
      id: 'interview',
      title: 'Mock Interviews',
      score: user.scores.interviewReadiness,
      icon: MessageSquareCode,
      description: 'Engage in realistic conversational technical mock screens.',
      details: user.scores.interviewReadiness > 0 ? `Rating: ${user.scores.interviewReadiness / 10}/10` : 'Ready to start',
      actionLabel: 'Launch Interactivity',
      onClick: () => setActivePage('interview')
    },
    {
      id: 'opensource',
      title: 'Open Source Merges',
      score: user.scores.openSource,
      icon: Flame,
      description: 'Monitor actual open source PR mergers to nurture robust production habits.',
      details: `Points Accumulated: ${user.scores.openSource}`,
      actionLabel: 'Log Contributions',
      onClick: () => setActivePage('opensource')
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Playful sliding banner announcement of streak and roadmap updates */}
      <MotivationalBanner />

      {/* Dynamic Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200/80 dark:border-[#1C1C1E] pb-6">
        <div>
          <h1 className="font-display text-3xl font-black tracking-tight text-slate-800 dark:text-white md:text-4xl">
            Welcome back, {user.name.split(' ')[0]} 👋
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500 dark:text-[#8E8E93]">
            <span className="font-bold text-slate-600 dark:text-slate-350 flex items-center gap-1.5 mr-1.5">
              <Zap className="h-4.5 w-4.5 text-amber-500 fill-amber-400" />
              <span>Target Career:</span>
            </span>
            <span className="text-violet-600 dark:text-emerald-400 bg-violet-100/60 dark:bg-emerald-500/10 border border-violet-200/60 dark:border-emerald-400/20 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide">
              {user.onboarding?.targetRole}
            </span>
            <span className="text-slate-400 dark:text-[#AEAEB2] font-semibold ml-1">
              in {user.onboarding?.preferredIndustry} Industry
            </span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => setActivePage('roadmap')}
          className="flex items-center justify-center gap-2 rounded-full cursor-pointer bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500 hover:opacity-95 text-white font-bold text-xs px-5 py-3 shadow-md tracking-tight transition-transform"
        >
          <Compass className="h-4.5 w-4.5 animate-spin" style={{ animationDuration: '30s' }} />
          <span>Generate Career Roadmap</span>
        </motion.button>
      </div>

      {/* Hero Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Circle Readiness Gauge and sub scores */}
        <div className="lg:col-span-1 rounded-3xl border border-slate-200/80 dark:border-[#2D2D30]/60 bg-white dark:bg-[#1E293B]/40 p-6 flex flex-col items-center justify-center text-center shadow-xs">
          <CircularProgress score={user.scores.careerReadiness} size={160} />
          
          <div className="mt-5 space-y-1.5 max-w-xs">
            <h3 className="font-display font-extrabold text-slate-800 dark:text-white text-base flex items-center justify-center gap-1.5">
              <Award className="h-5 w-5 text-violet-500" />
              <span>Career Readiness Score</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#8E8E93] leading-relaxed">
              An aggregate score analyzing your repository commits, algorithm sandboxes, and STAR optimized resume structures.
            </p>
          </div>
        </div>

        {/* Analytics Line Chart Card */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/80 dark:border-[#2D2D30]/60 bg-white dark:bg-[#1E293B]/40 p-6 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-[#1C1C1E] pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4.5 w-4.5 text-violet-500" />
              <span className="font-display font-extrabold text-slate-800 dark:text-white text-sm">Readiness Progress Index</span>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-wider text-slate-450 dark:text-[#8E8E93] font-bold">Metrics trends</span>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-[160px]">
            <MetricLineChart data={progressHistory} />
          </div>
        </div>
      </div>

      {/* Widgets Area Header */}
      <div>
        <h2 className="font-display text-lg font-black tracking-tight text-slate-800 dark:text-white mb-5 flex items-center gap-2">
          <span>Hiring Readiness Pillars</span>
          <span className="text-[9.5px] uppercase font-mono tracking-widest font-extrabold bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400 px-2.5 py-1 rounded-full border border-violet-200/30 dark:border-violet-400/10 transition-colors">
            5 Audited Modules
          </span>
        </h2>

        {/* Grid widgets dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {widgets.map((widget) => (
            <DashboardWidget
              key={widget.id}
              id={widget.id}
              title={widget.title}
              score={widget.score}
              icon={widget.icon}
              description={widget.description}
              details={widget.details}
              actionLabel={widget.actionLabel}
              onClick={widget.onClick}
            />
          ))}
        </div>
      </div>

      {/* Low diagnostic logs / activity feed */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-[#2D2D30]/60 bg-white dark:bg-[#1E293B]/40 p-6 shadow-xs">
        <h3 className="font-display font-extrabold text-slate-850 dark:text-white text-sm mb-4 flex items-center gap-2">
          <Clock className="h-4.5 w-4.5 text-slate-400" />
          <span>Real-time Habit Achievements</span>
        </h3>
        <div className="space-y-3">
          {feedItems.map(item => (
            <div key={item.id} className="flex items-start justify-between border-b border-slate-100 dark:border-[#1C1C1E]/50 pb-3 last:border-0 last:pb-0 font-sans text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="h-4.5 w-4.5 text-emerald-500 mt-0.5" />
                <span className="text-slate-700 dark:text-[#E5E5E7] font-medium leading-normal">{item.msg}</span>
              </div>
              <span className="text-slate-400 dark:text-[#8E8E93] text-[9.5px] font-mono font-bold shrink-0 ml-4">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
