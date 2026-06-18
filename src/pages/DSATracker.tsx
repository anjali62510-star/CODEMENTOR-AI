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
  CheckCircle,
  Waves,
  Anchor,
  Compass,
  Ship,
  Droplet
} from 'lucide-react';
import { triggerConfetti, triggerXpGain, triggerBadgeUnlock } from '../components/Celebration';
import { OceanPageShell, OceanPageHeader, OceanLoadingScreen } from '../components/ocean/OceanUI';

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
  const [problemName, setProblemName] = useState('Two Sum Reef Passage');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [language, setLanguage] = useState('TypeScript');
  const [codeSolution, setCodeSolution] = useState(`// Solve the Two Sum Reef Passage\nfunction twoSum(nums: number[], target: number): number[] {\n    const map = new Map<number, number>();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement)!, i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}`);
  const [feedback, setFeedback] = useState<CodeFeedback | null>(null);

  const sampleProblems = [
    { name: 'Two Sum Reef Passage', diff: 'Easy', boilerplate: `// Solve the Two Sum Reef Passage\nfunction twoSum(nums: number[], target: number): number[] {\n    const map = new Map<number, number>();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement)!, i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}` },
    { name: 'Group Anagrams Lagoon', diff: 'Medium', boilerplate: `// Group anagram code currents of string arrays\nfunction groupAnagrams(strs: string[]): string[][] {\n    const map = new Map<string, string[]>();\n    for (const s of strs) {\n        const sorted = s.split('').sort().join('');\n        if (!map.has(sorted)) map.set(sorted, []);\n        map.get(sorted)!.push(s);\n    }\n    return Array.from(map.values());\n}` },
    { name: 'Valid Parentheses Straits', diff: 'Easy', boilerplate: `// Validate nested brackets across currents\nfunction isValid(s: string): boolean {\n    const stack: string[] = [];\n    const closeToOpen: { [key: string]: string } = { ')': '(', '}': '{', ']': '[' };\n    for (const c of s) {\n        if (closeToOpen[c]) {\n            if (stack.length && stack[stack.length - 1] === closeToOpen[c]) {\n                stack.pop();\n            } else return false;\n        } else {\n            stack.push(c);\n        }\n    }\n    return stack.length === 0;\n}` },
    { name: 'LRU Cache Basin', diff: 'Hard', boilerplate: `// Design LRU Cache structures inside bottom trenches\nclass LRUCache {\n    private capacity: number;\n    private map = new Map<number, number>();\n    constructor(capacity: number) {\n        this.capacity = capacity;\n    }\n    get(key: number): number {\n        if (!this.map.has(key)) return -1;\n        const val = this.map.get(key)!;\n        this.map.delete(key);\n        this.map.set(key, val);\n        return val;\n    }\n    put(key: number, value: number): void {\n        this.map.delete(key);\n        this.map.set(key, value);\n        if (this.map.size > this.capacity) {\n            const first = this.map.keys().next().value;\n            this.map.delete(first);\n        }\n    }\n}` }
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

    // Normalize name back to server format if needed
    let serverProblemName = problemName;
    if (problemName === 'Two Sum Reef Passage') serverProblemName = 'Two Sum';
    else if (problemName === 'Group Anagrams Lagoon') serverProblemName = 'Group Anagrams';
    else if (problemName === 'Valid Parentheses Straits') serverProblemName = 'Valid Parentheses';
    else if (problemName === 'LRU Cache Basin') serverProblemName = 'LRU Cache';

    try {
      const data = await apiFetch('/api/dsa/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemName: serverProblemName,
          difficulty,
          language,
          codeSolution
        })
      });
      setFeedback(data.feedback);
      if (data.feedback) {
        triggerConfetti(3000);
        triggerXpGain(150, `Successfully sailed through ${problemName} (${difficulty})`);
        if (data.feedback.status === 'Accepted' || data.feedback.correctnessScore >= 80) {
          triggerBadgeUnlock('Sea Lane Explorer 🏆', `Explored "${problemName}" with correctness of ${data.feedback.correctnessScore}%!`, 'star');
        }
      }
      await fetchDsaProfile(); 
      await refreshUser(); 
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred compiling algorithms evaluation.');
    } finally {
      setSolving(false);
    }
  };

  // Nautical category naming map helper
  const oceanizeCategory = (catName: string) => {
    const match = catName.trim().toLowerCase();
    if (match === 'arrays & hashing' || match === 'arrays') return 'Arrays Reef & Hash Shallows 🐚';
    if (match === 'two pointers' || match === 'pointers') return 'Two Pointers Strait 🧭';
    if (match === 'sliding window' || match === 'window') return 'Sliding Window Tide 🌊';
    if (match === 'trees' || match === 'binary tree') return 'Forest of Coral Trees 🌿';
    if (match === 'graphs') return 'Subsea Graph Trenches 🌀';
    if (match === 'stack' || match === 'queues') return 'Stack Backcurrents ⚓';
    return `${catName} Passage`;
  };

  if (loading) {
    return <OceanLoadingScreen message="Syncing Sea Lane sandboxes..." />;
  }

  return (
    <OceanPageShell>
      <OceanPageHeader
        title="Sea Lane DSA Tracker"
        subtitle="Navigate algorithm reefs, parse complexity currents, and chart your problem-solving voyage."
        icon={Code2}
        badge="ALGORITHM REEFS"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Core Code Editor Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="premium-card p-6 flex flex-col bg-white dark:bg-[#061524]/60">
            <h3 className="font-display text-[#0A2540] dark:text-white font-bold text-sm mb-4 flex items-center gap-2 border-b border-[#D2E1ED]/30 dark:border-[#123456]/30 pb-3">
              <Terminal className="h-4.5 w-4.5 text-[#00B8D9]" />
              <span>Interactive Command Cabin</span>
            </h3>

            {/* Select problem variables */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9.5px] font-mono text-[#5C768D] dark:text-cyan-400 uppercase tracking-wider font-extrabold text-[#00B8D9]">Voyage Target</label>
                <select
                  value={problemName}
                  onChange={(e) => handleProblemChange(e.target.value)}
                  className="bg-[#F8FAFC] dark:bg-[#030D18] border border-[#D2E1ED] dark:border-[#123456] text-xs font-semibold text-[#0A2540] dark:text-white p-2.5 rounded-xl focus:outline-hidden cursor-pointer"
                >
                  {sampleProblems.map(p => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5 font-mono">
                <label className="text-[9.5px] font-mono text-[#5C768D] dark:text-cyan-400 uppercase tracking-wider font-extrabold text-[#00B8D9]">Naval Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-[#F8FAFC] dark:bg-[#030D18] border border-[#D2E1ED] dark:border-[#123456] text-xs font-semibold text-[#0A2540] dark:text-white p-2.5 rounded-xl focus:outline-hidden cursor-pointer font-mono"
                >
                  <option value="TypeScript">TypeScript</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="Python">Python</option>
                  <option value="C++">C++</option>
                  <option value="Java">Java</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9.5px] font-mono text-[#5C768D] dark:text-cyan-400 uppercase tracking-wider font-extrabold text-[#00B8D9]">Water Danger Rating</label>
                <span className={`text-[10.5px] font-bold leading-none px-3 py-3 inline-flex items-center justify-center rounded-xl border text-center font-mono uppercase tracking-wider ${
                  difficulty === 'Easy' ? 'text-teal-650 bg-teal-50 border-teal-200 dark:text-teal-400 dark:bg-teal-500/5 dark:border-teal-500/20' :
                  difficulty === 'Medium' ? 'text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-500/5 dark:border-amber-500/20' :
                  'text-rose-600 bg-rose-50 border-rose-200 dark:text-rose-455 dark:bg-rose-500/5 dark:border-rose-500/20'
                }`}>
                  {difficulty}
                </span>
              </div>
            </div>

            {/* Main Code Textarea */}
            <div className="relative font-mono text-xs text-zinc-805 dark:text-zinc-205 mb-5 select-text">
              <textarea
                value={codeSolution}
                onChange={(e) => setCodeSolution(e.target.value)}
                rows={13}
                spellCheck={false}
                className="w-full bg-[#F8FAFC] dark:bg-[#030D18] border border-[#D2E1ED] dark:border-[#123456] p-4 rounded-xl focus:outline-hidden focus:border-[#00B8D9] font-mono leading-relaxed resize-y font-semibold text-[#0A2540] dark:text-white"
              />
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-[#123456]/40 pt-4">
              <span className="text-[9.5px] font-mono text-[#5C768D] dark:text-cyan-400 font-bold">Sea Lane compiler validation sequence active.</span>
              <motion.button
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={handleCodeSubmit}
                disabled={solving}
                className="flex items-center justify-center gap-2 rounded-xl cursor-pointer bg-gradient-to-r from-[#00B8D9] to-[#0F4C81] text-white px-5 py-2.5 text-xs font-bold transition shadow-xs disabled:opacity-50"
              >
                {solving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-cyan-200" />
                    <span>Analyzing Tide Gaps...</span>
                  </>
                ) : (
                  <>
                    <Ship className="h-4.5 w-4.5 animate-pulse text-cyan-255" />
                    <span>Steer Solution</span>
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
            <div className="premium-card p-6 space-y-5 bg-white dark:bg-[#061524]/60">
              <div className="flex items-center justify-between border-b border-zinc-155 dark:border-[#123456]/40 pb-3">
                <div className="flex items-center gap-2 font-display font-extrabold text-[#0A2540] dark:text-white text-base">
                  <Cpu className="h-4.5 w-4.5 text-[#00B8D9]" />
                  <span>Complexity Sonar feedback</span>
                </div>
                <span className={`text-[10.5px] font-extrabold px-2.5 py-0.8 rounded-md font-mono border ${
                  feedback.status === 'Accepted' ? 'text-teal-600 bg-teal-50 border-teal-200 dark:text-teal-400 dark:bg-teal-500/10' : 'text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-500/10'
                }`}>
                  {feedback.status}
                </span>
              </div>

              {/* Big space/time variables */}
              <div className="grid grid-cols-2 gap-4 font-mono select-all">
                <div className="rounded-xl border border-[#D2E1ED] dark:border-[#123456] bg-slate-50 dark:bg-[#030D18]/45 p-4 text-center">
                  <span className="block text-[#0A2540] dark:text-white font-extrabold text-xl">{feedback.timeComplexity}</span>
                  <label className="text-[9px] uppercase tracking-wider text-[#5C768D] dark:text-cyan-400 mt-1 block font-bold">Time Complexity Reef</label>
                </div>
                <div className="rounded-xl border border-[#D2E1ED] dark:border-[#123456] bg-slate-50 dark:bg-[#030D18]/45 p-4 text-center">
                  <span className="block text-[#0A2540] dark:text-white font-extrabold text-xl">{feedback.spaceComplexity}</span>
                  <label className="text-[9px] uppercase tracking-wider text-[#5C768D] dark:text-cyan-400 mt-1 block font-bold">Space Depth Scale</label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 font-mono select-all">
                <div className="rounded-xl border border-slate-100 dark:border-[#123456] bg-slate-50 dark:bg-[#030D18]/30 p-3.5 text-center">
                  <span className="block text-teal-600 dark:text-teal-400 font-extrabold text-lg">{feedback.correctnessScore}%</span>
                  <label className="text-[9.5px] uppercase tracking-wider text-[#5C768D] dark:text-cyan-400 mt-0.5 block font-bold">Stability Match</label>
                </div>
                <div className="rounded-xl border border-slate-100 dark:border-[#123456] bg-slate-50 dark:bg-[#030D18]/30 p-3.5 text-center">
                  <span className="block text-teal-600 dark:text-teal-400 font-extrabold text-lg">{feedback.performanceScore}%</span>
                  <label className="text-[9.5px] uppercase tracking-wider text-[#5C768D] dark:text-cyan-400 mt-0.5 block font-bold">Efficiency Current</label>
                </div>
              </div>

              {/* Gaps / Critical issues details */}
              {feedback.criticalIssues.length > 0 && (
                <div className="pt-2 select-text">
                  <h4 className="font-mono text-[9px] uppercase tracking-wider text-rose-500 mb-2 flex items-center gap-1.5 font-bold">
                    <XCircle className="h-4 w-4" />
                    <span>Algorithmic Warnings</span>
                  </h4>
                  <ul className="list-disc list-inside text-xs text-[#5C768D] dark:text-cyan-100 space-y-1.5 pl-1.5 font-semibold leading-relaxed">
                    {feedback.criticalIssues.map((issue, idx) => (
                      <li key={idx} className="leading-relaxed">{issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvements details */}
              {feedback.improvements.length > 0 && (
                <div className="pt-2 select-text">
                  <h4 className="font-mono text-[9px] uppercase tracking-wider text-teal-650 dark:text-[#2DD4BF] mb-2 flex items-center gap-1.5 font-bold">
                    <CheckCircle className="h-4 w-4 text-teal-500" />
                    <span>Suggested Route Adjustments</span>
                  </h4>
                  <div className="space-y-2.5">
                    {feedback.improvements.map((imp, idx) => (
                      <p key={idx} className="text-xs text-[#5C768D] dark:text-cyan-100 leading-relaxed border-l-2 border-teal-500 pl-3 select-all font-semibold">
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
            <div className="premium-card p-6 flex flex-col bg-white dark:bg-[#061524]/60">
              <h3 className="font-display text-[#0A2540] dark:text-white font-bold text-sm mb-4 border-b border-[#D2E1ED]/30 dark:border-[#123456]/40 pb-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4.5 w-4.5 text-[#00B8D9]" />
                  <span>Ocean Map Seals</span>
                </span>
                
                {/* Lighthouse flame indicator */}
                <div className="flex items-center gap-1 text-orange-500 font-mono text-xs font-bold animate-pulse">
                  <Flame className="h-4.5 w-4.5 fill-orange-500/10" />
                  <span>{dsaData.currentStreak || 12} Knots Streak</span>
                </div>
              </h3>
              
              <div className="flex items-baseline gap-1 font-sans select-text">
                <span className="text-4xl font-black text-[#0A2540] dark:text-white tracking-tight">{dsaData.solvedCount}</span>
                <span className="text-[#5C768D] dark:text-cyan-400 text-xs font-mono font-bold">/ {dsaData.totalCount} Lanes Cleared</span>
              </div>

              {/* Categories block */}
              <div className="space-y-4 mt-6">
                {dsaData.byCategory.map((cat, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5 font-mono text-[9.5px] font-bold">
                    <div className="flex items-center justify-between text-[#0A2540] dark:text-cyan-200 font-sans text-xs font-bold">
                      <span>{oceanizeCategory(cat.category)}</span>
                      <span className="text-cyan-700 dark:text-cyan-300">{cat.solved} <span className="text-slate-400 dark:text-slate-500">/ {cat.total}</span></span>
                    </div>
                    <div className="h-2 w-full rounded-lg bg-[#F8FAFC] dark:bg-[#030D18] overflow-hidden border border-[#D2E1ED]/30 dark:border-white/5">
                      <div 
                        className="h-full rounded-lg bg-gradient-to-r from-[#00B8D9] to-[#0F4C81] transition-all duration-505" 
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
            <div className="premium-card p-6 flex flex-col bg-white dark:bg-[#061524]/60">
              <span className="block text-[9px] font-mono tracking-widest text-[#5C768D] dark:text-cyan-400 uppercase mb-4 font-black">Daily Water Cleared</span>
              <div className="flex items-end justify-between h-32 pt-6 pb-2 px-3 border border-[#D2E1ED] dark:border-[#123456] bg-slate-50 dark:bg-[#030D18]/50 rounded-xl">
                {dsaData.weeklyProgress.map((wp, idx) => {
                  const maxVal = Math.max(...(dsaData.weeklyProgress?.map(w => w.solved) || [1]), 4);
                  const heightPercent = maxVal > 0 ? (wp.solved / maxVal) * 100 : 0;

                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 group flex-1">
                      <div className="relative w-full flex justify-center h-20 items-end">
                        {wp.solved > 0 && (
                          <span className="absolute -top-6 scale-0 group-hover:scale-110 transition-all bg-[#0F4C81] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs pointer-events-none font-mono">
                            {wp.solved}
                          </span>
                        )}
                        <div 
                          className={`w-4 rounded-t-[3px] transition-all duration-500 ${
                            wp.solved > 0 
                              ? 'bg-gradient-to-t from-[#00B8D9] to-[#0F4C81] group-hover:from-teal-400 group-hover:to-cyan-400' 
                              : 'bg-slate-200 dark:bg-slate-800'
                          }`}
                          style={{ height: `${heightPercent || 6}%`, minHeight: '4px' }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-[#5C768D] dark:text-cyan-400 font-bold transition-colors">{wp.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Difficulty Distribution Chart Stack */}
          {dsaData && dsaData.difficultyDistribution && (
            <div className="premium-card p-6 flex flex-col bg-white dark:bg-[#061524]/60">
              <span className="block text-[9px] font-mono tracking-widest text-[#5C768D] dark:text-cyan-400 uppercase mb-4 font-black">Complexity Depth Ratios</span>
              
              <div className="grid grid-cols-3 gap-3 mb-5 font-mono text-center select-text font-bold">
                <div className="bg-[#F8FAFC] dark:bg-[#030D18] rounded-xl p-2.5 border border-[#D2E1ED] dark:border-[#123456]">
                  <span className="block text-[#2DD4BF] font-extrabold text-lg leading-none">{dsaData.difficultyDistribution.Easy}</span>
                  <span className="text-[9px] text-slate-400 dark:text-cyan-455">Easy</span>
                </div>
                <div className="bg-[#F8FAFC] dark:bg-[#030D18] rounded-xl p-2.5 border border-[#D2E1ED] dark:border-[#123456]">
                  <span className="block text-amber-500 font-extrabold text-lg leading-none">{dsaData.difficultyDistribution.Medium}</span>
                  <span className="text-[9px] text-slate-400 dark:text-cyan-455 font-bold">Mod</span>
                </div>
                <div className="bg-[#F8FAFC] dark:bg-[#030D18] rounded-xl p-2.5 border border-[#D2E1ED] dark:border-[#123456]">
                  <span className="block text-rose-500 font-extrabold text-lg leading-none">{dsaData.difficultyDistribution.Hard}</span>
                  <span className="text-[9px] text-slate-400 dark:text-cyan-455 font-bold">Hard</span>
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
                    <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                      <div className="h-full bg-[#2DD4BF] transition-all duration-500" style={{ width: `${pEasy}%` }} title={`Easy ${Math.round(pEasy)}%`} />
                      <div className="h-full bg-amber-400 transition-all duration-500 border-l border-white dark:border-[#030D18]" style={{ width: `${pMed}%` }} title={`Medium ${Math.round(pMed)}%`} />
                      <div className="h-full bg-rose-500 transition-all duration-500 border-l border-white dark:border-[#030D18]" style={{ width: `${pHard}%` }} title={`Hard ${Math.round(pHard)}%`} />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#5C768D] dark:text-cyan-405 font-bold">
                      <span>{Math.round(pEasy)}% Easy</span>
                      <span>{Math.round(pMed)}% Mod</span>
                      <span>{Math.round(pHard)}% Hard</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Past Submissions table logs */}
          {dsaData && dsaData.recentSubmissions && (
            <div className="premium-card p-5 flex flex-col font-mono text-[10.5px] bg-white dark:bg-[#061524]/60">
              <h3 className="font-display text-[#0A2540] dark:text-white font-extrabold text-xs mb-3 flex items-center gap-2 border-b border-zinc-150 dark:border-[#123456]/50 pb-2">
                <History className="h-4.5 w-4.5 text-[#5C768D]" />
                <span>Voyage Evaluation Log</span>
              </h3>
              <div className="space-y-3 max-h-[320px] overflow-y-auto select-text">
                {dsaData.recentSubmissions.map((sub) => {
                  let visualProbName = sub.problemName;
                  if (sub.problemName === 'Two Sum') visualProbName = 'Two Sum Reef Passage';
                  else if (sub.problemName === 'Group Anagrams') visualProbName = 'Group Anagrams Lagoon';
                  else if (sub.problemName === 'Valid Parentheses') visualProbName = 'Valid Parentheses Straits';
                  else if (sub.problemName === 'LRU Cache') visualProbName = 'LRU Cache Basin';

                  return (
                    <div key={sub.id} className="flex items-start justify-between border-b border-slate-100 dark:border-[#123456]/30 pb-2.5 last:border-0 last:pb-0">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-sans text-[11px] font-extrabold text-[#0D2E4D] dark:text-cyan-100 truncate max-w-[130px]">{visualProbName}</span>
                        <span className="text-[#5C768D] dark:text-slate-400 text-[9.5px] font-mono font-semibold truncate uppercase">{sub.language} • {sub.difficulty}</span>
                      </div>

                      <div className="text-right whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 font-bold ${
                          sub.status === 'Accepted' ? 'text-teal-600 dark:text-teal-450' : 'text-rose-600 dark:text-rose-500'
                        }`}>
                          {sub.status === 'Accepted' ? (
                            <CheckCircle className="h-3.5 w-3.5 text-teal-500" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-rose-500" />
                          )}
                          <span>{sub.status === 'Accepted' ? 'PASS' : 'FAIL'}</span>
                        </span>
                        <span className="block text-[9px] text-[#5C768D] dark:text-slate-500 font-bold tracking-tight mt-0.5">
                          {new Date(sub.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </OceanPageShell>
  );
};

export default DSATracker;
