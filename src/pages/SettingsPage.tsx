import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, CheckCircle, Shield, KeyRound, Loader2, Sparkles } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, token, updateSettings } = useAuth();
  const [theme, setTheme] = useState<'dark' | 'light'>(user?.settings?.theme || 'dark');
  const [emailNotifications, setEmailNotifications] = useState(user?.settings?.emailNotifications || true);
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
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="border-b border-[#1C1C1E] pb-6">
        <h1 className="font-sans text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5 md:text-3xl">
          <SettingsIcon className="h-7 w-7 text-[#E5E5E7]" />
          <span>System Settings</span>
        </h1>
        <p className="text-xs text-[#8E8E93] mt-1.5 leading-relaxed">
          Manage sandbox interfaces behaviors, theme presets, email alert notifications, and security credentials anchors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings options Column */}
        <div className="lg:col-span-3 rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-6 shadow-xs">
          <h3 className="font-sans text-white font-bold text-sm border-b border-[#1C1C1E] pb-3 flex items-center gap-2 mb-6">
            <Sparkles className="h-4.5 w-4.5 text-emerald-400" />
            <span>Customize platform behaviors</span>
          </h3>

          <form onSubmit={handleSave} className="space-y-6 font-sans">
            {/* Theme Presets */}
            <div className="space-y-3">
              <label className="block text-[10.5px] font-mono text-[#8E8E93] uppercase tracking-wider">Appearance Preset</label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'dark', title: 'Cosmic Obsidian (Dark)', description: 'Subtle slate borders paired with deep charcoal backdrops.' },
                  { id: 'light', title: 'Slick Minimalist (Light)', description: 'High contrast crisp outlines with clean negative spaces.' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTheme(item.id as any)}
                    className={`
                      border rounded-xl p-4.5 text-left transition relative
                      ${theme === item.id
                        ? 'bg-emerald-500/5 border-emerald-500/40 text-emerald-400'
                        : 'bg-[#1C1C1E] border-[#2D2D30] text-[#8E8E93] hover:text-[#E5E5E7] hover:bg-[#1C1C20]'
                      }
                    `}
                  >
                    <h4 className="text-xs font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-[10.5px] text-[#8E8E93] leading-relaxed">{item.description}</p>
                    {theme === item.id && (
                      <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Email notifications checkbox */}
            <div className="space-y-3 pt-5 border-t border-[#1C1C1E]">
              <label className="block text-[10.5px] font-mono text-[#8E8E93] uppercase tracking-wider">Notifications alerts</label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="rounded bg-[#1C1C1E] border-[#2D2D30] text-emerald-500 accent-emerald-500 h-4.5 w-4.5 mt-0.5 focus:ring-0 focus:ring-offset-0"
                />
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition">Email Digests Report</h4>
                  <p className="text-[10.5px] text-[#8E8E93] leading-relaxed mt-0.5">Receive weekly summaries detailing your career velocity scores progress levels.</p>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between border-t border-[#1C1C1E] pt-6">
              {success ? (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-pulse">
                  <CheckCircle className="h-4.5 w-4.5" />
                  <span>Settings variables saved successfully!</span>
                </span>
              ) : (
                <div />
              )}

              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-2.5 text-xs font-bold transition shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:opacity-50 font-sans"
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
          <div className="rounded-xl border border-[#2D2D30] bg-[#141416]/50 p-5 shadow-xs font-mono text-[10.5px] text-[#8E8E93] space-y-4">
            <h3 className="font-sans text-[#E5E5E7] font-semibold text-xs border-b border-[#1C1C1E] pb-2 flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-[#8E8E93]" />
              <span>Diagnostic parameters</span>
            </h3>

            <div>
              <span className="block uppercase text-[9px] font-bold text-[#AEAEB2] tracking-wider">JWT Auth Node token:</span>
              <p className="bg-[#1C1C1E] rounded p-2 text-white truncate select-all mt-1.5 border border-[#2D2D30] lowercase">
                {token}
              </p>
            </div>

            <div className="pt-2 border-t border-[#1C1C1E]/55">
              <span className="block uppercase text-[9px] font-bold text-[#AEAEB2] tracking-wider">Database Link:</span>
              <span className="block text-emerald-400 font-semibold mt-1">Local JSON db/user.json (Persistent)</span>
            </div>

            <div className="pt-2 border-t border-[#1C1C1E]/55 flex items-center justify-between text-[#8E8E93]">
              <span>System latency:</span>
              <span className="text-emerald-400 font-bold">14ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
