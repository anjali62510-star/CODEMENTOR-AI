import fs from 'fs';
import path from 'path';
import { 
  User, 
  GitHubAnalysis, 
  DSAPicture, 
  AIRoadmap, 
  OpenSourceContribution, 
  InterviewSession, 
  ResumeAnalysis 
} from '../types';

// Path for local storage within the container
const DB_FILE = path.join(process.cwd(), 'src', 'db', 'db.json');

// Interface for the local DB
interface DatabaseSchema {
  users: User[];
  githubAnalyses: (GitHubAnalysis & { userId: string })[];
  dsaTracker: { [userId: string]: DSAPicture };
  roadmaps: { [userId: string]: AIRoadmap };
  openSource: OpenSourceContribution[];
  interviews: InterviewSession[];
  resumes: ResumeAnalysis[];
}

// Initial default database structure
const INITIAL_DB: DatabaseSchema = {
  users: [],
  githubAnalyses: [],
  dsaTracker: {},
  roadmaps: {},
  openSource: [],
  interviews: [],
  resumes: []
};

// Simple Thread-safe file db write mechanism
function readDB(): DatabaseSchema {
  try {
    const parentDir = path.dirname(DB_FILE);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), 'utf-8');
      return INITIAL_DB;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading file db', err);
    return INITIAL_DB;
  }
}

function writeDB(data: DatabaseSchema) {
  try {
    const parentDir = path.dirname(DB_FILE);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing file db', err);
  }
}

// Helper to generate IDs
export const generateId = () => Math.random().toString(36).substring(2, 11);

// Standard default DSA Data
export const getDefaultDSA = (): DSAPicture => ({
  solvedCount: 34,
  totalCount: 450,
  byCategory: [
    { category: 'Arrays & Hashing', solved: 15, total: 60 },
    { category: 'Two Pointers', solved: 8, total: 30 },
    { category: 'Sliding Window', solved: 5, total: 25 },
    { category: 'Trees & Graphs', solved: 4, total: 85 },
    { category: 'Dynamic Programming', solved: 2, total: 95 }
  ],
  recentSubmissions: [
    {
      id: 'sub-1',
      problemName: 'Two Sum',
      difficulty: 'Easy',
      language: 'TypeScript',
      status: 'Accepted',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'sub-2',
      problemName: 'Longest Consecutive Sequence',
      difficulty: 'Medium',
      language: 'JavaScript',
      status: 'Accepted',
      timestamp: new Date(Date.now() - 3600000 * 48).toISOString()
    }
  ]
});

// Mock Mongoose-like Models
export const UserDB = {
  find: async (): Promise<User[]> => {
    const db = readDB();
    return db.users;
  },

  findOne: async (query: { email?: string; id?: string }): Promise<User | null> => {
    const db = readDB();
    if (query.email) {
      const u = db.users.find(user => user.email.toLowerCase() === query.email!.toLowerCase());
      return u || null;
    }
    if (query.id) {
      const u = db.users.find(user => user._id === query.id);
      return u || null;
    }
    return null;
  },

  findById: async (id: string): Promise<User | null> => {
    const db = readDB();
    const u = db.users.find(user => user._id === id);
    return u || null;
  },

  create: async (data: Omit<User, '_id' | 'scores' | 'settings' | 'onboarded' | 'createdAt'> & { password?: string }): Promise<User & { passwordHash?: string }> => {
    const db = readDB();
    const _id = generateId();
    const newUser: User & { passwordHash?: string } = {
      _id,
      name: data.name,
      email: data.email,
      onboarded: false,
      scores: {
        careerReadiness: 15,
        github: 0,
        dsa: 8,
        resume: 10,
        interviewReadiness: 0,
        openSource: 0
      },
      settings: {
        theme: 'dark',
        emailNotifications: true
      },
      createdAt: new Date().toISOString(),
      passwordHash: data.password // we will hash this in the auth route
    };
    db.users.push(newUser);
    writeDB(db);
    return newUser;
  },

  findByIdAndUpdate: async (id: string, updates: Partial<User>): Promise<User | null> => {
    const db = readDB();
    const idx = db.users.findIndex(user => user._id === id);
    if (idx === -1) return null;

    db.users[idx] = {
      ...db.users[idx],
      ...updates,
      // Ensure complex nested fields merge properly if specified
      scores: updates.scores ? { ...db.users[idx].scores, ...updates.scores } : db.users[idx].scores,
      settings: updates.settings ? { ...db.users[idx].settings, ...updates.settings } : db.users[idx].settings,
      profile: updates.profile || db.users[idx].profile,
      onboarding: updates.onboarding || db.users[idx].onboarding
    };

    writeDB(db);
    return db.users[idx];
  },

  updatePasswordHash: async (id: string, hash: string) => {
    const db = readDB();
    const idx = db.users.findIndex(u => u._id === id);
    if (idx !== -1) {
      (db.users[idx] as any).passwordHash = hash;
      writeDB(db);
    }
  },

  getPasswordHash: async (id: string): Promise<string | null> => {
    const db = readDB();
    const u = db.users.find(user => user._id === id);
    return u ? (u as any).passwordHash || null : null;
  }
};

