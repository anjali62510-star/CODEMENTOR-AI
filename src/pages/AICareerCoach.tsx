import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { 
  Bot, 
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
  Zap,
  Bookmark
} from 'lucide-react';

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
    { text: `How do I become a ${user?.onboarding?.targetRole || 'Software Engineer'}?`, label: 'Hiring Pathway' },
    { text: 'What should I learn after React and TypeScript?', label: 'Framework Roadmap' },
    { text: 'Am I ready for internship interviews right now?', label: 'Readiness Audit' },
    { text: 'Which core portfolio projects should I build next?', label: 'Portfolio Ideas' }
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
          text: `👋 **Hi ${user.name.split(' ')[0]}**! I am your personal **CodeMentor AI Career Coach** 🤖.

You're **${user.scores.careerReadiness}%** ready for **${user.onboarding?.targetRole || 'Software Engineering'}** roles! 🚀

Here is your dynamic breakdown:
- **Consolidated Career Index**: \`${user.scores.careerReadiness}%\`
- **GitHub Audit Quality**: \`${user.scores.github}%\`
- **DSA tracker**: \`${user.scores.dsa}%\`
- **Resume ATS Alignment**: \`${user.scores.resume}%\`

How can I help accelerate your application velocity today? Ask me about specific technical requirements, target resume bullet formulations, or custom study sequences!`,
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
        throw new Error('AI Coach response timed out.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with AI Coach.');
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
          text: `Handshake reset. I've re-initialized our active coaching session using your profile matrix. What engineering or career questions are on your mind?`,
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
          return <strong key={sIdx} className="font-extrabold text-violet-700 dark:text-violet-300">{segment}</strong>;
        }
        // Handle basic backticks `code`
        const codeSegments = segment.split('`');
        return codeSegments.map((subSeg, csIdx) => {
          if (csIdx % 2 === 1) {
            return (
              <code key={csIdx} className="bg-slate-100 dark:bg-slate-800 text-pink-600 dark:text-emerald-400 font-mono text-[11px] px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/5 mx-0.5 font-bold">
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
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="border-b border-slate-200 dark:border-[#1C1C1E] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-2.5 md:text-3xl">
            <Bot className="h-7 w-7 text-violet-500" />
            <span>AI Career Coach</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#8E8E93] mt-1.5 leading-relaxed font-semibold">
            Your conversational systems lead and placement advisor. Ask anything about system architecture, roadmap bottlenecks, or resume STAR optimizations.
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={handleClearHistory}
          className="self-start md:self-auto flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-500 dark:text-[#8E8E93] hover:text-slate-800 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-[#141416]/50 border border-slate-200 dark:border-[#2D2D30] px-3.5 py-2 rounded-xl transition cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Reset Handshake Session</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Main Conversation Sandbox Container */}
        <div className="lg:col-span-3 flex flex-col h-[580px] rounded-3xl border border-slate-200 dark:border-[#2D2D30]/60 bg-white dark:bg-[#141416]/40 shadow-xs overflow-hidden">
          
          {/* Header context band */}
          <div className="border-b border-slate-200 dark:border-[#1C1C1E] bg-slate-50 dark:bg-[#0E0E10]/95 px-5 py-3 flex items-center justify-between font-mono text-[10px]">
            <div className="flex items-center gap-2 text-slate-500 dark:text-[#AEAEB2] font-extrabold">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
              <span>COACH-BOT INTERACTION PORTAL</span>
            </div>
            <div className="text-slate-400 dark:text-[#8E8E93] uppercase font-black">
              Target Track: {user.onboarding?.targetRole}
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
                      className="h-8.5 w-8.5 rounded-xl bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0"
                    >
                      <Bot className="h-4.5 w-4.5" />
                    </motion.div>
                  )}

                  <div className={`max-w-[85%] rounded-3xl px-4.5 py-4 space-y-1.5 relative border ${
                    isCoach 
                      ? 'bg-slate-50 dark:bg-[#1E293B]/70 border-slate-200 dark:border-slate-800/80 text-slate-800 dark:text-[#E5E5E7] rounded-tl-none' 
                      : 'bg-violet-55/70 dark:bg-violet-500/5 border-violet-150 dark:border-violet-500/25 text-violet-950 dark:text-violet-100 rounded-tr-none'
                  }`}>
                    {/* Timestamp bubble */}
                    <span className="absolute top-2.5 right-4.5 font-mono text-[8px] text-slate-400 dark:text-[#8E8E93] font-bold">{m.timestamp}</span>
                    
                    {/* Message Body */}
                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-1 text-xs leading-relaxed font-semibold">
                      {renderFormattedText(m.text)}
                    </div>
                  </div>

                  {!isCoach && (
                    <div className="h-8.5 w-8.5 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 text-white flex items-center justify-center font-black text-xs shrink-0 select-none shadow-xs">
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
                  className="h-8.5 w-8.5 rounded-xl bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0"
                >
                  <Bot className="h-4.5 w-4.5" />
                </motion.div>
                <div className="bg-slate-50 dark:bg-[#1E293B]/70 border border-slate-200 dark:border-slate-800/80 rounded-3xl rounded-tl-none px-4.5 py-3.5 flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '300ms' }} />
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
            <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800/60 bg-slate-50/50 dark:bg-[#0E0E10]/30 space-y-2 select-none">
              <span className="block font-mono text-[9px] uppercase text-slate-400 dark:text-[#8E8E93] tracking-wider font-extrabold flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-violet-500" />
                <span>Suggested Mentorship Queries:</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-1">
                {starterQuestions.map((q, qidx) => (
                  <button
                    key={qidx}
                    type="button"
                    onClick={() => handleSendMessage(q.text)}
                    className="group flex items-center justify-between rounded-xl border border-slate-200 dark:border-[#2D2D30] bg-white dark:bg-[#141416]/75 px-3 py-2 text-left hover:border-violet-500/45 dark:hover:border-violet-500/30 hover:bg-slate-50 dark:hover:bg-[#1C1C1E] transition duration-200 cursor-pointer"
                  >
                    <div className="space-y-0.5 max-w-[90%]">
                      <span className="block font-mono text-[8px] text-slate-400 dark:text-[#8E8E93] uppercase font-bold group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors">{q.label}</span>
                      <p className="text-[10.5px] text-slate-700 dark:text-white truncate font-sans font-bold">{q.text}</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 dark:text-[#8E8E93] group-hover:text-violet-500 dark:group-hover:text-violet-400 group-hover:translate-x-0.5 transition shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input field tray container */}
          <div className="border-t border-slate-200 dark:border-[#1C1C1E] bg-slate-50 dark:bg-[#0E0E10] p-4 font-sans select-none">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-3 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-[#2D2D30] rounded-2xl px-4.5 py-1 focus-within:border-violet-500/40 focus-within:ring-1 focus-within:ring-violet-500/10 transition"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Ask CodeMentor Coach (e.g., "What system design items do I study next?")`}
                disabled={sending}
                className="flex-1 bg-transparent py-3.5 text-xs text-slate-705 dark:text-white placeholder-slate-400 dark:placeholder-[#8E8E93] focus:outline-hidden disabled:opacity-50 font-bold"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || sending}
                className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-semibold disabled:bg-slate-100 dark:disabled:bg-[#151518] disabled:text-[#8E8E93] transition shrink-0 cursor-pointer shadow-xs"
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
        <div className="lg:col-span-1 space-y-6 select-none font-sans text-[11px] text-slate-500 dark:text-[#8E8E93] font-semibold">
          
          {/* Active Context metadata */}
          <div className="rounded-3xl border border-slate-200 dark:border-[#2D2D30]/60 bg-white dark:bg-[#141416]/50 p-5 space-y-4">
            <h3 className="font-display text-slate-800 dark:text-white font-extrabold text-xs border-b border-slate-100 dark:border-[#1C1C1E] pb-2 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-violet-500" />
              <span>COACH CONTEXT SYNC</span>
            </h3>

            <p className="text-[11px] text-slate-500 dark:text-[#8E8E93] leading-relaxed">
              Our conversation parameters are dynamically grounded using your profile onboarding and local sandbox diagnostic states.
            </p>

            <div className="space-y-3 pt-2 border-t border-slate-150 dark:border-[#1C1C1E]">
              <div>
                <span className="block uppercase text-[8.5px] text-slate-450 dark:text-[#AEAEB2] tracking-wider font-extrabold">Target Career:</span>
                <span className="block text-slate-800 dark:text-white font-extrabold mt-0.5">{user.onboarding?.targetRole}</span>
              </div>
              <div>
                <span className="block uppercase text-[8.5px] text-slate-450 dark:text-[#AEAEB2] tracking-wider font-extrabold">Grade level:</span>
                <span className="block text-slate-800 dark:text-white font-extrabold mt-0.5 capitalize">{user.onboarding?.experienceLevel} Track</span>
              </div>
              <div>
                <span className="block uppercase text-[8.5px] text-slate-450 dark:text-[#AEAEB2] tracking-wider font-extrabold">Profile skills tags:</span>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {user.profile?.skills?.slice(0, 5).map(s => (
                    <span key={s} className="bg-slate-100 dark:bg-[#1C1C1E] text-slate-600 dark:text-[#AEAEB2] border border-slate-200 dark:border-[#2D2D30] px-2 py-0.5 rounded-md text-[9.5px] font-bold">
                      {s}
                    </span>
                  )) || <span className="text-[#8E8E93] italic">None declared</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Connected Metrics Cards */}
          <div className="rounded-3xl border border-slate-200 dark:border-[#2D2D30]/60 bg-white dark:bg-[#141416]/50 p-5 space-y-3.5">
            <h3 className="font-display text-slate-800 dark:text-[#E5E5E7] font-extrabold text-xs border-b border-slate-100 dark:border-[#1C1C1E] pb-2 flex items-center gap-1.5">
              <Award className="h-4.5 w-4.5 text-violet-500" />
              <span>Current Percentiles</span>
            </h3>

            <div className="space-y-2.5 pt-0.5">
              <div className="flex items-center justify-between">
                <span>Total Readiness:</span>
                <strong className="text-violet-600 dark:text-emerald-400 font-extrabold">{user.scores.careerReadiness}%</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>GitHub Quality:</span>
                <strong className="text-slate-800 dark:text-white font-extrabold">{user.scores.github}%</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>DSA Index:</span>
                <strong className="text-slate-800 dark:text-white font-extrabold">{user.scores.dsa}%</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Resume ATS Align:</span>
                <strong className="text-slate-800 dark:text-white font-extrabold">{user.scores.resume}%</strong>
              </div>
            </div>
          </div>

          {/* AI Terminal Note */}
          <div className="rounded-3xl border border-violet-500/10 bg-violet-500/5 p-5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400 font-extrabold uppercase tracking-wider text-[9.5px]">
              <Terminal className="h-4 w-4" />
              <span>Diagnostic Syncing</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-[#8E8E93] leading-relaxed">
              Want to recalculate these values? Practice algorithm challenges, expand your biography details, or commit additional projects. Your mentor instantly adapts context!
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
export default AICareerCoach;
