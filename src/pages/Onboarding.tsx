import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Check, Compass, Anchor, Ship } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  OceanPublicShell,
  OceanFormCard,
  OceanInput,
  OceanSelect,
  OceanButton,
  OceanErrorBanner,
} from '../components/ocean/OceanUI';

interface OnboardingProps {
  onNavigate: (route: string) => void;
}

const STEPS = [
  { id: 1, label: 'Set Course', icon: Compass },
  { id: 2, label: 'Experience Depth', icon: Anchor },
  { id: 3, label: 'Launch Voyage', icon: Ship },
];

export const Onboarding: React.FC<OnboardingProps> = ({ onNavigate }) => {
  const { onboard } = useAuth();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [targetRole, setTargetRole] = useState('Fullstack Software Engineer');
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [preferredIndustry, setPreferredIndustry] = useState('Tech SaaS');
  const [githubUsername, setGithubUsername] = useState('');
  const [weeklyHours, setWeeklyHours] = useState(15);

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
        weeklyHours: Number(weeklyHours),
      });
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.message || 'Onboarding submission rejected');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OceanPublicShell>
      <div className="flex min-h-screen flex-col justify-center py-12 px-4 sm:px-6">
        <div className="max-w-xl mx-auto w-full">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-10">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const active = step >= s.id;
              return (
                <div key={s.id} className="flex items-center flex-1">
                  <div className={`flex flex-col items-center ${i < STEPS.length - 1 ? 'flex-1' : ''}`}>
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition ${
                      active ? 'bg-[#00B8D9] border-[#00B8D9] text-white' : 'border-[#D2E1ED] dark:border-[#123456] text-[#5C768D]'
                    }`}>
                      {step > s.id ? <Check className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <span className={`text-[9px] font-mono font-bold mt-1.5 ${active ? 'text-[#00B8D9]' : 'text-[#5C768D]'}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-2 rounded ${step > s.id ? 'bg-[#00B8D9]' : 'bg-[#D2E1ED] dark:bg-[#123456]'}`} />
                  )}
                </div>
              );
            })}
          </div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-2xl font-black text-[#0A2540] dark:text-white text-center mb-2">
              Chart Your Expedition
            </h1>
            <p className="text-sm text-[#5C768D] dark:text-cyan-300 font-semibold text-center mb-8">
              Tell us your destination so Captain Mentor can navigate your journey.
            </p>
          </motion.div>

          <OceanFormCard>
            {error && <OceanErrorBanner message={error} />}
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                    <OceanSelect label="Target Harbor (Role)" value={targetRole} onChange={(e) => setTargetRole(e.target.value)}>
                      {['Fullstack Software Engineer', 'Frontend Engineer', 'Backend Systems Engineer', 'AI / Machine Learning Architect', 'Mobile Application Developer', 'DevOps / Site Reliability Engineer'].map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </OceanSelect>
                    <OceanSelect label="Industry Current" value={preferredIndustry} onChange={(e) => setPreferredIndustry(e.target.value)}>
                      {['Tech SaaS', 'Fintech / Finance', 'Healthtech / Medical', 'AI / Cognitive Automations', 'Web3 / Cryptography', 'ClimateTech'].map((i) => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </OceanSelect>
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                    <div>
                      <label className="ocean-label">Experience Depth</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setExperienceLevel(lvl)}
                            className={`py-3 rounded-xl text-xs font-bold capitalize border transition cursor-pointer ${
                              experienceLevel === lvl
                                ? 'bg-cyan-50 dark:bg-cyan-950/30 border-[#00B8D9] text-[#00B8D9]'
                                : 'border-[#D2E1ED] dark:border-[#123456] text-[#5C768D]'
                            }`}
                          >
                            {lvl === 'beginner' ? '🛶 Shallow' : lvl === 'intermediate' ? '⛵ Mid-Sea' : '🚢 Deep'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <OceanInput
                      label="GitHub Harbor (optional)"
                      value={githubUsername}
                      onChange={(e) => setGithubUsername(e.target.value)}
                      placeholder="@yourusername"
                    />
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                    <div>
                      <label className="ocean-label">Weekly Sailing Hours: {weeklyHours}h</label>
                      <input
                        type="range"
                        min={5}
                        max={40}
                        value={weeklyHours}
                        onChange={(e) => setWeeklyHours(Number(e.target.value))}
                        className="w-full accent-[#00B8D9]"
                      />
                    </div>
                    <div className="rounded-xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200/50 dark:border-cyan-800/30 p-4 text-xs text-[#5C768D] dark:text-cyan-300 font-semibold space-y-1">
                      <p><strong className="text-[#0A2540] dark:text-white">Role:</strong> {targetRole}</p>
                      <p><strong className="text-[#0A2540] dark:text-white">Depth:</strong> {experienceLevel}</p>
                      <p><strong className="text-[#0A2540] dark:text-white">Industry:</strong> {preferredIndustry}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-3 mt-8">
                {step > 1 && (
                  <OceanButton type="button" variant="secondary" onClick={() => setStep(step - 1)} className="!w-auto flex-1">
                    Previous Port
                  </OceanButton>
                )}
                {step < 3 ? (
                  <OceanButton type="button" onClick={() => setStep(step + 1)} className="flex-1">
                    Continue Voyage <ArrowRight className="h-4 w-4" />
                  </OceanButton>
                ) : (
                  <OceanButton type="submit" loading={isSubmitting} className="flex-1">
                    Launch Command Deck <ArrowRight className="h-4 w-4" />
                  </OceanButton>
                )}
              </div>
            </form>
          </OceanFormCard>
        </div>
      </div>
    </OceanPublicShell>
  );
};

export default Onboarding;