export const GitHubDB = {
  findByUserId: async (userId: string): Promise<GitHubAnalysis | null> => {
    const db = readDB();
    const analysis = db.githubAnalyses.find(g => g.userId === userId);
    return analysis || null;
  },

  upsert: async (userId: string, data: GitHubAnalysis): Promise<GitHubAnalysis> => {
    const db = readDB();
    const idx = db.githubAnalyses.findIndex(g => g.userId === userId);
    const doc = { ...data, userId };

    if (idx !== -1) {
      db.githubAnalyses[idx] = doc;
    } else {
      db.githubAnalyses.push(doc);
    }
    
    // Update the user's score record too
    const userIdx = db.users.findIndex(u => u._id === userId);
    if (userIdx !== -1) {
      db.users[userIdx].scores.github = data.readinessContribution;
      // Recalculate overall Career Readiness
      const s = db.users[userIdx].scores;
      db.users[userIdx].scores.careerReadiness = Math.round(
        (s.github + s.dsa + s.resume + s.interviewReadiness + s.openSource) / 5
      );
    }

    writeDB(db);
    return data;
  }
};

export const DSADB = {
  findByUserId: async (userId: string): Promise<DSAPicture> => {
    const db = readDB();
    if (!db.dsaTracker[userId]) {
      db.dsaTracker[userId] = getDefaultDSA();
      writeDB(db);
    }
    return db.dsaTracker[userId];
  },

  update: async (userId: string, data: DSAPicture): Promise<DSAPicture> => {
    const db = readDB();
    db.dsaTracker[userId] = data;

    // Calc score based on solved vs standard target (e.g., target 150 solved = 100%)
    const score = Math.min(100, Math.round((data.solvedCount / 150) * 100));

    const userIdx = db.users.findIndex(u => u._id === userId);
    if (userIdx !== -1) {
      db.users[userIdx].scores.dsa = score;
      const s = db.users[userIdx].scores;
      db.users[userIdx].scores.careerReadiness = Math.round(
        (s.github + s.dsa + s.resume + s.interviewReadiness + s.openSource) / 5
      );
    }

    writeDB(db);
    return data;
  }
};

export const RoadmapDB = {
  findByUserId: async (userId: string): Promise<AIRoadmap | null> => {
    const db = readDB();
    return db.roadmaps[userId] || null;
  },

  save: async (userId: string, roadmap: AIRoadmap): Promise<AIRoadmap> => {
    const db = readDB();
    db.roadmaps[userId] = roadmap;
    writeDB(db);
    return roadmap;
  }
};

