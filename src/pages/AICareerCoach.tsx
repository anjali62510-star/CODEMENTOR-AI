import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { 
  Send, 
  Compass, 
  Code2, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  Award,
  Terminal,
  RefreshCw,
  Sparkles,
  Bookmark,
  Waves,
  Anchor,
  Ship,
  HelpCircle
} from 'lucide-react';
import { OceanPageShell, OceanPageHeader } from '../components/ocean/OceanUI';

interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
}

export const AICareerCoach: React.FC = () => {
  const { user, apiFetch } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Suggested prompt templates listed in product requirements
  const starterQuestions = [
    { text: `How do I navigate my career voyage to become a ${user?.onboarding?.targetRole || 'Software Engineer'}?`, label: 'Pathway Map' },
    { text: 'Which technical currents should I explore after React and TypeScript Islands?', label: 'Framework Roadmap' },
    { text: 'Am I prepared to clear recruiter harbor checkpoints right now?', label: 'Readiness Audit' },
    { text: 'What portfolio vessels should I construct next in the Code Ocean?', label: 'Portfolio Drafting' }
  ];

  // Load welcome prompt or memory history when component mounts
  useEffect(() => {
    if (user) {
      const savedHistory = localStorage.getItem(`codementor_chat_history_${user._id}`);
      if (savedHistory) {
        try {
          const parsed = JSON.parse(savedHistory);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
            return;
          }
        } catch (e) {
          console.warn("Failed to retrieve local coaching history:", e);
        }
      }

      setMessages([
        {
          id: 'welcome',
          sender: 'coach',
          text: `👋 **Ahoy, ${user.name.split(' ')[0]}**! I am **Captain Mentor** ⚓, your personal **Ocean Guide AI** of the professional High Seas.
          
Your voyage progress stands at **${user.scores.careerReadiness}%** to anchor at safe employment harbors! 🚀

Here is the current readings of your navigation coordinates:
- **Consolidated Career Compass**: \`${user.scores.careerReadiness}%\` bearing
- **Code Ocean Analytics**: \`${user.scores.github}%\` current alignment
- **DSA Sea Lanes Solved**: \`${user.scores.dsa}%\` depth
- **Recruiter Radar Rating**: \`${user.scores.resume}%\` ast sonar grade

How can I help you adjust your rudder or chart your technical journey today? Ask me about specific coding islands, STAR action-bullet drafting, or subsea time-complexity currents!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [user]);

  // Sync state mutations cleanly with browser memory
  useEffect(() => {
    if (user && messages.length > 0) {
      localStorage.setItem(`codementor_chat_history_${user._id}`, JSON.stringify(messages));
    }
  }, [messages, user]);

  // Handle auto-scroll as chats expand
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, sending]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText ? customText.trim() : inputText.trim();
    if (!textToSend || sending) return;

    if (!customText) {
      setInputText('');
    }

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 11),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setSending(true);
    setError(null);

    try {
      const historyPayload = [...messages, userMsg].map(m => ({
        sender: m.sender,
        text: m.text
      }));

      // Inject nautical system prompt modifiers on backend chat proxies
      const response = await apiFetch('/api/coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historyPayload })
      });

      if (response && response.reply) {
        setMessages(prev => [...prev, {
          id: Math.random().toString(36).substring(2, 11),
          sender: 'coach',
          text: response.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error('Ocean Guide response stalled in dark waters.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with Ocean Guide.');
    } finally {
      setSending(false);
    }
  };

  const handleClearHistory = () => {
    if (user) {
      setMessages([
        {
          id: 'welcome-reset',
          sender: 'coach',
          text: `Anchor lines re-tensioned. I've reset our communication lines. What oceanic or professional questions are on your mind?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const renderFormattedText = (rawStr: string) => {
    const lines = rawStr.split('\n');
    return lines.map((line, lIdx) => {
      // Replace basic **text** wrappers with bold styles
      const boldSegments = line.split('**');
      const renderedSegments = boldSegments.map((segment, sIdx) => {
        if (sIdx % 2 === 1) {
          return <strong key={sIdx} className="font-extrabold text-[#00B8D9]">{segment}</strong>;
        }
        // Handle basic backticks `code`
        const codeSegments = segment.split('`');
        return codeSegments.map((subSeg, csIdx) => {
          if (csIdx % 2 === 1) {
            return (
              <code key={csIdx} className="bg-cyan-50 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-300 font-mono text-[11px] px-1.5 py-0.5 rounded border border-cyan-150/40 mx-0.5 font-bold">
                {subSeg}
              </code>
            );
          }
          return subSeg;
        });
      });

      return (
        <span key={lIdx} className="block min-h-[4px] leading-relaxed mt-1">
          {renderedSegments}
        </span>
      );
    });
  };

  if (!user) return null;

  return (
    <OceanPageShell>
      <OceanPageHeader
        title="Captain Mentor"
        subtitle="Your AI Ocean Guide — career guidance, resume advice, GitHub insights, DSA recommendations, and open source navigation."
        icon={Compass}
        badge="OCEAN GUIDE AI"
        action={
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleClearHistory}
            className="ocean-btn-secondary !w-auto text-[10px]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Clear Logbook
          </motion.button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Main Conversation Sandbox Container */}
        <div className="lg:col-span-3 flex flex-col h-[580px] rounded-3xl border border-[#D2E1ED] dark:border-[#123456] bg-white dark:bg-[#061524]/60 shadow-xs overflow-hidden">
          
          {/* Header context band */}
          <div className="border-b border-[#D2E1ED] dark:border-[#123456]/40 bg-[#F8FAFC] dark:bg-[#030D18]/95 px-5 py-3 flex items-center justify-between font-mono text-[10px]">
            <div className="flex items-center gap-2 text-[#5C768D] dark:text-cyan-400 font-extrabold text-[9px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00B8D9] animate-pulse" />
              <span>COMMAND LOCK CABINET • PASSIVE DECK</span>
            </div>
            <div className="text-slate-400 dark:text-cyan-550 uppercase font-black">
              Fleet Course: {user.onboarding?.targetRole}
            </div>
          </div>

          {/* Active Chat Log Stream */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 font-sans text-xs select-text">
            {messages.map((m) => {
              const isCoach = m.sender === 'coach';
              return (
                <div 
                  key={m.id} 
                  className={`flex items-start gap-3.5 ${isCoach ? 'justify-start' : 'justify-end'}`}
                >
                  {isCoach && (
                    <motion.div 
                      animate={{ y: [0, -3, 0] }}
                      transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                      className="h-8.5 w-8.5 rounded-xl bg-cyan-100/60 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-[#00B8D9] flex items-center justify-center shrink-0"
                    >
                      <Anchor className="h-4 w-4" />
                    </motion.div>
                  )}

                  <div className={`max-w-[85%] rounded-3xl px-4.5 py-4 space-y-1.5 relative border ${
                    isCoach 
                      ? 'bg-[#F8FAFC] dark:bg-[#030D18]/60 border-[#D2E1ED] dark:border-[#123456]/80 text-[#0A2540] dark:text-[#E2E8F0] rounded-tl-none' 
                      : 'bg-cyan-100/20 dark:bg-cyan-500/10 border-cyan-200/50 dark:border-cyan-900/10 text-[#0A2540] dark:text-cyan-150 rounded-tr-none'
                  }`}>
                    {/* Timestamp bubble */}
                    <span className="absolute top-2.5 right-4.5 font-mono text-[8px] text-[#5C768D] dark:text-cyan-405 font-bold">{m.timestamp}</span>
                    
                    {/* Message Body */}
                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-1 text-xs leading-relaxed font-semibold">
                      {renderFormattedText(m.text)}
                    </div>
                  </div>

                  {!isCoach && (
                    <div className="h-8.5 w-8.5 rounded-full bg-gradient-to-tr from-[#00B8D9] to-[#0F4C81] text-white flex items-center justify-center font-black text-xs shrink-0 select-none shadow-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Pulsing Dots reply simulator loader */}
            {sending && (
              <div className="flex items-start gap-3.5 justify-start">
                <motion.div 
                  animate={{ y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                  className="h-8.5 w-8.5 rounded-xl bg-cyan-100/60 dark:bg-cyan-500/10 border border-cyan-200/50 dark:border-cyan-500/20 text-[#00B8D9] flex items-center justify-center shrink-0"
                >
                  <Anchor className="h-4.5 w-4.5" />
                </motion.div>
                <div className="bg-[#F8FAFC] dark:bg-[#030D18]/70 border border-[#D2E1ED] dark:border-[#123456] rounded-3xl rounded-tl-none px-4.5 py-3.5 flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#00B8D9] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-1.5 w-1.5 rounded-full bg-[#00B8D9] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="h-1.5 w-1.5 rounded-full bg-[#00B8D9] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-rose-500/10 bg-rose-500/5 p-4 text-xs text-rose-500 dark:text-rose-400 text-center font-mono select-none">
                {error}
              </div>
            )}

            <div ref={scrollRef} />
          </div>

          {/* Quick starter question suggestions pillbox */}
          {messages.length < 3 && (
            <div className="px-5 py-3 border-t border-[#D2E1ED] dark:border-[#123456]/40 bg-[#F8FAFC]/50 dark:bg-[#030D18]/30 space-y-2 select-none">
              <span className="block font-mono text-[9px] uppercase text-[#5C768D] dark:text-cyan-400 tracking-wider font-extrabold flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-[#00B8D9]" />
                <span>Suggested Mentorship Queries:</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-1">
                {starterQuestions.map((q, qidx) => (
                  <button
                    key={qidx}
                    type="button"
                    onClick={() => handleSendMessage(q.text)}
                    className="group flex items-center justify-between rounded-xl border border-[#D2E1ED] dark:border-[#123456] bg-white dark:bg-[#061524]/75 px-3 py-2 text-left hover:border-cyan-400 dark:hover:border-cyan-600 hover:bg-[#F8FAFC] transition duration-200 cursor-pointer"
                  >
                    <div className="space-y-0.5 max-w-[90%]">
                      <span className="block font-mono text-[8px] text-[#5C768D] dark:text-cyan-405 uppercase font-bold group-hover:text-[#00B8D9] transition-colors">{q.label}</span>
                      <p className="text-[10.5px] text-[#0A2540] dark:text-white truncate font-sans font-bold">{q.text}</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-[#5C768D] group-hover:text-[#00B8D9] group-hover:translate-x-0.5 transition shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input field tray container */}
          <div className="border-t border-[#D2E1ED] dark:border-[#123456]/40 bg-[#F8FAFC] dark:bg-[#030D18] p-4 font-sans select-none">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-3 bg-white dark:bg-[#061524] border border-[#D2E1ED] dark:border-[#123456] rounded-2xl px-4.5 py-1 focus-within:border-cyan-500/40 focus-within:ring-1 focus-within:ring-cyan-500/10 transition"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Query Captain Mentor (e.g., "Which system design patterns do I map next?")`}
                disabled={sending}
                className="flex-1 bg-transparent py-3.5 text-xs text-[#0A2540] dark:text-white placeholder-slate-400 dark:placeholder-cyan-550 focus:outline-hidden disabled:opacity-50 font-bold"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || sending}
                className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-gradient-to-r from-[#00B8D9] to-[#0F4C81] text-white font-semibold disabled:opacity-40 transition shrink-0 cursor-pointer shadow-xs"
              >
                {sending ? (
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Diagonal Context Side Panel Card */}
        <div className="lg:col-span-1 space-y-6 select-none font-sans text-[11px] text-[#5C768D] dark:text-cyan-400 font-semibold text-xs border-zinc-200">
          
          {/* Active Context metadata */}
          <div className="rounded-3xl border border-[#D2E1ED] dark:border-[#123456] bg-white dark:bg-[#061524]/50 p-5 space-y-4">
            <h3 className="font-display text-[#0A2540] dark:text-white font-black text-xs border-b border-slate-100 dark:border-[#123456]/40 pb-2 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#00B8D9]" />
              <span>NAVIGATION TELEMETRY</span>
            </h3>

            <p className="text-[11.5px] leading-relaxed">
              Captain Mentor anchors the active dialogue context using your onboarding credentials and subsea repository scans.
            </p>

            <div className="space-y-3 pt-2 border-t border-[#D2E1ED]/50 dark:border-[#123456]/30">
              <div>
                <span className="block uppercase text-[8.5px] text-slate-400 dark:text-cyan-405 tracking-wider font-extrabold">Course Category:</span>
                <span className="block text-[#0A2540] dark:text-white font-bold mt-0.5">{user.onboarding?.targetRole}</span>
              </div>
              <div>
                <span className="block uppercase text-[8.5px] text-slate-400 dark:text-cyan-405 tracking-wider font-extrabold">Seaworthy Level:</span>
                <span className="block text-[#0A2540] dark:text-white font-bold mt-0.5 capitalize">{user.onboarding?.experienceLevel} Voyage</span>
              </div>
              <div>
                <span className="block uppercase text-[8.5px] text-slate-400 dark:text-cyan-405 tracking-wider font-extrabold">Known Channels:</span>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {user.profile?.skills?.slice(0, 5).map(s => (
                    <span key={s} className="bg-slate-100 dark:bg-[#061524] text-slate-600 dark:text-cyan-200 border border-[#D2E1ED]/60 dark:border-[#123456]/60 px-2 py-0.5 rounded-md text-[9.5px] font-bold">
                      {s}
                    </span>
                  )) || <span className="text-[#8E8E93] italic">None declared</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Connected Metrics Cards */}
          <div className="rounded-3xl border border-[#D2E1ED] dark:border-[#123456] bg-white dark:bg-[#061524]/50 p-5 space-y-3.5">
            <h3 className="font-display text-[#0A2540] dark:text-slate-350 font-black text-xs border-b border-slate-100 dark:border-[#123456]/30 pb-2 flex items-center gap-1.5">
              <Award className="h-4.5 w-4.5 text-[#00B8D9]" />
              <span>Bearing Percentiles</span>
            </h3>

            <div className="space-y-2.5 pt-0.5">
              <div className="flex items-center justify-between">
                <span>Total Compass Readiness:</span>
                <strong className="text-[#00B8D9] font-black">{user.scores.careerReadiness}%</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Code Ocean Quality:</span>
                <strong className="text-slate-800 dark:text-white font-bold">{user.scores.github}%</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>DSA Sea Lanes Index:</span>
                <strong className="text-slate-800 dark:text-white font-bold">{user.scores.dsa}%</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Recruiter Radar Grade:</span>
                <strong className="text-slate-800 dark:text-white font-bold">{user.scores.resume}%</strong>
              </div>
            </div>
          </div>

          {/* Help instructions block */}
          <div className="rounded-3xl border border-cyan-500/10 bg-cyan-550/5 p-5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#00B8D9] font-extrabold uppercase tracking-wider text-[9.5px]">
              <HelpCircle className="h-4 w-4" />
              <span>Captain's Log</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#5C768D] dark:text-cyan-100">
              Rudder dragging? Complete algorithmic Sea Lane challenges, update resume text outlines, or parse green public repositories to instantly update Captain Mentor's feedback context!
            </p>
          </div>

        </div>
      </div>
    </OceanPageShell>
  );
};

export default AICareerCoach;
