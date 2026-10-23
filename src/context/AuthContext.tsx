import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, QuizSessionSummary, StudentRosterRecord } from '../types';
import { CHARACTERS } from '../data/characters';

interface AuthContextType {
  user: UserAccount | null;
  isAuthenticated: boolean;
  isTeacher: boolean;
  login: (email: string, pass: string) => { success: boolean; message: string };
  teacherLogin: (passcode: string) => { success: boolean; message: string };
  register: (email: string, pass: string, nickname: string) => { success: boolean; message: string };
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [studentRoster, setStudentRoster] = useState<StudentRosterRecord[]>(INITIAL_STUDENTS);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const activeEmail = localStorage.getItem('kids_center_active_email');
      if (activeEmail) {
        const stored = localStorage.getItem(`kids_center_user_${activeEmail}`);
        if (stored) {
          setUser(JSON.parse(stored));
          return;
        }
      }
      const storedDefault = localStorage.getItem('kids_center_user_default');
      if (storedDefault) {
        setUser(JSON.parse(storedDefault));
      } else {
        localStorage.setItem('kids_center_user_default', JSON.stringify(DEFAULT_USER));
        setUser(DEFAULT_USER);
      }

      // Load roster
      const storedRoster = localStorage.getItem('kids_center_roster');
      if (storedRoster) {
        setStudentRoster(JSON.parse(storedRoster));
      }
    } catch {
      setUser(DEFAULT_USER);
    }
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

  const login = (email: string, pass: string): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !pass) {
      return { success: false, message: 'Please enter both email and password.' };
    }

    try {
      const accountsJson = localStorage.getItem('kids_center_passwords');
      const accounts: Record<string, string> = accountsJson ? JSON.parse(accountsJson) : {};

      if (!accounts[cleanEmail]) {
        return { success: false, message: 'Account not found. Please register first!' };
      }

      if (accounts[cleanEmail] !== pass) {
        return { success: false, message: 'Incorrect password.' };
      }

      const stored = localStorage.getItem(`kids_center_user_${cleanEmail}`);
      if (stored) {
        saveUser(JSON.parse(stored));
      } else {
        const newProfile: UserAccount = {
          ...DEFAULT_USER,
          email: cleanEmail,
          nickname: cleanEmail.split('@')[0]
        };
        saveUser(newProfile);
      }
      setIsAuthModalOpen(false);
      return { success: true, message: `Welcome back, ${cleanEmail}!` };
    } catch {
      return { success: false, message: 'Login error.' };
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

  const register = (email: string, pass: string, nickname: string): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || cleanEmail.indexOf('@') === -1) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    if (!pass || pass.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters.' };
    }

    try {
      const accountsJson = localStorage.getItem('kids_center_passwords');
      const accounts: Record<string, string> = accountsJson ? JSON.parse(accountsJson) : {};

      if (accounts[cleanEmail]) {
        return { success: false, message: 'Account already exists. Please log in.' };
      }

      accounts[cleanEmail] = pass;
      localStorage.setItem('kids_center_passwords', JSON.stringify(accounts));

      const newProfile: UserAccount = {
        email: cleanEmail,
        nickname: nickname.trim() || cleanEmail.split('@')[0],
        role: 'student',
        coins: user ? Math.max(450, user.coins) : 450,
        unlockedCharacters: ['rookie-champ'],
        equippedCharacterId: 'rookie-champ',
        stats: {
          totalSolved: 0,
          totalCorrect: 0,
          totalCoinsEarned: 450,
          bestStreak: 0
        },
        history: []
      };

      saveUser(newProfile);
      setIsAuthModalOpen(false);
      return { success: true, message: `Welcome, ${newProfile.nickname}!` };
    } catch {
      return { success: false, message: 'Registration failed.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('kids_center_active_email');
    setUser(DEFAULT_USER);
  };

  const addCoins = (amount: number) => {
    if (!user) return;
    saveUser({
      ...user,
      coins: Math.max(0, user.coins + amount),
      stats: {
        ...user.stats,
        totalCoinsEarned: amount > 0 ? user.stats.totalCoinsEarned + amount : user.stats.totalCoinsEarned
      }
    });
  };

  const unlockCharacter = (characterId: string, price: number): boolean => {
    if (!user) return false;
    if (user.unlockedCharacters.includes(characterId)) return true;
    if (user.coins < price) return false;

    saveUser({
      ...user,
      coins: user.coins - price,
      unlockedCharacters: [...user.unlockedCharacters, characterId],
      equippedCharacterId: characterId
    });
    return true;
  };

  const equipCharacter = (characterId: string) => {
    if (!user) return;
    if (!user.unlockedCharacters.includes(characterId)) return;
    saveUser({
      ...user,
      equippedCharacterId: characterId
    });
  };

  const saveSession = (session: QuizSessionSummary) => {
    if (!user) return;
    saveUser({
      ...user,
      coins: user.coins + session.coinsEarned,
      stats: {
        totalSolved: user.stats.totalSolved + session.totalQuestions,
        totalCorrect: user.stats.totalCorrect + session.correctAnswers,
        totalCoinsEarned: user.stats.totalCoinsEarned + session.coinsEarned,
        bestStreak: Math.max(user.stats.bestStreak, session.correctAnswers)
      },
      history: [session, ...user.history.slice(0, 19)]
    });
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
