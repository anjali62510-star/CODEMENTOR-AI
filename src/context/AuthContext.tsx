import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserOnboarding, UserProfile, UserSettings } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  onboard: (data: UserOnboarding) => Promise<void>;
  updateProfile: (profile: UserProfile) => Promise<void>;
  updateSettings: (settings: UserSettings) => Promise<void>;
  refreshUser: () => Promise<void>;
  apiFetch: (path: string, options?: RequestInit) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('codementor_token'));
  const [loading, setLoading] = useState(true);

  // Set the visual theme class on html node
  const applyTheme = (theme: 'dark' | 'light') => {
    const root = window.document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
  };

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            applyTheme(data.user.settings?.theme || 'dark');
          } else {
            // Token expired or invalid
            logout();
          }
        } catch (err) {
          console.error('Error validating auth session:', err);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }
    localStorage.setItem('codementor_token', data.token);
    setToken(data.token);
    setUser(data.user);
    applyTheme(data.user.settings?.theme || 'dark');
  };

  const signup = async (name: string, email: string, password: string) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }
    localStorage.setItem('codementor_token', data.token);
    setToken(data.token);
    setUser(data.user);
    applyTheme(data.user.settings?.theme || 'dark');
  };

  const logout = () => {
    localStorage.removeItem('codementor_token');
    setToken(null);
    setUser(null);
    // Standard default
    const root = window.document.documentElement;
    root.classList.add('dark');
  };

  const onboard = async (onboardingData: UserOnboarding) => {
    const res = await fetch('/api/auth/onboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(onboardingData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Onboarding update failed');
    }
    setUser(data.user);
  };

  const updateProfile = async (profile: UserProfile) => {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profile)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Profile update failed');
    }
    setUser(data.user);
  };

  const updateSettings = async (settings: UserSettings) => {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(settings)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Settings update failed');
    }
    setUser(data.user);
    applyTheme(settings.theme);
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error('Error refreshing user profiles', err);
    }
  };

  // Safe wrapper for fetches requiring authorization bearer tokens
  const apiFetch = async (path: string, options: RequestInit = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers
    };
    const res = await fetch(path, { ...options, headers });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'API request failed');
    }
    return data;
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      signup,
      logout,
      onboard,
      updateProfile,
      updateSettings,
      refreshUser,
      apiFetch
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be mounted within an AuthProvider context layer');
  }
  return context;
};
