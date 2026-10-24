import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, QuizSessionSummary, StudentRosterRecord } from '../types';
import { CHARACTERS } from '../data/characters';

interface AuthContextType {
  user: UserAccount | null;
  isAuthenticated: boolean;
  isTeacher: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message: string }>;
  teacherLogin: (passcode: string) => { success: boolean; message: string };
  register: (email: string, pass: string, nickname: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  addCoins: (amount: number) => void;
  unlockCharacter: (characterId: string, price: number) => boolean;
  equipCharacter: (characterId: string) => void;
  saveSession: (session: QuizSessionSummary) => void;
  exportSyncCode: () => string;
  importSyncCode: (code: string) => { success: boolean; message: string };
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  // Teacher roster actions
  studentRoster: StudentRosterRecord[];
  awardStudentCoins: (studentId: string, amount: number) => void;
}

const DEFAULT_USER: UserAccount = {
  email: 'champion@kidscenter.com',
  nickname: 'Math Champion',
  role: 'student',
  coins: 450, // Welcome bonus
  unlockedCharacters: ['rookie-champ'],
  equippedCharacterId: 'rookie-champ',
  stats: {
    totalSolved: 15,
    totalCorrect: 14,
    totalCoinsEarned: 450,
    bestStreak: 8
  },
  history: []
};

// Simulated classroom students enrolled in the platform for the teacher
const INITIAL_STUDENTS: StudentRosterRecord[] = [
  {
    id: 'std-1',
    name: 'Omar Farouk',
    email: 'omar.f@kidscenter.com',
    grade: 'Grade 5 - Soroban Track',
    coins: 2450,
    totalSolved: 142,
    totalCorrect: 138,
    accuracy: 97,
    bestStreak: 24,
    equippedCharacterId: 'messi-10',
    lastActive: '10 mins ago'
  },
  {
    id: 'std-2',
    name: 'Youssef Ahmed',
    email: 'youssef.a@kidscenter.com',
    grade: 'Grade 6 - Speed Math',
    coins: 3800,
    totalSolved: 210,
    totalCorrect: 198,
    accuracy: 94,
    bestStreak: 32,
    equippedCharacterId: 'ronaldo-7',
    lastActive: '25 mins ago'
  },
  {
    id: 'std-3',
    name: 'Mariam Khaled',
    email: 'mariam.k@kidscenter.com',
    grade: 'Grade 4 - Mental Arithmetic',
    coins: 1650,
    totalSolved: 95,
    totalCorrect: 91,
    accuracy: 96,
    bestStreak: 18,
    equippedCharacterId: 'salah-11',
    lastActive: '1 hour ago'
  },
  {
    id: 'std-4',
    name: 'Adam Tarek',
    email: 'adam.t@kidscenter.com',
    grade: 'Grade 5 - Multiplication Masters',
    coins: 1200,
    totalSolved: 78,
    totalCorrect: 68,
    accuracy: 87,
    bestStreak: 12,
    equippedCharacterId: 'spider-hero',
    lastActive: '3 hours ago'
  },
  {
    id: 'std-5',
    name: 'Nour El-Din',
    email: 'nour.d@kidscenter.com',
    grade: 'Grade 6 - Olympiad Math',
    coins: 5200,
    totalSolved: 320,
    totalCorrect: 312,
    accuracy: 98,
    bestStreak: 45,
    equippedCharacterId: 'saiyan-goku',
    lastActive: 'Just now'
  },
  {
    id: 'std-6',
    name: 'Salma Hossam',
    email: 'salma.h@kidscenter.com',
    grade: 'Grade 4 - Mental Arithmetic',
    coins: 980,
    totalSolved: 55,
    totalCorrect: 47,
    accuracy: 85,
    bestStreak: 9,
    equippedCharacterId: 'rookie-champ',
    lastActive: 'Yesterday'
  }
];


const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\\/+$/, '');
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const SESSION_STORAGE_KEY = 'kids_center_supabase_session';

type SupabaseSession = {
  access_token: string;
  refresh_token?: string;
  user: { id: string; email?: string; user_metadata?: Record<string, unknown> };
};

