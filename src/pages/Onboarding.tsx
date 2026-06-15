import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, Check } from 'lucide-react';

interface OnboardingProps {
  onNavigate: (route: string) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onNavigate }) => {
  const { onboard } = useAuth();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [targetRole, setTargetRole] = useState('Fullstack Software Engineer');
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [preferredIndustry, setPreferredIndustry] = useState('Tech SaaS');
  const [githubUsername, setGithubUsername] = useState('');
  const [weeklyHours, setWeeklyHours] = useState(15);

  const roles = [
    'Fullstack Software Engineer',
    'Frontend Engineer',
    'Backend Systems Engineer',
    'AI / Machine Learning Architect',
    'Mobile Application Developer',
    'DevOps / Site Reliability Engineer'
  ];

  const industries = [
    'Tech SaaS',
    'Fintech / Finance',
    'Healthtech / Medical',
    'AI / Cognitive Automations',
    'Web3 / Cryptography',
    'ClimateTech'
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onboard({
        targetRole,
        experienceLevel,
        preferredIndustry,
        githubUsername: githubUsername.trim() || undefined,
        weeklyHours: Number(weeklyHours)
      });
      onNavigate('dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Onboarding submission rejected');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-[#09090B] text-[#E5E5E7] py-12 px-4 sm:px-6 lg:px-8 relative selection:bg-emerald-500 selection:text-black">
      <div className="absolute top-1/4 right-1/4 h-[350px] w-[350px] rounded-full bg-[#10B981]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-xl mx-auto w-full z-10">
        {/* Progress Tracker Breadcrumb */}
        <div className="flex items-center justify-between mb-8 select-none font-mono text-[10px] text-[#8E8E93] tracking-widest uppercase">
          <span className={step >= 1 ? 'text-emerald-400 font-bold' : ''}>01. Core Role</span>
          <span className="h-px bg-[#2D2D30] flex-1 mx-4" />
          <span className={step >= 2 ? 'text-emerald-400 font-bold' : ''}>02. Preferences</span>
          <span className="h-px bg-[#2D2D30] flex-1 mx-4" />
          <span className={step >= 3 ? 'text-emerald-400 font-bold' : ''}>03. Handles</span>
        </div>

        <div className="bg-[#141416]/85 border border-[#2D2D30] rounded-xl py-8 px-6 sm:px-8 shadow-[2px_12px_35px_rgba(0,0,0,0.6)] backdrop-blur-md">
          {error && (
            <div className="mb-5 rounded-lg border border-rose-500/20 bg-rose-500/5 p-3.5 text-xs text-rose-400">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* STEP 1: TARGET ROLE & SPEC & SKILLS */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white font-sans">Locate your engineering coordinates</h3>
                  <p className="text-xs text-[#8E8E93] mt-1">Select the career role matching your professional targeting priorities.</p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {roles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setTargetRole(role)}
                      className={`
                        flex items-center justify-between rounded-lg p-3.5 text-left text-sm font-medium transition-all duration-150 border
                        ${targetRole === role 
                          ? 'bg-emerald-500/5 border-emerald-500/40 text-emerald-400' 
                          : 'bg-[#1C1C1E] border-[#2D2D30] text-[#8E8E93] hover:text-white hover:bg-[#1E1E22]'
                        }
                      `}
                    >
                      <span>{role}</span>
                      {targetRole === role && <Check className="h-4 w-4 text-emerald-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: PREFERENCES & TIME GUIDES */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white font-sans">Detail your developmental constraints</h3>
                  <p className="text-xs text-[#8E8E93] mt-1">Configure your skill levels and study allocation metrics.</p>
                </div>

                {/* Experience Levels Group */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#AEAEB2]">Experience Level</label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setExperienceLevel(lvl)}
                        className={`
                          rounded-lg py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-150 border
                          ${experienceLevel === lvl
                            ? 'bg-emerald-500/5 border-emerald-500/40 text-emerald-400'
                            : 'bg-[#1C1C1E] border-[#2D2D30] text-[#8E8E93] hover:text-white'
                          }
                        `}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preferred Industry Dropdown */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#AEAEB2]">Target Industry Sectors</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {industries.map((ind) => (
                      <button
                        key={ind}
                        type="button"
                        onClick={() => setPreferredIndustry(ind)}
                        className={`
                          ellipse rounded-lg p-3 text-xs font-medium transition-all text-left border
                          ${preferredIndustry === ind
                            ? 'bg-emerald-500/5 border-emerald-500/40 text-emerald-400'
                            : 'bg-[#1C1C1E] border-[#2D2D30] text-[#8E8E93] hover:text-white hover:bg-[#1E1E22]'
                          }
                        `}
                      >
                        {ind}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weekly allocations slider */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#AEAEB2]">
                    <span>Weekly Practice Allocation</span>
                    <span className="text-emerald-400 font-bold font-mono">{weeklyHours} Hours</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    step="5"
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(Number(e.target.value))}
                    className="w-full accent-emerald-400 bg-[#1C1C1E]"
                  />
                  <span className="block text-[10px] text-[#8E8E93]">We recommend at least 15 hours per week for intermediate career transitions.</span>
                </div>
              </div>
            )}

            {/* STEP 3: EXTERNAL HANDSHAKES & SUBMISSIONS */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white font-sans">Establish external platform handshakes</h3>
                  <p className="text-xs text-[#8E8E93] mt-1">Provide your social profile handles so our system can audit metadata metrics.</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="git-user" className="block text-xs font-mono uppercase tracking-wider text-[#AEAEB2]">
                    GitHub Username (Optional)
                  </label>
                  <input
                    id="git-user"
                    type="text"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    placeholder="octocat"
                    className="w-full bg-[#1C1C1E] border border-[#2D2D30] rounded-lg px-3.5 py-2 text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                  />
                  <p className="text-[10px] text-[#8E8E93]">
                    Your username will be evaluated by CodeMentor AI to audit repo README structures and commit density scores.
                  </p>
                </div>
              </div>
            )}

            {/* Stepped Navigation Footer */}
            <div className="mt-8 pt-5 border-t border-[#1C1C1E] flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="rounded-lg border border-[#2D2D30] bg-[#141416]/50 hover:bg-[#1C1C1E] text-[#E5E5E7] px-4 py-2 text-xs font-semibold transition"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 text-xs font-bold transition"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-2.5 text-xs font-extrabold tracking-wide transition shadow-[0_0_15px_rgba(16,185,129,0.25)] disabled:opacity-50 animate-pulse"
                >
                  {isSubmitting ? (
                    <span>Configuring Sandbox...</span>
                  ) : (
                    <>
                      <span>Complete Setup & Launch</span>
                      <Check className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Onboarding;
