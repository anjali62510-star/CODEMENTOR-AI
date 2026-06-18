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
  BookMarked,
  Waves,
  Anchor,
  Ship
} from 'lucide-react';
import { InteractiveSkillTree } from '../components/InteractiveSkillTree';
import { OceanPageShell, OceanPageHeader, OceanLoadingScreen } from '../components/ocean/OceanUI';

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
      <div className="flex h-64 items-center justify-center font-mono text-xs text-[#5C768D] dark:text-cyan-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#00B8D9] border-t-transparent" />
          <span>Charting Study Island coordinates...</span>
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
    <OceanPageShell>
      <OceanPageHeader
        title="Navigation Route"
        subtitle="Chart your learning voyage across skill destinations with AI-generated milestone currents."
        icon={Compass}
        badge="VOYAGE PLANNER"
      />

      {/* Configuration Box */}
      <div className="rounded-3xl border border-[#D2E1ED] dark:border-[#123456] bg-white dark:bg-[#061524]/60 p-6 shadow-xs space-y-4">
        <h3 className="font-display font-extrabold text-[#0A2540] dark:text-white text-sm flex items-center gap-2 mb-3">
          <Cpu className="h-4.5 w-4.5 text-[#00B8D9]" />
          <span>Calibrate Voyage Blueprint</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 font-sans text-xs">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono text-[#5C768D] dark:text-cyan-400 uppercase tracking-wider font-extrabold">Target Role Island</label>
            <select
              value={roleOptions.includes(targetRole) ? targetRole : 'Custom'}
              onChange={(e) => {
                if (e.target.value !== 'Custom') {
                  setTargetRole(e.target.value);
                }
              }}
              className="bg-[#F8FAFC] dark:bg-[#030D18] border border-[#D2E1ED] dark:border-[#123456] text-xs font-semibold text-[#0A2540] dark:text-white px-2.5 py-3 rounded-xl focus:outline-hidden"
            >
              {roleOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
              <option value="Custom">Custom Target Harbor</option>
            </select>
          </div>

          {!roleOptions.includes(targetRole) || targetRole === 'Custom' ? (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-[#5C768D] dark:text-cyan-400 uppercase tracking-wider font-extrabold">Custom Role Coordinates</label>
              <input
                type="text"
                placeholder="e.g. DevOps Engineer"
                value={targetRole === 'Custom' ? '' : targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="bg-[#F8FAFC] dark:bg-[#030D18] border border-[#D2E1ED] dark:border-[#123456] text-xs font-semibold text-[#0A2540] dark:text-white px-3 py-2.5 rounded-xl focus:outline-hidden"
              />
            </div>
          ) : null}

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono text-[#5C768D] dark:text-cyan-400 uppercase tracking-wider font-extrabold">Pilot Experience Level</label>
            <select
              value={currentSkillLevel}
              onChange={(e) => setCurrentSkillLevel(e.target.value)}
              className="bg-[#F8FAFC] dark:bg-[#030D18] border border-[#D2E1ED] dark:border-[#123456] text-xs font-semibold text-[#0A2540] dark:text-white px-2.5 py-3 rounded-xl focus:outline-hidden"
            >
              <option value="beginner">Beginner Current (Core Basics)</option>
              <option value="intermediate">Intermediate Waters (Hands-on)</option>
              <option value="advanced">Deep Oceans (System flows)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono text-[#5C768D] dark:text-cyan-400 uppercase tracking-wider font-extrabold">Voyage duration runway</label>
            <select
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              className="bg-[#F8FAFC] dark:bg-[#030D18] border border-[#D2E1ED] dark:border-[#123456] text-xs font-semibold text-[#0A2540] dark:text-white px-2.5 py-3 rounded-xl focus:outline-hidden"
            >
              <option value="6 weeks">Speed Sail (6 Weeks)</option>
              <option value="12 weeks">Standard Passage (12 Weeks)</option>
              <option value="24 weeks">Full Comprehensive Cruise (24 Weeks)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-[10px] font-mono text-[#5C768D] dark:text-cyan-400 uppercase tracking-wider font-extrabold">Navigated skill islands (Technologies)</label>
            <input
              type="text"
              placeholder="e.g. React, JavaScript, HTML, CSS"
              value={currentTechnologies}
              onChange={(e) => setCurrentTechnologies(e.target.value)}
              className="bg-[#F8FAFC] dark:bg-[#030D18] border border-[#D2E1ED] dark:border-[#123456] text-xs font-semibold text-[#0A2540] dark:text-white px-3.5 py-2.5 rounded-xl focus:outline-hidden placeholder-slate-400"
            />
          </div>

          <div className="flex items-end justify-start md:col-span-2">
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={handleGenerate}
              disabled={generating}
              className="w-full flex items-center justify-center gap-2 rounded-full cursor-pointer bg-gradient-to-r from-[#00B8D9] to-[#0F4C81] text-white py-3 text-xs font-bold transition shadow-xs hover:shadow-md disabled:opacity-50"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin data-cyan-200" />
                  <span>Calculating Tidal Stages...</span>
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

      {/* Interactive SVG Skill Tree Visualization */}
      <InteractiveSkillTree activeRole={roadmap?.role || targetRole} />

      {roadmap ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Timeline Milestones Side Card */}
          <div className="lg:col-span-1 rounded-3xl border border-[#D2E1ED] dark:border-[#123456] bg-white dark:bg-[#061524]/60 p-6 self-start shadow-xs flex flex-col justify-between">
            <div className="space-y-3.5 pb-2">
              <span className="block text-[9.5px] font-mono tracking-widest text-[#5C768D] dark:text-cyan-400 uppercase font-black">Voyage Route</span>
              <h3 className="font-display font-black text-[#0A2540] dark:text-white text-base leading-snug">{roadmap.role}</h3>
              
              <div className="space-y-1 pt-1">
                <p className="text-[11px] text-[#5C768D] dark:text-cyan-155 font-mono font-bold">
                  Duration limit: <strong className="text-[#0A2540] dark:text-white font-extrabold">{roadmap.timeline}</strong>
                </p>
                <p className="text-[9.5px] font-mono text-slate-400 dark:text-slate-500">
                  Last calibrated: {new Date(roadmap.lastGenerated).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Overall steps progression bar stats */}
            <div className="mt-8 border-t border-slate-100 dark:border-[#123456]/30 pt-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9.5px] font-mono text-[#5C768D] dark:text-cyan-400 uppercase font-black">Route Cleared</span>
                <span className="text-xs font-black text-[#00B8D9] dark:text-[#2DD4BF] font-mono">{progressPercentage}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-[#030D18] overflow-hidden border border-[#D2E1ED]/20 dark:border-white/5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-[#00B8D9] to-[#0F4C81] transition-all duration-700" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-[10px] text-[#5C768D] dark:text-cyan-400 font-sans font-semibold mt-2.5">
                Completed {completedSteps} of {totalSteps} waypoints
              </p>
            </div>
          </div>

          {/* Stepped Timeline Roadmap column */}
          <div className="lg:col-span-3 space-y-6">
            <div className="relative pl-6 border-l-2 border-[#D2E1ED] dark:border-[#123456]/40 ml-4 space-y-8">
              {roadmap.steps.map((step, idx) => {
                const isCompleted = step.status === 'completed';
                const isSyncing = syncingId === step.id;

                return (
                  <div key={step.id} className="relative group overflow-visible">
                    {/* Circle Node Tracker handle */}
                    <div className="absolute -left-[35px] top-1.5 z-10 flex h-7.5 w-7.5 items-center justify-center rounded-full bg-white dark:bg-[#061524] transition-colors shadow-xs">
                      {isSyncing ? (
                        <Loader2 className="h-4 w-4 animate-spin text-[#00B8D9]" />
                      ) : isCompleted ? (
                        <CheckCircle className="h-6 w-6 text-teal-500 fill-teal-50 dark:fill-[#0a2540] bg-white dark:bg-[#0e0e15] rounded-full" />
                      ) : (
                        <Circle className="h-5 w-5 text-[#5C768D] dark:text-cyan-600 group-hover:text-[#00B8D9] transition border-none" />
                      )}
                    </div>

                    {/* Step Card Content */}
                    <div className={`
                      rounded-3xl border p-5 transition-all duration-300 shadow-xs hover:shadow-md
                      ${isCompleted 
                        ? 'border-slate-205 dark:border-[#123456]/30 bg-[#F8FAFC]/55 dark:bg-[#030D18]/10 opacity-75' 
                        : 'border-[#D2E1ED] dark:border-[#123456] bg-white dark:bg-[#061524]/60 hover:bg-[#F8FAFC]/40'
                      }
                    `}>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 font-mono text-[9.5px] font-bold">
                            <span className="text-cyan-700 dark:text-[#2DD4BF] bg-cyan-100/50 dark:bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-200/50 dark:border-cyan-500/15 uppercase">Voyage Port 0{idx+1}</span>
                            <span className="text-[#5C768D] dark:text-cyan-405 flex items-center gap-1.5 font-bold">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{step.duration}</span>
                            </span>
                          </div>
                          <h3 className="font-sans font-black text-[#0A2540] dark:text-white text-base tracking-tight leading-snug">{step.title}</h3>
                          <p className="text-[12px] text-[#5C768D] dark:text-cyan-100 leading-relaxed mt-2 pl-0.5 select-all font-semibold">
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
                                ? 'bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/25 text-teal-600 dark:text-[#2DD4BF] hover:bg-teal-100/50'
                                : 'bg-slate-100 hover:bg-slate-200 dark:bg-[#030D18] border-[#D2E1ED] dark:border-[#123456] text-[#0A2540] dark:text-[#E2E8F0] hover:border-cyan-405/30'
                              }
                            `}
                          >
                            {isCompleted ? 'Anchored ✓' : 'Drop Anchor'}
                          </button>
                        </div>
                      </div>

                      {/* Step Resource Links list */}
                      {step.resources && step.resources.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-[#123456]/30 flex flex-wrap items-center gap-3 font-mono text-[10.5px]">
                          <span className="text-[#5C768D] dark:text-cyan-400 uppercase font-black flex items-center gap-1.5">
                            <BookMarked className="h-4 w-4 text-[#00B8D9]" />
                            <span>Navigation Charts:</span>
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {step.resources.map((res, rIdx) => (
                              <a
                                key={rIdx}
                                href={res.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-cyan-700 dark:text-[#2DD4BF] font-black hover:underline bg-[#F8FAFC] hover:bg-slate-100 dark:bg-[#030D18] px-3 py-1.5 rounded-lg border border-[#D2E1ED] dark:border-[#123456]"
                              >
                                <span>{res.name}</span>
                                <ArrowRight className="h-3 w-3 text-[#00B8D9]" />
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
        <div className="rounded-3xl border border-dashed border-[#D2E1ED] dark:border-[#123456] bg-white dark:bg-[#061524]/30 p-12 text-center">
          <Compass className="h-10 w-10 text-[#00B8D9] mx-auto mb-4 opacity-50 animate-spin" style={{ animationDuration: '40s' }} />
          <h3 className="font-sans font-black text-[#0A2540] dark:text-white text-base">Plan your developmental pathways</h3>
          <p className="text-xs text-[#5C768D] dark:text-cyan-300 max-w-sm mx-auto mt-1 leading-relaxed font-semibold">
            Click "Generate Customized Syllabus" to compile your multi-week AI dynamic nautical learning voyage.
          </p>
        </div>
      )}
    </OceanPageShell>
  );
};

export default AIRoadmap;