const getSavedSession = (): SupabaseSession | null => {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) as SupabaseSession : null;
  } catch {
    return null;
  }
};

const saveSessionToken = (session: SupabaseSession | null) => {
  if (session) localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_STORAGE_KEY);
};

const authRequest = async (path: string, body?: unknown) => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel, then redeploy.');
  }
  const response = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
    method: 'POST',
    headers: { apikey: SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {})
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.msg || result.message || result.error_description || result.error || 'Supabase authentication failed.');
  }
  return result;
};

const databaseRequest = async (path: string, token: string, init: RequestInit = {}) => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) throw new Error('Supabase environment variables are missing.');
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers || {})
    }
  });
  const raw = await response.text();
  const result = raw ? (() => { try { return JSON.parse(raw); } catch { return raw; } })() : null;
  if (!response.ok) {
    const message = typeof result === 'object' && result
      ? (result.message || result.details || result.hint || result.code)
      : result;
    throw new Error(String(message || `Supabase database request failed (${response.status}).`));
  }
  return result;
};

const loadRemoteProfile = async (authUser: SupabaseSession['user'], token: string): Promise<UserAccount> => {
  const profiles = await databaseRequest(
    `profiles?id=eq.${encodeURIComponent(authUser.id)}&select=*`,
    token
  );
  const profile = Array.isArray(profiles) ? profiles[0] : null;
  if (!profile) throw new Error('Your Supabase account exists, but its profile is missing. Run the profile repair SQL in Supabase, then sign in again.');

  const [charactersResult, sessionsResult] = await Promise.all([
    databaseRequest(`user_characters?user_id=eq.${encodeURIComponent(authUser.id)}&select=character_id`, token).catch(() => []),
    databaseRequest(`quiz_sessions?user_id=eq.${encodeURIComponent(authUser.id)}&select=*&order=created_at.desc&limit=20`, token).catch(() => [])
  ]);
  const unlocked = Array.isArray(charactersResult)
    ? charactersResult.map((item: any) => String(item.character_id))
    : [];
  if (!unlocked.includes('rookie-champ')) unlocked.unshift('rookie-champ');

  const history: QuizSessionSummary[] = Array.isArray(sessionsResult) ? sessionsResult.map((item: any) => ({
    id: String(item.id),
    date: item.created_at || new Date().toISOString(),
    categoryTitle: item.category_title || 'Math Quiz',
    totalQuestions: Number(item.total_questions || 0),
    correctAnswers: Number(item.correct_answers || 0),
    accuracy: Number(item.accuracy || 0),
    coinsEarned: Number(item.coins_earned || 0),
    timeSpentSeconds: Number(item.time_spent_seconds || 0),
    averageTimePerQuestion: Number(item.total_questions || 0) > 0
      ? Number(item.time_spent_seconds || 0) / Number(item.total_questions)
      : 0,
    problems: []
  })) : [];

  const totalSolved = Number(profile.total_solved || 0);
  const totalCorrect = Number(profile.total_correct || 0);
  return {
    email: profile.email || authUser.email || '',
    nickname: profile.nickname || authUser.email?.split('@')[0] || 'Player',
    role: profile.role === 'teacher' ? 'teacher' : 'student',
    coins: Number(profile.coins ?? 450),
    unlockedCharacters: unlocked,
    equippedCharacterId: profile.equipped_character_id || 'rookie-champ',
    stats: {
      totalSolved,
      totalCorrect,
      totalCoinsEarned: history.reduce((sum, session) => sum + session.coinsEarned, 0),
      bestStreak: Number(profile.best_streak || 0)
    },
    history
  };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [studentRoster, setStudentRoster] = useState<StudentRosterRecord[]>(INITIAL_STUDENTS);

  // Restore a real Supabase Auth session; localStorage-only demo accounts are not treated as signed in.
  useEffect(() => {
    let cancelled = false;
    const restore = async () => {
      try {
        const session = getSavedSession();
        if (session?.access_token && SUPABASE_URL && SUPABASE_ANON_KEY) {
          const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
            headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${session.access_token}` }
          });
          if (response.ok) {
            const authUser = await response.json();
            const remoteUser = await loadRemoteProfile(authUser, session.access_token);
            if (!cancelled) {
              setUser(remoteUser);
              localStorage.setItem(`kids_center_user_${remoteUser.email}`, JSON.stringify(remoteUser));
              return;
            }
          }
          saveSessionToken(null);
        }
      } catch (error) {
        console.error('Unable to restore Supabase session:', error);
      }
      if (!cancelled) {
        setUser(DEFAULT_USER);
        try { localStorage.setItem('kids_center_user_default', JSON.stringify(DEFAULT_USER)); } catch {}
      }
    };
    void restore();
    return () => { cancelled = true; };
  }, []);

  const saveUser = (updated: UserAccount) => {
    setUser(updated);
    try {
      localStorage.setItem(`kids_center_user_${updated.email}`, JSON.stringify(updated));
      localStorage.setItem('kids_center_active_email', updated.email);

      // Keep roster updated with active student
      if (updated.role === 'student') {
        setStudentRoster(prev => {
          const exists = prev.find(s => s.email === updated.email);
          let newRoster: StudentRosterRecord[];
          if (exists) {
            newRoster = prev.map(s =>
              s.email === updated.email
                ? {
                    ...s,
                    coins: updated.coins,
                    totalSolved: updated.stats.totalSolved,
                    totalCorrect: updated.stats.totalCorrect,
                    accuracy:
                      updated.stats.totalSolved > 0
                        ? Math.round((updated.stats.totalCorrect / updated.stats.totalSolved) * 100)
                        : 100,
                    bestStreak: updated.stats.bestStreak,
                    equippedCharacterId: updated.equippedCharacterId,
                    lastActive: 'Just now'
                  }
                : s
            );
          } else {
            newRoster = [
              {
                id: `std-${Date.now()}`,
                name: updated.nickname,
                email: updated.email,
                grade: 'Grade 5 - Active Player',
                coins: updated.coins,
                totalSolved: updated.stats.totalSolved,
                totalCorrect: updated.stats.totalCorrect,
                accuracy:
                  updated.stats.totalSolved > 0
                    ? Math.round((updated.stats.totalCorrect / updated.stats.totalSolved) * 100)
                    : 100,
                bestStreak: updated.stats.bestStreak,
                equippedCharacterId: updated.equippedCharacterId,
                lastActive: 'Just now'
              },
              ...prev
            ];
          }
          localStorage.setItem('kids_center_roster', JSON.stringify(newRoster));
          return newRoster;
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const login = async (email: string, pass: string): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !pass) return { success: false, message: 'Please enter both email and password.' };
    try {
      const result = await authRequest('token?grant_type=password', { email: cleanEmail, password: pass });
      if (!result.access_token || !result.user) {
        return { success: false, message: 'Supabase did not return a signed-in session. Check your email confirmation settings.' };
      }
      const session = result as SupabaseSession;
      saveSessionToken(session);
      const remoteUser = await loadRemoteProfile(session.user, session.access_token);

      // Preserve local progress from this browser when an existing local account is first linked.
      try {
        const localRaw = localStorage.getItem(`kids_center_user_${cleanEmail}`);
        if (localRaw) {
          const localUser = JSON.parse(localRaw) as UserAccount;
          if (localUser.email === cleanEmail) {
            remoteUser.coins = Math.max(remoteUser.coins, Number(localUser.coins || 0));
            remoteUser.stats.totalSolved = Math.max(remoteUser.stats.totalSolved, Number(localUser.stats.totalSolved || 0));
            remoteUser.stats.totalCorrect = Math.max(remoteUser.stats.totalCorrect, Number(localUser.stats.totalCorrect || 0));
            remoteUser.stats.bestStreak = Math.max(remoteUser.stats.bestStreak, Number(localUser.stats.bestStreak || 0));
            remoteUser.unlockedCharacters = Array.from(new Set([...remoteUser.unlockedCharacters, ...(localUser.unlockedCharacters || [])]));
            remoteUser.equippedCharacterId = localUser.equippedCharacterId || remoteUser.equippedCharacterId;
            remoteUser.history = remoteUser.history.length ? remoteUser.history : (localUser.history || []);
            await databaseRequest(`profiles?id=eq.${encodeURIComponent(session.user.id)}`, session.access_token, {
              method: 'PATCH',
              headers: { Prefer: 'return=minimal' },
              body: JSON.stringify({
                coins: remoteUser.coins,
                total_solved: remoteUser.stats.totalSolved,
                total_correct: remoteUser.stats.totalCorrect,
                best_streak: remoteUser.stats.bestStreak,
                equipped_character_id: remoteUser.equippedCharacterId,
                updated_at: new Date().toISOString()
              })
            });
            for (const characterId of remoteUser.unlockedCharacters) {
              await databaseRequest('user_characters', session.access_token, {
                method: 'POST',
                headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' },
                body: JSON.stringify({ user_id: session.user.id, character_id: characterId })
              }).catch(() => undefined);
            }
          }
        }
      } catch (migrationError) {
        console.warn('Could not migrate local progress:', migrationError);
      }

      saveUser(remoteUser);
      setIsAuthModalOpen(false);
      return { success: true, message: `Welcome back, ${remoteUser.nickname}!` };
    } catch (error) {
      saveSessionToken(null);
      return { success: false, message: error instanceof Error ? error.message : 'Login failed.' };
    }
  };

  const teacherLogin = (passcode: string): { success: boolean; message: string } => {
    const cleanCode = passcode.trim();
    if (cleanCode === '01068545095' || cleanCode === '1234') {
      const teacherProfile: UserAccount = {
        email: 'teacher@kidscenter.com',
        nickname: 'Coach Ahmed (Teacher)',
        role: 'teacher',
        coins: 99999,
        unlockedCharacters: CHARACTERS.map(c => c.id),
        equippedCharacterId: 'messi-10',
        stats: {
          totalSolved: 999,
          totalCorrect: 999,
          totalCoinsEarned: 99999,
          bestStreak: 100
        },
        history: []
      };
      saveUser(teacherProfile);
      setIsAuthModalOpen(false);
      return { success: true, message: 'Teacher Portal Access Granted!' };
    }
    return { success: false, message: 'Incorrect teacher passcode!' };
  };

  const register = async (email: string, pass: string, nickname: string): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || cleanEmail.indexOf('@') === -1) return { success: false, message: 'Please enter a valid email address.' };
    if (!pass || pass.length < 6) return { success: false, message: 'Password must be at least 6 characters for Supabase Auth.' };
    try {
      const result = await authRequest('signup', {
        email: cleanEmail,
        password: pass,
        data: { nickname: nickname.trim() || cleanEmail.split('@')[0], role: 'student' }
      });
      if (!result.access_token || !result.user) {
        return {
          success: true,
          message: 'Account created. Check your email to confirm it, then sign in.'
        };
      }
      const session = result as SupabaseSession;
      saveSessionToken(session);
      const remoteUser = await loadRemoteProfile(session.user, session.access_token);
      saveUser(remoteUser);
      setIsAuthModalOpen(false);
      return { success: true, message: `Welcome, ${remoteUser.nickname}!` };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Registration failed.' };
    }
  };

  const logout = () => {
    saveSessionToken(null);
    localStorage.removeItem('kids_center_active_email');
    setUser(DEFAULT_USER);
  };

  const addCoins = (amount: number) => {
    if (!user) return;
    const updated = {
      ...user,
      coins: Math.max(0, user.coins + amount),
      stats: {
        ...user.stats,
        totalCoinsEarned: amount > 0 ? user.stats.totalCoinsEarned + amount : user.stats.totalCoinsEarned
      }
    };
    saveUser(updated);
    const session = getSavedSession();
    if (session?.access_token) {
      void databaseRequest(`profiles?id=eq.${encodeURIComponent(session.user.id)}`, session.access_token, {
        method: 'PATCH', headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ coins: updated.coins, updated_at: new Date().toISOString() })
      }).catch(error => console.error('Could not save coins to Supabase:', error));
    }
  };

  const unlockCharacter = (characterId: string, price: number): boolean => {
    if (!user) return false;
    if (user.unlockedCharacters.includes(characterId)) return true;
    if (user.coins < price) return false;

    const updated = {
      ...user,
      coins: user.coins - price,
      unlockedCharacters: [...user.unlockedCharacters, characterId],
      equippedCharacterId: characterId
    };
    saveUser(updated);
    const session = getSavedSession();
    if (session?.access_token) {
      void Promise.all([
        databaseRequest('user_characters', session.access_token, {
          method: 'POST',
          headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' },
          body: JSON.stringify({ user_id: session.user.id, character_id: characterId })
        }),
        databaseRequest(`profiles?id=eq.${encodeURIComponent(session.user.id)}`, session.access_token, {
          method: 'PATCH', headers: { Prefer: 'return=minimal' },
          body: JSON.stringify({ coins: updated.coins, equipped_character_id: characterId, updated_at: new Date().toISOString() })
        })
      ]).catch(error => console.error('Could not save character purchase to Supabase:', error));
    }
    return true;
  };

  const equipCharacter = (characterId: string) => {
    if (!user) return;
    if (!user.unlockedCharacters.includes(characterId)) return;
    saveUser({ ...user, equippedCharacterId: characterId });
    const session = getSavedSession();
    if (session?.access_token) {
      void databaseRequest(`profiles?id=eq.${encodeURIComponent(session.user.id)}`, session.access_token, {
        method: 'PATCH', headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ equipped_character_id: characterId, updated_at: new Date().toISOString() })
      }).catch(error => console.error('Could not save equipped character:', error));
    }
  };

  const saveSession = (quizSession: QuizSessionSummary) => {
    if (!user) return;
    const updated: UserAccount = {
      ...user,
      coins: user.coins + quizSession.coinsEarned,
      stats: {
        totalSolved: user.stats.totalSolved + quizSession.totalQuestions,
        totalCorrect: user.stats.totalCorrect + quizSession.correctAnswers,
        totalCoinsEarned: user.stats.totalCoinsEarned + quizSession.coinsEarned,
        bestStreak: Math.max(user.stats.bestStreak, quizSession.correctAnswers)
      },
      history: [quizSession, ...user.history.slice(0, 19)]
    };
    saveUser(updated);
    const session = getSavedSession();
    if (session?.access_token) {
      void databaseRequest('rpc/record_quiz_and_update_stats', session.access_token, {
        method: 'POST',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({
          p_user_id: session.user.id,
          p_category: quizSession.categoryTitle,
          p_total: quizSession.totalQuestions,
          p_correct: quizSession.correctAnswers,
          p_coins: quizSession.coinsEarned,
          p_time_spent: quizSession.timeSpentSeconds
        })
      }).then(async () => {
        const fresh = await loadRemoteProfile(session.user, session.access_token);
        saveUser({ ...fresh, history: [quizSession, ...fresh.history.filter(item => item.id !== quizSession.id)].slice(0, 20) });
      }).catch(error => console.error('Could not save quiz session to Supabase:', error));
    }
  };

  const exportSyncCode = (): string => {
    if (!user) return '';
    try {
      return btoa(encodeURIComponent(JSON.stringify(user)));
    } catch {
      return '';
    }
  };

  const importSyncCode = (code: string): { success: boolean; message: string } => {
    try {
      const decoded = decodeURIComponent(atob(code.trim()));
      const parsed: UserAccount = JSON.parse(decoded);
      if (!parsed.email) return { success: false, message: 'Invalid code.' };
      saveUser(parsed);
      return { success: true, message: `Loaded profile: ${parsed.nickname}` };
    } catch {
      return { success: false, message: 'Invalid code format.' };
    }
  };

  const awardStudentCoins = (studentId: string, amount: number) => {
    setStudentRoster(prev => {
      const updated = prev.map(s => (s.id === studentId ? { ...s, coins: s.coins + amount } : s));
      localStorage.setItem('kids_center_roster', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && user.email !== DEFAULT_USER.email,
        isTeacher: user?.role === 'teacher',
        login,
        teacherLogin,
        register,
        logout,
        addCoins,
        unlockCharacter,
        equipCharacter,
        saveSession,
        exportSyncCode,
        importSyncCode,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        isAuthModalOpen,
        studentRoster,
        awardStudentCoins
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
