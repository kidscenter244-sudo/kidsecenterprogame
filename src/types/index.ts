export type OperationType = 'add-sub' | 'multiplication' | 'division';

export interface AddSubSettings {
  numbersCount: number; // e.g. 3, 4, 5...
  digitsCount: number;  // e.g. 1, 2, 3...
  questionCount: number;
  timeLimitSeconds: number; // 0 = no limit, or e.g. 30s
}

export interface MultiplicationSettings {
  digits1: number; // digits of first number
  digits2: number; // digits of second number
  questionCount: number;
  timeLimitSeconds: number;
}

export interface DivisionSettings {
  dividendDigits: number; // digits of dividend
  divisorDigits: number;  // digits of divisor
  questionCount: number;
  timeLimitSeconds: number;
}

export interface MixedSettings {
  includeAddSub: boolean;
  addSubCount: number;
  addSubNumbers: number;
  addSubDigits: number;

  includeMultiplication: boolean;
  multCount: number;
  multDigits1: number;
  multDigits2: number;

  includeDivision: boolean;
  divCount: number;
  divDividendDigits: number;
  divDivisorDigits: number;

  timeLimitSeconds: number;
}

export interface MathProblem {
  id: string;
  type: OperationType;
  title: string;
  terms?: number[]; // for Add-sub (subtracted term is negative)
  numA?: number;
  numB?: number;
  symbol: string;
  correctAnswer: number;
  userAnswer?: number;
  isCorrect?: boolean;
  timeTakenSeconds?: number;
}

export interface QuizSessionSummary {
  id: string;
  date: string;
  categoryTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  coinsEarned: number;
  timeSpentSeconds: number;
  averageTimePerQuestion: number;
  problems: MathProblem[];
}

export interface RobloxAvatarConfig {
  faceType: 'smile' | 'smirk' | 'serious' | 'mask' | 'ninja' | 'saiyan' | 'bat' | 'electric' | 'cyborg' | 'pharaoh';
  hairType: 'swept' | 'spiky' | 'fade' | 'curly' | 'long-blonde' | 'saiyan-huge' | 'ninja-headband' | 'cowl' | 'helmet' | 'crown' | 'cap';
  skinTone: string;
  hasBeard?: boolean;
}

export interface CharacterItem {
  id: string;
  name: string;
  title: string;
  category: 'football' | 'superhero' | 'anime' | 'legend';
  tier: 'Starter' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  price: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  skinColor: string;
  hairColor: string;
  jerseyNumber?: string;
  hasCape?: boolean;
  hasSoccerBall?: boolean;
  hasAura?: boolean;
  auraColor?: string;
  description: string;
  unlockedByDefault?: boolean;
  stats: {
    speed: number;
    power: number;
    focus: number;
  };
  robloxConfig?: RobloxAvatarConfig;
}

export interface UserAccount {
  email: string;
  nickname: string;
  role: 'student' | 'teacher';
  coins: number;
  unlockedCharacters: string[];
  equippedCharacterId: string;
  stats: {
    totalSolved: number;
    totalCorrect: number;
    totalCoinsEarned: number;
    bestStreak: number;
  };
  history: QuizSessionSummary[];
}

export interface StudentRosterRecord {
  id: string;
  email: string;
  name: string;
  grade: string;
  coins: number;
  totalSolved: number;
  totalCorrect: number;
  accuracy: number;
  bestStreak: number;
  equippedCharacterId: string;
  lastActive: string;
}

export interface StageEnvironment {
  id: string;
  name: string;
  description: string;
  groundColor: string;
  ambientColor: string;
  lightColor: string;
  fogColor: string;
  price: number;
}
