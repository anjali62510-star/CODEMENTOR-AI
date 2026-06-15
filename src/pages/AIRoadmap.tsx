import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AIRoadmap as AIRoadmapType } from '../types';
import { 
  Map, 
  Sparkles, 
  Loader2, 
  CheckCircle, 
  Circle, 
  BookOpen, 
  Calendar,
  Compass,
  ArrowRight
} from 'lucide-react';

export const AIRoadmap: React.FC = () => {
  const { user, apiFetch } = useAuth();
  const [timeline, setTimeline] = useState('12 weeks');
  const [roadmap, setRoadmap] = useState<AIRoadmapType | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const fetchRoadmap = async () => {
    try {
      const data = await apiFetch('/api/roadmap');
      if (data.roadmap) {
        setRoadmap(data.roadmap);
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
        body: JSON.stringify({ timeline })
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
      <div className="flex h-full items-center justify-center font-mono text-xs text-[#8E8E93]">
        Mapping curriculum stages...
      </div>
    );
  }

  const completedSteps = roadmap?.steps.filter(s => s.status === 'completed').length || 0;
  const totalSteps = roadmap?.steps.length || 0;
  const progressPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-[#1C1C1E] pb-6">
        <div>
          <h1 className="font-sans text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5 md:text-3xl">
            <Map className="h-7 w-7 text-emerald-400 group-hover:text-emerald-300" />
            <span>AI Curriculum Roadmap</span>
          </h1>
          <p className="text-xs text-[#8E8E93] mt-1.5 leading-relaxed">
            Generate custom, sequential skill stages and resource references matching targeted career positions using Gemini semantic blueprints.
          </p>
        </div>

        {/* Configurations selector */}
        <div className="flex items-center gap-2.5">
          <select
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            className="bg-[#1C1C1E] border border-[#2D2D30] text-xs font-semibold text-white px-2.5 py-1.8 rounded-lg focus:outline-hidden"
          >
            <option value="6 weeks">Speed Runway (6 Weeks)</option>
            <option value="12 weeks">Standard Focus (12 Weeks)</option>
            <option value="24 weeks">Full Comprehensive (24 Weeks)</option>
          </select>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black px-4.5 py-1.8 text-xs font-bold transition shadow-[0_0_15px_rgba(16,185,129,0.25)] disabled:opacity-50"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating Plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Re-align Curriculum</span>
              </>
            )}
          </button>
        </div>
      </div>

      {roadmap ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Timeline Milestones Side Card */}
          <div className="lg:col-span-1 rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-6 self-start shadow-xs flex flex-col justify-between">
            <div>
              <span className="block text-[10px] font-mono tracking-widest text-[#8E8E93] uppercase mb-1">Target Curriculum</span>
              <h3 className="font-sans font-bold text-white text-base leading-snug">{roadmap.role}</h3>
              <p className="text-xs text-[#8E8E93] leading-relaxed mt-2.5 font-mono">
                Duration limit: {roadmap.timeline}
              </p>
              <span className="block text-[9.5px] font-mono text-[#AEAEB2] mt-0.5">
                Last generated: {new Date(roadmap.lastGenerated).toLocaleDateString()}
              </span>
            </div>

            {/* Overall steps progression bar stats */}
            <div className="mt-8 border-t border-[#1C1C1E] pt-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-[#8E8E93] uppercase">Syllabus Complete</span>
                <span className="text-xs font-semibold text-emerald-400 font-mono">{progressPercentage}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#1C1C1E] overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="block text-[9.5px] font-mono text-[#8E8E93] mt-2">
                Completed {completedSteps} of {totalSteps} milestones
              </span>
            </div>
          </div>

          {/* Stepped Timeline Roadmap column */}
          <div className="lg:col-span-3 space-y-6">
            <div className="relative pl-6 border-l-2 border-[#1C1C1E] ml-4 space-y-8">
              {roadmap.steps.map((step, idx) => {
                const isCompleted = step.status === 'completed';
                const isSyncing = syncingId === step.id;

                return (
                  <div key={step.id} className="relative group">
                    {/* Circle Node Tracker handle */}
                    <div className="absolute -left-[35px] top-1.5 z-10 flex h-6.5 w-6.5 items-center justify-center rounded-full bg-[#0E0E10] transition-colors">
                      {isSyncing ? (
                        <Loader2 className="h-4.5 w-4.5 animate-spin text-emerald-400" />
                      ) : isCompleted ? (
                        <CheckCircle className="h-6 w-6 text-emerald-400 fill-emerald-500/10" />
                      ) : (
                        <Circle className="h-5.5 w-5.5 text-[#3D3D42] group-hover:text-emerald-400 border-none" />
                      )}
                    </div>

                    {/* Step Card Content */}
                    <div className={`
                      rounded-xl border p-5 transition-all duration-300
                      ${isCompleted 
                        ? 'border-[#2D2D30]/65 bg-[#141416]/20 opacity-80' 
                        : 'border-[#2D2D30] bg-[#141416]/75 hover:bg-[#18181B]'
                      }
                    `}>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5 font-mono text-[10px]">
                            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.8 py-0.5 rounded border border-emerald-500/15 uppercase">Stage 0{idx+1}</span>
                            <span className="text-[#8E8E93] flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{step.duration}</span>
                            </span>
                          </div>
                          <h3 className="font-sans font-bold text-white text-base tracking-tight">{step.title}</h3>
                          <p className="text-xs text-[#8E8E93] leading-relaxed mt-2 pl-0.5 select-all">
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
                              rounded-lg px-3.5 py-1.8 text-xs font-semibold whitespace-nowrap transition border
                              ${isCompleted
                                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20'
                                : 'bg-[#1C1C1E] border-[#2D2D30] text-[#E5E5E7] hover:bg-[#252529] hover:border-emerald-500/20'
                              }
                            `}
                          >
                            {isCompleted ? 'Completed' : 'Mark Complete'}
                          </button>
                        </div>
                      </div>

                      {/* Step Resource Links list */}
                      {step.resources && step.resources.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-[#1C1C1E]/55 flex flex-wrap items-center gap-3 font-mono text-[10.5px]">
                          <span className="text-[#8E8E93] uppercase font-bold flex items-center gap-1.5">
                            <BookOpen className="h-3.5 w-3.5" />
                            <span>Study Resources:</span>
                          </span>
                          <div className="flex flex-wrap gap-2.5">
                            {step.resources.map((res, rIdx) => (
                              <a
                                key={rIdx}
                                href={res.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium hover:underline bg-[#1C1C1E] px-2 py-1 rounded border border-[#2D2D30]"
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
        <div className="rounded-xl border border-[#2D2D30] border-dashed bg-[#141416]/20 p-12 text-center">
          <Compass className="h-10 w-10 text-[#8E8E93] mx-auto mb-4 opacity-50" />
          <h3 className="font-sans font-bold text-white text-base">Plan your developmental pathways</h3>
          <p className="text-xs text-[#8E8E93] max-w-sm mx-auto mt-1 leading-relaxed">
            Click "Generate Career Roadmap" to compile your multi-week AI modular career curriculum.
          </p>
        </div>
      )}
    </div>
  );
};
export default AIRoadmap;
