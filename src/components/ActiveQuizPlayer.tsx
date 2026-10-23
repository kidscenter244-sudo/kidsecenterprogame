import React, { useState, useEffect, useRef } from 'react';
import { MathProblem, QuizSessionSummary } from '../types';
import { calculateProblemReward } from '../utils/mathGenerator';
import { sounds } from '../utils/audio';
import { Clock, Flame, Check, X, ArrowRight, CornerDownLeft, Delete } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ActiveQuizPlayerProps {
  problems: MathProblem[];
  categoryTitle: string;
  timeLimitTotalSeconds: number; // 0 = untimed
  onFinishQuiz: (session: QuizSessionSummary) => void;
  onExit: () => void;
}

export const ActiveQuizPlayer: React.FC<ActiveQuizPlayerProps> = ({
  problems: initialProblems,
  categoryTitle,
  timeLimitTotalSeconds,
  onFinishQuiz,
  onExit
}) => {
  const [problems, setProblems] = useState<MathProblem[]>(initialProblems);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [streak, setStreak] = useState(0);
  const [sessionCoins, setSessionCoins] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; coinsWon: number } | null>(null);

  // Timers
  const [timeLeft, setTimeLeft] = useState(timeLimitTotalSeconds);
  const questionStartTimeRef = useRef(Date.now());
  const sessionStartTimeRef = useRef(Date.now());

  const currentProblem = problems[currentIndex];

  // Global time countdown if time limit > 0
  useEffect(() => {
    if (timeLimitTotalSeconds <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto submit current question and finish
          finalizeSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLimitTotalSeconds]);

  // Reset input and reset question start time on index change
  useEffect(() => {
    setInputVal('');
    setFeedback(null);
    questionStartTimeRef.current = Date.now();
  }, [currentIndex]);

  // Physical keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (feedback !== null) return; // Wait for brief transition

      if (e.key >= '0' && e.key <= '9') {
        sounds.playKeyClick();
        setInputVal((prev) => (prev.length < 9 ? prev + e.key : prev));
      } else if (e.key === 'Backspace') {
        sounds.playKeyClick();
        setInputVal((prev) => prev.slice(0, -1));
      } else if (e.key === 'Enter') {
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputVal, feedback, currentIndex]);

  const handleKeypadPress = (val: string) => {
    if (feedback !== null) return;
    sounds.playKeyClick();

    if (val === 'backspace') {
      setInputVal((prev) => prev.slice(0, -1));
    } else if (val === 'clear') {
      setInputVal('');
    } else {
      setInputVal((prev) => (prev.length < 9 ? prev + val : prev));
    }
  };

  const handleSubmit = () => {
    if (!inputVal.trim() || feedback !== null) return;

    const parsedAnswer = parseInt(inputVal, 10);
    const timeTaken = (Date.now() - questionStartTimeRef.current) / 1000;
    const isCorrect = parsedAnswer === currentProblem.correctAnswer;

    let nextStreak = isCorrect ? streak + 1 : 0;
    setStreak(nextStreak);

    // Update problem record
    const updatedProblem: MathProblem = {
      ...currentProblem,
      userAnswer: parsedAnswer,
      isCorrect,
      timeTakenSeconds: timeTaken
    };

    const newProblems = [...problems];
    newProblems[currentIndex] = updatedProblem;
    setProblems(newProblems);

    // Calculate coins
    const reward = calculateProblemReward(updatedProblem, timeTaken, streak);
    const coinsWon = reward.coins;

    if (isCorrect) {
      sounds.playCorrect();
      sounds.playCoin();
      if (nextStreak > 0 && nextStreak % 3 === 0) {
        sounds.playStreak();
      }
      setSessionCoins((prev) => prev + coinsWon);
    } else {
      sounds.playWrong();
    }

    setFeedback({ isCorrect, coinsWon });

    // Transition after brief delay
    setTimeout(() => {
      if (currentIndex + 1 < problems.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        finalizeSession(newProblems, sessionCoins + (isCorrect ? coinsWon : 0));
      }
    }, 700);
  };

  const finalizeSession = (finalProblems = problems, finalCoins = sessionCoins) => {
    const timeSpent = Math.max(1, Math.round((Date.now() - sessionStartTimeRef.current) / 1000));
    const correctCount = finalProblems.filter((p) => p.isCorrect).length;
    const accuracy = Math.round((correctCount / finalProblems.length) * 100);

    const summary: QuizSessionSummary = {
      id: `session-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      categoryTitle,
      totalQuestions: finalProblems.length,
      correctAnswers: correctCount,
      accuracy,
      coinsEarned: finalCoins,
      timeSpentSeconds: timeSpent,
      averageTimePerQuestion: parseFloat((timeSpent / finalProblems.length).toFixed(1)),
      problems: finalProblems
    };

    onFinishQuiz(summary);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Status Bar: Progress, Timer, Streak, Coins */}
      <div className="bg-white border-2 border-neutral-900 rounded-2xl p-4 shadow-[0_6px_0_0_#171717] flex items-center justify-between gap-3">
        {/* Progress & Exit */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sounds.playKeyClick();
              if (window.confirm('Do you want to exit the current math match?')) {
                onExit();
              }
            }}
            className="px-2.5 py-1 text-xs font-black bg-neutral-100 hover:bg-neutral-200 border border-neutral-900 rounded-lg cursor-pointer"
          >
            ✕ Exit
          </button>
          <div className="font-mono text-xs sm:text-sm font-black text-neutral-800">
            Q {currentIndex + 1} / {problems.length}
          </div>
        </div>

        {/* Global Timer if active */}
        {timeLimitTotalSeconds > 0 && (
          <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm font-black px-2.5 py-1 bg-neutral-100 border border-neutral-900 rounded-lg">
            <Clock className={`w-3.5 h-3.5 ${timeLeft <= 10 ? 'text-rose-600 animate-pulse' : 'text-neutral-700'}`} />
            <span className={timeLeft <= 10 ? 'text-rose-600 font-extrabold' : 'text-neutral-900'}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
        )}

        {/* Streak & Live Coins */}
        <div className="flex items-center gap-2">
          {streak > 1 && (
            <div className="flex items-center gap-1 bg-rose-100 border border-rose-400 text-rose-700 px-2 py-0.5 rounded-lg text-xs font-black animate-bounce">
              <Flame className="w-3.5 h-3.5 fill-rose-500" />
              <span>{streak}x</span>
            </div>
          )}
          <div className="flex items-center gap-1 font-mono font-black text-xs sm:text-sm bg-amber-100 border border-neutral-900 px-2.5 py-1 rounded-lg">
            <span>🪙</span>
            <span>+{sessionCoins}</span>
          </div>
        </div>
      </div>

      {/* Math Card Display Area */}
      <div className="relative bg-white border-3 border-neutral-900 rounded-3xl p-6 sm:p-8 shadow-[0_10px_0_0_#171717] min-h-[300px] flex flex-col justify-center items-center">
        {/* Flash Feedback Popover */}
        {feedback && (
          <div
            className={`absolute top-4 right-4 px-3 py-1.5 rounded-xl border-2 border-neutral-900 font-black text-xs flex items-center gap-1 shadow-md animate-in zoom-in duration-150 ${
              feedback.isCorrect ? 'bg-emerald-300 text-emerald-950' : 'bg-rose-300 text-rose-950'
            }`}
          >
            {feedback.isCorrect ? (
              <>
                <Check className="w-4 h-4 text-emerald-900 stroke-[3]" />
                <span>CORRECT! +{feedback.coinsWon} 🪙</span>
              </>
            ) : (
              <>
                <X className="w-4 h-4 text-rose-900 stroke-[3]" />
                <span>Wrong (Answer: {currentProblem.correctAnswer})</span>
              </>
            )}
          </div>
        )}

        {/* 1. Addition & Subtraction Soroban Mental Math Vertical Style */}
        {currentProblem.type === 'add-sub' && currentProblem.terms && (
          <div className="flex flex-col items-end my-2">
            <div className="space-y-1.5 pr-2">
              {currentProblem.terms.map((term, tIdx) => {
                const isSubtracted = term < 0;
                return (
                  <div
                    key={tIdx}
                    className="flex items-center justify-end gap-3 font-mono text-3xl sm:text-4xl font-black text-neutral-900 tracking-wider"
                  >
                    {/* Explicit user rule: Hide '+' sign, only show '-' next to the subtracted term */}
                    <span className="w-6 text-center text-rose-600 font-black text-3xl">
                      {isSubtracted ? '−' : ''}
                    </span>
                    <span className={isSubtracted ? 'text-rose-600' : 'text-neutral-900'}>
                      {Math.abs(term)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Answer line divider */}
            <div className="w-48 sm:w-60 h-1 bg-neutral-900 my-4 rounded-full" />

            {/* Input Display box */}
            <div className="w-48 sm:w-60 h-16 bg-neutral-50 border-3 border-neutral-900 rounded-2xl flex items-center justify-end px-4 font-mono text-3xl font-black text-neutral-900 shadow-inner">
              {inputVal || <span className="text-neutral-300">?</span>}
            </div>
          </div>
        )}

        {/* 2. Multiplication & Division Horizontal Style */}
        {(currentProblem.type === 'multiplication' || currentProblem.type === 'division') && (
          <div className="flex flex-col items-center my-4 space-y-6">
            <div className="flex items-center justify-center gap-3 font-mono text-3xl sm:text-4xl font-black text-neutral-900">
              <span>{currentProblem.numA}</span>
              <span className="text-amber-500 text-4xl">{currentProblem.symbol}</span>
              <span>{currentProblem.numB}</span>
              <span className="text-neutral-400">=</span>
            </div>

            {/* Input Display box */}
            <div className="w-48 sm:w-60 h-16 bg-neutral-50 border-3 border-neutral-900 rounded-2xl flex items-center justify-center px-4 font-mono text-3xl font-black text-neutral-900 shadow-inner">
              {inputVal || <span className="text-neutral-300">?</span>}
            </div>
          </div>
        )}
      </div>

      {/* On-screen Numeric Keypad for fast tablet/mobile input */}
      <div className="bg-white border-2 border-neutral-900 rounded-3xl p-4 shadow-[0_6px_0_0_#171717]">
        <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleKeypadPress(digit)}
              className="h-13 bg-neutral-50 hover:bg-neutral-100 border-2 border-neutral-900 rounded-2xl font-mono text-2xl font-black text-neutral-900 shadow-[0_3px_0_0_#171717] active:translate-y-0.5 cursor-pointer transition-all"
            >
              {digit}
            </button>
          ))}

          <button
            onClick={() => handleKeypadPress('clear')}
            className="h-13 bg-rose-100 hover:bg-rose-200 border-2 border-neutral-900 rounded-2xl font-bold text-xs uppercase text-rose-900 shadow-[0_3px_0_0_#171717] active:translate-y-0.5 cursor-pointer"
          >
            Clear
          </button>

          <button
            onClick={() => handleKeypadPress('0')}
            className="h-13 bg-neutral-50 hover:bg-neutral-100 border-2 border-neutral-900 rounded-2xl font-mono text-2xl font-black text-neutral-900 shadow-[0_3px_0_0_#171717] active:translate-y-0.5 cursor-pointer"
          >
            0
          </button>

          <button
            onClick={() => handleKeypadPress('backspace')}
            className="h-13 bg-neutral-200 hover:bg-neutral-300 border-2 border-neutral-900 rounded-2xl flex items-center justify-center text-neutral-900 shadow-[0_3px_0_0_#171717] active:translate-y-0.5 cursor-pointer"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Big Submit Button */}
        <div className="max-w-sm mx-auto mt-3">
          <button
            onClick={handleSubmit}
            disabled={!inputVal.trim() || feedback !== null}
            className={`w-full py-3.5 border-2 border-neutral-900 rounded-2xl font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_0_0_#171717] active:translate-y-0.5 transition-all ${
              !inputVal.trim()
                ? 'bg-neutral-200 text-neutral-400 border-neutral-400 shadow-none cursor-not-allowed'
                : 'bg-emerald-400 hover:bg-emerald-500 text-neutral-900'
            }`}
          >
            <span>Submit Answer</span>
            <CornerDownLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
