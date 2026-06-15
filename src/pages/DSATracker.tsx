import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DSAPicture } from '../types';
import { 
  Code2, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Command, 
  Terminal, 
  BookOpen, 
  Cpu, 
  History 
} from 'lucide-react';

interface CodeFeedback {
  status: string;
  timeComplexity: string;
  spaceComplexity: string;
  correctnessScore: number;
  performanceScore: number;
  criticalIssues: string[];
  improvements: string[];
}

export const DSATracker: React.FC = () => {
  const { user, apiFetch, refreshUser } = useAuth();
  const [dsaData, setDsaData] = useState<DSAPicture | null>(null);
  const [loading, setLoading] = useState(true);
  const [solving, setSolving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [problemName, setProblemName] = useState('Two Sum');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [language, setLanguage] = useState('TypeScript');
  const [codeSolution, setCodeSolution] = useState(`// Implement your function here\nfunction twoSum(nums: number[], target: number): number[] {\n    const map = new Map<number, number>();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement)!, i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}`);
  const [feedback, setFeedback] = useState<CodeFeedback | null>(null);

  const sampleProblems = [
    { name: 'Two Sum', diff: 'Easy', boilerplate: `// Implement your function here\nfunction twoSum(nums: number[], target: number): number[] {\n    const map = new Map<number, number>();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement)!, i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}` },
    { name: 'Group Anagrams', diff: 'Medium', boilerplate: `// Group anagrams of string arrays\nfunction groupAnagrams(strs: string[]): string[][] {\n    const map = new Map<string, string[]>();\n    for (const s of strs) {\n        const sorted = s.split('').sort().join('');\n        if (!map.has(sorted)) map.set(sorted, []);\n        map.get(sorted)!.push(s);\n    }\n    return Array.from(map.values());\n}` },
    { name: 'Valid Parentheses', diff: 'Easy', boilerplate: `// Validate nested brackets\nfunction isValid(s: string): boolean {\n    const stack: string[] = [];\n    const closeToOpen: { [key: string]: string } = { ')': '(', '}': '{', ']': '[' };\n    for (const c of s) {\n        if (closeToOpen[c]) {\n            if (stack.length && stack[stack.length - 1] === closeToOpen[c]) {\n                stack.pop();\n            } else return false;\n        } else {\n            stack.push(c);\n        }\n    }\n    return stack.length === 0;\n}` },
    { name: 'LRU Cache', diff: 'Hard', boilerplate: `// Design LRU Cache structures\nclass LRUCache {\n    private capacity: number;\n    private map = new Map<number, number>();\n    constructor(capacity: number) {\n        this.capacity = capacity;\n    }\n    get(key: number): number {\n        if (!this.map.has(key)) return -1;\n        const val = this.map.get(key)!;\n        this.map.delete(key);\n        this.map.set(key, val);\n        return val;\n    }\n    put(key: number, value: number): void {\n        this.map.delete(key);\n        this.map.set(key, value);\n        if (this.map.size > this.capacity) {\n            const first = this.map.keys().next().value;\n            this.map.delete(first);\n        }\n    }\n}` }
  ];

  const fetchDsaProfile = async () => {
    try {
      const data = await apiFetch('/api/dsa/profile');
      if (data.dsa) {
        setDsaData(data.dsa);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDsaProfile();
  }, []);

  const handleProblemChange = (name: string) => {
    setProblemName(name);
    const prob = sampleProblems.find(p => p.name === name);
    if (prob) {
      setDifficulty(prob.diff as any);
      setCodeSolution(prob.boilerplate);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeSolution.trim() || codeSolution.length < 20) {
      setError('Please provide a complete meaningful problem solution.');
      return;
    }
    setError(null);
    setSolving(true);
    setFeedback(null);

    try {
      const data = await apiFetch('/api/dsa/submit', {
        method: 'POST',
        body: JSON.stringify({
          problemName,
          difficulty,
          language,
          codeSolution
        })
      });
      setFeedback(data.feedback);
      await fetchDsaProfile(); // Refresh list solves history
      await refreshUser(); // Refresh unified dashboard scores
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred compiling algorithms evaluation.');
    } finally {
      setSolving(false);
    }
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center font-mono text-xs text-[#8E8E93]">Initializing analytics playground...</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="border-b border-[#1C1C1E] pb-6">
        <h1 className="font-sans text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5 md:text-3xl">
          <Code2 className="h-7 w-7 text-emerald-400 group-hover:text-emerald-300" />
          <span>Algorithms Practice Playground</span>
        </h1>
        <p className="text-xs text-[#8E8E93] mt-1.5 leading-relaxed">
          Solve algorithmic issues, test edge cases, and examine visual complexities through Node container telemetry. Let AI audit computational performance profiles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Code Editor Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-6 flex flex-col shadow-xs">
            <h3 className="font-sans text-[#E5E5E7] font-semibold text-sm mb-4 flex items-center gap-2 border-b border-[#1C1C1E] pb-3">
              <Terminal className="h-4 w-4 text-[#8E8E93]" />
              <span>Diagnostic sandbox editor</span>
            </h3>

            {/* Select problem variables */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 font-sans">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono text-[#8E8E93] uppercase tracking-wider">Problem template</label>
                <select
                  value={problemName}
                  onChange={(e) => handleProblemChange(e.target.value)}
                  className="bg-[#1C1C1E] border border-[#2D2D30] text-xs font-semibold text-white px-2 py-1.5 rounded-lg focus:outline-hidden"
                >
                  {sampleProblems.map(p => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono text-[#8E8E93] uppercase tracking-wider">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-[#1C1C1E] border border-[#2D2D30] text-xs font-semibold text-white px-2 py-1.5 rounded-lg focus:outline-hidden"
                >
                  <option value="TypeScript">TypeScript</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="Python">Python</option>
                  <option value="C++">C++</option>
                  <option value="Java">Java</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono text-[#8E8E93] uppercase tracking-wider">Difficulty</label>
                <span className={`text-xs font-bold leading-none px-3.5 py-2 inline-flex items-center justify-center rounded-lg border text-center font-mono uppercase tracking-wider ${
                  difficulty === 'Easy' ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/25' :
                  difficulty === 'Medium' ? 'text-amber-400 bg-amber-500/5 border-amber-500/25' :
                  'text-rose-500 bg-rose-500/5 border-rose-500/25'
                }`}>
                  {difficulty}
                </span>
              </div>
            </div>

            {/* Main Code Textarea */}
            <div className="relative font-mono text-xs text-[#E5E5E7] mb-5">
              <textarea
                value={codeSolution}
                onChange={(e) => setCodeSolution(e.target.value)}
                rows={16}
                spellCheck={false}
                className="w-full bg-[#0E0E10] border border-[#2D2D30] p-4 rounded-xl focus:outline-hidden focus:border-emerald-500 font-mono leading-relaxed resize-y"
              />
            </div>

            <div className="flex items-center justify-between border-t border-[#1C1C1E] pt-4">
              <span className="text-[10px] font-mono text-[#8E8E93]">Press compiler to analyze space & time metrics.</span>
              <button
                type="button"
                onClick={handleCodeSubmit}
                disabled={solving}
                className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2.5 text-xs font-bold transition shadow-[0_0_15px_rgba(16,185,129,0.25)] disabled:opacity-50"
              >
                {solving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Compiling Solution...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Analyze Code Complexity</span>
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-lg border border-rose-500/15 bg-rose-500/5 p-3.5 text-xs text-rose-400">
                {error}
              </div>
            )}
          </div>

          {/* AI Complexity Compilation Feedback panel */}
          {feedback && (
            <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-[#1C1C1E] pb-3">
                <div className="flex items-center gap-2 font-sans font-bold text-white text-base">
                  <Cpu className="h-4.5 w-4.5 text-emerald-400" />
                  <span>Complexity Audit results</span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded font-mono uppercase border ${
                  feedback.status === 'Accepted' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                }`}>
                  {feedback.status}
                </span>
              </div>

              {/* Big space/time variables */}
              <div className="grid grid-cols-2 gap-4 font-mono select-all">
                <div className="rounded-lg border border-[#262629] bg-[#1B1B1E]/40 p-4 text-center">
                  <span className="block text-white font-extrabold text-lg">{feedback.timeComplexity}</span>
                  <label className="text-[9px] uppercase tracking-wider text-[#8E8E93] mt-0.5 block">Time Complexity Scale</label>
                </div>
                <div className="rounded-lg border border-[#262629] bg-[#1B1B1E]/40 p-4 text-center">
                  <span className="block text-white font-extrabold text-lg">{feedback.spaceComplexity}</span>
                  <label className="text-[9px] uppercase tracking-wider text-[#8E8E93] mt-0.5 block">Space Complexity Scale</label>
                </div>
              </div>

              {/* Gaps / Critical issues details */}
              {feedback.criticalIssues.length > 0 && (
                <div>
                  <h4 className="font-sans font-bold text-white text-xs mb-2">Algorithmic Warnings</h4>
                  <ul className="list-disc list-inside text-xs text-[#8E8E93] space-y-1 pl-1">
                    {feedback.criticalIssues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvements details */}
              <div>
                <h4 className="font-sans font-bold text-white text-xs mb-2">Recommended Code Enhancements</h4>
                <div className="space-y-2">
                  {feedback.improvements.map((imp, idx) => (
                    <p key={idx} className="text-xs text-[#8E8E93] leading-relaxed border-l-2 border-emerald-500/40 pl-3 select-all">
                      {imp}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Categories, solved count & past history logs Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* General progress stats */}
          {dsaData && (
            <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-6 flex flex-col shadow-xs">
              <h3 className="font-sans text-[#E5E5E7] font-semibold text-sm mb-4 border-b border-[#1C1C1E] pb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#8E8E93]" />
                <span>Solved aggregates</span>
              </h3>
              <div className="flex items-baseline gap-1 font-sans">
                <span className="text-4xl font-extrabold text-white tracking-tight">{dsaData.solvedCount}</span>
                <span className="text-[#8E8E93] text-xs font-mono">/ {dsaData.totalCount} Problems</span>
              </div>

              {/* Categories block */}
              <div className="space-y-4 mt-6">
                {dsaData.byCategory.map((cat, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5 font-mono text-[10px]">
                    <div className="flex items-center justify-between text-[#E5E5E7] font-sans text-xs">
                      <span className="font-medium text-white/90">{cat.category}</span>
                      <span className="font-semibold text-emerald-400 font-mono">{cat.solved} / {cat.total}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#1C1C1E] overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-emerald-500/80 transition-all duration-500" 
                        style={{ width: `${(cat.solved / cat.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past Submissions table logs */}
          {dsaData && dsaData.recentSubmissions && (
            <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-5 shadow-xs flex flex-col font-mono text-[10.5px]">
              <h3 className="font-sans text-white font-semibold text-xs mb-3 flex items-center gap-2">
                <History className="h-4.5 w-4.5 text-[#8E8E93]" />
                <span>Submissions History</span>
              </h3>
              <div className="space-y-3 max-h-[280px] overflow-y-auto">
                {dsaData.recentSubmissions.map((sub) => (
                  <div key={sub.id} className="flex items-start justify-between border-b border-[#1C1C1E]/30 pb-2.5 last:border-0 last:pb-0">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-sans text-[11px] font-bold text-[#E5E5E7] truncate max-w-[130px]">{sub.problemName}</span>
                      <span className="text-[#8E8E93] text-[9.5px] font-mono font-medium lowercase tracking-wide">{sub.language} • {sub.difficulty}</span>
                    </div>

                    <div className="text-right">
                      <span className={`inline-flex items-center gap-1 font-bold ${
                        sub.status === 'Accepted' ? 'text-emerald-400' : 'text-rose-500'
                      }`}>
                        {sub.status === 'Accepted' ? (
                          <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.5]" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 stroke-[2.5]" />
                        )}
                        <span>{sub.status === 'Accepted' ? 'PASS' : 'FAIL'}</span>
                      </span>
                      <span className="block text-[9px] text-[#8E8E93] font-normal tracking-tight mt-0.5">
                        {new Date(sub.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default DSATracker;
