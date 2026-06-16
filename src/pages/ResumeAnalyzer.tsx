import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FileSearch, 
  Sparkles, 
  Loader2, 
  CheckCircle, 
  X, 
  Award, 
  ChevronRight, 
  TrendingUp,
  History,
  AlertCircle,
  Upload,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Wrench,
  Tags
} from 'lucide-react';

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
        triggerXpGain(200, 'Resume Action Bullets Analyzed & Optimised');
        triggerBadgeUnlock('ATS Star Optimizer 💎', `Resume analyzed! Your ATS alignment grade is ${data.analysis.overallScore}%. Custom STAR action-verb enhancements have been synthesized!`, 'award');
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
    return <div className="flex h-full items-center justify-center font-mono text-xs text-[#8E8E93]">Initializing Resume environments...</div>;
  }

  // Formatting percentages safely
  const atsScore = analysis ? (analysis.overallScore || 0) : 0;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="border-b border-[#1C1C1E] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5 md:text-3xl">
            <FileSearch className="h-7 w-7 text-emerald-400" />
            <span>AI Resume Analyzer</span>
          </h1>
          <p className="text-xs text-[#8E8E93] mt-1.5 leading-relaxed">
            Upload plain copy or drop professional resume documents. CodeMentor AI analyzes your material for ATS score matches, identifies skill matrices, pinpoint gaps, and builds Silicon-Valley grade STAR bullet transformations.
          </p>
        </div>
      </div>

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
              rounded-xl border border-dashed transition-all duration-300 p-8 text-center bg-[#141416]/20 relative overflow-hidden
              ${dragActive ? 'border-emerald-500 bg-emerald-500/5' : 'border-[#2D2D30] hover:border-emerald-500/40'}
            `}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              accept=".txt"
              onChange={handleFileChange}
            />

            <Upload className="h-9 w-9 text-[#8E8E93] mx-auto mb-3 opacity-60" />
            <h3 className="font-sans font-bold text-white text-sm mb-1">Drag and drop your plain-text Resume</h3>
            <p className="text-xs text-[#8E8E93] max-w-md mx-auto mb-4 leading-medium">
              Accepts plain-text <code className="font-mono text-emerald-400 bg-emerald-500/5 px-1 py-0.5 rounded text-[10px]">.txt</code> files for automatic parsing, or copy-paste directly inside the simulator below.
            </p>

            <button
              onClick={onButtonClick}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#2D2D30] bg-[#1C1C1E] hover:bg-[#252528] text-[#E5E5E7] px-4 py-2 text-xs font-semibold transition"
            >
              <FileText className="h-3.5 w-3.5 text-emerald-400" />
              <span>Select Plain Text File</span>
            </button>
          </div>

          {/* Paste Input Sandbox */}
          <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-6 shadow-xs flex flex-col">
            <h3 className="font-sans text-white font-semibold text-sm mb-4 border-b border-[#1C1C1E] pb-3 flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-emerald-400" />
              <span>Interactive Resume Bullet Sandbox</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder={`--- ADA LOVELACE DEVELOPMENT RESUME ---\n\nPROFESSIONAL SUMMARY:\nHighly focused full-stack systems engineer.\n\nEXPERIENCE & BULLETS:\n- Helped build a custom dashboard for client management\n- Managed database engines\n- Refactored weak frontend stylesheet code`}
                rows={9}
                className="w-full bg-[#0E0E10] border border-[#2D2D30] p-4 rounded-xl focus:outline-hidden focus:border-emerald-500 font-mono text-xs leading-relaxed resize-y text-[#E5E5E7]"
              />

              <div className="flex items-center justify-between pt-2 border-t border-[#1C1C1E]">
                <span className="text-[10.5px] font-mono text-[#8E8E93]">Paste bullet outlines or full copy above.</span>
                <button
                  type="submit"
                  disabled={analyzing}
                  className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black px-4.5 py-2.5 text-xs font-bold transition shadow-[0_0_15px_rgba(16,185,129,0.25)] disabled:opacity-50"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-black" />
                      <span>Decompressing Copy...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Diagnose Gaps & Improve</span>
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
          {analysis && analysis.enhancedBullets && (
            <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-6 shadow-xs space-y-5">
              <h3 className="font-sans text-white font-bold text-sm border-b border-[#1C1C1E] pb-3 flex items-center gap-2">
                <TrendingUp className="h-4.5 w-4.5 text-emerald-400" />
                <span>AI Recommendation: STAR Transformations</span>
              </h3>

              <div className="space-y-4">
                {analysis.enhancedBullets.map((imp, idx) => (
                  <div key={idx} className="rounded-xl border border-[#1C1C1E] bg-[#141416]/75 p-5 relative font-sans">
                    <span className="absolute top-3 right-4 font-mono text-[9px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded leading-none">Flat outline</span>
                    
                    <div className="space-y-4 mt-2">
                      <div>
                        <p className="text-xs text-[#8E8E93] max-w-[80%] italic">
                          "{imp.original}"
                        </p>
                      </div>

                      <div className="border-t border-[#1C1C1E]/50 pt-3 relative">
                        <span className="absolute top-3 right-0 font-mono text-[9px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 px-1.5 py-0.5 rounded leading-none">STAR conversion</span>
                        <h4 className="text-xs font-bold text-emerald-400 mb-1.5 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          <span>Silicon Valley Benchmark</span>
                        </h4>
                        <p className="text-xs font-semibold text-white pr-24 leading-relaxed">
                          "{imp.enhanced}"
                        </p>
                        <p className="text-[10.5px] text-[#8E8E93] leading-relaxed mt-2.5 font-mono select-none">
                          <strong className="text-[#AEAEB2] uppercase font-sans tracking-wide text-[9px] block mb-0.5">Tactical rationale:</strong>
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
              <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-6 shadow-xs flex flex-col items-center text-center">
                <div className="relative flex items-center justify-center mb-4">
                  {/* Score circle SVG */}
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" className="stroke-current text-[#1C1C1E]" strokeWidth="6" fill="transparent" />
                    <circle cx="48" cy="48" r="40" className="stroke-current text-emerald-400" strokeWidth="6" fill="transparent" 
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * atsScore) / 100}
                    />
                  </svg>
                  <span className="absolute font-mono font-extrabold text-xl text-white">{atsScore}%</span>
                </div>
                <h3 className="font-sans font-bold text-white text-sm">ATS Relevance Score</h3>
                <p className="text-[11px] text-[#8E8E93] mt-1 pr-1.5 leading-relaxed">
                  Your outline satisfies approximately <strong className="text-emerald-400">{atsScore}%</strong> of automatic FAANG recruiter parsers.
                </p>

                {/* Specific score subsets */}
                <div className="grid grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-[#1C1C1E] w-full font-mono text-[9px]">
                  <div>
                    <span className="block text-white font-bold text-xs">{analysis.grammarScore || 85}%</span>
                    <span className="text-[#8E8E93] uppercase">Grammar</span>
                  </div>
                  <div>
                    <span className="block text-white font-bold text-xs">{analysis.keywordMatchScore || 60}%</span>
                    <span className="text-[#8E8E93] uppercase">Keywords</span>
                  </div>
                  <div>
                    <span className="block text-white font-bold text-xs">{analysis.formatScore || 70}%</span>
                    <span className="text-[#8E8E93] uppercase">Format</span>
                  </div>
                </div>
              </div>

              {/* Identified skills list */}
              {analysis.skillsIdentified && (
                <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-5 shadow-xs space-y-3">
                  <h3 className="font-sans text-[#E5E5E7] font-semibold text-xs border-b border-[#1C1C1E] pb-2 flex items-center gap-2">
                    <Tags className="h-4 w-4 text-[#8E8E93]" />
                    <span>Identified Skill Matrices</span>
                  </h3>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[9.5px]">
                    {analysis.skillsIdentified.map((sk) => (
                      <span key={sk} className="text-[#E5E5E7] bg-[#1C1C1E] border border-[#2D2D30] rounded px-2 py-0.5">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Crucial Keyword Gaps */}
              <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-5 shadow-xs space-y-3">
                <h3 className="font-sans text-[#E5E5E7] font-semibold text-xs border-b border-[#1C1C1E] pb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-[#8E8E93]" />
                  <span>Crucial Keyword Gaps</span>
                </h3>
                <div className="flex flex-wrap gap-1.5 font-mono text-[9.5px]">
                  {(analysis.missingKeywords || analysis.gapAnalysis || []).map((tag) => (
                    <span key={tag} className="text-rose-400 bg-rose-500/5 border border-rose-500/10 rounded px-2.5 py-1 font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-[#8E8E93] leading-relaxed font-sans pt-1">
                  Injecting cloud orchestrators configure keywords directly improves matching metrics.
                </p>
              </div>

              {/* Key Strengths & Weaknesses */}
              <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-5 shadow-xs space-y-4">
                {/* Strengths */}
                {analysis.strengths && (
                  <div>
                    <h4 className="font-sans text-[#E5E5E7] font-semibold text-xs border-b border-[#1C1C1E] pb-2 flex items-center gap-2">
                      <ThumbsUp className="h-4 w-4 text-[#8E8E93]" />
                      <span>Resume Core Strengths</span>
                    </h4>
                    <ul className="space-y-1.5 pt-2.5 font-sans text-xs text-[#8E8E93] leading-relaxed pl-1">
                      {analysis.strengths.slice(0, 3).map((st, i) => (
                        <li key={i} className="flex gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{st}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Weaknesses */}
                {analysis.weaknesses && (
                  <div>
                    <h4 className="font-sans text-[#E5E5E7] font-semibold text-xs border-b border-[#1C1C1E] pb-2 flex items-center gap-2">
                      <ThumbsDown className="h-4 w-4 text-rose-400" />
                      <span>Evaluated Flaws / Vulnerabilities</span>
                    </h4>
                    <ul className="space-y-1.5 pt-2.5 font-sans text-xs text-[#8E8E93] leading-relaxed pl-1">
                      {analysis.weaknesses.slice(0, 3).map((wk, i) => (
                        <li key={i} className="flex gap-2">
                          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                          <span>{wk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Checklist Suggestions */}
              {analysis.improvements && (
                <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-5 shadow-xs space-y-3.5">
                  <h3 className="font-sans text-[#E5E5E7] font-semibold text-xs border-b border-[#1C1C1E] pb-2 flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-emerald-400" />
                    <span>Checklist Corrections</span>
                  </h3>
                  <div className="space-y-2.5 pt-1.5 font-sans text-xs">
                    {analysis.improvements.slice(0, 3).map((tip, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 text-[10px] font-bold shrink-0 mt-0.5 select-all">
                          {i + 1}
                        </span>
                        <p className="text-[#AEAEB2] leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-[#2D2D30] border-dashed bg-[#141416]/10 p-8 text-center">
              <FileSearch className="h-10 w-10 text-[#8E8E93] mx-auto mb-3 opacity-50" />
              <h3 className="font-sans font-bold text-white text-sm">Awaiting sandbox outlines</h3>
              <p className="text-xs text-[#8E8E93] mt-1 leading-relaxed leading-medium">
                Submit raw bullet coordinate copy or upload standard text records. Deep scanning models construct extensive diagnostics summaries here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ResumeAnalyzer;
