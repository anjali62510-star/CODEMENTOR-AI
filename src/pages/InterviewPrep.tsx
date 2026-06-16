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
  Eye,
  BookOpen,
  CheckCircle,
  ChevronDown
} from 'lucide-react';

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
  const [topic, setTopic] = useState('System Design & Scaling');
  const [sending, setSending] = useState(false);
  const [ending, setEnding] = useState(false);
  const [reply, setReply] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Question bank state variables
  const [selectedSubCategory, setSelectedSubCategory] = useState('Technical Questions');
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionsError, setQuestionsError] = useState<string | null>(null);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const topics = [
    'System Design & Scaling',
    'Behavioral & Star Method',
    'React & State Architecture',
    'Distributed Systems & DBs',
    'Data Structures & Algorithms'
  ];

  const subCategories = ['HR Questions', 'Technical Questions', 'DSA Questions', 'System Design Questions'];

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
    try {
      const data = await apiFetch('/api/interview/questions/generate', {
        method: 'POST',
        body: JSON.stringify({ category: selectedSubCategory })
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
    try {
      const data = await apiFetch('/api/interview/start', {
        method: 'POST',
        body: JSON.stringify({ topic })
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
      await refreshUser(); // Force update scores
    } catch (err) {
      console.error(err);
    } finally {
      setEnding(false);
    }
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center font-mono text-xs text-[#8E8E93]">Constructing dialogue environments...</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="border-b border-[#1C1C1E] pb-6">
        <h1 className="font-sans text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5 md:text-3xl">
          <MessageSquareCode className="h-7 w-7 text-emerald-400" />
          <span>Interview Prep Hub</span>
        </h1>
        <p className="text-xs text-[#8E8E93] mt-1.5 leading-relaxed">
          Pick technical modules to simulate dialogue streams with standard FAANG recruiters, or explore a library-grade high-yield question deck complete with robust AI model frameworks.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1C1C1E] pb-px">
        <button
          onClick={() => setActiveTab('simulation')}
          className={`px-5 py-3 text-xs font-bold tracking-tight border-b-2 transition ${
            activeTab === 'simulation'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-[#8E8E93] hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            <span>Interactive Recruiter Simulation</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('bank')}
          className={`px-5 py-3 text-xs font-bold tracking-tight border-b-2 transition ${
            activeTab === 'bank'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-[#8E8E93] hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Structured Question & Flashcard Deck</span>
          </div>
        </button>
      </div>

      {activeTab === 'simulation' ? (
        /* Real interactive recruiter chat simulation */
        <div className="space-y-6">
          {!session || session.status === 'completed' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-6 shadow-xs space-y-6">
                <h3 className="font-sans text-white font-semibold text-sm mb-4 border-b border-[#1C1C1E] pb-3 flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-emerald-400" />
                  <span>Configure Session Parameters</span>
                </h3>

                <div className="space-y-4 font-sans">
                  <div>
                    <label className="block text-[10px] font-mono text-[#8E8E93] uppercase tracking-wider mb-2">Subject Selection Priority</label>
                    <div className="grid grid-cols-1 gap-2.5">
                      {topics.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTopic(t)}
                          className={`
                            flex items-center justify-between rounded-lg p-3.5 text-sm font-semibold transition border text-left
                            ${topic === t
                              ? 'bg-emerald-500/5 border-emerald-500/40 text-emerald-400'
                              : 'bg-[#1C1C1E] border-[#2D2D30] text-[#8E8E93] hover:text-white hover:bg-[#1C1C20]'
                            }
                          `}
                        >
                          <span>{t}</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="text-xs text-rose-400 bg-rose-500/5 p-3 rounded-lg border border-rose-500/10">
                      {error}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleStartSession}
                    disabled={starting}
                    className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-2.5 text-xs font-bold transition shadow-[0_0_15px_rgba(16,185,129,0.25)] w-full"
                  >
                    {starting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-black" />
                        <span>Booting Recruiter AI...</span>
                      </>
                    ) : (
                      <>
                        <Activity className="h-4 w-4" />
                        <span>Initiate Interview Session</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Past reviews */}
              {session && session.status === 'completed' && (
                <div className="lg:col-span-1 rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-6 shadow-xs space-y-5">
                  <h3 className="font-sans text-white font-semibold text-sm border-b border-[#1C1C1E] pb-3 flex items-center gap-2">
                    <Award className="h-4.5 w-4.5 text-emerald-400" />
                    <span>FAANG Evaluation Report</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-4 text-center font-mono">
                    <div className="rounded-lg border border-[#2D2D30] p-3">
                      <span className="block text-2xl font-bold text-white">{session.score}/10</span>
                      <span className="text-[9px] uppercase tracking-wider text-[#8E8E93]">Aggregate Rank</span>
                    </div>
                    <div className="rounded-lg border border-[#2D2D30] p-3 text-emerald-400 bg-emerald-500/5">
                      <span className="block text-xs font-bold uppercase tracking-wider">Pass</span>
                      <span className="text-[9px] uppercase tracking-wider text-[#8E8E93]">Hiring Level</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <h4 className="font-sans font-bold text-white text-xs">Evaluator Feedback Guidelines</h4>
                    <p className="text-xs text-[#8E8E93] leading-relaxed select-all border-l-2 border-emerald-500/40 pl-3">
                      {session.feedback || 'Excellent system trade-offs discussion.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-[#2D2D30] bg-[#0E0E10] flex flex-col h-[550px] shadow-lg max-w-4xl mx-auto overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between bg-[#141416] border-b border-[#2D2D30] px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <div className="font-sans">
                    <h3 className="text-xs font-bold text-white leading-normal">Hiring Manager Live</h3>
                    <p className="text-[10px] text-[#8E8E93] mt-0.5 leading-none">Category: {session.topic}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleEndSession}
                  disabled={ending}
                  className="rounded-lg border border-rose-500/40 bg-rose-500/5 hover:bg-rose-500 hover:text-black py-1.5 px-3 text-[10.5px] font-bold text-rose-400 transition"
                >
                  {ending ? 'Evaluating Response...' : 'Complete & Generate AI Report'}
                </button>
              </div>

              {/* Message Streams viewport */}
              <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 font-sans focus:outline-hidden">
                {session.chatHistory.map((item: any, index: number) => {
                  const isAI = item.role === 'model';
                  return (
                    <div
                      key={index}
                      className={`flex items-start gap-3 max-w-[85%] ${
                        isAI ? '' : 'ml-auto flex-row-reverse'
                      }`}
                    >
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center border shrink-0 ${
                        isAI 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                          : 'bg-[#1C1C1E] border-[#2D2D30] text-purple-400'
                      }`}>
                        {isAI ? <Cpu className="h-4.5 w-4.5" /> : <UserIcon className="h-4.5 w-4.5" />}
                      </div>

                      <div className={`rounded-xl p-4 text-xs leading-relaxed select-all ${
                        isAI 
                          ? 'bg-[#141416] border border-[#2D2D30] text-[#E5E5E7]' 
                          : 'bg-emerald-500/5 border border-emerald-500/15 text-emerald-400'
                      }`}>
                        {item.parts[0]?.text || ''}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message inputs bottom */}
              <div className="p-4 border-t border-[#2D2D30] bg-[#141416]">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your response showing technical and behavioral skills..."
                    disabled={sending}
                    className="w-full bg-[#1C1C1E] border border-[#2D2D30] rounded-lg px-4 py-3 text-xs text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={sending || !reply.trim()}
                    className="flex items-center justify-center h-10 w-10 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black transition shrink-0 disabled:opacity-45"
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
          <div className="flex flex-wrap gap-2 pb-2">
            {subCategories.map((sc) => (
              <button
                key={sc}
                onClick={() => setSelectedSubCategory(sc)}
                className={`px-4 py-2 rounded-lg text-xs font-bold tracking-tight border transition ${
                  selectedSubCategory === sc
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                    : 'bg-[#141416]/50 border-[#2D2D30] text-[#8E8E93] hover:text-white'
                }`}
              >
                {sc}
              </button>
            ))}
          </div>

          {loadingQuestions ? (
            <div className="py-16 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-400 mx-auto mb-4" />
              <p className="text-xs font-mono text-[#8E8E93]">Synthesizing high-yield interview questions using Gemini...</p>
            </div>
          ) : questionsError ? (
            <div className="rounded-xl border border-rose-500/10 bg-rose-500/5 p-6 text-center">
              <p className="text-xs text-rose-400">{questionsError}</p>
            </div>
          ) : questions.length > 0 ? (
            <div className="grid grid-cols-1 gap-5">
              {questions.map((q) => {
                const isExpanded = expandedQuestionId === q.id;
                return (
                  <div 
                    key={q.id} 
                    className={`rounded-xl border transition-all duration-300 overflow-hidden leading-relaxed ${
                      isExpanded ? 'border-emerald-500/30 bg-[#141416]' : 'border-[#2D2D30] bg-[#141416]/40 hover:border-[#3D3D42]'
                    }`}
                  >
                    {/* Header bar / reveal trigger */}
                    <div 
                      onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                      className="p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/15 font-bold">
                            Question
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase leading-none ${
                            q.difficulty.toLowerCase().includes('hard')
                              ? 'text-rose-400 bg-rose-500/10 border border-rose-500/15'
                              : q.difficulty.toLowerCase().includes('medium')
                              ? 'text-amber-400 bg-amber-500/10 border border-amber-500/15'
                              : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/15'
                          }`}>
                            {q.difficulty}
                          </span>
                        </div>
                        <h3 className="font-sans text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {q.question}
                        </h3>
                      </div>

                      <button className="text-[#8E8E93] hover:text-white transition">
                        <ChevronDown className={`h-5 w-5 transform transition-transform duration-300 ${isExpanded ? 'rotate-180 text-emerald-400' : ''}`} />
                      </button>
                    </div>

                    {/* Disclosures answer panel */}
                    {isExpanded && (
                      <div className="px-5 pb-6 pt-1 border-t border-[#1C1C1E] bg-[#0E0E10]/70 space-y-4">
                        {/* Summary conceptual info */}
                        <div className="space-y-1.5">
                          <h4 className="text-[10px] font-bold text-amber-400 uppercase tracking-wider font-mono">Conceptual Overview</h4>
                          <p className="text-xs text-[#AEAEB2] leading-relaxed">
                            {q.explanation}
                          </p>
                        </div>

                        {/* Model answer */}
                        <div className="space-y-2 font-sans rounded-lg border border-emerald-500/10 bg-emerald-500/5 p-4">
                          <h4 className="text-[10.5px] font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                            <CheckCircle className="h-4 w-4" />
                            <span>Recommended Answer Framework</span>
                          </h4>
                          <p className="text-xs text-[#E5E5E7] leading-relaxed whitespace-pre-wrap">
                            {q.modelAnswer}
                          </p>
                        </div>

                        {/* Follow up items */}
                        {q.followUpQuestions && q.followUpQuestions.length > 0 && (
                          <div className="space-y-2 pt-1">
                            <h4 className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider font-mono">Possible Interviewer Follow-Ups</h4>
                            <ul className="space-y-1.5 text-xs text-[#8E8E93]">
                              {q.followUpQuestions.map((fq, fi) => (
                                <li key={fi} className="flex gap-2.5 items-start">
                                  <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
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
            <div className="rounded-xl border border-[#2D2D30] border-dashed p-12 text-center">
              <HelpCircle className="h-10 w-10 text-[#8E8E93] mx-auto mb-3 opacity-50" />
              <p className="text-xs text-[#8E8E93]">No high-yield flashcard files created yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default InterviewPrep;
