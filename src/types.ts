export interface UserOnboarding {
  targetRole: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  preferredIndustry: string;
  githubUsername?: string;
  weeklyHours: number;
}

export interface UserScores {
  careerReadiness: number;
  github: number;
  dsa: number;
  resume: number;
  interviewReadiness: number;
  openSource: number;
}

export interface UserProfile {
  bio?: string;
  skills: string[];
  experience: string[];
  projects: string[];
  website?: string;
  linkedin?: string;
}

export interface UserSettings {
  theme: 'dark' | 'light';
  emailNotifications: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  onboarded: boolean;
  onboarding?: UserOnboarding;
  scores: UserScores;
  profile?: UserProfile;
  settings: UserSettings;
  createdAt: string;
  weeklyXp?: { day: string; xp: number }[];
  streak?: number;
}

export interface GitHubAnalysis {
  username: string;
  name?: string;
  avatarUrl?: string;
  bio?: string;
  company?: string;
  location?: string;
  followers?: number;
  following?: number;
  lastAnalyzed: string;
  repositoriesCount: number;
  contributionsCount: number;
  starsCount: number;
  pullRequestsCount?: number;
  issuesCount?: number;
  languages: { name: string; percentage: number }[];
  readmeRating: string; // 'A' | 'B' | 'C' | 'D'
  recommendations: string[];
  recommendationsReasons: string[];
  readinessContribution: number;
  topRepos?: { name: string; description: string; stars: number; forks: number; url: string; language?: string }[];
  recentActivity?: { date: string; type: string; repo: string; message?: string }[];
  strengths?: string[];
  weaknesses?: string[];
  missingSkills?: string[];
  technologyRecommendations?: string[];
  openSourceReadinessScore?: number;
  heatmapData?: number[]; // grid array
}

export interface DSAPicture {
  solvedCount: number;
  totalCount: number;
  byCategory: { category: string; solved: number; total: number }[];
  recentSubmissions: {
    id: string;
    problemName: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    language: string;
    status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded';
    timestamp: string;
  }[];
  currentStreak?: number;
  weeklyProgress?: { day: string; solved: number }[];
  difficultyDistribution?: { Easy: number; Medium: number; Hard: number };
  activityDates?: string[];
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  status: 'pending' | 'in-progress' | 'completed';
  resources: { name: string; url: string }[];
}

export interface AIRoadmap {
  role: string;
  timeline: string;
  lastGenerated: string;
  steps: RoadmapStep[];
}

export interface OpenSourceContribution {
  _id: string;
  userId: string;
  repoName: string;
  prUrl: string;
  description: string;
  status: 'draft' | 'open' | 'merged' | 'closed';
  language: string;
  createdAt: string;
}

export interface InterviewTranscript {
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export interface InterviewFeedback {
  averageScore: number;
  strengths: string[];
  weaknesses: string[];
  questionsFeedback: {
    question: string;
    userAnswer: string;
    rating: number; // 1-10
    feedback: string;
  }[];
}

export interface InterviewSession {
  _id: string;
  topic: string;
  roleName: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  transcript: InterviewTranscript[];
  feedback?: InterviewFeedback;
  status: 'active' | 'completed';
  createdAt: string;
}

export interface ResumeAnalysis {
  _id: string;
  userId: string;
  textInput: string;
  overallScore: number;
  grammarScore: number;
  keywordMatchScore: number;
  formatScore: number;
  parsedSkills: string[];
  gapAnalysis: string[];
  tips: string[];
  enhancedBullets: { original: string; enhanced: string; reason: string }[];
  createdAt: string;
}
