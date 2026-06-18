import { useState, useEffect, useCallback } from 'react';

export interface OceanPreferences {
  themeVariant: 'ocean-light' | 'midnight-ocean' | 'aurora-night';
  oceanAnimations: boolean;
  reduceMotion: boolean;
  performanceMode: boolean;
  careerFocus: string;
  preferredTechStack: string;
  learningGoals: string;
  interviewDifficulty: 'beginner' | 'intermediate' | 'advanced';
  notifyDsa: boolean;
  notifyRoadmap: boolean;
  notifyOpenSource: boolean;
  notifyGithub: boolean;
  profileVisibility: 'public' | 'private';
  activityVisibility: boolean;
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  showCompass: boolean;
  showSkillIslands: boolean;
  showAchievements: boolean;
  showWeeklyTide: boolean;
}

const DEFAULT_PREFS: OceanPreferences = {
  themeVariant: 'midnight-ocean',
  oceanAnimations: true,
  reduceMotion: false,
  performanceMode: false,
  careerFocus: 'Full-Stack Engineering',
  preferredTechStack: 'React, TypeScript, Node.js',
  learningGoals: 'Land a software engineering role within 6 months',
  interviewDifficulty: 'intermediate',
  notifyDsa: true,
  notifyRoadmap: true,
  notifyOpenSource: true,
  notifyGithub: true,
  profileVisibility: 'public',
  activityVisibility: true,
  fontSize: 'medium',
  highContrast: false,
  showCompass: true,
  showSkillIslands: true,
  showAchievements: true,
  showWeeklyTide: true,
};

const STORAGE_KEY = 'codementor_ocean_preferences';

export function useOceanSettings() {
  const [prefs, setPrefs] = useState<OceanPreferences>(DEFAULT_PREFS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(raw) });
      }
    } catch {
      /* use defaults */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));

    const root = document.documentElement;
    root.classList.toggle('reduce-motion', prefs.reduceMotion);
    root.classList.toggle('performance-mode', prefs.performanceMode);
    root.classList.toggle('high-contrast', prefs.highContrast);
    root.dataset.fontSize = prefs.fontSize;
    root.dataset.themeVariant = prefs.themeVariant;
  }, [prefs, loaded]);

  const updatePrefs = useCallback((patch: Partial<OceanPreferences>) => {
    setPrefs((prev) => ({ ...prev, ...patch }));
  }, []);

  const exportProgress = useCallback(() => {
    const data = {
      exportedAt: new Date().toISOString(),
      preferences: prefs,
      note: 'CodeMentor AI Ocean Explorer progress export',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codementor-ocean-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [prefs]);

  return { prefs, updatePrefs, exportProgress, loaded };
}
