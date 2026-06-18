import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  MessageSquareCode, 
  Sparkles, 
  Loader2, 
  Award, 
  ChevronRight, 
  Activity, 
  Cpu, 
  User as UserIcon, 
  Send,
  HelpCircle,
  BookOpen,
  CheckCircle,
  ChevronDown,
  Waves,
  Anchor,
  Compass,
  Ship,
  HelpCircle as HelpIcon,
  ShieldCheck
} from 'lucide-react';
import { triggerConfetti, triggerXpGain, triggerBadgeUnlock } from '../components/Celebration';
import { OceanPageShell, OceanPageHeader, OceanLoadingScreen } from '../components/ocean/OceanUI';

interface QuestionItem {
  id: string;
  question: string;
  difficulty: string;
  explanation: string;
  modelAnswer: string;
  followUpQuestions: string[];
}

export const InterviewPrep: React.FC = () => {
  const { user, apiFetch, refreshUser } = useAuth();
  
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'simulation' | 'bank'>('simulation');

  // Simulation state variables
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [topic, setTopic] = useState('Subsea System Architecture & Scaling');
  const [sending, setSending] = useState(false);
  const [ending, setEnding] = useState(false);
  const [reply, setReply] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Question bank state variables
  const [selectedSubCategory, setSelectedSubCategory] = useState('Technical Navigation Audits');
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionsError, setQuestionsError] = useState<string | null>(null);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const topics = [
    'Subsea System Architecture & Scaling',
    'Behavioral Sea Currents & STAR Method',
    'React & Component Island Structures',
    'Distributed Ocean Channels & Databases',
    'Sea Lane Algorithms & Structures'
  ];

  const subCategories = [
    'Fleet HR Checkpoints',
    'Technical Navigation Audits',
    'Sea Lane Algorithm Gaps',
    'Subsea Architecture Problems'
  ];

  // Fetch standard states
  const fetchCurrentSession = async () => {
    try {
      const data = await apiFetch('/api/interview/status');
      if (data.session) {
        setSession(data.session);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    setLoadingQuestions(true);
    setQuestionsError(null);

    // Normalize category names back for API requirements if needed
    let apiCategory = selectedSubCategory;
    if (selectedSubCategory === 'Fleet HR Checkpoints') apiCategory = 'HR Questions';
    else if (selectedSubCategory === 'Technical Navigation Audits') apiCategory = 'Technical Questions';
    else if (selectedSubCategory === 'Sea Lane Algorithm Gaps') apiCategory = 'DSA Questions';
    else if (selectedSubCategory === 'Subsea Architecture Problems') apiCategory = 'System Design Questions';

    try {
      const data = await apiFetch('/api/interview/questions/generate', {
        method: 'POST',
        body: JSON.stringify({ category: apiCategory })
      });
      if (data.questions) {
        setQuestions(data.questions);
        if (data.questions.length > 0) {
          setExpandedQuestionId(data.questions[0].id);
        }
      }
    } catch (err: any) {
      console.error(err);
      setQuestionsError(err.message || 'Error occurred contacting Gemini for question generation.');
    } finally {
      setLoadingQuestions(false);
    }
  };

  useEffect(() => {
    fetchCurrentSession();
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [selectedSubCategory]);

  const handleStartSession = async () => {
    setStarting(true);
    setError(null);

    // Normalize topic targets
    let apiTopic = topic;
    if (topic === 'Subsea System Architecture & Scaling') apiTopic = 'System Design & Scaling';
    else if (topic === 'Behavioral Sea Currents & STAR Method') apiTopic = 'Behavioral & Star Method';
    else if (topic === 'React & Component Island Structures') apiTopic = 'React & State Architecture';
    else if (topic === 'Distributed Ocean Channels & Databases') apiTopic = 'Distributed Systems & DBs';
    else if (topic === 'Sea Lane Algorithms & Structures') apiTopic = 'Data Structures & Algorithms';

    try {
      const data = await apiFetch('/api/interview/start', {
        method: 'POST',
        body: JSON.stringify({ topic: apiTopic })
      });
      setSession(data.session);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unable to instantiate a dialogue session.');
    } finally {
      setStarting(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !session) return;
    setSending(true);
    setError(null);
    const text = reply.trim();
    setReply('');

    try {
      const data = await apiFetch('/api/interview/message', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: session.id,
          message: text
        })
      });
      setSession(data.session);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred communicating message parameters.');
    } finally {
      setSending(false);
    }
  };

  const handleEndSession = async () => {
    if (!session) return;
    setEnding(true);
    try {
      const data = await apiFetch(`/api/interview/end/${session.id}`, {
        method: 'PUT'
      });
      setSession(data.session);
      
      // Earn XP for ending the session
      try {
        await apiFetch('/api/user/earn-xp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: 100 })
        });
      } catch (xpErr) {
        console.error('Failed to save session completion XP', xpErr);
      }
      
      await refreshUser(); // Force update scores & XP

      // Launch standard gamified celebrations
      triggerConfetti(4000);
      triggerXpGain(100, `Completed Captain's Audit: ${session.topic || 'Dialogue'}`);
      triggerBadgeUnlock('Voyage Audited ⚓', 'Cleared deep mock interview simulations with robust technical fluency.', 'trophy');
      
    } catch (err) {
      console.error(err);
    } finally {
      setEnding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center font-mono text-xs text-[#5C768D] dark:text-cyan-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#00B8D9] border-t-transparent" />
          <span>Formulating Captain's Audit gates...</span>
        </div>
      </div>
    );
  }

  return (
    <OceanPageShell>
      <OceanPageHeader
        title="Interview Coast"
        subtitle="Practice technical audits with Captain Mentor simulations and explore the question harbor database."
        icon={Anchor}
        badge="HARBOR PREP"
      />

      {/* Tabs */}
      <div className="flex border-b border-[#D2E1ED] dark:border-[#123456]/30 pb-px font-sans">
        <button
          onClick={() => setActiveTab('simulation')}
          className={`px-5 py-3 text-xs font-bold tracking-tight border-b-2 transition cursor-pointer ${
            activeTab === 'simulation'
              ? 'border-[#00B8D9] text-[#00B8D9] bg-cyan-100/10 dark:border-cyan-405 dark:text-cyan-300 dark:bg-cyan-500/5'
              : 'border-transparent text-[#5C768D] dark:text-cyan-600 hover:text-[#0A2540] dark:hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            <span>Interactive Captain's Audit</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('bank')}
          className={`px-5 py-3 text-xs font-bold tracking-tight border-b-2 transition cursor-pointer ${
            activeTab === 'bank'
              ? 'border-[#00B8D9] text-[#00B8D9] bg-cyan-100/10 dark:border-cyan-405 dark:text-cyan-300 dark:bg-cyan-500/5'
              : 'border-transparent text-[#5C768D] dark:text-cyan-600 hover:text-[#0A2540] dark:hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Nautical Question Bank</span>
          </div>
        </button>
      </div>

      {activeTab === 'simulation' ? (
        /* Real interactive recruiter chat simulation */
        <div className="space-y-6">
          {!session || session.status === 'completed' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 premium-card p-6 shadow-xs space-y-6 bg-white dark:bg-[#061524]/60">
                <h3 className="font-display text-[#0A2540] dark:text-white font-bold text-sm mb-4 border-b border-slate-100 dark:border-[#123456]/30 pb-3 flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-[#00B8D9]" />
                  <span>Configure Audit Coordinates</span>
                </h3>

                <div className="space-y-4 font-sans">
                  <div>
                    <label className="block text-[10px] font-mono text-[#5C768D] dark:text-cyan-405 uppercase tracking-wider mb-2 font-black">Audit Currents Priority</label>
                    <div className="grid grid-cols-1 gap-2.5">
                      {topics.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTopic(t)}
                          className={`
                            flex items-center justify-between rounded-xl p-3.5 text-xs font-bold transition border text-left cursor-pointer
                            ${topic === t
                              ? 'bg-cyan-100/20 border-cyan-200 text-[#00B8D9] dark:bg-cyan-500/5 dark:border-[#00B8D9]/40'
                              : 'bg-slate-55 border-slate-100 text-slate-600 hover:text-[#0a2540] dark:bg-[#030D18]/40 dark:border-[#123456] dark:text-cyan-100 dark:hover:text-white'
                            }
                          `}
                        >
                          <span>{t}</span>
                          <ChevronRight className="h-4 w-4 text-[#00B8D9]" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/5 p-3 rounded-xl border border-rose-100 dark:border-rose-500/10 font-bold">
                      {error}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleStartSession}
                    disabled={starting}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00B8D9] to-[#0F4C81] text-white px-5 py-3 text-xs font-bold transition shadow-xs w-full cursor-pointer"
                  >
                    {starting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-cyan-200" />
                        <span>Calibrating Captain AI...</span>
                      </>
                    ) : (
                      <>
                        <Activity className="h-4 w-4 animate-pulse" />
                        <span>Launch Audit simulation</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Past reviews */}
              {session && session.status === 'completed' && (
                <div className="lg:col-span-1 premium-card p-6 shadow-xs space-y-5 bg-white dark:bg-[#061524]/60">
                  <h3 className="font-display text-[#0A2540] dark:text-white font-bold text-sm border-b border-slate-100 dark:border-[#123456]/40 pb-3 flex items-center gap-2">
                    <Award className="h-4.5 w-4.5 text-[#00B8D9]" />
                    <span>FAANG Evaluation Report</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-4 text-center font-mono font-bold text-xs select-all">
                    <div className="rounded-xl border border-slate-100 dark:border-[#123456] p-3">
                      <span className="block text-2xl font-black text-[#0A2540] dark:text-white">{session.score}/10</span>
                      <span className="text-[9px] uppercase tracking-wider text-[#5C768D] dark:text-cyan-405 font-black">Aggregate Rank</span>
                    </div>
                    <div className="rounded-xl border border-cyan-150 dark:border-cyan-455/20 p-3 text-cyan-705 bg-cyan-50 dark:text-cyan-300 dark:bg-cyan-500/10 font-black">
                      <span className="block text-xs font-extrabold uppercase tracking-wider">Pass</span>
                      <span className="text-[9px] uppercase tracking-wider text-cyan-500 dark:text-cyan-405 font-medium">Sailed Level</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <h4 className="font-sans font-bold text-[#0A2540] dark:text-white text-xs">Evaluator Feedback Guidelines</h4>
                    <p className="text-xs text-[#5C768D] dark:text-cyan-100 leading-relaxed select-all border-l-2 border-[#00B8D9] pl-3 font-semibold">
                      {session.feedback || 'Excellent subsea architecture tradeoffs discussed.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-3xl border border-[#D2E1ED] dark:border-[#123456] bg-white dark:bg-[#061524]/60 flex flex-col h-[550px] shadow-xs max-w-4xl mx-auto overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between bg-[#F8FAFC] dark:bg-[#030D18]/55 border-b border-[#D2E1ED] dark:border-[#123456]/40 px-5 py-3.5 select-none">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <div className="font-sans">
                    <h3 className="text-xs font-black text-[#0A2540] dark:text-white leading-normal">Captain Assessor Live</h3>
                    <p className="text-[10px] text-[#5C768D] dark:text-cyan-405 mt-0.5 leading-none font-extrabold uppercase font-mono">Current: {session.topic}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleEndSession}
                  disabled={ending}
                  className="rounded-xl border border-rose-225 dark:border-rose-500/25 bg-rose-50 dark:bg-rose-500/5 hover:bg-rose-100 py-1.8 px-3 text-[10.5px] font-black text-rose-600 dark:text-rose-400 transition cursor-pointer shadow-xs font-mono uppercase"
                >
                  {ending ? 'Generating coordinates...' : 'Deploy Voyage Evaluation Report'}
                </button>
              </div>

              {/* Message Streams viewport */}
              <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 font-sans focus:outline-hidden bg-slate-50/10 dark:bg-zinc-950/10 select-text">
                {session.chatHistory.map((item: any, index: number) => {
                  const isAI = item.role === 'model';
                  return (
                    <div
                      key={index}
                      className={`flex items-start gap-3 max-w-[85%] ${
                        isAI ? '' : 'ml-auto flex-row-reverse'
                      }`}
                    >
                      <div className={`h-8 w-8 rounded-xl flex items-center justify-center border shrink-0 ${
                        isAI 
                          ? 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-150 dark:border-cyan-500/20 text-[#00B8D9]' 
                          : 'bg-slate-100 dark:bg-slate-900 border-slate-205 dark:border-slate-800 text-[#00B8D9]'
                      }`}>
                        {isAI ? <Ship className="h-4.5 w-4.5" /> : <UserIcon className="h-4.5 w-4.5" />}
                      </div>

                      <div className={`rounded-2xl p-4 text-xs leading-relaxed border ${
                        isAI 
                          ? 'bg-slate-50 dark:bg-[#030D18]/50 border-slate-150 dark:border-[#123456] text-[#0A2540] dark:text-[#E2E8F0] rounded-tl-none font-semibold' 
                          : 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-150 dark:border-cyan-900/10 text-[#0A2540] dark:text-cyan-150 rounded-tr-none font-extrabold'
                      }`}>
                        {item.parts[0]?.text || ''}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message inputs bottom */}
              <div className="p-4 border-t border-[#D2E1ED] dark:border-[#123456]/40 bg-[#F8FAFC] dark:bg-[#030D18]" style={{ userSelect: 'none' }}>
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Provide your algorithmic and strategic reasoning coordinates..."
                    disabled={sending}
                    className="w-full bg-white dark:bg-[#061524] border border-[#D2E1ED] dark:border-[#123456] rounded-xl px-4 py-3 text-xs text-[#0A2540] dark:text-white focus:outline-hidden focus:border-[#00B8D9] transition-colors placeholder-slate-400 font-semibold"
                  />
                  <button
                    type="submit"
                    disabled={sending || !reply.trim()}
                    className="flex items-center justify-center h-11 w-11 rounded-xl bg-gradient-to-r from-[#00B8D9] to-[#0F4C81] text-white transition shrink-0 disabled:opacity-45 cursor-pointer shadow-xs"
                  >
                    {sending ? (
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 stroke-[2.5]" />
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* High Yield Questions Deck */
        <div className="space-y-6">
          {/* Subcategory toggle buttons */}
          <div className="flex flex-wrap gap-2 pb-2 font-mono">
            {subCategories.map((sc) => (
              <button
                key={sc}
                onClick={() => setSelectedSubCategory(sc)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-tight border transition cursor-pointer select-none ${
                  selectedSubCategory === sc
                    ? 'bg-cyan-100/40 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/25 text-[#00B8D9]'
                    : 'bg-slate-50 hover:bg-slate-100 border-[#D2E1ED] text-[#5C768D] dark:bg-[#030D18]/30 dark:border-[#123456] dark:text-cyan-405 dark:hover:text-white'
                }`}
              >
                {sc}
              </button>
            ))}
          </div>

          {loadingQuestions ? (
            <div className="py-16 text-center font-mono">
              <Loader2 className="h-8 w-8 animate-spin text-[#00B8D9] mx-auto mb-4" />
              <p className="text-xs text-[#5C768D] dark:text-cyan-400 font-extrabold uppercase">Drafting high yield nautical checklists with Sonar model...</p>
            </div>
          ) : questionsError ? (
            <div className="rounded-xl border border-rose-500/15 bg-rose-500/5 p-6 text-center">
              <p className="text-xs text-rose-650 dark:text-rose-400 font-bold">{questionsError}</p>
            </div>
          ) : questions.length > 0 ? (
            <div className="grid grid-cols-1 gap-5">
              {questions.map((q) => {
                const isExpanded = expandedQuestionId === q.id;
                return (
                  <div 
                    key={q.id} 
                    className={`rounded-2xl border transition-all duration-305 overflow-hidden leading-relaxed ${
                      isExpanded 
                        ? 'border-[#00B8D9]/40 bg-cyan-100/5 dark:border-cyan-550/30' 
                        : 'border-[#D2E1ED] bg-white dark:border-[#123456] dark:bg-[#061524]/50 hover:border-cyan-555'
                    }`}
                  >
                    {/* Header bar / reveal trigger */}
                    <div 
                      onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                      className="p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5 font-mono text-[9.5px] font-bold">
                          <span className="text-cyan-800 bg-cyan-50 dark:text-[#2DD4BF] dark:bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-150 uppercase font-black">
                            Waypoint Probe
                          </span>
                          <span className={`px-1.5 py-0.5 rounded uppercase leading-none font-extrabold ${
                            q.difficulty.toLowerCase().includes('hard')
                              ? 'text-rose-600 bg-rose-50 border border-rose-100 dark:text-rose-400 dark:bg-rose-500/10'
                              : q.difficulty.toLowerCase().includes('medium')
                              ? 'text-amber-600 bg-amber-50 border border-amber-100 dark:text-amber-400 dark:bg-amber-500/10'
                              : 'text-emerald-700 bg-emerald-50 border border-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10'
                          }`}>
                            {q.difficulty}
                          </span>
                        </div>
                        <h3 className="font-display text-sm font-black text-[#0A2540] dark:text-white transition-colors">
                          {q.question}
                        </h3>
                      </div>

                      <button className="text-[#00B8D9] hover:text-[#0F4C81] transition cursor-pointer">
                        <ChevronDown className={`h-5 w-5 transform transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[#00B8D9]' : ''}`} />
                      </button>
                    </div>

                    {/* Disclosures answer panel */}
                    {isExpanded && (
                      <div className="px-5 pb-6 pt-2 border-t border-slate-100 dark:border-[#123456]/40 bg-slate-50/30 dark:bg-zinc-950/40 space-y-4 select-text">
                        {/* Summary conceptual info */}
                        <div className="space-y-1.5">
                          <h4 className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider font-mono font-black">Conceptual Navigation Map</h4>
                          <p className="text-xs text-[#5C768D] dark:text-slate-350 leading-relaxed font-semibold">
                            {q.explanation}
                          </p>
                        </div>

                        {/* Model answer */}
                        <div className="space-y-2 font-sans rounded-xl border border-cyan-150 bg-cyan-50/40 dark:border-cyan-950/20 dark:bg-cyan-500/5 p-4">
                          <h4 className="text-[10.5px] font-extrabold text-[#0F4C81] dark:text-[#2DD4BF] uppercase tracking-wider font-mono flex items-center gap-1.5">
                            <CheckCircle className="h-4 w-4 text-teal-500" />
                            <span>Recommended Steering Solution</span>
                          </h4>
                          <p className="text-xs text-[#0A2540] dark:text-[#E2E8F0] leading-relaxed whitespace-pre-wrap font-semibold">
                            {q.modelAnswer}
                          </p>
                        </div>

                        {/* Follow up items */}
                        {q.followUpQuestions && q.followUpQuestions.length > 0 && (
                          <div className="space-y-2 pt-1 font-semibold">
                            <h4 className="text-[10px] font-semibold text-slate-400 dark:text-cyan-550 uppercase tracking-wider font-mono">Possible Fleet Follow-Ups</h4>
                            <ul className="space-y-1.5 text-xs text-[#5C768D] dark:text-slate-400 pl-0.5">
                              {q.followUpQuestions.map((fq, fi) => (
                                <li key={fi} className="flex gap-2.5 items-start">
                                  <span className="text-[#00B8D9] font-bold shrink-0 mt-0.5">•</span>
                                  <span>{fq}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-[#D2E1ED] border-dashed dark:border-[#123456] p-12 text-center bg-[#F8FAFC]/50 dark:bg-transparent">
              <HelpIcon className="h-10 w-10 text-[#5C768D] mx-auto mb-3 opacity-50" />
              <p className="text-xs text-[#5C768D] dark:text-cyan-400 font-bold">No high value checklists compiled yet.</p>
            </div>
          )}
        </div>
      )}
    </OceanPageShell>
  );
};

export default InterviewPrep;
