import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import {
  Settings as SettingsIcon,
  CheckCircle,
  Shield,
  Loader2,
  Waves,
  Bell,
  Bot,
  Layout,
  Eye,
  Download,
  Accessibility,
  Anchor,
} from 'lucide-react';
import {
  OceanPageShell,
  OceanPageHeader,
  OceanSettingsSection,
  OceanToggleRow,
  OceanThemeCard,
  OceanInput,
  OceanSelect,
  OceanButton,
} from '../components/ocean/OceanUI';
import { useOceanSettings } from '../hooks/useOceanSettings';

export const SettingsPage: React.FC = () => {
  const { user, token, updateSettings } = useAuth();
  const { prefs, updatePrefs, exportProgress } = useOceanSettings();
  const [theme, setTheme] = useState<'dark' | 'light'>(user?.settings?.theme || 'dark');
  const [emailNotifications, setEmailNotifications] = useState(user?.settings?.emailNotifications !== false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'theme' | 'ai' | 'notifications' | 'privacy' | 'dashboard' | 'accessibility'>('theme');

  const tabs = [
    { id: 'theme' as const, label: 'Ocean Themes', icon: Waves },
    { id: 'dashboard' as const, label: 'Command Deck', icon: Layout },
    { id: 'ai' as const, label: 'Captain Mentor', icon: Bot },
    { id: 'notifications' as const, label: 'Harbor Alerts', icon: Bell },
    { id: 'privacy' as const, label: 'Privacy & Data', icon: Shield },
    { id: 'accessibility' as const, label: 'Accessibility', icon: Accessibility },
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await updateSettings({ theme, emailNotifications });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <OceanPageShell>
      <OceanPageHeader
        title="Deck Settings"
        subtitle="Configure your Ocean Explorer command bridge — themes, AI preferences, notifications, and voyage data."
        icon={SettingsIcon}
        badge="COMMAND CENTER"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tab navigation */}
        <div className="lg:col-span-1 space-y-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold transition cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800/40 text-[#00B8D9]'
                    : 'text-[#5C768D] dark:text-cyan-400 hover:bg-slate-50 dark:hover:bg-[#061524]/60'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Settings panels */}
        <div className="lg:col-span-3 space-y-6">
          <form onSubmit={handleSave}>
            {activeTab === 'theme' && (
              <div className="space-y-6">
                <OceanSettingsSection title="Appearance Mode" description="Choose your ocean atmosphere" icon={Waves}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <OceanThemeCard
                      id="ocean-light"
                      title="Ocean Light"
                      description="Pearl white decks with coastal cyan accents"
                      preview="bg-gradient-to-br from-[#F8FAFC] via-[#EAF2F8] to-cyan-100"
                      selected={theme === 'light'}
                      onClick={() => { setTheme('light'); updatePrefs({ themeVariant: 'ocean-light' }); }}
                    />
                    <OceanThemeCard
                      id="midnight-ocean"
                      title="Midnight Ocean"
                      description="Deep sea navy with moonlight cyan glow"
                      preview="bg-gradient-to-br from-[#030D18] via-[#061524] to-[#0A2540]"
                      selected={theme === 'dark' && prefs.themeVariant !== 'aurora-night'}
                      onClick={() => { setTheme('dark'); updatePrefs({ themeVariant: 'midnight-ocean' }); }}
                    />
                    <OceanThemeCard
                      id="aurora-night"
                      title="Aurora Night"
                      description="Emerald aurora above the midnight horizon"
                      preview="bg-gradient-to-br from-[#020810] via-emerald-950/40 to-cyan-950"
                      selected={prefs.themeVariant === 'aurora-night'}
                      onClick={() => { setTheme('dark'); updatePrefs({ themeVariant: 'aurora-night' }); }}
                    />
                  </div>
                </OceanSettingsSection>

                <OceanSettingsSection title="Animation Controls" description="Tune ocean motion for your device" icon={Anchor}>
                  <OceanToggleRow
                    label="Enable Ocean Animations"
                    description="Waves, floating panels, creature movement, and page transitions"
                    checked={prefs.oceanAnimations}
                    onChange={(v) => updatePrefs({ oceanAnimations: v })}
                  />
                  <OceanToggleRow
                    label="Reduce Motion"
                    description="Minimize animations for accessibility or focus"
                    checked={prefs.reduceMotion}
                    onChange={(v) => updatePrefs({ reduceMotion: v })}
                  />
                  <OceanToggleRow
                    label="Performance Mode"
                    description="Disable particles and background effects for slower devices"
                    checked={prefs.performanceMode}
                    onChange={(v) => updatePrefs({ performanceMode: v })}
                  />
                </OceanSettingsSection>
              </div>
            )}

            {activeTab === 'dashboard' && (
              <OceanSettingsSection title="Command Deck Layout" description="Customize which widgets appear on your bridge" icon={Layout}>
                <OceanToggleRow label="Career Compass" description="Show animated compass with bearing and destinations" checked={prefs.showCompass} onChange={(v) => updatePrefs({ showCompass: v })} />
                <OceanToggleRow label="Skill Islands Archipelago" description="Display growing skill island map" checked={prefs.showSkillIslands} onChange={(v) => updatePrefs({ showSkillIslands: v })} />
                <OceanToggleRow label="Ocean Creatures" description="Show achievement creature discovery panel" checked={prefs.showAchievements} onChange={(v) => updatePrefs({ showAchievements: v })} />
                <OceanToggleRow label="Weekly Tide Chart" description="Display XP flow as ocean tide levels" checked={prefs.showWeeklyTide} onChange={(v) => updatePrefs({ showWeeklyTide: v })} />
              </OceanSettingsSection>
            )}

            {activeTab === 'ai' && (
              <OceanSettingsSection title="Captain Mentor Preferences" description="Configure your AI Ocean Guide navigation style" icon={Bot}>
                <OceanInput label="Career Focus" value={prefs.careerFocus} onChange={(e) => updatePrefs({ careerFocus: e.target.value })} />
                <OceanInput label="Preferred Tech Stack" value={prefs.preferredTechStack} onChange={(e) => updatePrefs({ preferredTechStack: e.target.value })} />
                <OceanInput label="Learning Goals" value={prefs.learningGoals} onChange={(e) => updatePrefs({ learningGoals: e.target.value })} />
                <OceanSelect label="Interview Difficulty" value={prefs.interviewDifficulty} onChange={(e) => updatePrefs({ interviewDifficulty: e.target.value as any })}>
                  <option value="beginner">Beginner Bay</option>
                  <option value="intermediate">Open Sea</option>
                  <option value="advanced">Deep Waters</option>
                </OceanSelect>
              </OceanSettingsSection>
            )}

            {activeTab === 'notifications' && (
              <OceanSettingsSection title="Harbor Notification Center" description="Choose which voyage alerts reach your deck" icon={Bell}>
                <OceanToggleRow label="DSA Reminders" description="Daily algorithm reef practice prompts" checked={prefs.notifyDsa} onChange={(v) => updatePrefs({ notifyDsa: v })} />
                <OceanToggleRow label="Roadmap Updates" description="Navigation route changes and new destinations" checked={prefs.notifyRoadmap} onChange={(v) => updatePrefs({ notifyRoadmap: v })} />
                <OceanToggleRow label="Open Source Opportunities" description="New contribution harbors and PR currents" checked={prefs.notifyOpenSource} onChange={(v) => updatePrefs({ notifyOpenSource: v })} />
                <OceanToggleRow label="GitHub Milestones" description="Commit waves, star tides, and repo depth alerts" checked={prefs.notifyGithub} onChange={(v) => updatePrefs({ notifyGithub: v })} />
                <div className="pt-3 border-t border-[#D2E1ED] dark:border-[#123456]/40">
                  <OceanToggleRow label="Email Tide Digests" description="Weekly voyage summary delivered to your harbor email" checked={emailNotifications} onChange={setEmailNotifications} />
                </div>
              </OceanSettingsSection>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <OceanSettingsSection title="Privacy Controls" description="Manage your explorer visibility" icon={Eye}>
                  <OceanSelect label="Profile Visibility" value={prefs.profileVisibility} onChange={(e) => updatePrefs({ profileVisibility: e.target.value as any })}>
                    <option value="public">Public Harbor — visible to recruiters</option>
                    <option value="private">Private Voyage — hidden from public</option>
                  </OceanSelect>
                  <OceanToggleRow label="Activity Visibility" description="Show learning activity on your explorer log" checked={prefs.activityVisibility} onChange={(v) => updatePrefs({ activityVisibility: v })} />
                </OceanSettingsSection>
                <OceanSettingsSection title="Data Management" description="Export and backup your voyage data" icon={Download}>
                  <p className="text-[11px] text-[#5C768D] dark:text-cyan-300 font-semibold">Download your progress, preferences, and voyage analytics as a JSON report.</p>
                  <OceanButton type="button" variant="secondary" onClick={exportProgress} className="!w-auto">
                    <Download className="h-4 w-4" /> Export Progress Report
                  </OceanButton>
                </OceanSettingsSection>
              </div>
            )}

            {activeTab === 'accessibility' && (
              <OceanSettingsSection title="Accessibility" description="Ensure comfortable navigation for all explorers" icon={Accessibility}>
                <OceanSelect label="Font Size" value={prefs.fontSize} onChange={(e) => updatePrefs({ fontSize: e.target.value as any })}>
                  <option value="small">Compact (Small)</option>
                  <option value="medium">Standard (Medium)</option>
                  <option value="large">Expanded (Large)</option>
                </OceanSelect>
                <OceanToggleRow label="High Contrast Mode" description="Enhanced border and text contrast for readability" checked={prefs.highContrast} onChange={(v) => updatePrefs({ highContrast: v })} />
              </OceanSettingsSection>
            )}

            <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#D2E1ED] dark:border-[#123456]">
              {success ? (
                <span className="text-xs text-[#2DD4BF] font-extrabold flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4" />
                  Settings anchored successfully!
                </span>
              ) : <div />}
              <OceanButton type="submit" loading={saving} className="!w-auto px-8">
                Save Configuration
              </OceanButton>
            </div>
          </form>

          {/* Diagnostic side info */}
          <div className="premium-card rounded-2xl p-5 font-mono text-[10px] text-[#5C768D] dark:text-cyan-400 space-y-3">
            <div className="flex items-center gap-2 border-b border-[#D2E1ED] dark:border-[#123456]/40 pb-2">
              <Shield className="h-4 w-4 text-[#00B8D9]" />
              <span className="font-display font-black text-xs text-[#0A2540] dark:text-white">Voyage Diagnostics</span>
            </div>
            <div>
              <span className="block uppercase text-[8px] font-bold tracking-wider opacity-60">Session Token</span>
              <p className="bg-[var(--bg-tertiary)] rounded-lg p-2 truncate mt-1 border border-[var(--border-color)] text-[var(--text-primary)]">{token}</p>
            </div>
            <div className="flex justify-between font-bold">
              <span>Database:</span>
              <span className="text-[#2DD4BF]">JSON Persistent ✓</span>
            </div>
          </div>
        </div>
      </div>
    </OceanPageShell>
  );
};

export default SettingsPage;
