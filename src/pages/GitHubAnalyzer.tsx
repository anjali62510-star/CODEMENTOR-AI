import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { GitHubAnalysis } from '../types';
import { 
  Github, 
  Sparkles, 
  Loader2, 
  Search, 
  BookOpen, 
  Activity, 
  Star, 
  Code,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  MapPin,
  Building2,
  Users,
  GitPullRequest,
  CheckCircle,
  XCircle,
  Calendar,
  AlertTriangle,
  GitBranch,
  FileCode,
  Award,
  Waves,
  Anchor,
  Compass,
  Ship,
  Droplet
} from 'lucide-react';
import { PolarCategoriesChart, CircularProgress } from '../components/DashboardCharts';
import { motion } from 'motion/react';
import { OceanPageShell, OceanPageHeader, OceanLoadingScreen } from '../components/ocean/OceanUI';

export const GitHubAnalyzer: React.FC = () => {
  const { user, apiFetch, refreshUser } = useAuth();
  const [username, setUsername] = useState(user?.onboarding?.githubUsername || '');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<GitHubAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const data = await apiFetch('/api/github/profile');
        if (data.analysis) {
          setAnalysis(data.analysis);
        }
      } catch (err) {
        console.error('No previous analyses found:', err);
      }
    };
    fetchAnalysis();
  }, []);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please provide a valid GitHub username to audit.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const data = await apiFetch('/api/github/analyze', {
        method: 'POST',
        body: JSON.stringify({ githubUsername: username.trim() })
      });
      setAnalysis(data.analysis);
      await refreshUser(); 
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Audit of credentials failed. This might have hit temporary quotas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <OceanPageShell>
      <OceanPageHeader
        title="Code Ocean Analytics"
        subtitle="Scrutinize repository currents, language distribution tides, and contribution wave patterns."
        icon={Waves}
        badge="SONAR DEPTH"
      />

      {/* Audit Trigger Core Input */}
      <div className="premium-card p-6 relative overflow-hidden bg-white dark:bg-[#061524]/60">
        <div className="absolute top-0 right-0 h-24 w-24 bg-[#00B8D9]/5 rounded-full blur-xl pointer-events-none" />
        <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row items-stretch gap-3 relative z-10">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5C768D] dark:text-cyan-400" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub username (e.g. torvalds)"
              className="w-full bg-[#F8FAFC] dark:bg-[#030D18] border border-[#D2E1ED] dark:border-[#123456] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#0A2540] dark:text-white focus:outline-hidden focus:ring-1 focus:ring-[#00B8D9] focus:border-[#00B8D9] transition-colors font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00B8D9] to-[#0F4C81] text-white px-6 py-2.5 text-xs font-bold shadow-xs disabled:opacity-50 cursor-pointer hover:scale-101 active:scale-99 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-cyan-200" />
                <span>Navigating Current Tides...</span>
              </>
            ) : (
              <>
                <Anchor className="h-4 w-4 text-cyan-255" />
                <span>Scour Public Harbors</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2 font-semibold">
            <AlertCircle className="h-4.5 w-4.5 mt-0.5 shrink-0 text-rose-500" />
            <p className="flex-1 leading-normal">{error}</p>
          </div>
        )}
      </div>

      {/* Main Analysis Display Panel */}
      {analysis ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Diagnostic Key Metadata Column */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* User Profile Info Card */}
            <div className="premium-card p-6 flex flex-col items-center text-center relative overflow-hidden bg-white dark:bg-[#061524]/60">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#00B8D9] to-[#0F4C81]" />
              <div className="relative mb-4">
                <img 
                  src={analysis.avatarUrl || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200`} 
                  alt={analysis.name || analysis.username}
                  referrerPolicy="no-referrer"
                  className="h-20 w-20 rounded-full border-2 border-[#00B8D9] object-cover shadow-sm" 
                />
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#0F4C81] font-mono text-[9px] font-black text-white border-2 border-[#D2E1ED] dark:border-[#030D18]">
                  {analysis.readmeRating}
                </span>
              </div>
              <h2 className="font-display text-lg font-black text-[#0A2540] dark:text-white leading-tight">{analysis.name || analysis.username}</h2>
              <span className="text-xs text-[#00B8D9] font-mono font-bold mt-1">@{analysis.username}</span>
              
              {analysis.bio && (
                <p className="text-xs text-[#5C768D] dark:text-cyan-100 mt-4 leading-relaxed font-semibold italic border-t border-b border-[#D2E1ED]/50 dark:border-[#123456]/40 py-3 w-full">
                  "{analysis.bio}"
                </p>
              )}

              {/* Company & Location */}
              <div className="w-full mt-4 space-y-2 text-left font-mono text-[10px] text-[#5C768D] dark:text-cyan-400 font-bold">
                {analysis.company && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-[#0F4C81]" />
                    <span className="truncate">{analysis.company}</span>
                  </div>
                )}
                {analysis.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-[#0F4C81]" />
                    <span className="truncate">{analysis.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-[#0F4C81]" />
                  <span>{analysis.followers || 0} crew followers • {analysis.following || 0} sailing</span>
                </div>
                <div className="flex items-center justify-between border-t border-[#D2E1ED]/30 dark:border-[#123456]/30 pt-3 mt-3 w-full font-sans text-[10px]">
                  <span className="text-slate-400 dark:text-slate-500 font-bold">Last Recorded Audit:</span>
                  <span className="text-slate-800 dark:text-cyan-150 font-black">{new Date(analysis.lastAnalyzed).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* General Repositories & Star Metadata counts */}
            <div className="premium-card p-4.5 grid grid-cols-5 gap-1 text-center font-mono text-[8px] text-[#5C768D] dark:text-cyan-400 font-bold bg-white dark:bg-[#061524]/60">
              <div className="p-1">
                <Anchor className="h-4 w-4 text-[#00B8D9] mx-auto mb-1" />
                <span className="block text-[#0A2540] dark:text-white font-extrabold font-sans text-xs tracking-tight leading-none">{analysis.repositoriesCount}</span>
                <span className="mt-1 block">Islands</span>
              </div>
              <div className="border-l border-[#D2E1ED] dark:border-[#123456]/50 p-1">
                <Waves className="h-4 w-4 text-[#00B8D9] mx-auto mb-1" />
                <span className="block text-[#0A2540] dark:text-white font-extrabold font-sans text-xs tracking-tight leading-none">{analysis.contributionsCount}</span>
                <span className="mt-1 block">Waves</span>
              </div>
              <div className="border-l border-[#D2E1ED] dark:border-[#123456]/50 p-1">
                <Star className="h-4 w-4 text-amber-500 mx-auto mb-1" />
                <span className="block text-[#0A2540] dark:text-white font-extrabold font-sans text-xs tracking-tight leading-none">{analysis.starsCount}</span>
                <span className="mt-1 block">Stars</span>
              </div>
              <div className="border-l border-[#D2E1ED] dark:border-[#123456]/50 p-1">
                <GitPullRequest className="h-4 w-4 text-[#00B8D9] mx-auto mb-1" />
                <span className="block text-[#0A2540] dark:text-white font-extrabold font-sans text-xs tracking-tight leading-none">{analysis.pullRequestsCount || 0}</span>
                <span className="mt-1 block">PR Merges</span>
              </div>
              <div className="border-l border-[#D2E1ED] dark:border-[#123456]/50 p-1">
                <AlertCircle className="h-4 w-4 text-[#0F4C81] mx-auto mb-1" />
                <span className="block text-[#0A2540] dark:text-white font-extrabold font-sans text-xs tracking-tight leading-none">{analysis.issuesCount || 0}</span>
                <span className="mt-1 block">Storms</span>
              </div>
            </div>

            {/* Open Source Readiness Panel */}
            <div className="premium-card p-6 flex flex-col items-center text-center bg-white dark:bg-[#061524]/60">
              <span className="block text-[9.5px] font-mono tracking-widest text-[#5C768D] dark:text-cyan-400 uppercase mb-4 self-start font-black">⚓ Open Source Readiness</span>
              <CircularProgress score={analysis.openSourceReadinessScore || 75} />
              <p className="text-xs text-[#5C768D] dark:text-cyan-100 mt-4 leading-relaxed font-sans font-semibold">
                Measures issue resolution velocities, license inclusion patterns, and public code layout documentation standards.
              </p>
            </div>

            {/* Language distribution as ocean currents */}
            <div className="premium-card p-6 bg-white dark:bg-[#061524]/60">
              <h3 className="font-mono text-[9px] uppercase tracking-wider text-[#0F4C81] dark:text-cyan-400 mb-4 flex items-center gap-1.5 border-b border-zinc-150 dark:border-[#123456]/40 pb-2 font-black">
                <Droplet className="h-4 w-4 text-[#00B8D9]" />
                <span>Language Currents</span>
              </h3>
              <PolarCategoriesChart 
                categories={analysis.languages.map(l => ({ label: l.name, score: Math.round(l.percentage) }))} 
              />
            </div>
          </div>

          {/* Detailed Optimizations & Recommendations Columns */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Rudder Alignment Optimizations */}
            <div className="premium-card p-6 bg-white dark:bg-[#061524]/60">
              <div className="flex items-center justify-between mb-5 border-b border-[#D2E1ED]/55 dark:border-[#123456]/40 pb-3">
                <div className="flex items-center gap-2">
                  <Compass className="h-4.5 w-4.5 text-[#00B8D9]" />
                  <span className="font-display font-black text-[#0A2540] dark:text-white text-base">Course Corrections & Improvements</span>
                </div>
                <span className="font-mono text-[9.5px] font-black uppercase tracking-wider text-[#00B8D9] bg-cyan-100/50 dark:text-cyan-300 dark:bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-200 dark:border-cyan-400/20">
                  Current Yield: {analysis.readinessContribution}%
                </span>
              </div>

              {/* Recommendation item cards list */}
              <div className="space-y-4">
                {analysis.recommendations.map((rec, i) => (
                  <div key={i} className="rounded-xl border border-[#D2E1ED] dark:border-[#123456] bg-[#F8FAFC]/55 dark:bg-[#030D18]/30 p-4 relative overflow-hidden group hover:border-[#00B8D9]/40 transition">
                    <span className="absolute top-3 right-3 text-[10px] font-mono font-bold text-slate-300 dark:text-slate-700">COORD 0{i+1}</span>
                    <h4 className="font-display text-sm font-bold text-[#0A2540] dark:text-white pr-6 mb-1.5">{rec}</h4>
                    <p className="text-xs text-[#5C768D] dark:text-cyan-100 leading-relaxed font-semibold">
                      {analysis.recommendationsReasons[i] || 'Anchor systems identified this coordinate gap during public API deep scans.'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Career Portfolio Insights */}
            <div className="premium-card p-6 bg-white dark:bg-[#061524]/60">
              <h3 className="font-display font-black text-[#0A2540] dark:text-white text-base flex items-center gap-2 mb-5 border-b border-[#D2E1ED]/55 dark:border-[#123456]/45 pb-3">
                <Sparkles className="h-4.5 w-4.5 text-[#00B8D9]" />
                <span>Ocean Guard AI Diagnostic Sonar</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-mono text-[9.5px] uppercase tracking-wider text-teal-650 dark:text-[#2DD4BF] mb-3 flex items-center gap-1.5 font-black">
                    <CheckCircle className="h-4 w-4 text-teal-500" />
                    <span>Coastal Strengths</span>
                  </h4>
                  <ul className="space-y-2.5 text-xs text-[#5C768D] dark:text-cyan-100 list-none font-semibold">
                    {analysis.strengths?.map((str, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-teal-500 font-extrabold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-mono text-[9.5px] uppercase tracking-wider text-amber-600 dark:text-amber-450 mb-3 flex items-center gap-1.5 font-black">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Hiring Reef Hazards</span>
                  </h4>
                  <ul className="space-y-2.5 text-xs text-[#5C768D] dark:text-cyan-100 list-none font-semibold">
                    {analysis.weaknesses?.map((wk, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-amber-500 font-extrabold">•</span>
                        <span>{wk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="md:col-span-2 border-t border-[#D2E1ED]/40 dark:border-[#123456]/40 pt-5 mt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-mono text-[9.5px] uppercase tracking-wider text-rose-500 mb-3 flex items-center gap-1.5 font-black">
                      <XCircle className="h-4 w-4 text-rose-500" />
                      <span>Missing Fleet Skills</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missingSkills?.map((ms, idx) => (
                        <span key={idx} className="bg-rose-500/10 border border-rose-500/15 text-rose-600 dark:text-rose-450 rounded-lg px-2.5 py-1 text-[10px] font-mono font-extrabold">
                          {ms}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-mono text-[9.5px] uppercase tracking-wider text-teal-650 dark:text-teal-450 mb-3 flex items-center gap-1.5 font-black">
                      <Award className="h-4 w-4 text-teal-500" />
                      <span>Suggested Island Expansions</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.technologyRecommendations?.map((tr, idx) => (
                        <span key={idx} className="bg-teal-500/10 border border-teal-500/15 text-teal-600 dark:text-teal-400 rounded-lg px-2.5 py-1 text-[10px] font-mono font-extrabold">
                          {tr}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity heatmap inspired by water depth */}
            <div className="premium-card p-6 font-mono bg-white dark:bg-[#061524]/60">
              <div className="flex items-center justify-between mb-4 border-b border-[#D2E1ED]/40 dark:border-[#123456]/40 pb-3">
                <span className="text-[9.5px] uppercase tracking-wider text-[#0F4C81] dark:text-cyan-400 block font-black">52-Week Marine Depth Heatmap</span>
                <span className="text-[10px] text-[#5C768D] dark:text-cyan-300 font-bold">{analysis.repositoriesCount} repository trenches scoured</span>
              </div>
              <div className="flex flex-wrap gap-1 w-full max-w-full justify-between p-2 bg-[#F8FAFC] dark:bg-[#030D18] border border-[#D2E1ED] dark:border-[#123456] rounded-xl">
                {analysis.heatmapData?.map((val, idx) => {
                  let colorClass = 'bg-slate-100 dark:bg-[#061524]'; 
                  if (val > 0 && val <= 3) colorClass = 'bg-[#E0F7FA] dark:bg-[#0F4C81]/25 text-[#00B8D9]/40';
                  else if (val > 3 && val <= 7) colorClass = 'bg-[#B2EBF2] dark:bg-[#0F4C81]/50 text-white';
                  else if (val > 7 && val <= 11) colorClass = 'bg-[#00B8D9] text-white';
                  else if (val > 11) colorClass = 'bg-[#0F4C81] text-white shadow-xs';

                  return (
                    <div 
                      key={idx}
                      title={`Week ${idx+1}: ${val} knots of activity`}
                      className={`h-4.5 w-4.5 rounded-[3px] flex items-center justify-center text-[8px] font-extrabold cursor-default transition-transform hover:scale-120 ${colorClass}`}
                    >
                      {val > 0 ? val : ''}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-end gap-2 text-[9px] text-[#5C768D] dark:text-slate-400 mt-3 font-bold">
                <span>Shallow Current</span>
                <div className="h-3 w-3 rounded bg-slate-100 dark:bg-[#061524] border border-slate-205" />
                <div className="h-3 w-3 rounded bg-[#E0F7FA] dark:bg-[#0F4C81]/25" />
                <div className="h-3 w-3 rounded bg-[#B2EBF2] dark:bg-[#0F4C81]/50" />
                <div className="h-3 w-3 rounded bg-[#00B8D9]" />
                <div className="h-3 w-3 rounded bg-[#0F4C81]" />
                <span>Ocean Abyss</span>
              </div>
            </div>

            {/* Scrutinized Repository Islands Grid */}
            <div className="space-y-4">
              <span className="block text-[10px] font-mono tracking-widest text-[#5C768D] dark:text-cyan-400 uppercase pl-1 font-black">Scrutinized Repository Islands</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.topRepos?.map((repo, idx) => (
                  <div key={idx} className="premium-card p-5 hover:border-[#00B8D9]/40 transition flex flex-col justify-between group bg-white dark:bg-[#061524]/60">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-display font-bold text-[#0A2540] dark:text-white text-sm truncate flex items-center gap-2">
                          <FileCode className="h-4 w-4 text-[#00B8D9]" />
                          <span>{repo.name}</span>
                        </h4>
                        <a 
                          href={repo.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[#5C768D] hover:text-[#00B8D9] dark:hover:text-white transition"
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      </div>
                      <p className="text-xs text-[#5C768D] dark:text-cyan-100 leading-relaxed line-clamp-2 font-semibold">
                        {repo.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 mt-4 pt-3.5 border-t border-[#D2E1ED]/40 dark:border-[#123456]/40 font-mono text-[9px] text-[#5C768D] dark:text-cyan-400 font-bold">
                      {repo.language && (
                        <span className="text-cyan-800 dark:text-cyan-300 bg-cyan-100/60 dark:bg-cyan-500/10 border border-cyan-200/50 dark:border-cyan-450/10 px-1.5 py-0.5 rounded">
                          {repo.language}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-amber-500" />
                        <span>{repo.stars} knots</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <GitBranch className="h-3.5 w-3.5 text-teal-500" />
                        <span>{repo.forks} channels</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chronological Activity Timeline */}
            <div className="premium-card p-6 bg-white dark:bg-[#061524]/60 space-y-4">
              <span className="block text-[10px] font-mono tracking-widest text-[#5C768D] dark:text-cyan-400 uppercase pl-1 border-b border-zinc-150 dark:border-[#123456]/40 pb-2 font-black">Maritime Voyage Log</span>
              
              <div className="relative pl-6 border-l border-[#D2E1ED] dark:border-[#123456]/40 space-y-5 py-2">
                {analysis.recentActivity?.map((act, idx) => (
                  <div key={idx} className="relative">
                    {/* Circle Node indicator */}
                    <div className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full bg-white dark:bg-[#030D18] border-2 border-[#00B8D9] flex items-center justify-center" />
                    
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[8px] uppercase tracking-wider text-cyan-800 bg-cyan-100/60 dark:text-cyan-300 dark:bg-cyan-500/10 px-1.5 py-0.2 rounded font-black border border-cyan-200/30 dark:border-cyan-455/10">
                            {act.type}
                          </span>
                          <span className="text-[#0D2E4D] dark:text-cyan-200 font-display font-black text-xs">{act.repo}</span>
                        </div>
                        <p className="text-xs text-[#5C768D] dark:text-cyan-100 leading-relaxed font-semibold">
                          {act.message}
                        </p>
                      </div>
                      <span className="text-[9px] font-mono text-[#5C768D] dark:text-cyan-405 font-bold whitespace-nowrap self-start">
                        {act.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div className="premium-card border-dashed p-12 text-center bg-white dark:bg-[#061524]/60">
          <Ship className="h-10 w-10 text-[#00B8D9] mx-auto mb-4 opacity-70 animate-bounce" />
          <h3 className="font-display font-black text-[#0A2540] dark:text-white text-base">Initialize Maritime Evaluation</h3>
          <p className="text-xs text-[#5C768D] dark:text-cyan-300 max-w-sm mx-auto mt-1 leading-relaxed font-semibold">
            Input your public handle above. Code Ocean algorithms will map your repository patterns into navigable currents and readiness percentages.
          </p>
        </div>
      )}
    </OceanPageShell>
  );
};

export default GitHubAnalyzer;
