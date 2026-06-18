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
  Waves,
  Anchor,
  Compass,
  Ship
} from 'lucide-react';
import { triggerConfetti, triggerXpGain, triggerBadgeUnlock } from '../components/Celebration';
import { OceanPageShell, OceanPageHeader, OceanLoadingScreen } from '../components/ocean/OceanUI';

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
  
  // Ocean-themed filter categories
  const categoryFilters = ['Good First Issues', 'GSSoC Projects', 'Hacktoberfest Repositories', 'Beginner-friendly repositories'];

  const getOceanicCategoryLabel = (label: string) => {
    if (label === 'Good First Issues') return 'Calm Shallows (Good First Issues) ⛵';
    if (label === 'GSSoC Projects') return 'Mid-Currents (GSSoC Ports) 🌀';
    if (label === 'Hacktoberfest Repositories') return 'High Winds (Hacktoberfest) 🌊';
    return 'Coastal Gaps (Beginner Friendly) 🐚';
  };

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

      // Gamification trigger celebrations
      if (status === 'merged') {
        triggerConfetti(3500);
        triggerXpGain(25, `Logged PR: ${repository}`);
        triggerBadgeUnlock('OSS Fleet Admiral 🌟', 'Logged a successfully merged open-source code patch on Github!', 'trophy');
      } else {
        triggerXpGain(10, `Logged Draft PR: ${repository}`);
      }
      
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
    return <OceanLoadingScreen message="Syncing open source voyages..." />;
  }

  const consolidatedScore = user?.scores?.openSource || 0;
  const mergedPrsCount = contributions.filter(c => c.status === 'merged').length;

  return (
    <OceanPageShell>
      <OceanPageHeader
        title="Open Source Bay"
        subtitle="Discover contribution harbors, track PR merges, and build your collaborative fleet history."
        icon={Flame}
        badge="VOYAGE DISCOVERIES"
        action={
          activeTab === 'log' ? (
            <button type="button" onClick={() => setShowForm(!showForm)} className="ocean-btn-primary !w-auto px-5">
              {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showForm ? 'Cancel' : 'Log Voyage'}
            </button>
          ) : undefined
        }
      />

      {/* Tabs */}
      <div className="flex border-b border-[#D2E1ED] dark:border-[#123456]/30 pb-px font-sans">
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`px-5 py-3 text-xs font-bold tracking-tight border-b-2 transition cursor-pointer ${
            activeTab === 'recommendations'
              ? 'border-[#00B8D9] text-[#00B8D9] bg-cyan-100/10 dark:border-cyan-405 dark:text-cyan-300 dark:bg-cyan-500/5'
              : 'border-transparent text-[#5C768D] dark:text-cyan-600 hover:text-[#0A2540] dark:hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-4 w-4 text-[#00B8D9]" />
            <span>Tidal Voyage Suggestions</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('log')}
          className={`px-5 py-3 text-xs font-bold tracking-tight border-b-2 transition cursor-pointer ${
            activeTab === 'log'
              ? 'border-[#00B8D9] text-[#00B8D9] bg-cyan-100/10 dark:border-cyan-405 dark:text-cyan-300 dark:bg-cyan-500/5'
              : 'border-transparent text-[#5C768D] dark:text-cyan-600 hover:text-[#0A2540] dark:hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2 font-semibold">
            <GitPullRequest className="h-4 w-4 text-[#00B8D9]" />
            <span>Captain's Log ({contributions.length})</span>
          </div>
        </button>
      </div>

      {activeTab === 'recommendations' ? (
        <div className="space-y-6 animate-fade-in">
          {/* Controls Bar */}
          <div className="premium-card p-6 space-y-4 shadow-xs bg-white dark:bg-[#061524]/60">
            <div className="flex items-center gap-2 text-[#0A2540] dark:text-white text-xs font-bold border-b border-[#D2E1ED]/30 dark:border-[#123456]/40 pb-3 mb-2 font-sans">
              <Filter className="h-4.5 w-4.5 text-[#00B8D9]" />
              <span>Configure Voyage Finder Parameters</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
              <div>
                <label className="block text-[10px] font-mono text-[#5C768D] dark:text-cyan-405 uppercase tracking-wider mb-2 font-black">Primary Technology Filter</label>
                <div className="flex flex-wrap gap-2">
                  {techFilters.map((tech) => (
                    <button
                      key={tech}
                      onClick={() => setSelectedTech(tech)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        selectedTech === tech
                          ? 'bg-cyan-100/20 border-cyan-200 text-[#00B8D9] dark:bg-cyan-500/10 dark:border-[#00B8D9]/40'
                          : 'bg-slate-50 border-[#D2E1ED] text-[#5C768D] dark:bg-[#030D18]/30 dark:border-[#123456] dark:text-cyan-405 dark:hover:text-white'
                      }`}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#5C768D] dark:text-cyan-405 uppercase tracking-wider mb-2 font-black font-semibold">Voyage currents category</label>
                <div className="flex flex-wrap gap-2">
                  {categoryFilters.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-cyan-100/20 border-cyan-200 text-[#00B8D9] dark:bg-cyan-500/10 dark:border-[#00B8D9]/40'
                          : 'bg-slate-50 border-[#D2E1ED] text-[#5C768D] dark:bg-[#030D18]/30 dark:border-[#123456] dark:text-cyan-405 dark:hover:text-white'
                      }`}
                    >
                      {getOceanicCategoryLabel(cat)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-[#123456]/40">
              <button
                onClick={fetchRecommendations}
                disabled={loadingRecs}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00B8D9] to-[#0F4C81] text-white px-4 py-2 text-xs font-bold transition cursor-pointer shadow-xs"
              >
                {loadingRecs ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Analyzing Github registries...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Query Deep Registries</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Recs Result Section */}
          {loadingRecs ? (
            <div className="py-16 text-center font-mono">
              <Loader2 className="h-8 w-8 animate-spin text-[#00B8D9] mx-auto mb-4" />
              <p className="text-xs text-[#5C768D] dark:text-cyan-400 font-extrabold uppercase animate-pulse">Querying public project graphs for matching issues...</p>
            </div>
          ) : recsError ? (
            <div className="rounded-xl border border-rose-500/15 bg-rose-500/5 p-6 text-center">
              <p className="text-xs text-rose-500 dark:text-rose-450 font-semibold">{recsError}</p>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">
              {recommendations.map((rec, index) => (
                <div key={index} className="premium-card p-6 flex flex-col justify-between hover:border-cyan-500/35 transition-all duration-300 shadow-xs bg-white dark:bg-[#061524]/60">
                  <div className="space-y-4">
                    {/* Repository details */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Github className="h-4.5 w-4.5 text-[#0A2540] dark:text-white" />
                          <a href={rec.repoUrl} target="_blank" rel="noreferrer" className="text-sm font-black text-[#0A2540] dark:text-white hover:text-[#00B8D9] font-mono transition-colors">
                            {rec.repoName}
                          </a>
                        </div>
                        <p className="text-xs text-[#5C768D] dark:text-cyan-200 mt-1 pr-6 leading-relaxed font-semibold">
                          {rec.repoDescription}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-500/20 shrink-0 select-all font-mono">
                        ⭐ {rec.stars.toLocaleString()}
                      </span>
                    </div>

                    {/* Active issue detail */}
                    <div className="rounded-2xl border border-[#D2E1ED] bg-[#F8FAFC] dark:border-[#123456] dark:bg-[#030D18]/50 p-4.5 space-y-2.5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[9.5px] uppercase tracking-wider text-cyan-800 bg-cyan-100/50 dark:text-cyan-400 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 px-2 py-0.5 rounded font-black">
                          Active Map Quest
                        </span>
                        <span className={`text-[9.5px] font-black font-mono px-2 py-0.5 rounded uppercase ${
                          rec.difficulty === 'Easy' 
                            ? 'text-teal-600 bg-teal-50 dark:text-[#2DD4BF] dark:bg-teal-500/10'
                            : rec.difficulty === 'Medium'
                            ? 'text-amber-605 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10'
                            : 'text-rose-650 bg-rose-50 dark:text-rose-450 dark:bg-rose-500/10'
                        }`}>
                          {rec.difficulty} Difficulty
                        </span>
                      </div>
                      <h4 className="text-xs font-black text-[#0A2540] dark:text-white leading-snug">
                        {rec.issueTitle}
                      </h4>
                      <p className="text-xs text-[#5C768D] dark:text-cyan-100 leading-relaxed font-semibold">
                        {rec.issueDescription}
                      </p>
                    </div>

                    {/* Step guidance */}
                    <div className="space-y-1.5 pl-1">
                      <h5 className="text-[10.5px] font-black text-cyan-800 dark:text-cyan-300 uppercase tracking-widest font-mono">Suggested Sailing Course</h5>
                      <p className="text-xs text-[#5C768D] dark:text-cyan-100 leading-relaxed select-all font-semibold">
                        {rec.contributionGuidelines}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-[#123456]/40 mt-5 flex justify-end">
                    <a
                      href={rec.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs font-bold text-[#0F4C81] dark:text-white hover:text-[#00B8D9] transition cursor-pointer"
                    >
                      <span>Embark on Github</span>
                      <ChevronRight className="h-4 w-4 text-[#00B8D9]" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="premium-card p-10 text-center border-dashed border-2 bg-white dark:bg-[#061524]/30 border-[#D2E1ED] dark:border-[#123456]">
              <Sparkles className="h-8 w-8 text-[#00B8D9] mx-auto mb-3 opacity-50 animate-pulse" />
              <p className="text-xs text-[#5C768D] font-bold">No recommended issue items generated yet.</p>
            </div>
          )}
        </div>
      ) : (
        /* Log view */
        <div className="space-y-8 animate-fade-in">
          {/* Inline Form to Log Contribution */}
          {showForm && (
            <div className="premium-card p-6 shadow-xs max-w-2xl font-sans bg-white dark:bg-[#061524]/60">
              <h3 className="text-base font-black text-[#0A2540] dark:text-white mb-2 ml-1.5 flex items-center gap-2">
                <GitPullRequest className="text-[#00B8D9] h-5 w-5" />
                <span>Verify Voyage Details</span>
              </h3>
              <p className="text-xs text-[#5C768D] dark:text-cyan-300 mb-5 ml-1.5 font-semibold">Provide coordinates of your merged or open pull requests to establish sailing habit metrics.</p>

              <form onSubmit={handleAddContribution} className="space-y-4 font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-[#5C768D] dark:text-cyan-405 uppercase tracking-wider mb-1.5 font-bold">Repository (e.g. facebook/react)</label>
                    <input
                      type="text"
                      required
                      placeholder="facebook/react"
                      value={repository}
                      onChange={(e) => setRepository(e.target.value)}
                      className="w-full bg-[#F8FAFC] dark:bg-[#030D18] border border-[#D2E1ED] dark:border-[#123456] rounded-xl px-4 py-2.5 text-xs text-[#0A2540] dark:text-white focus:outline-hidden focus:border-[#00B8D9] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#5C768D] dark:text-cyan-405 uppercase tracking-wider mb-1.5 font-bold">PR URL Link</label>
                    <input
                      type="url"
                      required
                      placeholder="https://github.com/facebook/react/pull/24890"
                      value={prUrl}
                      onChange={(e) => setPrUrl(e.target.value)}
                      className="w-full bg-[#F8FAFC] dark:bg-[#030D18] border border-[#D2E1ED] dark:border-[#123456] rounded-xl px-4 py-2.5 text-xs text-[#0A2540] dark:text-white focus:outline-hidden focus:border-[#00B8D9] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-[#5C768D] dark:text-cyan-405 uppercase tracking-wider mb-1.5 font-bold">Brief Description of Patch</label>
                  <input
                    type="text"
                    required
                    placeholder="fix: eliminate memory leakage cycles inside SSR layout reconciliation context"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#F8FAFC] dark:bg-[#030D18] border border-[#D2E1ED] dark:border-[#123456] rounded-xl px-4 py-2.5 text-xs text-[#0A2540] dark:text-white focus:outline-hidden focus:border-[#00B8D9] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-[#5C768D] dark:text-cyan-405 uppercase tracking-wider mb-1.5 font-bold">Primary Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-[#F8FAFC] dark:bg-[#030D18] border border-[#D2E1ED] dark:border-[#123456] rounded-xl px-3.5 py-2.5 text-xs text-[#0A2540] dark:text-white focus:outline-hidden focus:border-[#00B8D9] transition"
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
                    <label className="block text-[10px] font-mono text-[#5C768D] dark:text-cyan-405 uppercase tracking-wider mb-1.5 font-bold">PR Current Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full bg-[#F8FAFC] dark:bg-[#030D18] border border-[#D2E1ED] dark:border-[#123456] rounded-xl px-3.5 py-2.5 text-xs text-[#0A2540] dark:text-white focus:outline-hidden focus:border-[#00B8D9] transition"
                    >
                      <option value="merged">Merged (+25 pts)</option>
                      <option value="open">Open / Under Review (+10 pts)</option>
                      <option value="draft">Draft Setup</option>
                    </select>
                  </div>
                </div>

                {error && (
                  <div className="text-xs text-rose-500 dark:text-rose-450 bg-rose-50 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/10 p-3.5 rounded-xl flex items-center gap-2 font-bold">
                    <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00B8D9] to-[#0F4C81] text-white py-3 text-xs font-bold transition shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-[11px] text-[#5C768D] dark:text-cyan-400 font-black">
            <div className="premium-card p-5 shadow-xs bg-white dark:bg-[#061524]/60">
              <Activity className="h-4.5 w-4.5 text-[#00B8D9] mb-2" />
              <span className="text-[#0A2540] dark:text-white block font-sans text-xl font-black">{mergedPrsCount}</span>
              <span className="uppercase tracking-wider text-[9px] font-black">Total Merged Contributions</span>
            </div>
            <div className="premium-card p-5 shadow-xs bg-white dark:bg-[#061524]/60">
              <Award className="h-4.5 w-4.5 text-[#00B8D9] mb-2" />
              <span className="text-[#0A2540] dark:text-white block font-sans text-xl font-black">{consolidatedScore}</span>
              <span className="uppercase tracking-wider text-[9px] font-black">OS Habits Index</span>
            </div>
            <div className="premium-card p-5 shadow-xs bg-white dark:bg-[#061524]/60">
              <Calendar className="h-4.5 w-4.5 text-[#00B8D9] mb-2" />
              <span className="text-teal-600 block font-sans text-xl font-black uppercase">Active Mapping</span>
              <span className="uppercase tracking-wider text-[9px] font-black">Verification status</span>
            </div>
          </div>

          {/* Main Logs List */}
          <div className="font-sans">
            <h2 className="font-display font-black text-[#0A2540] dark:text-white text-base mb-4">Logged Pull Requests History</h2>

            {contributions.length > 0 ? (
              <div className="premium-card p-5 shadow-xs bg-white dark:bg-[#061524]/60">
                <div className="space-y-4">
                  {contributions.map((cont) => (
                    <div key={cont._id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-[#123456]/30 pb-4 last:border-0 last:pb-0 gap-3">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-[#030D18] border border-cyan-100 dark:border-cyan-900/40 text-[#00B8D9] shrink-0">
                          <GitPullRequest className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-mono text-xs font-bold text-[#0A2540] dark:text-white">{cont.repoName}</span>
                            <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded uppercase font-extrabold ${
                              cont.status === 'merged'
                                ? 'text-teal-600 bg-teal-50 dark:text-[#2DD4BF] dark:bg-teal-500/10'
                                : cont.status === 'open'
                                ? 'text-amber-500 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/15'
                                : 'text-zinc-500 bg-zinc-50 dark:text-zinc-400 dark:bg-zinc-500/10'
                            }`}>
                              {cont.status}
                            </span>
                          </div>
                          <h4 className="font-sans text-sm font-semibold text-[#5C768D] dark:text-[#E2E8F0] mt-1 pr-6 leading-snug">{cont.description}</h4>
                        </div>
                      </div>

                      <div className="sm:text-right shrink-0">
                        <span className="inline-flex items-center gap-1 text-teal-600 bg-teal-50 dark:text-[#2DD4BF] dark:bg-[#030D18] px-2.5 py-1 rounded-xl border border-teal-200 dark:border-cyan-900/35 font-mono text-[10.5px] font-bold">
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>{cont.status === 'merged' ? '+25 pts' : cont.status === 'open' ? '+10 pts' : '0 pts'}</span>
                        </span>
                        <span className="block text-[9px] text-[#5C768D] dark:text-slate-505 font-mono font-bold tracking-tight mt-1.5">
                          Ref: {new Date(cont.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="premium-card p-12 text-center border-dashed border-2 bg-white dark:bg-[#061524]/60 border-[#D2E1ED] dark:border-[#123456]">
                <GitPullRequest className="h-10 w-10 text-[#00B8D9] mx-auto mb-4 opacity-50" />
                <h3 className="font-display font-black text-[#0A2540] dark:text-white text-base">Register merged PR coordinates</h3>
                <p className="text-xs text-[#5C768D] dark:text-cyan-300 max-w-sm mx-auto mt-1 leading-relaxed font-semibold">
                  Log your active or merged GitHub pull requests to calculate your score multiplier. Recruiters value consistent sailing habits.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </OceanPageShell>
  );
};

export default OpenSource;
