import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { OpenSourceContribution } from '../types';
import { 
  Flame, 
  Sparkles, 
  Plus, 
  AlertCircle, 
  GitPullRequest, 
  Award, 
  Activity, 
  Calendar,
  CheckCircle,
  Loader2,
  X,
  Github,
  ChevronRight,
  Filter,
  CheckSquare
} from 'lucide-react';

interface RecommendedIssue {
  repoName: string;
  repoDescription: string;
  repoUrl: string;
  stars: number;
  language: string;
  issueTitle: string;
  issueDescription: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  contributionGuidelines: string;
}

export const OpenSource: React.FC = () => {
  const { user, apiFetch, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'log' | 'recommendations'>('recommendations');
  const [contributions, setContributions] = useState<OpenSourceContribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [repository, setRepository] = useState('');
  const [prUrl, setPrUrl] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('React');
  const [status, setStatus] = useState<'draft' | 'open' | 'merged' | 'closed'>('merged');

  // Recommendations Filters
  const [selectedTech, setSelectedTech] = useState('React');
  const [selectedCategory, setSelectedCategory] = useState('Good First Issues');
  const [recommendations, setRecommendations] = useState<RecommendedIssue[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [recsError, setRecsError] = useState<string | null>(null);

  const techFilters = ['React', 'Node.js', 'Python', 'Java', 'AI/ML', 'Data Science'];
  const categoryFilters = ['Good First Issues', 'GSSoC Projects', 'Hacktoberfest Repositories', 'Beginner-friendly repositories'];

  const fetchContributions = async () => {
    try {
      const data = await apiFetch('/api/open-source');
      if (data.contributions) {
        setContributions(data.contributions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    setLoadingRecs(true);
    setRecsError(null);
    try {
      const data = await apiFetch('/api/open-source/recommend', {
        method: 'POST',
        body: JSON.stringify({ techStack: selectedTech, category: selectedCategory })
      });
      if (data.recommendations) {
        setRecommendations(data.recommendations);
      }
    } catch (err: any) {
      console.error(err);
      setRecsError(err.message || 'Error occurred collecting recommendations.');
    } finally {
      setLoadingRecs(false);
    }
  };

  useEffect(() => {
    fetchContributions();
    fetchRecommendations();
  }, [selectedTech, selectedCategory]);

  const handleAddContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repository || !prUrl || !description || !language) {
      setError('Please fill in complete PR tracking coordinates.');
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      const data = await apiFetch('/api/open-source', {
        method: 'POST',
        body: JSON.stringify({
          repoName: repository,
          prUrl,
          description,
          language,
          status
        })
      });
      
      // Reload contributions to get the freshly-created tracking code
      await fetchContributions();
      await refreshUser(); // Update overall user score
      
      // Reset form fields
      setRepository('');
      setPrUrl('');
      setDescription('');
      setShowForm(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Tracking update rejected.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center font-mono text-xs text-[#8E8E93]">
        Evaluating Open Source commits...
      </div>
    );
  }

  const consolidatedScore = user?.scores?.openSource || 0;
  const mergedPrsCount = contributions.filter(c => c.status === 'merged').length;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-[#1C1C1E] pb-6">
        <div>
          <h1 className="font-sans text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5 md:text-3xl">
            <Flame className="h-7 w-7 text-emerald-400" />
            <span>Open Source Hub</span>
          </h1>
          <p className="text-xs text-[#8E8E93] mt-1.5 leading-relaxed">
            Discover beginner-friendly open-source issues, filter by technical stack, and track/log pull-request outcomes to establish a prominent public shipping history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'log' && (
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2.5 text-xs font-bold transition shadow-[0_0_15px_rgba(16,185,129,0.25)]"
            >
              {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              <span>{showForm ? 'Cancel Logging' : 'Log Merged PR'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1C1C1E] pb-px">
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`px-5 py-3 text-xs font-bold tracking-tight border-b-2 transition ${
            activeTab === 'recommendations'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-[#8E8E93] hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>AI Code Recommendation Engine</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('log')}
          className={`px-5 py-3 text-xs font-bold tracking-tight border-b-2 transition ${
            activeTab === 'log'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-[#8E8E93] hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <GitPullRequest className="h-4 w-4" />
            <span>Verifications Log ({contributions.length})</span>
          </div>
        </button>
      </div>

      {activeTab === 'recommendations' ? (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-6 space-y-4">
            <div className="flex items-center gap-2 text-white text-xs font-bold border-b border-[#1C1C1E] pb-3 mb-2">
              <Filter className="h-4.5 w-4.5 text-emerald-400" />
              <span>Configure Engine Parameters</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-mono text-[#8E8E93] uppercase tracking-wider mb-2">Primary Technology Filter</label>
                <div className="flex flex-wrap gap-2">
                  {techFilters.map((tech) => (
                    <button
                      key={tech}
                      onClick={() => setSelectedTech(tech)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        selectedTech === tech
                          ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-semibold'
                          : 'bg-[#1C1C1E] border border-[#2D2D30] text-[#8E8E93] hover:text-white'
                      }`}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#8E8E93] uppercase tracking-wider mb-2">Issue/Project Domain</label>
                <div className="flex flex-wrap gap-2">
                  {categoryFilters.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        selectedCategory === cat
                          ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-semibold'
                          : 'bg-[#1C1C1E] border border-[#2D2D30] text-[#8E8E93] hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#1C1C1E]">
              <button
                onClick={fetchRecommendations}
                disabled={loadingRecs}
                className="flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 text-xs font-bold transition"
              >
                {loadingRecs ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-black" />
                    <span>Analyzing Github registries...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Recalculate Recommendations</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Recs Result Section */}
          {loadingRecs ? (
            <div className="py-16 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-400 mx-auto mb-4" />
              <p className="text-xs font-mono text-[#8E8E93]">Querying public project graphs for matching issues...</p>
            </div>
          ) : recsError ? (
            <div className="rounded-xl border border-rose-500/10 bg-rose-500/5 p-6 text-center">
              <p className="text-xs text-rose-400">{recsError}</p>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recommendations.map((rec, index) => (
                <div key={index} className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-6 flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-300">
                  <div className="space-y-4">
                    {/* Repository details */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Github className="h-4.5 w-4.5 text-white" />
                          <a href={rec.repoUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-white hover:text-emerald-400 font-mono transition-colors">
                            {rec.repoName}
                          </a>
                        </div>
                        <p className="text-xs text-[#8E8E93] mt-1 pr-6 leading-relaxed">
                          {rec.repoDescription}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10 shrink-0">
                        ⭐ {rec.stars.toLocaleString()}
                      </span>
                    </div>

                    {/* Active issue detail */}
                    <div className="rounded-lg border border-[#1C1C1E] bg-[#0E0E10] p-4.5 space-y-2.5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[9.5px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-2 py-0.5 rounded">
                          Active Issue
                        </span>
                        <span className={`text-[9.5px] font-bold font-mono px-2 py-0.5 rounded uppercase ${
                          rec.difficulty === 'Easy' 
                            ? 'text-emerald-400 bg-emerald-500/5 border border-emerald-500/10'
                            : rec.difficulty === 'Medium'
                            ? 'text-amber-400 bg-amber-500/5 border border-amber-500/10'
                            : 'text-rose-400 bg-rose-500/5 border border-rose-500/10'
                        }`}>
                          {rec.difficulty} Difficulty
                        </span>
                      </div>
                      <h4 className="font-sans text-xs font-bold text-white leading-snug">
                        {rec.issueTitle}
                      </h4>
                      <p className="text-xs text-[#AEAEB2] leading-relaxed">
                        {rec.issueDescription}
                      </p>
                    </div>

                    {/* Step guidance */}
                    <div className="space-y-2 font-sans pl-1">
                      <h5 className="text-[10.5px] font-bold text-emerald-400 uppercase tracking-widest font-mono">Suggested Contribution Path</h5>
                      <p className="text-xs text-[#8E8E93] leading-relaxed select-all">
                        {rec.contributionGuidelines}
                      </p>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-[#1C1C1E] mt-5 flex justify-end">
                    <a
                      href={rec.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs font-bold text-white hover:text-emerald-400 transition"
                    >
                      <span>Open Issue on Github</span>
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-[#2D2D30] border-dashed p-10 text-center">
              <Sparkles className="h-8 w-8 text-[#8E8E93] mx-auto mb-3 opacity-50" />
              <p className="text-xs text-[#8E8E93]">No recommended issue items generated yet.</p>
            </div>
          )}
        </div>
      ) : (
        /* Log view */
        <div className="space-y-8">
          {/* Inline Form to Log Contribution */}
          {showForm && (
            <div className="rounded-xl border border-emerald-500/15 bg-gradient-to-br from-[#141416] to-[#0E0E10] p-6 shadow-sm max-w-2xl">
              <h3 className="font-sans text-base font-bold text-white mb-2.5 flex items-center gap-2">
                <GitPullRequest className="text-emerald-400 h-4.5 w-4.5" />
                <span>Verify Contribution Details</span>
              </h3>
              <p className="text-xs text-[#8E8E93] mb-5">Provide coordinates of your merged or open pull requests to establish shipping habits score indices.</p>

              <form onSubmit={handleAddContribution} className="space-y-4 font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-[#8E8E93] uppercase tracking-wider mb-1.5">Repository (e.g. facebook/react)</label>
                    <input
                      type="text"
                      required
                      placeholder="facebook/react"
                      value={repository}
                      onChange={(e) => setRepository(e.target.value)}
                      className="w-full bg-[#1C1C1E] border border-[#2D2D30] rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#8E8E93] uppercase tracking-wider mb-1.5">PR URL Link</label>
                    <input
                      type="url"
                      required
                      placeholder="https://github.com/facebook/react/pull/24890"
                      value={prUrl}
                      onChange={(e) => setPrUrl(e.target.value)}
                      className="w-full bg-[#1C1C1E] border border-[#2D2D30] rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-[#8E8E93] uppercase tracking-wider mb-1.5">Brief Description of Patch</label>
                  <input
                    type="text"
                    required
                    placeholder="fix: eliminate memory leakage cycles inside SSR layout reconciliation context"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#1C1C1E] border border-[#2D2D30] rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-[#8E8E93] uppercase tracking-wider mb-1.5">Primary Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-[#1C1C1E] border border-[#2D2D30] rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500 transition"
                    >
                      <option value="React">React</option>
                      <option value="TypeScript">TypeScript</option>
                      <option value="Node.js">Node.js</option>
                      <option value="Python">Python</option>
                      <option value="Java">Java</option>
                      <option value="Go">Go</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#8E8E93] uppercase tracking-wider mb-1.5">PR Current Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full bg-[#1C1C1E] border border-[#2D2D30] rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500 transition"
                    >
                      <option value="merged">Merged (+25 pts)</option>
                      <option value="open">Open / Under Review (+10 pts)</option>
                      <option value="draft">Draft Setup</option>
                    </select>
                  </div>
                </div>

                {error && (
                  <div className="text-xs text-rose-400 bg-rose-500/5 border border-rose-500/10 p-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black py-2.5 text-xs font-bold transition shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin animate-fade-in" />
                      <span>Verifying PR Coordinates...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Log Contribution & Re-score</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Analytics Mini Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-[11px] text-[#8E8E93]">
            <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-5 shadow-xs">
              <Activity className="h-4 w-4 text-[#8E8E93] mb-2" />
              <span className="text-white block font-sans text-xl font-extrabold">{mergedPrsCount}</span>
              <span className="uppercase tracking-wider text-[9px]">Total Merged Contributions</span>
            </div>
            <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-5 shadow-xs">
              <Award className="h-4 w-4 text-[#8E8E93] mb-2" />
              <span className="text-white block font-sans text-xl font-extrabold">{consolidatedScore}</span>
              <span className="uppercase tracking-wider text-[9px]">Consolidated OS Habits Index</span>
            </div>
            <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-5 shadow-xs">
              <Calendar className="h-4 w-4 text-[#8E8E93] mb-2" />
              <span className="text-emerald-400 block font-sans text-xl font-extrabold">Active Mapping</span>
              <span className="uppercase tracking-wider text-[9px]">Employer Verification state</span>
            </div>
          </div>

          {/* Main Logs List */}
          <div>
            <h2 className="font-sans text-base font-bold text-white mb-4">Logged Pull Requests History</h2>

            {contributions.length > 0 ? (
              <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-5 shadow-xs">
                <div className="space-y-4">
                  {contributions.map((cont) => (
                    <div key={cont._id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1C1C1E]/50 pb-4 last:border-0 last:pb-0 gap-3">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1C1C1E] border border-[#2D2D30] text-emerald-400 shrink-0">
                          <GitPullRequest className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-mono text-xs font-bold text-white">{cont.repoName}</span>
                            <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded uppercase font-semibold ${
                              cont.status === 'merged'
                                ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/15'
                                : cont.status === 'open'
                                ? 'text-amber-400 bg-amber-500/15 border border-amber-500/20'
                                : 'text-gray-400 bg-gray-500/10'
                            }`}>
                              {cont.status}
                            </span>
                          </div>
                          <h4 className="font-sans text-sm font-semibold text-[#E5E5E7] mt-1 pr-6 leading-snug">{cont.description}</h4>
                        </div>
                      </div>

                      <div className="sm:text-right shrink-0">
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[10.5px] font-bold bg-[#1C1C1E] px-2.5 py-1 rounded border border-[#2D2D30]">
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>{cont.status === 'merged' ? '+25 pts' : cont.status === 'open' ? '+10 pts' : '0 pts'}</span>
                        </span>
                        <span className="block text-[9px] text-[#8E8E93] font-mono font-medium tracking-tight mt-1">
                          Ref: {new Date(cont.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-[#2D2D30] border-dashed bg-[#141416]/10 p-12 text-center">
                <GitPullRequest className="h-10 w-10 text-[#8E8E93] mx-auto mb-4 opacity-50" />
                <h3 className="font-sans font-bold text-white text-base">Register merged PR coordinates</h3>
                <p className="text-xs text-[#8E8E93] max-w-sm mx-auto mt-1 leading-relaxed">
                  Log your active or merged GitHub pull requests to calculate your score multiplier. Recruiters value consistent coding habits.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default OpenSource;
