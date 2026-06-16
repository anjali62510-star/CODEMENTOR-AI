import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Settings as SettingsIcon, CheckCircle, Shield, KeyRound, Loader2, Sparkles, Sun, Moon } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, token, updateSettings } = useAuth();
  const [theme, setTheme] = useState<'dark' | 'light'>(user?.settings?.theme || 'dark');
  const [emailNotifications, setEmailNotifications] = useState(user?.settings?.emailNotifications !== false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      await updateSettings({
        theme,
        emailNotifications
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 select-none">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-[#1C1C1E] pb-6">
        <h1 className="font-display text-2xl font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-2.5 md:text-3xl">
          <SettingsIcon className="h-7 w-7 text-indigo-500 animate-spin" style={{ animationDuration: '4s' }} />
          <span>System Settings</span>
        </h1>
        <p className="text-xs text-slate-550 dark:text-[#8E8E93] mt-1.5 leading-relaxed font-bold">
          Manage sandbox interfaces behaviors, theme presets, email alert notifications, and security credentials anchors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings options Column */}
        <div className="lg:col-span-3 rounded-3xl border border-slate-200/80 dark:border-[#2D2D30]/65 bg-white dark:bg-[#1E293B]/40 p-6 shadow-xs">
          <h3 className="font-display text-slate-800 dark:text-white font-extrabold text-sm border-b border-slate-100 dark:border-[#1C1C1E] pb-3 flex items-center gap-2 mb-6">
            <Sparkles className="h-4.5 w-4.5 text-violet-500" />
            <span>Customize platform behaviors</span>
          </h3>

          <form onSubmit={handleSave} className="space-y-6 font-sans">
            {/* Theme Presets */}
            <div className="space-y-3.5">
              <label className="block text-[11px] font-mono font-extrabold text-slate-400 dark:text-[#8E8E93] uppercase tracking-wider">Appearance Mode Preset</label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'light', title: 'Slick Minimalist (Light)', description: 'High contrast crisp outlines with clean negative spaces.', icon: Sun, iconColor: 'text-amber-500' },
                  { id: 'dark', title: 'Cosmic Obsidian (Dark)', description: 'Subtle slate borders paired with deep charcoal backdrops.', icon: Moon, iconColor: 'text-violet-400' }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = theme === item.id;
                  return (
                    <motion.button
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                      key={item.id}
                      type="button"
                      onClick={() => setTheme(item.id as any)}
                      className={`
                        border rounded-2xl p-4.5 text-left transition relative cursor-pointer flex flex-col gap-2.5 h-full
                        ${isSelected
                          ? 'bg-violet-500/5 border-violet-500/40 text-violet-600 dark:text-violet-400 dark:bg-[#8B5CF6]/5'
                          : 'bg-slate-50 dark:bg-[#1C1C1E] border-slate-200 dark:border-[#2D2D30] text-slate-550 dark:text-[#8E8E93]'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded-lg ${isSelected ? 'bg-violet-100 dark:bg-violet-500/20' : 'bg-slate-200/55 dark:bg-slate-800'}`}>
                          <Icon className={`h-4.5 w-4.5 ${item.iconColor}`} />
                        </div>
                        <h4 className="text-xs font-black text-slate-800 dark:text-white">{item.title}</h4>
                      </div>
                      
                      <p className="text-[11px] text-slate-500 dark:text-[#8E8E93] leading-normal font-semibold mt-0.5">{item.description}</p>
                      {isSelected && (
                        <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-violet-600 dark:bg-emerald-400 shadow-sm" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Email notifications checkbox */}
            <div className="space-y-3 pt-5 border-t border-slate-100 dark:border-[#1C1C1E]">
              <label className="block text-[11px] font-mono font-extrabold text-slate-400 dark:text-[#8E8E93] uppercase tracking-wider">Notifications alerts</label>
              <label className="flex items-start gap-3.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="rounded bg-slate-100 dark:bg-[#1C1C1E] border-slate-200 dark:border-[#2D2D30] text-violet-500 accent-violet-500 h-4.5 w-4.5 mt-0.5 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-white group-hover:text-violet-500 dark:group-hover:text-violet-400 transition">Email Digests Report</h4>
                  <p className="text-[11px] text-slate-500 dark:text-[#8E8E93] leading-relaxed mt-0.5 font-semibold">Receive weekly summaries detailing your career readiness scores progress levels.</p>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-[#1C1C1E] pt-6">
              {success ? (
                <span className="text-xs text-emerald-500 font-extrabold flex items-center gap-1.5 animate-pulse">
                  <CheckCircle className="h-4.5 w-4.5" />
                  <span>Settings variables saved successfully!</span>
                </span>
              ) : (
                <div />
              )}

              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-full cursor-pointer bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 text-xs font-bold transition shadow-md disabled:opacity-50 font-sans"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving Variables...</span>
                  </>
                ) : (
                  <span>Save Configuration</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Diagnostic Metadata Side card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-3xl border border-slate-200/80 dark:border-[#2D2D30]/60 bg-white dark:bg-[#141416]/50 p-5 shadow-xs font-mono text-[10.5px] text-slate-500 dark:text-[#8E8E93] space-y-4">
            <h3 className="font-display text-slate-800 dark:text-[#E5E5E7] font-extrabold text-xs border-b border-slate-100 dark:border-[#1C1C1E] pb-2 flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-violet-500" />
              <span>Diagnostic parameters</span>
            </h3>

            <div>
              <span className="block uppercase text-[9px] font-bold text-slate-400 dark:text-[#AEAEB2] tracking-wider">JWT Auth Token:</span>
              <p className="bg-slate-100 dark:bg-[#1C1C1E] rounded-xl p-2.5 text-slate-800 dark:text-white truncate select-all mt-1.5 border border-slate-200 dark:border-[#2D2D30] lowercase font-semibold">
                {token}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-[#1C1C1E]/55">
              <span className="block uppercase text-[9px] font-bold text-slate-400 dark:text-[#AEAEB2] tracking-wider">Database Connection:</span>
              <span className="block text-emerald-500 dark:text-emerald-400 font-extrabold mt-1">Local JSON db/user.json (Persistent)</span>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-[#1C1C1E]/55 flex items-center justify-between font-bold">
              <span>System latency:</span>
              <span className="text-emerald-500 dark:text-emerald-450">14ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
