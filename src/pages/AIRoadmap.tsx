import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AIRoadmap as AIRoadmapType } from '../types';
import { motion } from 'motion/react';
import { 
  Map, 
  Sparkles, 
  Loader2, 
  CheckCircle, 
  Circle, 
  BookOpen, 
  Calendar,
  Compass,
  ArrowRight,
  Cpu,
  Bookmark,
  Award,
  BookMarked
} from 'lucide-react';

export const AIRoadmap: React.FC = () => {
  const { user, apiFetch } = useAuth();
  const [timeline, setTimeline] = useState('12 weeks');
  const [targetRole, setTargetRole] = useState(user?.onboarding?.targetRole || 'Software Engineer');
  const [currentSkillLevel, setCurrentSkillLevel] = useState(user?.onboarding?.experienceLevel || 'beginner');
  const [currentTechnologies, setCurrentTechnologies] = useState('React, JavaScript, HTML, CSS');
  const [roadmap, setRoadmap] = useState<AIRoadmapType | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const fetchRoadmap = async () => {
    try {
      const data = await apiFetch('/api/roadmap');
      if (data.roadmap) {
        setRoadmap(data.roadmap);
        if (data.roadmap.role) setTargetRole(data.roadmap.role);
      }
    } catch (err) {
      console.error('No roadmap generated yet:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const data = await apiFetch('/api/roadmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          timeline,
          targetRole,
          currentSkillLevel,
          currentTechnologies
        })
      });
      setRoadmap(data.roadmap);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleStepStatusToggle = async (stepId: string, currentStatus: string) => {
    setSyncingId(stepId);
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      const data = await apiFetch(`/api/roadmap/step/${stepId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      setRoadmap(data.roadmap);
    } catch (err) {
      console.error(err);
    } finally {
      setSyncingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center font-mono text-xs text-slate-400 dark:text-[#8E8E93]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
          <span>Mapping syllabus curriculum stages...</span>
        </div>
      </div>
    );
  }

  const completedSteps = roadmap?.steps.filter(s => s.status === 'completed').length || 0;
  const totalSteps = roadmap?.steps.length || 0;
  const progressPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const roleOptions = [
    'Frontend Developer',
    'Software Engineer',
    'Data Analyst',
    'Data Scientist',
    'ML Engineer'
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12 select-none">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-[#1C1C1E] pb-6">
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-2.5 md:text-3xl">
            <Map className="h-7 w-7 text-violet-500" />
            <span>AI Curriculum Roadmap</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#8E8E93] mt-1.5 leading-relaxed font-semibold">
            Track multi-week sequential syllabus modules generated matching your profile constraints. Click complete to earn habit points on your Dashboard!
          </p>
        </div>
      </div>

      {/* Configuration Box */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-[#2D2D30]/60 bg-white dark:bg-[#1E293B]/40 p-6 shadow-xs space-y-4">
        <h3 className="font-display font-extrabold text-slate-800 dark:text-white text-sm flex items-center gap-2 mb-3">
          <Cpu className="h-4.5 w-4.5 text-violet-500" />
          <span>Personalize Roadmap Blueprint</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 font-sans text-xs">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono text-slate-400 dark:text-[#8E8E93] uppercase tracking-wider font-extrabold">Target Career Role</label>
            <select
              value={roleOptions.includes(targetRole) ? targetRole : 'Custom'}
              onChange={(e) => {
                if (e.target.value !== 'Custom') {
                  setTargetRole(e.target.value);
                }
              }}
              className="bg-slate-50 dark:bg-[#1C1C1E] border border-slate-200 dark:border-[#2D2D30] text-xs font-semibold text-slate-800 dark:text-white px-2.5 py-3 rounded-xl focus:outline-hidden"
            >
              {roleOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
              <option value="Custom">Custom Target Role</option>
            </select>
          </div>

          {!roleOptions.includes(targetRole) || targetRole === 'Custom' ? (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-slate-400 dark:text-[#8E8E93] uppercase tracking-wider font-extrabold">Custom Role Title</label>
              <input
                type="text"
                placeholder="e.g. DevOps Engineer"
                value={targetRole === 'Custom' ? '' : targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="bg-slate-50 dark:bg-[#1C1C1E] border border-slate-200 dark:border-[#2D2D30] text-xs font-semibold text-slate-800 dark:text-white px-3 py-2.5 rounded-xl focus:outline-hidden"
              />
            </div>
          ) : null}

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono text-slate-400 dark:text-[#8E8E93] uppercase tracking-wider font-extrabold">Current Skill Level</label>
            <select
              value={currentSkillLevel}
              onChange={(e) => setCurrentSkillLevel(e.target.value)}
              className="bg-slate-50 dark:bg-[#1C1C1E] border border-slate-200 dark:border-[#2D2D30] text-xs font-semibold text-slate-800 dark:text-white px-2.5 py-3 rounded-xl focus:outline-hidden"
            >
              <option value="beginner">Beginner Track (Core Basics)</option>
              <option value="intermediate">Intermediate Track (Hands-on)</option>
              <option value="advanced">Advanced Track (System flows)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono text-slate-400 dark:text-[#8E8E93] uppercase tracking-wider font-extrabold">Study Duration Runway</label>
            <select
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              className="bg-slate-50 dark:bg-[#1C1C1E] border border-slate-200 dark:border-[#2D2D30] text-xs font-semibold text-slate-800 dark:text-white px-2.5 py-3 rounded-xl focus:outline-hidden"
            >
              <option value="6 weeks">Speed Runway (6 Weeks)</option>
              <option value="12 weeks">Standard Focus (12 Weeks)</option>
              <option value="24 weeks">Full Comprehensive (24 Weeks)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-[10px] font-mono text-slate-400 dark:text-[#8E8E93] uppercase tracking-wider font-extrabold">Technologies Already Claimed</label>
            <input
              type="text"
              placeholder="e.g. React, JavaScript, HTML, CSS"
              value={currentTechnologies}
              onChange={(e) => setCurrentTechnologies(e.target.value)}
              className="bg-slate-50 dark:bg-[#1C1C1E] border border-slate-200 dark:border-[#2D2D30] text-xs font-semibold text-slate-800 dark:text-white px-3.5 py-2.5 rounded-xl focus:outline-hidden placeholder-slate-400"
            />
          </div>

          <div className="flex items-end justify-start md:col-span-2">
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={handleGenerate}
              disabled={generating}
              className="w-full flex items-center justify-center gap-2 rounded-full cursor-pointer bg-gradient-to-r from-violet-500 to-indigo-600 text-white py-3 text-xs font-bold transition shadow-xs hover:shadow-md disabled:opacity-50"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  <span>Compiling Curriculum Stages...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4.5 w-4.5" />
                  <span>Generate Customized Syllabus</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {roadmap ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Timeline Milestones Side Card */}
          <div className="lg:col-span-1 rounded-3xl border border-slate-200/80 dark:border-[#2D2D30]/60 bg-white dark:bg-[#1E293B]/40 p-6 self-start shadow-xs flex flex-col justify-between">
            <div className="space-y-3.5 pb-2">
              <span className="block text-[9.5px] font-mono tracking-widest text-slate-400 dark:text-[#8E8E93] uppercase font-bold">Target Path</span>
              <h3 className="font-display font-black text-slate-850 dark:text-white text-base leading-snug">{roadmap.role}</h3>
              
              <div className="space-y-1 pt-1">
                <p className="text-[11px] text-slate-500 dark:text-[#8E8E93] font-mono">
                  Duration limit: <strong className="text-slate-800 dark:text-slate-100">{roadmap.timeline}</strong>
                </p>
                <p className="text-[9.5px] font-mono text-slate-400 dark:text-slate-500">
                  Last generated: {new Date(roadmap.lastGenerated).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Overall steps progression bar stats */}
            <div className="mt-8 border-t border-slate-100 dark:border-[#1C1C1E] pt-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9.5px] font-mono text-slate-450 dark:text-[#8E8E93] uppercase font-bold">Syllabus Complete</span>
                <span className="text-xs font-black text-violet-650 dark:text-emerald-450 font-mono">{progressPercentage}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-[#1C1C1E] overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-700" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-[#8E8E93] font-sans font-semibold mt-2.5">
                Completed {completedSteps} of {totalSteps} milestones
              </p>
            </div>
          </div>

          {/* Stepped Timeline Roadmap column */}
          <div className="lg:col-span-3 space-y-6">
            <div className="relative pl-6 border-l-2 border-slate-200 dark:border-[#1C1C1E] ml-4 space-y-8">
              {roadmap.steps.map((step, idx) => {
                const isCompleted = step.status === 'completed';
                const isSyncing = syncingId === step.id;

                return (
                  <div key={step.id} className="relative group overflow-visible">
                    {/* Circle Node Tracker handle */}
                    <div className="absolute -left-[35px] top-1.5 z-10 flex h-7.5 w-7.5 items-center justify-center rounded-full bg-slate-100 dark:bg-[#0E0E10] transition-colors shadow-xs">
                      {isSyncing ? (
                        <Loader2 className="h-4 w-4 animate-spin text-violet-500" />
                      ) : isCompleted ? (
                        <CheckCircle className="h-6 w-6 text-emerald-500 fill-emerald-50 bg-white rounded-full" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-350 dark:text-[#3D3D42] group-hover:text-violet-500 transition border-none" />
                      )}
                    </div>

                    {/* Step Card Content */}
                    <div className={`
                      rounded-3xl border p-5 transition-all duration-300 shadow-xs hover:shadow-md
                      ${isCompleted 
                        ? 'border-slate-200/50 dark:border-[#2D2D30]/50 bg-[#F1F5F9]/50 dark:bg-[#141416]/20 opacity-80' 
                        : 'border-slate-250 dark:border-[#2D2D30] bg-white dark:bg-[#141416]/75 hover:bg-slate-50/55 dark:hover:bg-[#18181b]'
                      }
                    `}>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 font-mono text-[9.5px] font-bold">
                            <span className="text-violet-650 dark:text-emerald-450 bg-violet-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md border border-violet-200 dark:border-emerald-500/15 uppercase">Stage 0{idx+1}</span>
                            <span className="text-slate-450 dark:text-[#8E8E93] flex items-center gap-1.5 font-bold">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{step.duration}</span>
                            </span>
                          </div>
                          <h3 className="font-sans font-extrabold text-slate-800 dark:text-white text-base tracking-tight leading-snug">{step.title}</h3>
                          <p className="text-[12px] text-slate-550 dark:text-[#8E8E93] leading-relaxed mt-2 pl-0.5 select-all font-medium">
                            {step.description}
                          </p>
                        </div>

                        {/* Interactive complete actions */}
                        <div className="sm:self-start">
                          <button
                            type="button"
                            onClick={() => handleStepStatusToggle(step.id, step.status)}
                            disabled={isSyncing}
                            className={`
                              rounded-full px-4 py-1.8 text-xs font-bold whitespace-nowrap transition cursor-pointer border
                              ${isCompleted
                                ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/25 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100/50'
                                : 'bg-slate-100 hover:bg-slate-200 dark:bg-[#1C1C1E] border-slate-200 dark:border-[#2D2D30] text-slate-700 dark:text-[#E5E5E7] hover:border-violet-500/30'
                              }
                            `}
                          >
                            {isCompleted ? 'Completed ✓' : 'Mark Complete'}
                          </button>
                        </div>
                      </div>

                      {/* Step Resource Links list */}
                      {step.resources && step.resources.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-[#1C1C1E]/55 flex flex-wrap items-center gap-3 font-mono text-[10.5px]">
                          <span className="text-slate-450 dark:text-[#8E8E93] uppercase font-extrabold flex items-center gap-1.5">
                            <BookMarked className="h-4 w-4 text-violet-500" />
                            <span>Study Resources:</span>
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {step.resources.map((res, rIdx) => (
                              <a
                                key={rIdx}
                                href={res.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-violet-600 dark:text-emerald-450 font-bold hover:underline bg-slate-50 hover:bg-slate-100 dark:bg-[#1C1C1E] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#2D2D30]"
                              >
                                <span>{res.name}</span>
                                <ArrowRight className="h-3 w-3" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-[#2D2D30] bg-[#F8FAFC] dark:bg-[#141416]/25 p-12 text-center">
          <Compass className="h-10 w-10 text-slate-400 dark:text-[#8E8E93] mx-auto mb-4 opacity-50" />
          <h3 className="font-sans font-bold text-slate-800 dark:text-white text-base">Plan your developmental pathways</h3>
          <p className="text-xs text-slate-550 dark:text-[#8E8E93] max-w-sm mx-auto mt-1 leading-relaxed font-semibold">
            Click "Generate Customized Syllabus" to compile your multi-week AI modular career curriculum.
          </p>
        </div>
      )}
    </div>
  );
};
export default AIRoadmap;