export const OpenSourceDB = {
  findByUserId: async (userId: string): Promise<OpenSourceContribution[]> => {
    const db = readDB();
    return db.openSource.filter(c => c.userId === userId);
  },

  create: async (userId: string, contrib: Omit<OpenSourceContribution, '_id' | 'userId' | 'createdAt'>): Promise<OpenSourceContribution> => {
    const db = readDB();
    const newContrib: OpenSourceContribution = {
      ...contrib,
      _id: generateId(),
      userId,
      createdAt: new Date().toISOString()
    };
    db.openSource.push(newContrib);

    // Recalculate OS score: e.g. 20 points per merged PR, 10 per open PR, up to 100
    const userContribs = db.openSource.filter(c => c.userId === userId);
    let osScore = 0;
    userContribs.forEach(c => {
      if (c.status === 'merged') osScore += 25;
      else if (c.status === 'open') osScore += 10;
    });
    osScore = Math.min(100, osScore);

    const userIdx = db.users.findIndex(u => u._id === userId);
    if (userIdx !== -1) {
      db.users[userIdx].scores.openSource = osScore;
      const s = db.users[userIdx].scores;
      db.users[userIdx].scores.careerReadiness = Math.round(
        (s.github + s.dsa + s.resume + s.interviewReadiness + s.openSource) / 5
      );
    }

    writeDB(db);
    return newContrib;
  },

  updateStatus: async (userId: string, contribId: string, status: 'draft' | 'open' | 'merged' | 'closed'): Promise<OpenSourceContribution | null> => {
    const db = readDB();
    const idx = db.openSource.findIndex(c => c._id === contribId && c.userId === userId);
    if (idx === -1) return null;

    db.openSource[idx].status = status;

    // Recalculate OS score
    const userContribs = db.openSource.filter(c => c.userId === userId);
    let osScore = 0;
    userContribs.forEach(c => {
      if (c.status === 'merged') osScore += 25;
      else if (c.status === 'open') osScore += 10;
    });
    osScore = Math.min(100, osScore);

    const userIdx = db.users.findIndex(u => u._id === userId);
    if (userIdx !== -1) {
      db.users[userIdx].scores.openSource = osScore;
      const s = db.users[userIdx].scores;
      db.users[userIdx].scores.careerReadiness = Math.round(
        (s.github + s.dsa + s.resume + s.interviewReadiness + s.openSource) / 5
      );
    }

    writeDB(db);
    return db.openSource[idx];
  },

  delete: async (userId: string, contribId: string): Promise<boolean> => {
    const db = readDB();
    const initialLen = db.openSource.length;
    db.openSource = db.openSource.filter(c => !(c._id === contribId && c.userId === userId));
    const deleted = db.openSource.length < initialLen;

    if (deleted) {
      // Recalculate OS score
      const userContribs = db.openSource.filter(c => c.userId === userId);
      let osScore = 0;
      userContribs.forEach(c => {
        if (c.status === 'merged') osScore += 25;
        else if (c.status === 'open') osScore += 10;
      });
      osScore = Math.min(100, osScore);

      const userIdx = db.users.findIndex(u => u._id === userId);
      if (userIdx !== -1) {
        db.users[userIdx].scores.openSource = osScore;
        const s = db.users[userIdx].scores;
        db.users[userIdx].scores.careerReadiness = Math.round(
          (s.github + s.dsa + s.resume + s.interviewReadiness + s.openSource) / 5
        );
      }
      writeDB(db);
    }

    return deleted;
  }
};

export const InterviewDB = {
  findByUserId: async (userId: string): Promise<InterviewSession[]> => {
    const db = readDB();
    // In db JSON, we can store userId on each InterviewSession
    return db.interviews.filter((i: any) => i.userId === userId);
  },

  findById: async (id: string): Promise<InterviewSession | null> => {
    const db = readDB();
    const result = db.interviews.find(i => i._id === id);
    return result || null;
  },

  create: async (userId: string, topic: string, roleName: string, difficulty: 'Easy' | 'Medium' | 'Hard'): Promise<InterviewSession> => {
    const db = readDB();
    const session: InterviewSession & { userId: string } = {
      _id: generateId(),
      userId,
      topic,
      roleName,
      difficulty,
      transcript: [],
      status: 'active',
      createdAt: new Date().toISOString()
    };
    db.interviews.push(session);
    writeDB(db);
    return session;
  },

  save: async (session: InterviewSession & { userId: string }): Promise<InterviewSession> => {
    const db = readDB();
    const idx = db.interviews.findIndex(i => i._id === session._id);
    if (idx !== -1) {
      db.interviews[idx] = session;
    } else {
      db.interviews.push(session);
    }

    // If completed, update user stats / interview score
    if (session.status === 'completed' && session.feedback) {
      const { userId } = session;
      const userIdx = db.users.findIndex(u => u._id === userId);
      if (userIdx !== -1) {
        db.users[userIdx].scores.interviewReadiness = Math.round(session.feedback.averageScore * 10); // Scale up to 100
        const s = db.users[userIdx].scores;
        db.users[userIdx].scores.careerReadiness = Math.round(
          (s.github + s.dsa + s.resume + s.interviewReadiness + s.openSource) / 5
        );
      }
    }

    writeDB(db);
    return session;
  }
};

export const ResumeDB = {
  findByUserId: async (userId: string): Promise<ResumeAnalysis[]> => {
    const db = readDB();
    return db.resumes.filter(r => r.userId === userId);
  },

  create: async (userId: string, data: Omit<ResumeAnalysis, '_id' | 'userId' | 'createdAt'>): Promise<ResumeAnalysis> => {
    const db = readDB();
    const doc: ResumeAnalysis = {
      ...data,
      _id: generateId(),
      userId,
      createdAt: new Date().toISOString()
    };
    db.resumes.push(doc);

    // Update user's resume score
    const userIdx = db.users.findIndex(u => u._id === userId);
    if (userIdx !== -1) {
      db.users[userIdx].scores.resume = data.overallScore;
      const s = db.users[userIdx].scores;
      db.users[userIdx].scores.careerReadiness = Math.round(
        (s.github + s.dsa + s.resume + s.interviewReadiness + s.openSource) / 5
      );
    }

    writeDB(db);
    return doc;
  }
};
