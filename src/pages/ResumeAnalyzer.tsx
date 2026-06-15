import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ResumeAnalysis } from '../types';
import { 
  FileSearch, 
  Sparkles, 
  Loader2, 
  CheckCircle, 
  X, 
  BookOpen, 
  Award, 
  ChevronRight, 
  TrendingUp,
  History,
  AlertCircle
} from 'lucide-react';

export const ResumeAnalyzer: React.FC = () => {
  const { user, apiFetch, refreshUser } = useAuth();
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async () => {
    try {
      const data = await apiFetch('/api/resume/profile');
      if (data.analysis) {
        setAnalysis(data.analysis);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim() || resumeText.length < 50) {
      setError('Please provide at least 50 characters of resume copy or bullet coordinates.');
      return;
    }
    setError(null);
    setAnalyzing(true);

    try {
      const data = await apiFetch('/api/resume/analyze', {
        method: 'POST',
        body: JSON.stringify({ resumeText })
      });
      setAnalysis(data.analysis);
      await refreshUser(); // Hot reload overall readiness metrics
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Verification of resume elements timed out under model limits.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center font-mono text-xs text-[#8E8E93]">Initializing Resume environments...</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="border-b border-[#1C1C1E] pb-6">
        <h1 className="font-sans text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5 md:text-3xl">
          <FileSearch className="h-7 w-7 text-[#E5E5E7] group-hover:text-emerald-400 animate-pulse" />
          <span>Resume Bullet STAR improver</span>
        </h1>
        <p className="text-xs text-[#8E8E93] mt-1.5 leading-relaxed">
          Paste plain text resumes or direct achievements below. CodeMentor AI analyzes your copy for crucial technical keyword gaps and structures flat achievements into high-impact metrics bullets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Paste Area and Trigger Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-6 shadow-xs flex flex-col">
            <h3 className="font-sans text-white font-semibold text-sm mb-4 border-b border-[#1C1C1E] pb-3 flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-emerald-400" />
              <span>Diagnostic bullet sandbox</span>
            </h3>

            <form onSubmit={handleAnalyze} className="space-y-4">
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder={`Ada Lovelace\nFullstack Software Developer\n- Engineered the internal API backend interfaces\n- Managed database systems\n- Refactored UI layouts using styling libraries`}
                rows={11}
                className="w-full bg-[#0E0E10] border border-[#2D2D30] p-4 rounded-xl focus:outline-hidden focus:border-emerald-500 font-mono text-xs leading-relaxed resize-y text-[#E5E5E7]"
              />

              <div className="flex items-center justify-between pt-2 border-t border-[#1C1C1E]">
                <span className="text-[10.5px] font-mono text-[#8E8E93]">Paste bullet lists to convert into STAR layouts.</span>
                <button
                  type="submit"
                  disabled={analyzing}
                  className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black px-4.5 py-2.5 text-xs font-bold transition shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Optimizing Bullets...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Analyze Resume Gaps</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-4 rounded-lg border border-rose-500/10 bg-rose-500/5 p-3.5 text-xs text-rose-400">
                {error}
              </div>
            )}
          </div>

          {/* STAR Bullets comparison */}
          {analysis && (
            <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-6 shadow-xs space-y-5">
              <h3 className="font-sans text-white font-bold text-sm border-b border-[#1C1C1E] pb-3 flex items-center gap-2">
                <TrendingUp className="h-4.5 w-4.5 text-emerald-400" />
                <span>Bullet-By-Bullet STAR Transformations</span>
              </h3>

              <div className="space-y-4">
                {analysis.starImprovements.map((imp, idx) => (
                  <div key={idx} className="rounded-xl border border-[#1C1C1E] bg-[#141416]/75 p-5 relative font-sans">
                    <span className="absolute top-3 right-4 font-mono text-[10.5px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded leading-none">Flat achievement</span>
                    
                    <div className="space-y-4 mt-2">
                      <div>
                        <p className="text-xs text-[#8E8E93] max-w-[80%] italic select-all">
                          "{imp.original}"
                        </p>
                      </div>

                      <div className="border-t border-[#1C1C1E]/50 pt-3 relative">
                        <span className="absolute top-3 right-0 font-mono text-[10.5px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 px-1.5 py-0.5 rounded leading-none">STAR structure</span>
                        <h4 className="text-xs font-bold text-emerald-400 mb-1.5 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          <span>Silicon Valley standard</span>
                        </h4>
                        <p className="text-xs font-semibold text-white pr-20 leading-relaxed select-all">
                          "{imp.improved}"
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Scoring & Keyword Gaps side panel */}
        <div className="lg:col-span-1 space-y-6">
          {analysis ? (
            <>
              {/* Score Display Card */}
              <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-6 text-center shadow-xs flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 font-mono font-extrabold text-xl shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  {analysis.score}%
                </div>
                <h3 className="font-sans font-bold text-white text-sm">Resume Alignment Rating</h3>
                <p className="text-[11px] text-[#8E8E93] mt-1 pr-1.5 leading-relaxed">Your resume copy aggregates general FAANG parameters benchmarks.</p>
              </div>

              {/* Keyword Gaps Tag block */}
              <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-5 shadow-xs">
                <h3 className="font-sans text-[#E5E5E7] font-semibold text-xs mb-3 border-b border-[#1C1C1E] pb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-[#8E8E93]" />
                  <span>Crucial Keyword Gaps</span>
                </h3>
                <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10.5px]">
                  {analysis.keywordGaps.map((tag) => (
                    <span key={tag} className="text-[#AEAEB2] bg-[#1C1C1E] border border-[#2D2D30] rounded px-2.5 py-1 font-semibold hover:border-emerald-500/30 transition">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-[9.5px] text-[#8E8E93] mt-3 leading-relaxed font-sans">
                  Adding operations configurations matching these keywords can raise matching parameters on screeners filters.
                </p>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-[#2D2D30] border-dashed bg-[#141416]/20 p-8 text-center">
              <FileSearch className="h-10 w-10 text-[#8E8E93] mx-auto mb-3 opacity-50" />
              <h3 className="font-sans font-bold text-white text-sm">Awaiting diagnostic parameters</h3>
              <p className="text-xs text-[#8E8E93] mt-1 leading-relaxed limit">
                Input flat bullets to instantly compile Silicon Valley STAR conversions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ResumeAnalyzer;
