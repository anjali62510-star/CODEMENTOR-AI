import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FileSearch, 
  Sparkles, 
  Loader2, 
  CheckCircle, 
  Award, 
  TrendingUp,
  AlertCircle,
  Upload,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Wrench,
  Tags,
  Waves,
  Anchor,
  Compass,
  Ship,
  Compass as CompassIcon,
  Search,
  CheckCircle2,
  AlertTriangle,
  Wifi
} from 'lucide-react';
import { OceanPageShell, OceanPageHeader, OceanLoadingScreen } from '../components/ocean/OceanUI';

interface ResumeAnalysisExpanded {
  _id: string;
  userId: string;
  overallScore: number;
  grammarScore: number;
  keywordMatchScore: number;
  formatScore: number;
  parsedSkills: string[];
  gapAnalysis: string[];
  tips: string[];
  enhancedBullets: { original: string; enhanced: string; reason: string }[];
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  improvements: string[];
  skillsIdentified: string[];
  createdAt: string;
}

export const ResumeAnalyzer: React.FC = () => {
  const { user, apiFetch, refreshUser } = useAuth();
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysisExpanded | null>(null);
  const [pastAnalyses, setPastAnalyses] = useState<ResumeAnalysisExpanded[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Drag and drop states
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAnalyses = async () => {
    try {
      const data = await apiFetch('/api/resume/analyses');
      if (data.analyses && data.analyses.length > 0) {
        // Retrieve the latest analysis
        setAnalysis(data.analyses[data.analyses.length - 1]);
        setPastAnalyses(data.analyses);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const handleAnalyze = async (textToAnalyze: string) => {
    if (!textToAnalyze.trim() || textToAnalyze.length < 50) {
      setError('Please provide at least 50 characters of resume copy or bullet coordinates.');
      return;
    }
    setError(null);
    setAnalyzing(true);

    try {
      const data = await apiFetch('/api/resume/analyze', {
        method: 'POST',
        body: JSON.stringify({ resumeText: textToAnalyze })
      });
      if (data.analysis) {
        setAnalysis(data.analysis);
        const { triggerConfetti, triggerXpGain, triggerBadgeUnlock } = await import('../components/Celebration');
        triggerConfetti(3000);
        triggerXpGain(200, 'Sonar ATS Coordinates mapped on Radar Grid');
        triggerBadgeUnlock('Radar Alignments Specialist 📡', `Radar alignment complete! Your candidate visibility grade stands at ${data.analysis.overallScore}%. Nautical optimizations are compiled.`, 'award');
        // Reload history
        fetchAnalyses();
        await refreshUser(); // Update overall readiness metrics
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Verification of resume elements timed out under model limits.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAnalyze(resumeText);
  };

  // Drag and Drop listeners
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (!file) return;
    
    if (file.type !== "text/plain" && !file.name.endsWith('.txt')) {
      setError("To guarantee perfect privacy parsing inside the browser, we support direct upload of standard plain text (.txt) files. For other formats (PDF, DOCX), please copy and paste the contents directly into the sandbox below.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        setResumeText(text);
        setError(null);
        // Automatically submit for analysis if long enough
        if (text.length >= 50) {
          handleAnalyze(text);
        } else {
          setError("File loaded successfully, but requires at least 50 characters before analyzing.");
        }
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return <OceanLoadingScreen message="Calibrating Recruiter Radar matrices..." />;
  }

  const atsScore = analysis ? (analysis.overallScore || 0) : 0;

  return (
    <OceanPageShell>
      <OceanPageHeader
        title="Recruiter Radar"
        subtitle="SONAR-scan your resume depth, map skill signals, and align with recruiter harbor checkpoints."
        icon={FileSearch}
        badge="ATS SONAR"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Middle Upload & Input area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* File Upload Zone */}
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`
              rounded-3xl border border-dashed transition-all duration-350 p-8 text-center bg-white dark:bg-[#061524]/30 relative overflow-hidden
              ${dragActive ? 'border-[#00B8D9] bg-cyan-100/10' : 'border-[#D2E1ED] dark:border-[#123456] hover:border-[#00B8D9]/40'}
            `}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              accept=".txt"
              onChange={handleFileChange}
            />

            <Upload className="h-9 w-9 text-[#00B8D9] mx-auto mb-3 opacity-80" />
            <h3 className="font-sans font-black text-[#0A2540] dark:text-white text-sm mb-1">Drag & drop plain-text Resume copy</h3>
            <p className="text-xs text-[#5C768D] dark:text-cyan-300 max-w-md mx-auto mb-4 leading-relaxed font-semibold">
              Supports plain-text <code className="font-mono text-cyan-800 bg-cyan-100/60 dark:text-cyan-300 dark:bg-cyan-500/10 px-1 py-0.5 rounded text-[10px] font-bold">.txt</code> files for parsing or paste direct STAR bullet formulas in the dock console below.
            </p>

            <button
              onClick={onButtonClick}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D2E1ED] dark:border-[#123456] bg-white dark:bg-[#061524] hover:bg-slate-50 text-[#0A2540] dark:text-[#E5E5E7] px-4.5 py-2.5 text-xs font-bold transition cursor-pointer shadow-xs"
            >
              <FileText className="h-4 w-4 text-[#00B8D9]" />
              <span>Select Plain Text Log</span>
            </button>
          </div>

          {/* Paste Input Sandbox */}
          <div className="premium-card p-6 shadow-xs flex flex-col bg-white dark:bg-[#061524]/60">
            <h3 className="font-display text-[#0A2540] dark:text-white font-bold text-sm mb-4 border-b border-[#D2E1ED]/30 dark:border-[#123456]/40 pb-3 flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-[#00B8D9]" />
              <span>Interactive Sonar Bullet Sandbox</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder={`--- MERIDIAN DEVELOPMENT LOGS ---\n\nPROFESSIONAL SUMMARY:\nHighly focused maritime client stack backend systems engineer.\n\nEXPERIENCE & BULLETS:\n- Helped build a custom dashboard for client management\n- Managed database engines\n- Refactored weak frontend stylesheet code`}
                rows={9}
                className="w-full bg-[#F8FAFC] dark:bg-[#030D18] border border-[#D2E1ED] dark:border-[#123456] p-4 rounded-xl focus:outline-hidden focus:border-[#00B8D9] font-mono text-xs leading-relaxed resize-y text-[#0A2540] dark:text-white font-semibold"
              />

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#123456]/40">
                <span className="text-[10.5px] font-mono text-[#5C768D] dark:text-cyan-405">Input bullet matrices or full summaries above.</span>
                <button
                  type="submit"
                  disabled={analyzing}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00B8D9] to-[#0F4C81] text-white px-5 py-2.5 text-xs font-bold transition shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-cyan-200" />
                      <span>Transcribing Signals...</span>
                    </>
                  ) : (
                    <>
                      <CompassIcon className="h-4 w-4 animate-spin" style={{ animationDuration: '30s' }} />
                      <span>Ping Radar Diagnostics</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-4 rounded-xl border border-rose-500/15 bg-rose-500/5 p-3.5 text-xs text-rose-500 font-bold font-mono">
                {error}
              </div>
            )}
          </div>

          {/* STAR Bullets comparison */}
          {analysis && analysis.enhancedBullets && (
            <div className="premium-card p-6 shadow-xs space-y-5 bg-white dark:bg-[#061524]/60">
              <h3 className="font-display text-[#0A2540] dark:text-white font-bold text-sm border-b border-[#D2E1ED]/30 dark:border-[#123456]/40 pb-3 flex items-center gap-2">
                <TrendingUp className="h-4.5 w-4.5 text-[#00B8D9]" />
                <span>Radar Coordinates: STAR Alignment Transformations</span>
              </h3>

              <div className="space-y-4">
                {analysis.enhancedBullets.map((imp, idx) => (
                  <div key={idx} className="rounded-2xl border border-[#D2E1ED] dark:border-[#123456] bg-slate-50/50 dark:bg-zinc-950/40 p-5 relative font-sans">
                    <span className="absolute top-3 right-4 font-mono text-[9px] font-bold text-rose-600 bg-rose-500/10 dark:text-rose-455 dark:bg-rose-500/5 border border-rose-500/20 px-1.5 py-0.5 rounded leading-none font-black uppercase">FLAT CURRENT</span>
                    
                    <div className="space-y-4 mt-2">
                      <div>
                        <p className="text-xs text-[#5C768D] dark:text-cyan-150 max-w-[80%] italic font-semibold">
                          "{imp.original}"
                        </p>
                      </div>

                      <div className="border-t border-slate-100 dark:border-[#123456]/30 pt-3 relative">
                        <span className="absolute top-3 right-0 font-mono text-[9px] font-bold text-teal-600 bg-teal-50 dark:text-[#2DD4BF] dark:bg-teal-500/10 border border-teal-500/20 px-1.5 py-0.5 rounded leading-none font-black uppercase">STAR CONVERSION</span>
                        <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400 mb-1.5 flex items-center gap-1.5">
                          <CheckCircle className="h-4 w-4 text-teal-500" />
                          <span>Silicon Valley Vessel Benchmarks</span>
                        </h4>
                        <p className="text-xs font-extrabold text-[#0D2E4D] dark:text-white pr-24 leading-relaxed">
                          "{imp.enhanced}"
                        </p>
                        <p className="text-[10.5px] text-[#5C768D] dark:text-slate-400 leading-relaxed mt-2.5 font-mono select-none">
                          <strong className="text-[#0F4C81] dark:text-cyan-305 uppercase font-sans tracking-wide text-[9px] block mb-0.5 font-extrabold">Tactical sonar coordinate logic:</strong>
                          {imp.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right side diagnostics panel widgets */}
        <div className="lg:col-span-1 space-y-6">
          {analysis ? (
            <>
              {/* ATS Gauge Display Card */}
              <div className="premium-card p-6 flex flex-col items-center text-center bg-white dark:bg-[#061524]/60">
                <div className="relative flex items-center justify-center mb-4">
                  {/* Score circle SVG */}
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" className="stroke-current text-slate-100 dark:text-[#123456]" strokeWidth="6" fill="transparent" />
                    <circle cx="48" cy="48" r="40" className="stroke-current text-[#00B8D9]" strokeWidth="6" fill="transparent" 
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * atsScore) / 100}
                    />
                  </svg>
                  <span className="absolute font-mono font-black text-xl text-[#0A2540] dark:text-white">{atsScore}%</span>
                </div>
                <h3 className="font-display font-bold text-[#0A2540] dark:text-white text-sm">Radar Visibility Score</h3>
                <p className="text-[11px] text-[#5C768D] dark:text-cyan-100 mt-1 pr-1.5 leading-relaxed font-semibold">
                  Your coordinates satisfy roughly <strong className="text-[#00B8D9]">{atsScore}%</strong> of automatic digital system recruiter radars.
                </p>

                {/* Specific score subsets */}
                <div className="grid grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-slate-100 dark:border-[#123456]/40 w-full font-mono text-[9px] font-bold">
                  <div>
                    <span className="block text-[#0A2540] dark:text-white font-extrabold text-xs">{analysis.grammarScore || 85}%</span>
                    <span className="text-[#5C768D] dark:text-slate-500 uppercase">Grammar</span>
                  </div>
                  <div>
                    <span className="block text-[#0A2540] dark:text-white font-extrabold text-xs">{analysis.keywordMatchScore || 60}%</span>
                    <span className="text-[#5C768D] dark:text-slate-500 uppercase font-black">Signals</span>
                  </div>
                  <div>
                    <span className="block text-[#0A2540] dark:text-white font-extrabold text-xs">{analysis.formatScore || 70}%</span>
                    <span className="text-[#5C768D] dark:text-slate-505 uppercase font-bold">Grid</span>
                  </div>
                </div>
              </div>

              {/* Identified skills list */}
              {analysis.skillsIdentified && (
                <div className="premium-card p-5 space-y-3 bg-white dark:bg-[#061524]/60">
                   <h3 className="font-display text-[#0A2540] dark:text-white font-bold text-xs border-b border-slate-100 dark:border-[#123456]/40 pb-2 flex items-center gap-2">
                    <Tags className="h-4.5 w-4.5 text-[#00B8D9]" />
                    <span>Marine Opportunity Hotspots</span>
                  </h3>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[9.5px]">
                    {analysis.skillsIdentified.map((sk) => (
                      <span key={sk} className="text-[#0D2E4D] dark:text-cyan-200 bg-[#EAF2F8] dark:bg-[#123456]/50 border border-cyan-200 dark:border-cyan-455/10 rounded px-2 py-1 font-bold">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Crucial Keyword Gaps */}
              <div className="premium-card p-5 space-y-3 bg-white dark:bg-[#061524]/60">
                <h3 className="font-display text-[#0A2540] dark:text-white font-bold text-xs border-b border-slate-100 dark:border-[#123456]/40 pb-2 flex items-center gap-2">
                  <AlertCircle className="h-4.5 w-4.5 text-[#00B8D9]" />
                  <span>Missing Skill Signals</span>
                </h3>
                <div className="flex flex-wrap gap-1.5 font-mono text-[9.5px]">
                  {(analysis.missingKeywords || analysis.gapAnalysis || []).map((tag) => (
                    <span key={tag} className="text-rose-600 bg-rose-50 border border-rose-100 dark:text-rose-400 dark:bg-rose-500/5 dark:border-rose-500/10 rounded px-2.5 py-1 font-extrabold">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-[#5C768D] dark:text-slate-500 leading-relaxed font-sans pt-1 font-semibold">
                  Injecting these key coordinate indicators directly boosts ATS radar echo metrics.
                </p>
              </div>

              {/* Key Strengths & Weaknesses */}
              <div className="premium-card p-5 space-y-4 bg-white dark:bg-[#061524]/60">
                {/* Strengths */}
                {analysis.strengths && (
                  <div>
                    <h4 className="font-display text-[#0A2540] dark:text-[#E2E2E2] font-semibold text-xs border-b border-slate-100 dark:border-[#123456]/30 pb-2 flex items-center gap-2">
                      <ThumbsUp className="h-4 w-4 text-teal-500" />
                      <span>Nautical Strengths</span>
                    </h4>
                    <ul className="space-y-1.5 pt-2.5 font-sans text-xs text-[#5C768D] dark:text-cyan-100 leading-relaxed pl-1 font-semibold">
                      {analysis.strengths.slice(0, 3).map((st, i) => (
                        <li key={i} className="flex gap-2">
                          <CheckCircle className="h-4 w-4 text-[#2DD4BF] shrink-0 mt-0.5" />
                          <span>{st}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Weaknesses */}
                {analysis.weaknesses && (
                  <div>
                    <h4 className="font-display text-[#0A2540] dark:text-[#E2E2E2] font-semibold text-xs border-b border-slate-100 dark:border-[#123456]/30 pb-2 flex items-center gap-2">
                      <ThumbsDown className="h-4 w-4 text-rose-500" />
                      <span>Reef Hazard Vulnerabilities</span>
                    </h4>
                    <ul className="space-y-1.5 pt-2.5 font-sans text-xs text-[#5C768D] dark:text-cyan-100 leading-relaxed pl-1 font-semibold">
                      {analysis.weaknesses.slice(0, 3).map((wk, i) => (
                        <li key={i} className="flex gap-2">
                          <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                          <span>{wk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Checklist Suggestions */}
              {analysis.improvements && (
                <div className="premium-card p-5 space-y-3.5 bg-white dark:bg-[#061524]/60">
                  <h3 className="font-display text-[#0A2540] dark:text-white font-bold text-xs border-b border-slate-100 dark:border-[#123456]/30 pb-2 flex items-center gap-2">
                    <Wrench className="h-4.5 w-4.5 text-[#00B8D9]" />
                    <span>Voyage Adjustments Checklist</span>
                  </h3>
                  <div className="space-y-2.5 pt-1.5 font-sans text-xs font-semibold">
                    {analysis.improvements.slice(0, 3).map((tip, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-100/50 dark:bg-[#123456]/50 border border-cyan-200/40 dark:border-[#123456]/30 text-[#0F4C81] dark:text-cyan-300 text-[10px] font-bold shrink-0 mt-0.5 select-all">
                          {i + 1}
                        </span>
                        <p className="text-[#5C768D] dark:text-cyan-100 leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="premium-card border-dashed p-8 text-center bg-white dark:bg-[#061524]/30">
              <FileSearch className="h-10 w-10 text-[#00B8D9] mx-auto mb-3 opacity-60 animate-bounce" />
              <h3 className="font-display font-bold text-[#0A2540] dark:text-white text-sm">Awaiting console coordinates</h3>
              <p className="text-xs text-[#5C768D] dark:text-cyan-300 mt-1.5 leading-relaxed font-semibold">
                Submit bullet points or load text records. Radar deep scans generate detailed OPPORTUNITY assessments here.
              </p>
            </div>
          )}
        </div>
      </div>
    </OceanPageShell>
  );
};

export default ResumeAnalyzer;
