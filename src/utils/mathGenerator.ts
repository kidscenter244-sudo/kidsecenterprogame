import {
  AddSubSettings,
  MultiplicationSettings,
  DivisionSettings,
  MathProblem
} from '../types';

/**
 * Returns a random integer in [min, max] inclusive
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates an integer with exactly N digits.
 * e.g., 1 digit => 1..9 (or 1..9 for addition, avoid 0 at start)
 * 2 digits => 10..99
 * 3 digits => 100..999
 */
function randomWithDigits(digits: number): number {
  const d = Math.max(1, Math.min(6, digits));
  if (d === 1) {
    return randomInt(1, 9);
  }
  const min = Math.pow(10, d - 1);
  const max = Math.pow(10, d) - 1;
  return randomInt(min, max);
}

/**
 * Generate Addition & Subtraction problems according to user instructions:
 * - Each question has `numbersCount` terms
 * - Exactly ONE term is subtracted
 * - The subtracted term must be smaller than the sum of numbers above it
 * - In display: '+' is hidden, only '-' is shown next to the subtracted term
 */
export function generateAddSubProblem(settings: AddSubSettings, index: number): MathProblem {
  const count = Math.max(2, settings.numbersCount || 3);
  const digits = Math.max(1, settings.digitsCount || 1);

  const terms: number[] = [];
  // Pick which index will be the subtraction (must be at least 1, not the first number)
  const subIndex = count > 2 ? randomInt(1, count - 1) : 1;

  let runningSum = 0;

  for (let i = 0; i < count; i++) {
    if (i === subIndex) {
      // Must be smaller than running sum so it never goes negative
      const minDigit = digits === 1 ? 1 : Math.pow(10, digits - 1);
      const maxDigit = Math.pow(10, digits) - 1;

      let subVal: number;
      if (runningSum > minDigit) {
        const upper = Math.min(maxDigit, runningSum - 1);
        subVal = randomInt(minDigit, upper);
      } else if (runningSum > 1) {
        subVal = randomInt(1, runningSum - 1);
      } else {
        subVal = 1;
        // bump previous term if needed
        if (terms[0]) terms[0] += 5;
        runningSum += 5;
      }

      // Store as negative value for calculation
      terms.push(-subVal);
      runningSum -= subVal;
    } else {
      const val = randomWithDigits(digits);
      terms.push(val);
      runningSum += val;
    }
  }

  const correctAnswer = terms.reduce((acc, curr) => acc + curr, 0);

  return {
    id: `add-sub-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 7)}`,
    type: 'add-sub',
    title: `Addition & Subtraction #${index + 1}`,
    terms,
    symbol: '+ / -',
    correctAnswer
  };
}

/**
 * Generate Multiplication problem
 * User sets digits of 1st number and digits of 2nd number
 */
export function generateMultiplicationProblem(settings: MultiplicationSettings, index: number): MathProblem {
  const d1 = Math.max(1, settings.digits1 || 2);
  const d2 = Math.max(1, settings.digits2 || 1);

  const numA = randomWithDigits(d1);
  const numB = randomWithDigits(d2);
  const correctAnswer = numA * numB;

  return {
    id: `mult-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 7)}`,
    type: 'multiplication',
    title: `Multiplication #${index + 1}`,
    numA,
    numB,
    symbol: '×',
    correctAnswer
  };
}

/**
 * Generate Division problem
 * Clean whole-integer division for kids: Dividend ÷ Divisor = Quotient
 */
export function generateDivisionProblem(settings: DivisionSettings, index: number): MathProblem {
  const dividendDigits = Math.max(2, settings.dividendDigits || 2);
  const divisorDigits = Math.max(1, Math.min(dividendDigits - 1, settings.divisorDigits || 1));

  // Generate a clean divisor
  const divisor = randomWithDigits(divisorDigits);

  // Determine quotient range so divisor * quotient has the requested dividendDigits
  const targetMin = Math.pow(10, dividendDigits - 1);
  const targetMax = Math.pow(10, dividendDigits) - 1;

  const minQuotient = Math.max(2, Math.ceil(targetMin / divisor));
  const maxQuotient = Math.max(minQuotient, Math.floor(targetMax / divisor));

  const quotient = randomInt(minQuotient, maxQuotient);
  const dividend = divisor * quotient;

  return {
    id: `div-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 7)}`,
    type: 'division',
    title: `Division #${index + 1}`,
    numA: dividend,
    numB: divisor,
    symbol: '÷',
    correctAnswer: quotient
  };
}

