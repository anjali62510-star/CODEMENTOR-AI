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
  AlertCircle
} from 'lucide-react';
import { PolarCategoriesChart } from '../components/DashboardCharts';

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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="border-b border-[#1C1C1E] pb-6">
        <h1 className="font-sans text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5 md:text-3xl">
          <Github className="h-7 w-7 text-[#E5E5E7] group-hover:text-emerald-400" />
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Diagnostic Key Metadata Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-6 flex flex-col items-center text-center shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 font-mono font-bold text-lg shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                {analysis.readmeRating}
              </div>
              <h2 className="font-sans text-lg font-bold text-white">@{analysis.username}</h2>
              <label className="font-mono text-[9px] uppercase tracking-widest text-[#8E8E93] mt-0.5">Readme Rating Grade</label>

              {/* Polar Category breakdown for code language proportions */}
              <div className="w-full mt-8 border-t border-[#1C1C1E] pt-6 text-left">
                <h3 className="font-mono text-[10px] uppercase tracking-wider text-[#AEAEB2] mb-4 flex items-center gap-1.5">
                  <Code className="h-4 w-4" />
                  <span>Language diversity match</span>
                </h3>
                <PolarCategoriesChart 
                  categories={analysis.languages.map(l => ({ label: l.name, score: l.percentage }))} 
                />
              </div>
            </div>

            {/* General Repositories & Star Metadata counts */}
            <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-5 shadow-xs grid grid-cols-3 gap-4 text-center font-mono text-[11px]">
              <div>
                <BookOpen className="h-4 w-4 text-[#8E8E93] mx-auto mb-1.5" />
                <span className="block text-white font-bold font-sans text-sm">{analysis.repositoriesCount}</span>
                <span className="text-[#8E8E93] text-[9px] uppercase tracking-wider">Repos</span>
              </div>
              <div className="border-x border-[#1C1C1E]">
                <Activity className="h-4 w-4 text-[#8E8E93] mx-auto mb-1.5" />
                <span className="block text-white font-bold font-sans text-sm">{analysis.contributionsCount}</span>
                <span className="text-[#8E8E93] text-[9px] uppercase tracking-wider">Commits</span>
              </div>
              <div>
                <Star className="h-4 w-4 text-[#8E8E93] mx-auto mb-1.5" />
                <span className="block text-white font-bold font-sans text-sm">{analysis.starsCount}</span>
                <span className="text-[#8E8E93] text-[9px] uppercase tracking-wider">Stars</span>
              </div>
            </div>
          </div>

          {/* Detailed Optimizations & Recommendations Columns */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-5 border-b border-[#1C1C1E] pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4.5 w-4.5 text-emerald-400" />
                  <span className="font-sans font-bold text-white text-base">Required Optimizations</span>
                </div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  Readiness: {analysis.readinessContribution}%
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
