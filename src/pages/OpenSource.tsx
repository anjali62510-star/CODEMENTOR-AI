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
  X
} from 'lucide-react';

export const OpenSource: React.FC = () => {
  const { user, apiFetch, refreshUser } = useAuth();
  const [contributions, setContributions] = useState<OpenSourceContribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [repository, setRepository] = useState('');
  const [prNumber, setPrNumber] = useState('');
  const [title, setTitle] = useState('');
  const [complexityPoints, setComplexityPoints] = useState(50);

  const fetchContributions = async () => {
    try {
      const data = await apiFetch('/api/opensource');
      if (data.contributions) {
        setContributions(data.contributions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContributions();
  }, []);

  const handleAddContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repository || !prNumber || !title) {
      setError('Please fill in complete PR tracking coordinates.');
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      const data = await apiFetch('/api/opensource/contribution', {
        method: 'POST',
        body: JSON.stringify({
          repository,
          prNumber: Number(prNumber),
          title,
          complexityPoints: Number(complexityPoints)
        })
      });
      setContributions(data.contributions);
      await refreshUser(); // Update standard user score context
      // Reset form fields
      setRepository('');
      setPrNumber('');
      setTitle('');
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

  // Calculate score total from points allocation
  const consolidatedScore = user?.scores?.openSource || 0;
  const mergedPrsCount = contributions.length;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-[#1C1C1E] pb-6">
        <div>
          <h1 className="font-sans text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5 md:text-3xl">
            <Flame className="h-7 w-7 text-emerald-400 group-hover:text-emerald-300" />
            <span>Open Source Merges Log</span>
          </h1>
          <p className="text-xs text-[#8E8E93] mt-1.5 leading-relaxed">
            Log and verify public code integrations, pull request alignments, and merged branches across globally recognized repository repositories clusters.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2.5 text-xs font-bold transition shadow-[0_0_15px_rgba(16,185,129,0.25)]"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          <span>{showForm ? 'Cancel Logging' : 'Log Merged PR'}</span>
        </button>
      </div>

      {/* Inline Form to Log Contribution */}
      {showForm && (
        <div className="rounded-xl border border-emerald-500/15 bg-gradient-to-br from-[#141416] to-[#0E0E10] p-6 shadow-sm max-w-2xl">
          <h3 className="font-sans text-base font-bold text-white mb-2.5 flex items-center gap-2">
            <GitPullRequest className="text-emerald-400 h-4.5 w-4.5" />
            <span>Verify integrations credentials</span>
          </h3>
          <p className="text-xs text-[#8E8E93] mb-5">Provide coordinates of your merged pull requests to recalculate developer habits index scores.</p>

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
                <label className="block text-[10px] font-mono text-[#8E8E93] uppercase tracking-wider mb-1.5">PR Number</label>
                <input
                  type="number"
                  required
                  placeholder="24890"
                  value={prNumber}
                  onChange={(e) => setPrNumber(e.target.value)}
                  className="w-full bg-[#1C1C1E] border border-[#2D2D30] rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#8E8E93] uppercase tracking-wider mb-1.5">PR Title Achievement</label>
              <input
                type="text"
                required
                placeholder="fix: eliminate memory leakage cycles inside SSR layout reconciliation context"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#1C1C1E] border border-[#2D2D30] rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#8E8E93] uppercase tracking-wider mb-1.5">Estimated Scope / Complexity</label>
              <div className="grid grid-cols-3 gap-2.5 mt-1.5">
                {[
                  { val: 20, tag: 'Standard patch (20pts)' },
                  { val: 50, tag: 'Standard feature (50pts)' },
                  { val: 100, tag: 'Heavy architectural (100pts)' }
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setComplexityPoints(item.val)}
                    className={`
                      border rounded-lg py-2.5 text-[10.5px] font-semibold tracking-tight transition
                      ${complexityPoints === item.val
                        ? 'bg-emerald-500/5 border-emerald-500/40 text-emerald-400 font-bold'
                        : 'bg-[#1C1C1E] border-[#2D2D30] text-[#8E8E93] hover:text-white'
                      }
                    `}
                  >
                    {item.tag}
                  </button>
                ))}
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
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting Tracking Request...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Verify PR & Log Points</span>
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
          <span className="uppercase tracking-wider text-[9px]">Consolidated Open Source Score</span>
        </div>
        <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-5 shadow-xs">
          <Calendar className="h-4 w-4 text-[#8E8E93] mb-2" />
          <span className="text-emerald-400 block font-sans text-xl font-extrabold">Active</span>
          <span className="uppercase tracking-wider text-[9px]">Hiring Metrics Alignment</span>
        </div>
      </div>

      {/* Main Contribution Logs List */}
      <div>
        <h2 className="font-sans text-base font-bold text-white mb-4">Contribution History Log</h2>

        {contributions.length > 0 ? (
          <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-5 shadow-xs">
            <div className="space-y-4">
              {contributions.map((cont) => (
                <div key={cont.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1C1C1E]/50 pb-4 last:border-0 last:pb-0 gap-3">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1C1C1E] border border-[#2D2D30] text-emerald-400 shrink-0">
                      <GitPullRequest className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-xs font-bold text-white">{cont.repository}</span>
                        <span className="font-mono text-[9.5px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-1.5 py-0.5 rounded">PR #{cont.prNumber}</span>
                      </div>
                      <h4 className="font-sans text-sm font-semibold text-[#E5E5E7] mt-1 pr-6 leading-snug">{cont.title}</h4>
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[10.5px] font-bold bg-[#1C1C1E] px-2.5 py-1 rounded border border-[#2D2D30]">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>+{cont.complexityPoints} points</span>
                    </span>
                    <span className="block text-[9px] text-[#8E8E93] font-mono font-medium tracking-tight mt-1">
                      Merged: {new Date(cont.mergedAt).toLocaleDateString()}
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
              Maintain an active catalog of your codebase contributions to help recruiters screen your capability. Logs points using selectors above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default OpenSource;