/**
 * Generate mixed problems from integrated home screen MixedSettings
 */
export function generateMixedProblems(settings: {
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
}): MathProblem[] {
  const problems: MathProblem[] = [];
  let index = 0;

  if (settings.includeAddSub && settings.addSubCount > 0) {
    for (let i = 0; i < settings.addSubCount; i++) {
      problems.push(
        generateAddSubProblem(
          {
            numbersCount: settings.addSubNumbers,
            digitsCount: settings.addSubDigits,
            questionCount: settings.addSubCount,
            timeLimitSeconds: 0
          },
          index++
        )
      );
    }
  }

  if (settings.includeMultiplication && settings.multCount > 0) {
    for (let i = 0; i < settings.multCount; i++) {
      problems.push(
        generateMultiplicationProblem(
          {
            digits1: settings.multDigits1,
            digits2: settings.multDigits2,
            questionCount: settings.multCount,
            timeLimitSeconds: 0
          },
          index++
        )
      );
    }
  }

  if (settings.includeDivision && settings.divCount > 0) {
    for (let i = 0; i < settings.divCount; i++) {
      problems.push(
        generateDivisionProblem(
          {
            dividendDigits: settings.divDividendDigits,
            divisorDigits: settings.divDivisorDigits,
            questionCount: settings.divCount,
            timeLimitSeconds: 0
          },
          index++
        )
      );
    }
  }

  return problems;
}

/**
 * Generate complete quiz session based on user settings
 */
export function generateQuizProblems(
  type: 'add-sub' | 'multiplication' | 'division' | 'mixed',
  settings: any
): MathProblem[] {
  if (type === 'mixed') {
    return generateMixedProblems(settings);
  }

  const problems: MathProblem[] = [];
  const count = (settings as { questionCount: number }).questionCount || 10;

  for (let i = 0; i < count; i++) {
    if (type === 'add-sub') {
      problems.push(generateAddSubProblem(settings as AddSubSettings, i));
    } else if (type === 'multiplication') {
      problems.push(generateMultiplicationProblem(settings as MultiplicationSettings, i));
    } else if (type === 'division') {
      problems.push(generateDivisionProblem(settings as DivisionSettings, i));
    }
  }

  return problems;
}

/**
 * Calculate earned coins based on:
 * - Accuracy (correct vs wrong)
 * - Difficulty (digits, rows)
 * - Speed (answered quickly under time limit)
 * - Streak multiplier
 */
export function calculateProblemReward(
  problem: MathProblem,
  timeTakenSeconds: number,
  currentStreak: number
): { coins: number; speedBonus: number; streakBonus: number; difficultyBonus: number } {
  if (!problem.isCorrect) {
    return { coins: 0, speedBonus: 0, streakBonus: 0, difficultyBonus: 0 };
  }

  const baseCoins = 10;
  let difficultyBonus = 0;

  if (problem.type === 'add-sub' && problem.terms) {
    const rows = problem.terms.length;
    const maxDigits = Math.max(...problem.terms.map(t => Math.abs(t).toString().length));
    difficultyBonus = (rows - 2) * 4 + (maxDigits - 1) * 6;
  } else if (problem.type === 'multiplication' && problem.numA && problem.numB) {
    const d1 = problem.numA.toString().length;
    const d2 = problem.numB.toString().length;
    difficultyBonus = (d1 + d2 - 2) * 6;
  } else if (problem.type === 'division' && problem.numA && problem.numB) {
    const d1 = problem.numA.toString().length;
    difficultyBonus = (d1 - 1) * 7;
  }

  // Speed Bonus: fast reflexes award extra coins!
  let speedBonus = 0;
  if (timeTakenSeconds <= 2.5) {
    speedBonus = 12;
  } else if (timeTakenSeconds <= 5.0) {
    speedBonus = 6;
  } else if (timeTakenSeconds <= 10.0) {
    speedBonus = 3;
  }

  // Streak Bonus: +2 coins per streak level up to +20
  const streakBonus = Math.min(20, currentStreak * 2);

  const totalCoins = Math.max(5, baseCoins + difficultyBonus + speedBonus + streakBonus);

  return {
    coins: totalCoins,
    speedBonus,
    streakBonus,
    difficultyBonus
  };
}
