import { UserSettings } from '../types';

/**
 * Update user settings via API.
 * @param settings Partial settings to update.
 */
export const updateSettings = async (settings: Partial<UserSettings>) => {
  const token = localStorage.getItem('codementor_token');
  const res = await fetch('/api/settings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(settings),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to update settings');
  }
  return res.json();
};
