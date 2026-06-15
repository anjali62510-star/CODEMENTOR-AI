import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  CircularProgress, 
  MetricLineChart 
} from '../components/DashboardCharts';
import { DashboardWidget } from '../components/DashboardWidget';
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
  Clock
} from 'lucide-react';

interface DashboardProps {
  setActivePage: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActivePage }) => {
  const { user, apiFetch } = useAuth();
  const [loading, setLoading] = useState(true);
  const [feedItems, setFeedItems] = useState<{ id: string; msg: string; time: string; type: string }[]>([]);

  useEffect(() => {
    // Generate simple recent dynamic newsfeed based on achievements
    if (user) {
      const items = [
        { id: '1', msg: 'Career Guidance Core Engine initialized.', time: 'Just now', type: 'system' },
        { id: '2', msg: `DSA target calibration set to intermediate level of code completeness.`, time: '1 hour ago', type: 'dsa' },
      ];
      if (user.scores.github > 0) {
        items.unshift({ id: '3', msg: `GitHub username audited with a consolidated score of ${user.scores.github}%.`, time: '10 mins ago', type: 'github' });
      }
      if (user.scores.resume > 15) {
        items.unshift({ id: '4', msg: `Passed resume bullet grammar STAR evaluation metrics with overall ${user.scores.resume}% match.`, time: '2 hours ago', type: 'resume' });
      }
      if (user.scores.openSource > 0) {
        items.unshift({ id: '5', msg: `Open Source merge multiplier verified. High habits points allocated, index bumped.`, time: 'Yesterday', type: 'opensource' });
      }
      setFeedItems(items);
      setLoading(false);
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex h-full items-center justify-center text-sm font-mono text-[#8E8E93]">
        Compiling dashboard telemetry...
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
      title: 'GitHub Core Analyzer',
      score: user.scores.github,
      icon: Github,
      description: 'Audit repository readme layout structures, language diversities, and persistent commit green lines.',
      details: user.onboarding?.githubUsername ? `Username: @${user.onboarding.githubUsername}` : 'Metadata: Disabled',
      actionLabel: 'Analyze Profile',
      onClick: () => setActivePage('github')
    },
    {
      id: 'dsa',
      title: 'DSA Tracking Sandbox',
      score: user.scores.dsa,
      icon: Code2,
      description: 'Test algorithm strategies on complex coding problems and analyze space/time compilation parameters.',
      details: `${user.scores.dsa > 30 ? '34 Solved' : '10 Solved'} • Target: 150`,
      actionLabel: 'Open Code Sandbox',
      onClick: () => setActivePage('dsa')
    },
    {
      id: 'resume',
      title: 'Resume Bullet Optimizer',
      score: user.scores.resume,
      icon: FileSearch,
      description: 'Review structural keyword match ratios and optimize bullets into high-precision achievements.',
      details: `Latest Performance Grade: ${user.scores.resume}%`,
      actionLabel: 'Review Resume Text',
      onClick: () => setActivePage('resume')
    },
    {
      id: 'interview',
      title: 'Interview Preparation Prep',
      score: user.scores.interviewReadiness,
      icon: MessageSquareCode,
      description: 'Conduct virtual mock technical and behavioral chats with compiler-grade Silicon Valley interviewers.',
      details: user.scores.interviewReadiness > 0 ? `Score: ${user.scores.interviewReadiness / 10}/10` : 'Sessions: Initializing',
      actionLabel: 'Launch Interactivity',
      onClick: () => setActivePage('interview')
    },
    {
      id: 'opensource',
      title: 'Open Source merges',
      score: user.scores.openSource,
      icon: Flame,
      description: 'Log and track merge indices of PR contributions across open-source clusters to establish shipping habits.',
      details: `Weekly Merge Points: ${user.scores.openSource}`,
      actionLabel: 'Review Contributions',
      onClick: () => setActivePage('opensource')
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Dynamic Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-[#1C1C1E] pb-6">
        <div>
          <h1 className="font-sans text-2xl font-extrabold tracking-tight text-white md:text-3xl">
            Welcome Back, {user.name.split(' ')[0]}
          </h1>
          <div className="flex flex-wrap items-center gap-2.5 mt-1.5 text-xs text-[#8E8E93]">
            <span className="font-sans font-medium text-white/95">Target Role:</span>
            <span className="text-[#E5E5E7] bg-[#1C1C1E] border border-[#2D2D30] px-2 py-0.5 rounded text-[11px] font-medium">{user.onboarding?.targetRole}</span>
            <span className="text-[#AEAEB2] font-mono">• Sector: {user.onboarding?.preferredIndustry}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActivePage('roadmap')}
          className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/20 text-emerald-400 hover:text-black hover:border-emerald-400 font-semibold text-xs px-4 py-2 transition-all duration-200"
        >
          <Compass className="h-4 w-4" />
          <span>Generate Career Roadmap</span>
        </button>
      </div>

      {/* Hero Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Circle Readiness Gauge and sub scores */}
        <div className="lg:col-span-1 rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-6 flex flex-col items-center justify-center text-center shadow-xs">
          <CircularProgress score={user.scores.careerReadiness} size={150} />
          
          <div className="mt-5 max-w-xs">
            <h3 className="font-sans font-bold text-white text-base">Consolidated Career Index</h3>
            <p className="text-xs text-[#8E8E93] leading-relaxed mt-1">
              Your overall score aggregates GitHub, DSA submissions, and Resume validations matching staff-level hiring rules.
            </p>
          </div>
        </div>

        {/* Analytics Line Chart Card */}
        <div className="lg:col-span-2 rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-6 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-[#1C1C1E] pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4.5 w-4.5 text-emerald-400" />
              <span className="font-sans font-bold text-white text-sm">Readiness Velocity</span>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#8E8E93]">Weekly milestones</span>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-[160px]">
            <MetricLineChart data={progressHistory} />
          </div>
        </div>
      </div>

      {/* Widgets Area Header */}
      <div>
        <h2 className="font-sans text-lg font-bold tracking-tight text-white mb-4 flex items-center gap-2">
          <span>Hiring Pillars diagnostics</span>
          <span className="text-[10px] uppercase font-mono tracking-wider font-normal bg-emerald-500/10 text-emerald-400 px-2 border border-emerald-500/15 py-0.5 rounded">
            5 audited
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
      <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-6 shadow-xs">
        <h3 className="font-sans text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#8E8E93]" />
          <span>Career sandbox activity logs</span>
        </h3>
        <div className="space-y-3.5">
          {feedItems.map(item => (
            <div key={item.id} className="flex items-start justify-between border-b border-[#1C1C1E]/50 pb-3 last:border-0 last:pb-0 font-mono text-[11px]">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="h-4 w-4 text-emerald-500/80 mt-0.5" />
                <span className="text-[#E5E5E7] leading-normal">{item.msg}</span>
              </div>
              <span className="text-[#8E8E93] text-[10px] shrink-0 font-medium ml-4">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
