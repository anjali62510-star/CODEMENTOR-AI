import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DSAPicture } from '../types';
import { motion } from 'motion/react';
import { 
  Code2, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  BookOpen, 
  Cpu, 
  History,
  Flame,
  Award,
  Zap,
  CheckCircle
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemName,
          difficulty,
          language,
          codeSolution
        })
      });
      setFeedback(data.feedback);
      if (data.feedback) {
        const { triggerConfetti, triggerXpGain, triggerBadgeUnlock } = await import('../components/Celebration');
        triggerConfetti(3000);
        triggerXpGain(150, `Successfully compiled ${problemName} (${difficulty})`);
        if (data.feedback.status === 'Accepted' || data.feedback.correctnessScore >= 80) {
          triggerBadgeUnlock('Algorithms Champion 🏆', `Mastered "${problemName}" with a correctness review of ${data.feedback.correctnessScore}% and stellar optimal space-complexity footprint!`, 'star');
        }
      }
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
    return (
      <div className="flex h-64 items-center justify-center font-mono text-xs text-slate-400 dark:text-[#8E8E93]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
          <span>Syncing analytical sandboxes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12 select-none">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-[#1C1C1E] pb-6">
        <h1 className="font-display text-2xl font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-2.5 md:text-3xl">
          <Code2 className="h-7 w-7 text-violet-500" />
          <span>Algorithms Practice Playground</span>
        </h1>
        <p className="text-xs text-slate-400 dark:text-[#8E8E93] mt-1.5 leading-relaxed font-semibold">
          Solve programming puzzles and compile solutions. CodeMentor evaluates computational time-complexities and code structures using Gemini telemetry.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Core Code Editor Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-slate-200 dark:border-[#2D2D30]/60 bg-white dark:bg-[#1E293B]/40 p-6 flex flex-col shadow-xs">
            <h3 className="font-display text-slate-800 dark:text-[#E5E5E7] font-extrabold text-sm mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-[#1C1C1E] pb-3">
              <Terminal className="h-4.5 w-4.5 text-slate-400" />
              <span>Interactive Code Sandbox</span>
            </h3>

            {/* Select problem variables */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5 font-sans">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9.5px] font-mono text-slate-400 dark:text-[#8E8E93] uppercase tracking-wider font-extrabold">Problem template</label>
                <select
                  value={problemName}
                  onChange={(e) => handleProblemChange(e.target.value)}
                  className="bg-slate-50 dark:bg-[#1C1C1E] border border-slate-250 dark:border-[#2D2D30] text-xs font-semibold text-slate-800 dark:text-white px-2.5 py-2.5 rounded-xl focus:outline-hidden cursor-pointer"
                >
                  {sampleProblems.map(p => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9.5px] font-mono text-slate-400 dark:text-[#8E8E93] uppercase tracking-wider font-extrabold">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-slate-50 dark:bg-[#1C1C1E] border border-slate-250 dark:border-[#2D2D30] text-xs font-semibold text-slate-800 dark:text-white px-2.5 py-2.5 rounded-xl focus:outline-hidden cursor-pointer"
                >
                  <option value="TypeScript">TypeScript</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="Python">Python</option>
                  <option value="C++">C++</option>
                  <option value="Java">Java</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9.5px] font-mono text-slate-400 dark:text-[#8E8E93] uppercase tracking-wider font-extrabold">Difficulty Level</label>
                <span className={`text-[10.5px] font-extrabold leading-none px-3 py-2.5 inline-flex items-center justify-center rounded-xl border text-center font-mono uppercase tracking-wider ${
                  difficulty === 'Easy' ? 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/5 dark:border-emerald-500/20' :
                  difficulty === 'Medium' ? 'text-amber-600 bg-amber-50 border-amber-100 dark:text-amber-400 dark:bg-amber-500/5 dark:border-amber-500/20' :
                  'text-rose-600 bg-rose-50 border-rose-100 dark:text-rose-450 dark:bg-rose-500/5 dark:border-rose-500/20'
                }`}>
                  {difficulty}
                </span>
              </div>
            </div>

            {/* Main Code Textarea */}
            <div className="relative font-mono text-xs text-slate-800 dark:text-[#E5E5E7] mb-5">
              <textarea
                value={codeSolution}
                onChange={(e) => setCodeSolution(e.target.value)}
                rows={14}
                spellCheck={false}
                className="w-full bg-slate-50 dark:bg-[#0E0E10] border border-slate-200 dark:border-[#2D2D30] p-4 rounded-2xl focus:outline-hidden focus:border-violet-500/40 dark:focus:border-violet-500 font-mono leading-relaxed resize-y select-text font-bold"
              />
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-[#1C1C1E]/70 pt-4">
              <span className="text-[9.5px] font-mono text-slate-400 dark:text-[#8E8E93] font-bold">CodeMentor Sandbox Compiler active.</span>
              <motion.button
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={handleCodeSubmit}
                disabled={solving}
                className="flex items-center justify-center gap-2 rounded-full cursor-pointer bg-gradient-to-r from-violet-500 to-indigo-600 text-white px-5 py-2.5 text-xs font-bold transition shadow-xs hover:shadow-md disabled:opacity-50"
              >
                {solving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Compiling Solution...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4.5 w-4.5 animate-pulse" />
                    <span>Compile Solution</span>
                  </>
                )}
              </motion.button>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-rose-500/15 bg-rose-500/5 p-3.5 text-xs text-rose-500 font-mono font-bold">
                {error}
              </div>
            )}
          </div>

          {/* AI Complexity Compilation Feedback panel */}
          {feedback && (
            <div className="rounded-3xl border border-slate-200 dark:border-[#2D2D30]/60 bg-white dark:bg-[#1E293B]/40 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1C1C1E] pb-3">
                <div className="flex items-center gap-2 font-display font-extrabold text-slate-800 dark:text-white text-base">
                  <Cpu className="h-4.5 w-4.5 text-violet-500" />
                  <span>Complexity Audit results</span>
                </div>
                <span className={`text-[10.5px] font-extrabold px-2.5 py-0.8 rounded-md font-mono uppercase border ${
                  feedback.status === 'Accepted' ? 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20' : 'text-amber-655 bg-amber-50 border-amber-100 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20'
                }`}>
                  {feedback.status}
                </span>
              </div>

              {/* Big space/time variables */}
              <div className="grid grid-cols-2 gap-4 font-mono select-all">
                <div className="rounded-2xl border border-slate-150 dark:border-[#262629] bg-slate-50/70 dark:bg-[#1B1B1E]/40 p-4 text-center">
                  <span className="block text-slate-800 dark:text-white font-black text-xl">{feedback.timeComplexity}</span>
                  <label className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-[#8E8E93] mt-1 block font-bold">Time Complexity Scale</label>
                </div>
                <div className="rounded-2xl border border-slate-150 dark:border-[#262629] bg-slate-50/70 dark:bg-[#1B1B1E]/40 p-4 text-center">
                  <span className="block text-slate-800 dark:text-white font-black text-xl">{feedback.spaceComplexity}</span>
                  <label className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-[#8E8E93] mt-1 block font-bold">Space Complexity Scale</label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 font-mono select-all">
                <div className="rounded-2xl border border-slate-150 dark:border-[#262629] bg-slate-50/70 dark:bg-[#1B1B1E]/40 p-3.5 text-center">
                  <span className="block text-emerald-600 dark:text-emerald-400 font-extrabold text-lg">{feedback.correctnessScore}%</span>
                  <label className="text-[9.5px] uppercase tracking-wider text-slate-400 dark:text-[#8E8E93] mt-0.5 block font-bold">Correctness Audit</label>
                </div>
                <div className="rounded-2xl border border-slate-150 dark:border-[#262629] bg-slate-50/70 dark:bg-[#1B1B1E]/40 p-3.5 text-center">
                  <span className="block text-emerald-600 dark:text-emerald-400 font-extrabold text-lg">{feedback.performanceScore}%</span>
                  <label className="text-[9.5px] uppercase tracking-wider text-slate-400 dark:text-[#8E8E93] mt-0.5 block font-bold">Efficiency Audit</label>
                </div>
              </div>

              {/* Gaps / Critical issues details */}
              {feedback.criticalIssues.length > 0 && (
                <div className="pt-2 select-text">
                  <h4 className="font-mono text-[9.5px] uppercase tracking-wider text-rose-500 mb-2 flex items-center gap-1.5 font-bold">
                    <XCircle className="h-4 w-4" />
                    <span>Algorithmic Warnings</span>
                  </h4>
                  <ul className="list-disc list-inside text-xs text-slate-500 dark:text-[#8E8E93] space-y-1.5 pl-1.5 font-semibold">
                    {feedback.criticalIssues.map((issue, idx) => (
                      <li key={idx} className="leading-relaxed">{issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvements details */}
              {feedback.improvements.length > 0 && (
                <div className="pt-2 select-text">
                  <h4 className="font-mono text-[9.5px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1.5 font-bold">
                    <CheckCircle className="h-4 w-4" />
                    <span>Recommended Code Enhancements</span>
                  </h4>
                  <div className="space-y-2.5">
                    {feedback.improvements.map((imp, idx) => (
                      <p key={idx} className="text-xs text-slate-550 dark:text-[#8E8E93] leading-relaxed border-l-2 border-emerald-500 pl-3 select-all font-semibold">
                        {imp}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Categories, solved count & past history logs Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* General progress stats */}
          {dsaData && (
            <div className="rounded-3xl border border-slate-200 dark:border-[#2D2D30]/60 bg-white dark:bg-[#1E293B]/40 p-6 flex flex-col shadow-xs">
              <h3 className="font-display text-slate-800 dark:text-[#E5E5E7] font-extrabold text-sm mb-4 border-b border-slate-100 dark:border-[#1C1C1E]/60 pb-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4.5 w-4.5 text-slate-400" />
                  <span>Solved Aggregates</span>
                </span>
                
                {/* Flame element for streak */}
                <div className="flex items-center gap-1 text-orange-500 font-mono text-xs font-extrabold animate-pulse">
                  <Flame className="h-4.5 w-4.5 fill-orange-500/10" />
                  <span>{dsaData.currentStreak || 12}D STREAK</span>
                </div>
              </h3>
              
              <div className="flex items-baseline gap-1 font-sans select-text">
                <span className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">{dsaData.solvedCount}</span>
                <span className="text-slate-400 dark:text-[#8E8E93] text-xs font-mono font-bold">/ {dsaData.totalCount} Problems</span>
              </div>

              {/* Categories block */}
              <div className="space-y-4 mt-6">
                {dsaData.byCategory.map((cat, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5 font-mono text-[10px]">
                    <div className="flex items-center justify-between text-slate-700 dark:text-[#E5E5E7] font-sans text-xs font-bold">
                      <span>{cat.category}</span>
                      <span className="text-emerald-500 dark:text-emerald-400">{cat.solved} <span className="text-slate-400 dark:text-[#8E8E93]">/ {cat.total}</span></span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-[#1C1C1E] overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500" 
                        style={{ width: `${(cat.solved / cat.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weekly Progress Bar Chart */}
          {dsaData && dsaData.weeklyProgress && (
            <div className="rounded-3xl border border-slate-200 dark:border-[#2D2D30]/60 bg-white dark:bg-[#1E293B]/40 p-6 flex flex-col shadow-xs">
              <span className="block text-[9.5px] font-mono tracking-widest text-slate-400 dark:text-[#8E8E93] uppercase mb-4 font-bold">Past Week Activity</span>
              <div className="flex items-end justify-between h-32 pt-6 pb-2 px-3 border border-slate-200 dark:border-[#1C1C1E]/55 bg-slate-50/70 dark:bg-[#0E0E10] rounded-2xl">
                {dsaData.weeklyProgress.map((wp, idx) => {
                  const maxVal = Math.max(...(dsaData.weeklyProgress?.map(w => w.solved) || [1]), 4);
                   const heightPercent = maxVal > 0 ? (wp.solved / maxVal) * 100 : 0;

                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 group flex-1">
                      <div className="relative w-full flex justify-center h-20 items-end">
                        {wp.solved > 0 && (
                          <span className="absolute -top-6 scale-0 group-hover:scale-110 transition-all bg-violet-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs pointer-events-none font-mono">
                            {wp.solved}
                          </span>
                        )}
                        <div 
                          className={`w-4.5 rounded-t-[4px] transition-all duration-500 ${
                            wp.solved > 0 
                              ? 'bg-gradient-to-t from-violet-600 to-indigo-400 group-hover:from-violet-500 group-hover:to-pink-350' 
                              : 'bg-slate-200 dark:bg-[#1C1C1E]'
                          }`}
                          style={{ height: `${heightPercent || 6}%`, minHeight: '4px' }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-slate-550 dark:text-[#8E8E93] group-hover:text-slate-800 dark:group-hover:text-white font-bold transition-colors">{wp.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Difficulty Distribution Chart Stack */}
          {dsaData && dsaData.difficultyDistribution && (
            <div className="rounded-3xl border border-slate-200 dark:border-[#2D2D30]/60 bg-white dark:bg-[#1E293B]/40 p-6 flex flex-col shadow-xs">
              <span className="block text-[9.5px] font-mono tracking-widest text-slate-400 dark:text-[#8E8E93] uppercase mb-4 font-bold">Difficulty Distribution</span>
              
              <div className="grid grid-cols-3 gap-3 mb-5 font-mono text-center select-text">
                <div className="bg-slate-50 dark:bg-[#1C1C1E] rounded-xl p-2.5 border border-slate-200 dark:border-[#2D2D30]">
                  <span className="block text-emerald-600 dark:text-emerald-400 font-extrabold text-lg leading-tight">{dsaData.difficultyDistribution.Easy}</span>
                  <span className="text-[9px] uppercase text-slate-400 dark:text-[#8E8E93] font-bold">Easy</span>
                </div>
                <div className="bg-slate-50 dark:bg-[#1C1C1E] rounded-xl p-2.5 border border-slate-200 dark:border-[#2D2D30]">
                  <span className="block text-amber-550 dark:text-amber-400 font-extrabold text-lg leading-tight">{dsaData.difficultyDistribution.Medium}</span>
                  <span className="text-[9px] uppercase text-slate-400 dark:text-[#8E8E93] font-bold">Med</span>
                </div>
                <div className="bg-slate-50 dark:bg-[#1C1C1E] rounded-xl p-2.5 border border-slate-200 dark:border-[#2D2D30]">
                  <span className="block text-rose-600 dark:text-rose-400 font-extrabold text-lg leading-tight">{dsaData.difficultyDistribution.Hard}</span>
                  <span className="text-[9px] uppercase text-slate-400 dark:text-[#8E8E93] font-bold">Hard</span>
                </div>
              </div>

              {/* Stacked Percentage bar */}
              {(() => {
                const easy = dsaData.difficultyDistribution?.Easy || 0;
                const med = dsaData.difficultyDistribution?.Medium || 0;
                const hard = dsaData.difficultyDistribution?.Hard || 0;
                const total = easy + med + hard || 1;
                const pEasy = (easy / total) * 100;
                const pMed = (med / total) * 100;
                const pHard = (hard / total) * 100;

                return (
                  <div className="space-y-2">
                    <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-[#1C1C1E] overflow-hidden flex">
                      <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${pEasy}%` }} title={`Easy ${Math.round(pEasy)}%`} />
                      <div className="h-full bg-amber-500 transition-all duration-500 border-l border-white dark:border-[#141416]" style={{ width: `${pMed}%` }} title={`Medium ${Math.round(pMed)}%`} />
                      <div className="h-full bg-rose-500 transition-all duration-500 border-l border-white dark:border-[#141416]" style={{ width: `${pHard}%` }} title={`Hard ${Math.round(pHard)}%`} />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-405 dark:text-[#8E8E93] font-extrabold">
                      <span>{Math.round(pEasy)}% Easy</span>
                      <span>{Math.round(pMed)}% Med</span>
                      <span>{Math.round(pHard)}% Hard</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Past Submissions table logs */}
          {dsaData && dsaData.recentSubmissions && (
            <div className="rounded-3xl border border-slate-200 dark:border-[#2D2D30]/60 bg-white dark:bg-[#1E293B]/40 p-5 shadow-xs flex flex-col font-mono text-[10.5px]">
              <h3 className="font-display text-slate-800 dark:text-white font-extrabold text-xs mb-3 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <History className="h-4.5 w-4.5 text-slate-400" />
                <span>Compiler Log History</span>
              </h3>
              <div className="space-y-3 max-h-[320px] overflow-y-auto select-text">
                {dsaData.recentSubmissions.map((sub) => (
                  <div key={sub.id} className="flex items-start justify-between border-b border-slate-105 dark:border-[#1C1C1E]/30 pb-2.5 last:border-0 last:pb-0">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-sans text-[11px] font-extrabold text-slate-800 dark:text-[#E5E5E7] truncate max-w-[130px]">{sub.problemName}</span>
                      <span className="text-slate-450 dark:text-[#8E8E93] text-[9.5px] font-mono font-bold lowercase tracking-wide">{sub.language} • {sub.difficulty}</span>
                    </div>

                    <div className="text-right">
                      <span className={`inline-flex items-center gap-1 font-extrabold ${
                        sub.status === 'Accepted' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-650 dark:text-rose-500'
                      }`}>
                        {sub.status === 'Accepted' ? (
                          <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.5]" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 stroke-[2.5]" />
                        )}
                        <span>{sub.status === 'Accepted' ? 'PASS' : 'FAIL'}</span>
                      </span>
                      <span className="block text-[9px] text-slate-400 dark:text-[#8E8E93] font-bold tracking-tight mt-0.5">
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
