/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { IntroHeroBanner } from './components/IntroHeroBanner';
import { MathTrainingArena } from './components/MathTrainingArena';
import { ActiveQuizPlayer } from './components/ActiveQuizPlayer';
import { QuizSummaryModal } from './components/QuizSummaryModal';
import { CharacterLockerStore } from './components/CharacterLockerStore';
import { TeacherPortal } from './components/TeacherPortal';
import { StatsHistoryView } from './components/StatsHistoryView';
import { AuthModal } from './components/AuthModal';
import {
  AddSubSettings,
  MultiplicationSettings,
  DivisionSettings,
  MixedSettings,
  MathProblem,
  QuizSessionSummary
} from './types';
import { generateQuizProblems } from './utils/mathGenerator';

function MainAppContent() {
  const { saveSession } = useAuth();

  const [activeTab, setActiveTab] = useState<'training' | 'locker' | 'teacher' | 'history'>('training');

  // Quiz state
  const [activeQuizProblems, setActiveQuizProblems] = useState<MathProblem[] | null>(null);
  const [activeQuizTitle, setActiveQuizTitle] = useState<string>('');
  const [activeQuizTime, setActiveQuizTime] = useState<number>(0);
  const [currentSessionSummary, setCurrentSessionSummary] = useState<QuizSessionSummary | null>(null);

  const startQuiz = (
    type: 'add-sub' | 'multiplication' | 'division' | 'mixed',
    settings: AddSubSettings | MultiplicationSettings | DivisionSettings | MixedSettings,
    categoryName: string
  ) => {
    const problems = generateQuizProblems(type, settings);
    setActiveQuizProblems(problems);
    setActiveQuizTitle(categoryName);
    setActiveQuizTime(settings.timeLimitSeconds || 0);
  };

  const handleFinishQuiz = (summary: QuizSessionSummary) => {
    saveSession(summary);
    setCurrentSessionSummary(summary);
    setActiveQuizProblems(null);
  };

  const handleExitQuiz = () => {
    setActiveQuizProblems(null);
  };

  const handlePlayAgainFromSummary = () => {
    if (!currentSessionSummary) return;
    const firstType = currentSessionSummary.problems[0]?.type || 'add-sub';
    const settings = {
      numbersCount: 3,
      digitsCount: 2,
      digits1: 2,
      digits2: 1,
      dividendDigits: 3,
      divisorDigits: 1,
      questionCount: currentSessionSummary.totalQuestions,
      timeLimitSeconds: currentSessionSummary.timeSpentSeconds
    };
    const newProblems = generateQuizProblems(firstType as any, settings as any);
    setCurrentSessionSummary(null);
    setActiveQuizProblems(newProblems);
    setActiveQuizTime(settings.timeLimitSeconds);
  };

  const handleGoToLockerFromSummary = () => {
    setCurrentSessionSummary(null);
    setActiveTab('locker');
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans selection:bg-amber-300 selection:text-neutral-900 pb-12">
      {/* 80% Width Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="w-[92%] sm:w-[88%] md:w-[80%] max-w-6xl mx-auto mt-4 flex-1">
        {/* If Active Quiz is Running */}
        {activeQuizProblems ? (
          <ActiveQuizPlayer
            problems={activeQuizProblems}
            categoryTitle={activeQuizTitle}
            timeLimitTotalSeconds={activeQuizTime}
            onFinishQuiz={handleFinishQuiz}
            onExit={handleExitQuiz}
          />
        ) : (
          <>
            {/* Top Entrance Banner (Kids Center Pro Games with 5-second 3D Roblox rotating hero showcase) */}
            {activeTab === 'training' && (
              <IntroHeroBanner
                onStartTraining={() => {}}
                onOpenLocker={() => setActiveTab('locker')}
              />
            )}

            {activeTab === 'training' && <MathTrainingArena onStartQuiz={startQuiz} />}

            {activeTab === 'locker' && <CharacterLockerStore />}

            {activeTab === 'teacher' && <TeacherPortal />}

            {activeTab === 'history' && <StatsHistoryView />}
          </>
        )}
      </main>

      {/* Quiz Completion Summary Modal */}
      {currentSessionSummary && (
        <QuizSummaryModal
          summary={currentSessionSummary}
          onPlayAgain={handlePlayAgainFromSummary}
          onGoToLocker={handleGoToLockerFromSummary}
        />
      )}

      {/* User Auth & Cross-device Sync Modal */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
