import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User as UserIcon, 
  MapPin, 
  BookOpen, 
  Linkedin, 
  Twitter, 
  Globe, 
  Briefcase, 
  CheckCircle, 
  Loader2,
  Lock,
  Sparkles,
  AlertTriangle,
  GitBranch,
  Rocket,
  Shield,
  Layers,
  Award
} from 'lucide-react';

interface GapItem {
  skill: string;
  importance: 'High' | 'Medium' | 'Low';
  description: string;
  recommendations: string[];
}

interface SkillGapReply {
  gaps: GapItem[];
  overallReadinessPercentage: number;
}

interface ProjectRecommendation {
  title: string;
  description: string;
  difficulty: 'Intermediate' | 'Advanced';
  techStack: string[];
  milestones: string[];
  architecturalInsight: string;
}

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, apiFetch } = useAuth();
  
  // Tabs controller state
  const [activeTab, setActiveTab] = useState<'edit' | 'skillgap' | 'projects'>('edit');

  // Biography form fields
  const [bio, setBio] = useState(user?.profile?.bio || 'Software craftsman passionate about high-performance backends and real-time client systems.');
  const [location, setLocation] = useState(user?.profile?.location || 'San Francisco, CA');
  const [linkedin, setLinkedin] = useState(user?.profile?.linkedin || '');
  const [twitter, setTwitter] = useState(user?.profile?.twitter || '');
  const [portfolio, setPortfolio] = useState(user?.profile?.portfolio || '');
  const [skills, setSkills] = useState(user?.profile?.skills?.join(', ') || 'React, TypeScript, Node.js, Express, PostgreSQL');
  
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Skill Gap State Variables
  const [gapAnalysis, setGapAnalysis] = useState<SkillGapReply | null>(null);
  const [loadingGap, setLoadingGap] = useState(false);
  const [gapError, setGapError] = useState<string | null>(null);

  // Project Recommendation State Variables
  const [recommendedProjects, setRecommendedProjects] = useState<ProjectRecommendation[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  const fetchSkillGap = async (silent = false) => {
    if (!silent) setLoadingGap(true);
    setGapError(null);
    try {
      const data = await apiFetch('/api/profile/skill-gap', { method: 'POST' });
      if (data.analysis) {
        setGapAnalysis(data.analysis);
      }
    } catch (err: any) {
      console.error(err);
      setGapError(err.message || 'Error occurred analyzing skill gaps.');
    } finally {
      if (!silent) setLoadingGap(false);
    }
  };

  const fetchProjectRecommendations = async (silent = false) => {
    if (!silent) setLoadingProjects(true);
    setProjectsError(null);
    try {
      const data = await apiFetch('/api/projects/recommend', { method: 'POST' });
      if (data.projects) {
        setRecommendedProjects(data.projects);
      }
    } catch (err: any) {
      console.error(err);
      setProjectsError(err.message || 'Error occurred collecting custom project recommendations.');
    } finally {
      if (!silent) setLoadingProjects(false);
    }
  };

  // Trigger load when tabs are clicked
  useEffect(() => {
    if (activeTab === 'skillgap' && !gapAnalysis) {
      fetchSkillGap();
    }
    if (activeTab === 'projects' && recommendedProjects.length === 0) {
      fetchProjectRecommendations();
    }
  }, [activeTab]);

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
      await updateProfile({
        bio,
        location,
        linkedin,
        twitter,
        portfolio,
        skills: skillsArray
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // If gaps or projects are loaded, trigger silent refresh in light of new skill arrays
      if (gapAnalysis) fetchSkillGap(true);
      if (recommendedProjects.length > 0) fetchProjectRecommendations(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="border-b border-[#1C1C1E] pb-6">
        <h1 className="font-sans text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5 md:text-3xl">
          <UserIcon className="h-7 w-7 text-emerald-400" />
          <span>Professional Profile & Growth</span>
        </h1>
        <p className="text-xs text-[#8E8E93] mt-1.5 leading-relaxed">
          Manage your biographies, credentials, and target roles. Compare your skills with industry-standard career matrices and request custom enterprise-grade project plans.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Profile details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-6 flex flex-col items-center text-center shadow-xs">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 font-bold text-white text-xl border border-emerald-500/10 mb-4 select-none">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="font-sans text-lg font-bold text-white leading-tight">{user.name}</h2>
            <p className="text-xs font-mono text-emerald-400 mt-1">{user.onboarding?.targetRole || 'Developer'}</p>
            <span className="text-[10.5px] font-mono text-[#8E8E93] mt-1.5 flex items-center justify-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{location}</span>
            </span>

            <p className="text-xs text-[#AEAEB2] leading-relaxed mt-5 italic pl-1 text-center font-sans">
              "{bio}"
            </p>

            <div className="flex items-center gap-3 mt-6 border-t border-[#1C1C1E] pt-5 w-full justify-center text-[#8E8E93]">
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noreferrer" className="hover:text-white transition">
                  <Linkedin className="h-4.5 w-4.5" />
                </a>
              )}
              {twitter && (
                <a href={twitter} target="_blank" rel="noreferrer" className="hover:text-white transition">
                  <Twitter className="h-4.5 w-4.5" />
                </a>
              )}
              {portfolio && (
                <a href={portfolio} target="_blank" rel="noreferrer" className="hover:text-white transition">
                  <Globe className="h-4.5 w-4.5" />
                </a>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-5 shadow-xs font-mono text-[11px] text-[#8E8E93] space-y-3.5">
            <h3 className="font-sans text-[#E5E5E7] font-semibold text-xs border-b border-[#1C1C1E] pb-2 flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" />
              <span>Target Role preferences</span>
            </h3>
            <div className="flex items-center justify-between text-white">
              <span>Experience:</span>
              <span className="font-semibold uppercase text-emerald-400">{user.onboarding?.experienceLevel || 'Beginner'}</span>
            </div>
            <div className="flex items-center justify-between text-white">
              <span>Industry:</span>
              <span className="font-semibold text-emerald-400">{user.onboarding?.preferredIndustry || 'SaaS'}</span>
            </div>
            <div className="flex items-center justify-between text-white">
              <span>Weekly Commits:</span>
              <span className="font-semibold text-emerald-400">{user.onboarding?.weeklyHours || 15} Hours</span>
            </div>
          </div>
        </div>

        {/* Right column: Form / Growth analyzer tabs */}
        <div className="lg:col-span-2 rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-6 shadow-xs flex flex-col">
          
          {/* Internal Right tabs bar */}
          <div className="flex border-b border-[#1C1C1E] pb-px mb-6">
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-4 py-2.5 text-xs font-bold tracking-tight border-b-2 transition ${
                activeTab === 'edit'
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                  : 'border-transparent text-[#8E8E93] hover:text-white'
              }`}
            >
              Credentials Fields
            </button>
            <button
              onClick={() => setActiveTab('skillgap')}
              className={`px-4 py-2.5 text-xs font-bold tracking-tight border-b-2 transition ${
                activeTab === 'skillgap'
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                  : 'border-transparent text-[#8E8E93] hover:text-white'
              }`}
            >
              AI Skill Gap Analyzer
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2.5 text-xs font-bold tracking-tight border-b-2 transition ${
                activeTab === 'projects'
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                  : 'border-transparent text-[#8E8E93] hover:text-white'
              }`}
            >
              AI Recommended Projects
            </button>
          </div>

          {/* ACTIVE VIEW RENDERING */}
          {activeTab === 'edit' && (
            <form onSubmit={handleSubmitProfile} className="space-y-5 font-sans">
              <div>
                <label className="block text-[10px] font-mono text-[#8E8E93] uppercase tracking-wider mb-2">Short Biographies Summary</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full bg-[#1C1C1E] border border-[#2D2D30] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-[#8E8E93] uppercase tracking-wider mb-2">Location Coordinates</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[#1C1C1E] border border-[#2D2D30] rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-[#8E8E93] uppercase tracking-wider mb-2">Skills tags (separated by commas)</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full bg-[#1C1C1E] border border-[#2D2D30] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#1C1C1E]">
                <h4 className="text-xs font-bold text-white mb-2">External Portals Links</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-[#8E8E93] uppercase tracking-wider mb-2">LinkedIn Link</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/ada"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      className="w-full bg-[#1C1C1E] border border-[#2D2D30] rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#8E8E93] uppercase tracking-wider mb-2">Twitter Link</label>
                    <input
                      type="url"
                      placeholder="https://twitter.com/ada"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      className="w-full bg-[#1C1C1E] border border-[#2D2D30] rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#8E8E93] uppercase tracking-wider mb-2">Portfolio Website</label>
                    <input
                      type="url"
                      placeholder="https://ada.dev"
                      value={portfolio}
                      onChange={(e) => setPortfolio(e.target.value)}
                      className="w-full bg-[#1C1C1E] border border-[#2D2D30] rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#1C1C1E] pt-5">
                {success ? (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-pulse">
                    <CheckCircle className="h-4.5 w-4.5" />
                    <span>Profile updated successfully!</span>
                  </span>
                ) : (
                  <div />
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-2.5 text-xs font-bold transition shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-black" />
                      <span>Saving Credentials...</span>
                    </>
                  ) : (
                    <span>Persist Profile Variables</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* SKILL GAP ANALYZER */}
          {activeTab === 'skillgap' && (
            <div className="space-y-6">
              {loadingGap ? (
                <div className="py-20 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-400 mx-auto mb-4" />
                  <p className="text-xs font-mono text-[#8E8E93]">Scanning Target Role specs and cross-matching skills metrics...</p>
                </div>
              ) : gapError ? (
                <div className="rounded-xl border border-rose-500/10 bg-rose-500/5 p-6 text-center">
                  <p className="text-xs text-rose-400">{gapError}</p>
                </div>
              ) : gapAnalysis ? (
                <div className="space-y-6">
                  {/* Readiness Banner */}
                  <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-5 flex flex-col sm:flex-row items-center gap-5 justify-between">
                    <div className="space-y-1.5 text-center sm:text-left">
                      <h4 className="text-xs font-bold text-white font-sans uppercase tracking-tight flex items-center gap-1.5 justify-center sm:justify-start">
                        <Award className="h-4 w-4 text-emerald-400" />
                        <span>Competency Alignment Ratio</span>
                      </h4>
                      <p className="text-xs text-[#8E8E93] max-w-sm leading-relaxed leading-medium">
                        Your technology stack complies with approx <strong className="text-emerald-400 font-extrabold">{gapAnalysis.overallReadinessPercentage}%</strong> of modern industry matrices for <strong className="text-white">{user.onboarding?.targetRole}</strong>.
                      </p>
                    </div>

                    {/* Progress indicator */}
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-[#1C1C1E] h-2.5 rounded-full overflow-hidden border border-[#2D2D30]">
                        <div className="bg-emerald-400 h-full transition-all duration-1000" style={{ width: `${gapAnalysis.overallReadinessPercentage}%` }} />
                      </div>
                      <span className="font-mono text-sm font-black text-emerald-400">{gapAnalysis.overallReadinessPercentage}%</span>
                    </div>
                  </div>

                  {/* List of explicit gap highlights */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Missing Skill Vectors & Frameworks</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {gapAnalysis.gaps.map((item, idx) => (
                        <div key={idx} className="rounded-xl border border-[#2D2D30] bg-[#1C1C1E]/30 p-5 space-y-3 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white font-mono">{item.skill}</span>
                              <span className={`text-[9.5px] font-mono px-1.5 py-0.5 rounded uppercase font-bold ${
                                item.importance === 'High' 
                                  ? 'text-rose-400 bg-rose-500/10'
                                  : item.importance === 'Medium'
                                  ? 'text-amber-400 bg-amber-500/10'
                                  : 'text-emerald-400 bg-emerald-500/10'
                              }`}>
                                {item.importance} Priority
                              </span>
                            </div>
                            <p className="text-xs text-[#8E8E93] leading-relaxed">
                              {item.description}
                            </p>
                          </div>

                          {/* Steps loop */}
                          <div className="space-y-1.5 pt-2 border-t border-[#1C1C1E] font-sans text-xs">
                            <span className="block text-[10px] font-mono text-[#8E8E93] uppercase tracking-wider mb-1">Target Action Guide</span>
                            {item.recommendations.map((rec, ri) => (
                              <div key={ri} className="flex gap-2 text-[11px] text-[#AEAEB2]">
                                <span className="text-emerald-400 shrink-0">•</span>
                                <span>{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#1C1C1E] flex justify-end">
                    <button
                      onClick={() => fetchSkillGap()}
                      className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
                    >
                      <Sparkles className="h-4.5 w-4.5" />
                      <span>Re-analyze Growth Vectors</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">Awaiting analyzer startup.</div>
              )}
            </div>
          )}

          {/* PROJECT RECOMMENDATIONS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {loadingProjects ? (
                <div className="py-20 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-400 mx-auto mb-4" />
                  <p className="text-xs font-mono text-[#8E8E93]">Synthesizing bespoke portfolio project specifications using Gemini...</p>
                </div>
              ) : projectsError ? (
                <div className="rounded-xl border border-rose-500/10 bg-rose-500/5 p-6 text-center">
                  <p className="text-xs text-rose-400">{projectsError}</p>
                </div>
              ) : recommendedProjects.length > 0 ? (
                <div className="space-y-6">
                  <div className="text-[11px] text-[#8E8E93] font-mono leading-relaxed border-b border-[#1C1C1E] pb-3">
                    Bespoke engineering outlines tailored specifically to reinforce missing skill categories and build recruiting magnets.
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {recommendedProjects.map((proj, idx) => (
                      <div key={idx} className="rounded-xl border border-[#2D2D30] bg-[#141416]/20 p-6 flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-300">
                        <div className="space-y-4">
                          
                          {/* Title difficulty header */}
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h4 className="font-sans text-sm font-extrabold text-white leading-tight">{proj.title}</h4>
                              <p className="text-xs text-[#8E8E93] mt-1 lead-relaxed leading-medium">{proj.description}</p>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 shrink-0 uppercase">
                              {proj.difficulty}
                            </span>
                          </div>

                          {/* Technstack tags */}
                          <div className="flex flex-wrap gap-1 border-b border-[#1C1C1E] pb-3.5 pt-0.5">
                            {proj.techStack.map((tech) => (
                              <span key={tech} className="text-[9.5px] font-mono text-[#8E8E93] bg-[#1C1C1E] px-2 py-0.5 rounded">
                                {tech}
                              </span>
                            ))}
                          </div>

                          {/* Roadmap steps / milestones */}
                          <div className="space-y-3 font-sans">
                            <h5 className="text-[11px] font-extrabold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                              <GitBranch className="h-4 w-4 text-emerald-400" />
                              <span>Implementation Roadmap Milestones</span>
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {proj.milestones.map((m, mi) => (
                                <div key={mi} className="rounded-lg border border-[#1C1C1E] bg-[#0E0E10]/80 p-3 flex gap-2.5 items-start">
                                  <span className="font-mono text-[10.5px] font-black text-emerald-400">0{mi+1}</span>
                                  <p className="text-[11px] text-[#AEAEB2] leading-normal">{m}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Architect tip */}
                          <div className="rounded-lg border border-emerald-500/10 bg-emerald-500/5 p-4 space-y-1.5 font-sans">
                            <h5 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono flex items-center gap-1">
                              <Rocket className="h-3.5 w-3.5" />
                              <span>Architectural scaling Insight</span>
                            </h5>
                            <p className="text-[11px] text-[#8E8E93] leading-relaxed select-all italic font-mono pl-1">
                              "{proj.architecturalInsight}"
                            </p>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[#1C1C1E] flex justify-end">
                    <button
                      onClick={() => fetchProjectRecommendations()}
                      className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
                    >
                      <Sparkles className="h-4.5 w-4.5" />
                      <span>Re-orchestrate Systems Outlines</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">Awaiting recommendation coordinates.</div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
