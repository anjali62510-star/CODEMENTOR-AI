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
  Info,
  Calendar,
  AlertTriangle,
  GitBranch,
  FileCode,
  Award
} from 'lucide-react';
import { PolarCategoriesChart, CircularProgress } from '../components/DashboardCharts';
import { motion } from 'motion/react';

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
      await refreshUser(); // Update scores inside Auth context too
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Audit of credentials failed. This might have hit temporary quotas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="border-b border-[#1C1C1E] pb-6">
        <h1 className="font-sans text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5 md:text-3xl">
          <Github className="h-7 w-7 text-emerald-400" />
          <span>GitHub Profile Auditing Engine</span>
        </h1>
        <p className="text-xs text-[#8E8E93] mt-1.5 leading-relaxed">
          Evaluate repository readme clarity, codebase packaging, and historic contribution density through an automated AI recruiter diagnostic model.
        </p>
      </div>

      {/* Audit Trigger Core Input */}
      <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-5 shadow-xs">
        <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8E93]" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub handle (e.g. octocat)"
              className="w-full bg-[#1C1C1E] border border-[#2D2D30] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-2.5 text-xs font-bold transition shadow-[0_0_15px_rgba(16,185,129,0.25)] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Running Recruiter Audit...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Analyze Platform Metadata</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-lg border border-rose-500/10 bg-rose-500/5 p-3.5 text-xs text-rose-400 flex items-start gap-2">
            <AlertCircle className="h-4.5 w-4.5 mt-0.5 shrink-0" />
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
            <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-6 flex flex-col items-center text-center shadow-xs">
              <div className="relative mb-4">
                <img 
                  src={analysis.avatarUrl || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200`} 
                  alt={analysis.name || analysis.username}
                  referrerPolicy="no-referrer"
                  className="h-20 w-20 rounded-full border border-emerald-500/30 object-cover" 
                />
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-bold text-black border border-[#141416]">
                  {analysis.readmeRating}
                </span>
              </div>
              <h2 className="font-sans text-lg font-bold text-white leading-tight">{analysis.name || analysis.username}</h2>
              <span className="text-xs text-emerald-400 font-mono mt-0.5">@{analysis.username}</span>
              
              {analysis.bio && (
                <p className="text-xs text-[#8E8E93] mt-3.5 leading-relaxed italic border-t border-b border-[#1C1C1E]/50 py-2.5 w-full">
                  "{analysis.bio}"
                </p>
              )}

              {/* Company & Location */}
              <div className="w-full mt-3.5 space-y-2 text-left font-mono text-[10.5px] text-[#8E8E93]">
                {analysis.company && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-emerald-500/70" />
                    <span className="truncate">{analysis.company}</span>
                  </div>
                )}
                {analysis.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-emerald-500/70" />
                    <span className="truncate">{analysis.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-emerald-500/70" />
                  <span>{analysis.followers || 0} followers • {analysis.following || 0} following</span>
                </div>
                <div className="flex items-center gap-2 border-t border-[#1C1C1E]/30 pt-2 float-right w-full justify-between">
                  <span>Last Audit:</span>
                  <span className="text-[#AEAEB2] font-bold">{new Date(analysis.lastAnalyzed).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* General Repositories & Star Metadata counts */}
            <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-5 shadow-xs grid grid-cols-5 gap-1.5 text-center font-mono text-[9px] text-[#8E8E93]">
              <div className="p-1">
                <BookOpen className="h-3.5 w-3.5 text-emerald-400 mx-auto mb-1.5" />
                <span className="block text-white font-bold font-sans text-xs leading-none">{analysis.repositoriesCount}</span>
                <span className="mt-0.5 block">Repos</span>
              </div>
              <div className="border-l border-[#1C1C1E]/55 p-1">
                <Activity className="h-3.5 w-3.5 text-emerald-400 mx-auto mb-1.5" />
                <span className="block text-white font-bold font-sans text-xs leading-none">{analysis.contributionsCount}</span>
                <span className="mt-0.5 block">Commits</span>
              </div>
              <div className="border-l border-[#1C1C1E]/55 p-1">
                <Star className="h-3.5 w-3.5 text-emerald-400 mx-auto mb-1.5" />
                <span className="block text-white font-bold font-sans text-xs leading-none">{analysis.starsCount}</span>
                <span className="mt-0.5 block">Stars</span>
              </div>
              <div className="border-l border-[#1C1C1E]/55 p-1">
                <GitPullRequest className="h-3.5 w-3.5 text-emerald-400 mx-auto mb-1.5" />
                <span className="block text-white font-bold font-sans text-xs leading-none">{analysis.pullRequestsCount || 0}</span>
                <span className="mt-0.5 block">PRs</span>
              </div>
              <div className="border-l border-[#1C1C1E]/55 p-1">
                <AlertCircle className="h-3.5 w-3.5 text-emerald-400 mx-auto mb-1.5" />
                <span className="block text-white font-bold font-sans text-xs leading-none">{analysis.issuesCount || 0}</span>
                <span className="mt-0.5 block">Issues</span>
              </div>
            </div>

            {/* Open Source Readiness Panel */}
            <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-6 flex flex-col items-center text-center shadow-xs">
              <span className="block text-[10px] font-mono tracking-widest text-[#8E8E93] uppercase mb-4 self-start">Open Source Performance</span>
              <CircularProgress score={analysis.openSourceReadinessScore || 75} />
              <p className="text-xs text-[#8E8E93] mt-4 leading-relaxed font-sans px-1">
                Based on active issue resolution, public repo documentation, licensing rigor, and cross-repo contributions history.
              </p>
            </div>

            {/* Polar Category breakdown for code language proportions */}
            <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-6 shadow-xs">
              <h3 className="font-mono text-[10px] uppercase tracking-wider text-[#AEAEB2] mb-4 flex items-center gap-1.5 border-b border-[#1C1C1E] pb-2">
                <Code className="h-4 w-4 text-emerald-400" />
                <span>Language Diversity match</span>
              </h3>
              <PolarCategoriesChart 
                categories={analysis.languages.map(l => ({ label: l.name, score: Math.round(l.percentage) }))} 
              />
            </div>
          </div>

          {/* Detailed Optimizations & Recommendations Columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Required Recruiter Optimizations */}
            <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-5 border-b border-[#1C1C1E] pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4.5 w-4.5 text-emerald-400" />
                  <span className="font-sans font-bold text-white text-base">Required Optimizations</span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/15">
                  Readiness Percentile: {analysis.readinessContribution}%
                </span>
              </div>

              {/* Recommendation item cards list */}
              <div className="space-y-4">
                {analysis.recommendations.map((rec, i) => (
                  <div key={i} className="rounded-lg border border-[#262629] bg-[#1B1B1E]/40 p-4 relative overflow-hidden group hover:border-[#3D3D42] transition">
                    <span className="absolute top-3 right-3 text-[10px] font-mono font-bold text-emerald-400/35 group-hover:text-emerald-400/80 transition">0{i+1}</span>
                    <h4 className="font-sans text-sm font-bold text-white pr-6 mb-1.5">{rec}</h4>
                    <p className="text-xs text-[#8E8E93] leading-relaxed select-all">
                      {analysis.recommendationsReasons[i] || 'Recruiters prioritized this based on hiring consistency filters.'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Career Portfolio Insights */}
            <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-6 shadow-xs">
              <h3 className="font-sans font-bold text-white text-base flex items-center gap-2 mb-5 border-b border-[#1C1C1E] pb-3">
                <Sparkles className="h-4.5 w-4.5 text-emerald-400" />
                <span>AI Developer Portfolio Insights</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4" />
                    <span>Technical Strengths</span>
                  </h4>
                  <ul className="space-y-2.5 text-xs text-[#8E8E93] list-none">
                    {analysis.strengths?.map((str, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-wider text-amber-500 mb-3 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Hiring Vulnerabilities</span>
                  </h4>
                  <ul className="space-y-2.5 text-xs text-[#8E8E93] list-none">
                    {analysis.weaknesses?.map((wk, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{wk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="md:col-span-2 border-t border-[#1C1C1E]/80 pt-5 mt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-mono text-[10px] uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-1.5">
                      <XCircle className="h-4 w-4" />
                      <span>Missing Career Skills</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missingSkills?.map((ms, idx) => (
                        <span key={idx} className="bg-rose-500/10 border border-rose-500/15 text-rose-400 rounded-md px-2 py-1 text-[10px] font-mono">
                          {ms}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                      <Award className="h-4 w-4" />
                      <span>Technology Roadmap Recs</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.technologyRecommendations?.map((tr, idx) => (
                        <span key={idx} className="bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 rounded-md px-2 py-1 text-[10px] font-mono">
                          {tr}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Contribution Heatmap representation */}
            <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-6 shadow-xs font-mono">
              <div className="flex items-center justify-between mb-4 border-b border-[#1C1C1E] pb-3">
                <span className="text-[10px] uppercase tracking-widest text-[#8E8E93] block">52-Week Contribution Intensity Heatmap</span>
                <span className="text-[9.5px] text-[#8E8E93]">{analysis.repositoriesCount} repositories scrutinized</span>
              </div>
              <div className="flex flex-wrap gap-1 w-full max-w-full justify-between p-1.5 bg-[#0E0E10] border border-[#1C1C1E] rounded-lg">
                {analysis.heatmapData?.map((val, idx) => {
                  let colorClass = 'bg-[#1C1C1E]'; // 0
                  if (val > 0 && val <= 3) colorClass = 'bg-emerald-950/40 text-emerald-400/20';
                  else if (val > 3 && val <= 7) colorClass = 'bg-emerald-900/60 text-emerald-400/40';
                  else if (val > 7 && val <= 11) colorClass = 'bg-emerald-600/60 text-emerald-200';
                  else if (val > 11) colorClass = 'bg-emerald-400 text-black';

                  return (
                    <div 
                      key={idx}
                      title={`Week ${idx+1}: ${val} public contributions`}
                      className={`h-4.5 w-4.5 rounded-[3px] flex items-center justify-center text-[8px] font-bold cursor-default transition-transform hover:scale-115 ${colorClass}`}
                    >
                      {val > 0 ? val : ''}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-end gap-2 text-[9px] text-[#8E8E93] mt-2.5">
                <span>Less</span>
                <div className="h-3 w-3 rounded bg-[#1C1C1E]" />
                <div className="h-3 w-3 rounded bg-emerald-950/40" />
                <div className="h-3 w-3 rounded bg-emerald-900/60" />
                <div className="h-3 w-3 rounded bg-emerald-600/60" />
                <div className="h-3 w-3 rounded bg-emerald-400" />
                <span>More</span>
              </div>
            </div>

            {/* Top Repositories Grid */}
            <div className="space-y-4">
              <span className="block text-[10px] font-mono tracking-widest text-[#8E8E93] uppercase pl-1">Scrutinized Top Repositories</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.topRepos?.map((repo, idx) => (
                  <div key={idx} className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-5 hover:bg-[#1C1C1E]/55 transition flex flex-col justify-between group">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-sans font-bold text-white text-sm tracking-tight truncate flex items-center gap-2">
                          <FileCode className="h-4 w-4 text-emerald-400" />
                          <span>{repo.name}</span>
                        </h4>
                        <a 
                          href={repo.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[#8E8E93] hover:text-emerald-400 transition"
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      </div>
                      <p className="text-xs text-[#8E8E93] leading-relaxed font-sans line-clamp-2">
                        {repo.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 mt-4 pt-3.5 border-t border-[#1C1C1E]/40 font-mono text-[10px] text-[#8E8E93]">
                      {repo.language && (
                        <span className="text-white text-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/10">
                          {repo.language}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-amber-500" />
                        <span>{repo.stars} stars</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <GitBranch className="h-3.5 w-3.5 text-emerald-500/70" />
                        <span>{repo.forks} forks</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chronological Activity Timeline */}
            <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-6 shadow-xs space-y-4">
              <span className="block text-[10px] font-mono tracking-widest text-[#8E8E93] uppercase pl-1 border-b border-[#1C1C1E] pb-2">Historic Portfolio Activity Log</span>
              
              <div className="relative pl-6 border-l border-[#1C1C1E] space-y-5 py-2">
                {analysis.recentActivity?.map((act, idx) => (
                  <div key={idx} className="relative">
                    {/* Circle Node indicator */}
                    <div className="absolute -left-[30px] top-1 h-4 w-4 rounded-full bg-[#0E0E10] border-2 border-emerald-400 flex items-center justify-center text-[7px]" />
                    
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded">
                            {act.type}
                          </span>
                          <span className="text-white font-sans font-bold text-xs">{act.repo}</span>
                        </div>
                        <p className="text-xs text-[#8E8E93] leading-relaxed">
                          {act.message}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-[#8E8E93] whitespace-nowrap self-start">
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
        <div className="rounded-xl border border-[#2D2D30] border-dashed bg-[#141416]/20 p-12 text-center">
          <Github className="h-10 w-10 text-[#8E8E93] mx-auto mb-4 opacity-50" />
          <h3 className="font-sans font-bold text-white text-base">Ready for audit formulation</h3>
          <p className="text-xs text-[#8E8E93] max-w-sm mx-auto mt-1 leading-relaxed">
            Provide your GitHub profile username on top and let CodeMentor AI conduct professional repository structuring audits.
          </p>
        </div>
      )}
    </div>
  );
};
export default GitHubAnalyzer;
