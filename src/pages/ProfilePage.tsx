import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User as UserIcon, 
  MapPin, 
  Linkedin, 
  Twitter, 
  Globe, 
  Briefcase, 
  CheckCircle, 
  Loader2,
  Sparkles,
  GitBranch,
  Rocket,
  Award,
  Anchor
} from 'lucide-react';
import { OceanPageShell, OceanPageHeader } from '../components/ocean/OceanUI';

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
    <OceanPageShell>
      <OceanPageHeader
        title="Explorer Log"
        subtitle="Manage your voyage credentials, skill gap analysis, and dockyard project fleet."
        icon={UserIcon}
        badge="EXPLORER PROFILE"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Profile details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="premium-card p-6 flex flex-col items-center text-center shadow-xs">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-650 font-bold text-white text-xl shadow-md mb-4 select-none">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="font-sans text-base font-extrabold text-zinc-900 dark:text-white leading-tight">{user.name}</h2>
            <p className="text-xs font-mono text-indigo-600 dark:text-indigo-400 mt-1 font-bold">{user.onboarding?.targetRole || 'Developer'}</p>
            <span className="text-[10.5px] font-mono text-zinc-400 dark:text-zinc-500 mt-1.5 flex items-center justify-center gap-1 font-bold">
              <MapPin className="h-3.5 w-3.5" />
              <span>{location}</span>
            </span>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mt-5 italic pl-1 text-center font-sans font-semibold">
              "{bio}"
            </p>

            <div className="flex items-center gap-3 mt-6 border-t border-zinc-100 dark:border-zinc-850 pt-5 w-full justify-center text-zinc-400 dark:text-[#8E8E93]">
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noreferrer" className="hover:text-zinc-800 dark:hover:text-white transition">
                  <Linkedin className="h-4.5 w-4.5" />
                </a>
              )}
              {twitter && (
                <a href={twitter} target="_blank" rel="noreferrer" className="hover:text-zinc-800 dark:hover:text-white transition">
                  <Twitter className="h-4.5 w-4.5" />
                </a>
              )}
              {portfolio && (
                <a href={portfolio} target="_blank" rel="noreferrer" className="hover:text-zinc-800 dark:hover:text-white transition">
                  <Globe className="h-4.5 w-4.5" />
                </a>
              )}
            </div>
          </div>

          <div className="premium-card p-5 shadow-xs font-mono text-[11px] text-zinc-500 dark:text-[#8E8E93] space-y-3.5 font-bold">
            <h3 className="font-sans text-zinc-800 dark:text-[#E5E5E7] font-semibold text-xs border-b border-zinc-100 dark:border-zinc-850 pb-2 flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" />
              <span>Target Role preferences</span>
            </h3>
            <div className="flex items-center justify-between text-zinc-800 dark:text-white">
              <span>Experience:</span>
              <span className="font-bold uppercase text-indigo-650 dark:text-indigo-400">{user.onboarding?.experienceLevel || 'Beginner'}</span>
            </div>
            <div className="flex items-center justify-between text-zinc-800 dark:text-white">
              <span>Industry:</span>
              <span className="font-bold text-indigo-650 dark:text-indigo-400">{user.onboarding?.preferredIndustry || 'SaaS'}</span>
            </div>
            <div className="flex items-center justify-between text-zinc-800 dark:text-white">
              <span>Weekly Commits:</span>
              <span className="font-bold text-indigo-650 dark:text-indigo-400">{user.onboarding?.weeklyHours || 15} Hours</span>
            </div>
          </div>
        </div>

        {/* Right column: Form / Growth analyzer tabs */}
        <div className="lg:col-span-2 premium-card p-6 shadow-xs flex flex-col">
          
          {/* Internal Right tabs bar */}
          <div className="flex border-b border-zinc-150 dark:border-zinc-850 pb-px mb-6">
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-4 py-2.5 text-xs font-bold tracking-tight border-b-2 transition cursor-pointer ${
                activeTab === 'edit'
                  ? 'border-indigo-650 text-indigo-600 bg-indigo-50/50 dark:border-indigo-405 dark:text-indigo-400 dark:bg-indigo-500/5'
                  : 'border-transparent text-zinc-500 dark:text-zinc-450 hover:text-zinc-805 dark:hover:text-white'
              }`}
            >
              Credentials Fields
            </button>
            <button
              onClick={() => setActiveTab('skillgap')}
              className={`px-4 py-2.5 text-xs font-bold tracking-tight border-b-2 transition cursor-pointer ${
                activeTab === 'skillgap'
                  ? 'border-indigo-650 text-indigo-600 bg-indigo-50/50 dark:border-indigo-405 dark:text-indigo-400 dark:bg-indigo-500/5'
                  : 'border-transparent text-zinc-500 dark:text-zinc-450 hover:text-zinc-850 dark:hover:text-white'
              }`}
            >
              AI Skill Gap Analyzer
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2.5 text-xs font-bold tracking-tight border-b-2 transition cursor-pointer ${
                activeTab === 'projects'
                  ? 'border-indigo-650 text-indigo-600 bg-indigo-50/50 dark:border-indigo-405 dark:text-indigo-400 dark:bg-indigo-500/5'
                  : 'border-transparent text-zinc-500 dark:text-zinc-450 hover:text-zinc-850 dark:hover:text-white'
              }`}
            >
              AI Recommended Projects
            </button>
          </div>

          {/* ACTIVE VIEW RENDERING */}
          {activeTab === 'edit' && (
            <form onSubmit={handleSubmitProfile} className="space-y-5 font-sans animate-fade-in">
              <div>
                <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2 font-bold">Short Biographies Summary</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-hidden focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2 font-bold">Location Coordinates</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-hidden focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2 font-bold">Skills tags (separated by commas)</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-900 dark:text-zinc-200 focus:outline-hidden focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-150 dark:border-zinc-850">
                <h4 className="text-xs font-black text-zinc-850 dark:text-white mb-2">External Portals Links</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-semibold">
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2 font-bold">LinkedIn Link</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/ada"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-xs text-zinc-905 dark:text-zinc-200 focus:outline-hidden focus:border-indigo-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2 font-bold">Twitter Link</label>
                    <input
                      type="url"
                      placeholder="https://twitter.com/ada"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-xs text-zinc-905 dark:text-zinc-200 focus:outline-hidden focus:border-indigo-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2 font-bold">Portfolio Website</label>
                    <input
                      type="url"
                      placeholder="https://ada.dev"
                      value={portfolio}
                      onChange={(e) => setPortfolio(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-xs text-zinc-905 dark:text-zinc-200 focus:outline-hidden focus:border-indigo-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-150 dark:border-zinc-850 pt-5">
                {success ? (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 animate-pulse">
                    <CheckCircle className="h-4.5 w-4.5" />
                    <span>Profile updated successfully!</span>
                  </span>
                ) : (
                  <div />
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-indigo-650 hover:bg-indigo-600 text-white px-5 py-2.5 text-xs font-bold transition shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
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
            <div className="space-y-6 animate-fade-in font-sans">
              {loadingGap ? (
                <div className="py-20 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
                  <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500 font-semibold">Scanning Target Role specs and cross-matching skills metrics...</p>
                </div>
              ) : gapError ? (
                <div className="rounded-xl border border-rose-500/10 bg-rose-500/5 p-6 text-center">
                  <p className="text-xs text-rose-500 font-bold">{gapError}</p>
                </div>
              ) : gapAnalysis ? (
                <div className="space-y-6">
                  {/* Readiness Banner */}
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-[#2D2D30]/30 dark:bg-zinc-900/10 p-5 flex flex-col sm:flex-row items-center gap-5 justify-between">
                    <div className="space-y-1 text-center sm:text-left">
                      <h4 className="text-xs font-bold text-zinc-800 dark:text-white font-sans uppercase tracking-tight flex items-center gap-1.5 justify-center sm:justify-start">
                        <Award className="h-4 w-4 text-indigo-605 dark:text-indigo-400" />
                        <span>Competency Alignment Ratio</span>
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-450 max-w-sm leading-relaxed font-semibold">
                        Your technology stack complies with approx <strong className="text-indigo-650 dark:text-indigo-400 font-extrabold">{gapAnalysis.overallReadinessPercentage}%</strong> of modern industry matrices for <strong className="text-zinc-800 dark:text-white">{user.onboarding?.targetRole}</strong>.
                      </p>
                    </div>

                    {/* Progress indicator */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-24 bg-zinc-200 dark:bg-[#1C1C1E] h-2.5 rounded-full overflow-hidden border border-zinc-305 dark:border-zinc-800">
                        <div className="bg-indigo-650 dark:bg-indigo-400 h-full transition-all duration-1000" style={{ width: `${gapAnalysis.overallReadinessPercentage}%` }} />
                      </div>
                      <span className="font-mono text-xs font-black text-indigo-650 dark:text-indigo-400">{gapAnalysis.overallReadinessPercentage}%</span>
                    </div>
                  </div>

                  {/* List of explicit gap highlights */}
                  <div className="space-y-4 font-sans">
                    <h4 className="text-xs font-black text-zinc-800 dark:text-white uppercase tracking-wider font-mono">Missing Skill Vectors & Frameworks</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {gapAnalysis.gaps.map((item, idx) => (
                        <div key={idx} className="rounded-2xl border border-zinc-200 bg-zinc-50/20 dark:border-zinc-805 dark:bg-zinc-900/30 p-5 space-y-3.5 flex flex-col justify-between hover:border-indigo-500/20 transition-colors">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-zinc-900 dark:text-white font-mono">{item.skill}</span>
                              <span className={`text-[9.5px] font-mono px-1.5 py-0.5 rounded uppercase font-extrabold ${
                                item.importance === 'High' 
                                  ? 'text-rose-650 bg-rose-50 border border-rose-100 dark:text-rose-400 dark:bg-rose-500/10'
                                  : item.importance === 'Medium'
                                  ? 'text-amber-600 bg-amber-50 border border-amber-100 dark:text-amber-400 dark:bg-amber-500/10'
                                  : 'text-emerald-650 bg-emerald-50 border border-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10'
                              }`}>
                                {item.importance} Priority
                              </span>
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-450 leading-relaxed font-semibold">
                              {item.description}
                            </p>
                          </div>

                          {/* Steps loop */}
                          <div className="space-y-1.5 pt-2.5 border-t border-zinc-150 dark:border-zinc-850 font-sans text-xs">
                            <span className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1 font-bold">Target Action Guide</span>
                            {item.recommendations.map((rec, ri) => (
                              <div key={ri} className="flex gap-2 text-[11px] text-zinc-600 dark:text-zinc-400 font-semibold">
                                <span className="text-emerald-500 shrink-0">•</span>
                                <span>{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-150 dark:border-zinc-850 flex justify-end">
                    <button
                      onClick={() => fetchSkillGap()}
                      className="flex items-center gap-1.5 text-xs font-bold text-indigo-650 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-305 transition cursor-pointer"
                    >
                      <Sparkles className="h-4.5 w-4.5" />
                      <span>Re-analyze Growth Vectors</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 font-bold text-zinc-450">Awaiting analyzer startup.</div>
              )}
            </div>
          )}

          {/* PROJECT RECOMMENDATIONS */}
          {activeTab === 'projects' && (
            <div className="space-y-6 animate-fade-in font-sans">
              {loadingProjects ? (
                <div className="py-20 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-605 dark:text-indigo-400 mx-auto mb-4" />
                  <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500 font-semibold">Synthesizing bespoke portfolio project specifications using Gemini...</p>
                </div>
              ) : projectsError ? (
                <div className="rounded-xl border border-rose-500/10 bg-rose-500/5 p-6 text-center">
                  <p className="text-xs text-rose-500 font-bold">{projectsError}</p>
                </div>
              ) : recommendedProjects.length > 0 ? (
                <div className="space-y-6">
                  <div className="text-[11px] text-zinc-450 dark:text-[#8E8E93] font-mono leading-relaxed border-b border-zinc-150 dark:border-zinc-850 pb-3 font-semibold">
                    Bespoke engineering outlines tailored specifically to reinforce missing skill categories and build recruiting magnets.
                  </div>

                  {/* The Dockyard Harbor container header */}
                  <div className="rounded-2xl bg-cyan-100/10 dark:bg-cyan-950/10 border border-cyan-200/50 dark:border-cyan-800/20 p-4 flex items-center justify-between font-mono text-[11px] leading-relaxed relative overflow-hidden">
                    <div className="flex items-center gap-2 relative z-10">
                      <Anchor className="h-5 w-5 text-[#00B8D9] animate-bounce" style={{ animationDuration: '4s' }} />
                      <span className="text-[#0A2540] dark:text-cyan-200">VESSELS SECURED AT HARBOR DOCK 04</span>
                    </div>
                    <span className="text-[10px] bg-cyan-500/20 text-[#00B8D9] px-2.5 py-0.5 rounded-full font-black">ACTIVE FLEET</span>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {recommendedProjects.map((proj, idx) => (
                      <div 
                        key={idx} 
                        className="premium-card p-6 flex flex-col justify-between ship-rock transition-all duration-350 shadow-xs relative overflow-hidden group"
                      >
                        {/* Harbour Water Ripple design details */}
                        <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-cyan-400/5 to-transparent pointer-events-none" />

                        <div className="space-y-4">
                          
                          {/* Title difficulty header */}
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <span className="text-3xl filter drop-shadow-md select-none group-hover:scale-110 transition duration-300">
                                {idx % 2 === 0 ? '⛵' : '🚢'}
                              </span>
                              <div>
                                <h4 className="font-sans text-sm font-black text-zinc-900 dark:text-white leading-tight flex items-center gap-1.5">
                                  <span>{proj.title}</span>
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[9px] font-mono font-black text-emerald-600 dark:text-[#2DD4BF] tracking-wider uppercase bg-emerald-50 dark:bg-emerald-950/35 border border-emerald-200/30 dark:border-emerald-500/20 px-1.5 py-0.5 rounded-md">
                                    ⚓ Status: Docked at Harbor
                                  </span>
                                  <p className="text-xs text-zinc-500 dark:text-zinc-450 leading-relaxed font-semibold max-w-xl">{proj.description}</p>
                                </div>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-indigo-650 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-150 dark:border-indigo-500/20 shrink-0 uppercase">
                              {proj.difficulty}
                            </span>
                          </div>

                          {/* Techstack tags */}
                          <div className="flex flex-wrap gap-1.5 border-b border-zinc-100 dark:border-zinc-850 pb-3.5 pt-0.5">
                            {proj.techStack.map((tech) => (
                              <span key={tech} className="text-[9.5px] font-mono font-bold text-[#00B8D9] dark:text-[#67E8F9] bg-cyan-100/30 dark:bg-cyan-950/40 border border-cyan-200/20 dark:border-cyan-500/10 px-2 py-0.5 rounded-md">
                                {tech}
                              </span>
                            ))}
                          </div>

                          {/* Roadmap steps / milestones */}
                          <div className="space-y-3 font-sans">
                            <h5 className="text-[11px] font-black text-[#0F4C81] dark:text-sky-350 uppercase tracking-wider font-mono flex items-center gap-1.5">
                              <GitBranch className="h-4 w-4 text-[#00B8D9]" />
                              <span>Voyage Roadmap Milestones</span>
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {proj.milestones.map((m, mi) => (
                                <div key={mi} className="rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-805 dark:bg-zinc-950/60 p-3 flex gap-2.5 items-start hover:border-[#00B8D9]/20 transition">
                                  <span className="font-mono text-[10.5px] font-black text-indigo-650 dark:text-indigo-400">Compartment 0{mi+1}</span>
                                  <p className="text-[11px] text-zinc-650 dark:text-[#AEAEB2] leading-normal font-semibold">{m}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Architect tip */}
                          <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 dark:border-indigo-950/30 dark:bg-indigo-500/5 p-4 space-y-1.5 font-sans">
                            <h5 className="text-[10px] font-bold text-[#00B8D9] dark:text-[#67E8F9] uppercase tracking-widest font-mono flex items-center gap-1">
                              <Rocket className="h-3.5 w-3.5" />
                              <span>Architectural sailing coordinates</span>
                            </h5>
                            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed select-all italic font-mono pl-1">
                              "{proj.architecturalInsight}"
                            </p>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Isolated Style Definitions to secure smooth listing animations */}
                  <style>{`
                    @keyframes rock {
                      0%, 100% { transform: translateY(0) rotate(0deg); }
                      33% { transform: translateY(-1.5px) rotate(0.4deg); }
                      66% { transform: translateY(-0.5px) rotate(-0.4deg); }
                    }
                  `}</style>

                  <div className="pt-4 border-t border-zinc-150 dark:border-zinc-850 flex justify-end">
                    <button
                      onClick={() => fetchProjectRecommendations()}
                      className="flex items-center gap-1.5 text-xs font-bold text-indigo-650 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-305 transition cursor-pointer"
                    >
                      <Sparkles className="h-4.5 w-4.5" />
                      <span>Re-orchestrate Systems Outlines</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 font-bold text-zinc-450">Awaiting recommendation coordinates.</div>
              )}
            </div>
          )}

        </div>
      </div>
    </OceanPageShell>
  );
};
export default ProfilePage;
