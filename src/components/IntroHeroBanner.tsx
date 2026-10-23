import React, { useState, useEffect } from 'react';
import { CHARACTERS } from '../data/characters';
import { ThreeCanvas } from './ThreeCanvas';
import { useAuth } from '../context/AuthContext';
import { sounds } from '../utils/audio';
import { Play, Sparkles, Trophy, Zap, Flame } from 'lucide-react';

interface IntroHeroBannerProps {
  onStartTraining: () => void;
  onOpenLocker: () => void;
}

export const IntroHeroBanner: React.FC<IntroHeroBannerProps> = ({
  onStartTraining,
  onOpenLocker
}) => {
  const { user } = useAuth();
  const starterHero = CHARACTERS.find((c) => c.id === 'rookie-champ') || CHARACTERS[0];
  const [spinSecondsLeft, setSpinSecondsLeft] = useState(5);

  useEffect(() => {
    if (spinSecondsLeft <= 0) return;
    const t = setInterval(() => {
      setSpinSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [spinSecondsLeft]);

  return (
    <div className="bg-white border-2 border-neutral-900 rounded-3xl p-6 sm:p-8 shadow-[0_8px_0_0_#171717] mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Kids Center Pro Games Headline */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-400 border border-neutral-900 rounded-xl text-xs font-black uppercase text-neutral-900 shadow-[0_2px_0_0_#171717]">
            <Zap className="w-3.5 h-3.5 fill-neutral-900" />
            <span>Next-Gen Math Esports Arena</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-neutral-900 tracking-tight leading-none">
            Kids Center <br />
            <span className="text-amber-500 underline decoration-neutral-900 decoration-wavy decoration-2">
              Pro Games
            </span>
          </h1>

          <p className="text-sm sm:text-base font-semibold text-neutral-600 max-w-lg leading-relaxed">
            Train your mental math reflexes with flash addition, subtraction, multiplication & division.
            Solve fast to earn 🪙 coins and unlock 20 legendary 3D Roblox football stars & heroes!
          </p>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center gap-2 bg-amber-100 border border-neutral-900 px-3.5 py-1.5 rounded-xl font-mono font-black text-xs text-neutral-900 shadow-[0_2px_0_0_#171717]">
              <span>🪙</span>
              <span>{user?.coins.toLocaleString() || 450} Coins</span>
            </div>

            <div className="flex items-center gap-2 bg-emerald-100 border border-neutral-900 px-3.5 py-1.5 rounded-xl font-mono font-black text-xs text-emerald-950 shadow-[0_2px_0_0_#171717]">
              <Trophy className="w-3.5 h-3.5 text-emerald-700" />
              <span>{user?.stats.totalSolved || 0} Solved</span>
            </div>

            <div className="flex items-center gap-2 bg-rose-100 border border-neutral-900 px-3.5 py-1.5 rounded-xl font-mono font-black text-xs text-rose-950 shadow-[0_2px_0_0_#171717]">
              <Flame className="w-3.5 h-3.5 text-rose-600 fill-rose-500" />
              <span>{user?.stats.bestStreak || 0}x Best Streak</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => {
                sounds.playKeyClick();
                onStartTraining();
              }}
              className="px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl border-2 border-neutral-900 shadow-[0_4px_0_0_#171717] active:translate-y-0.5 cursor-pointer flex items-center gap-2 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Enter Math Arena</span>
            </button>

            <button
              onClick={() => {
                sounds.playKeyClick();
                onOpenLocker();
              }}
              className="px-6 py-3.5 bg-amber-400 hover:bg-amber-500 text-neutral-900 font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl border-2 border-neutral-900 shadow-[0_4px_0_0_#171717] active:translate-y-0.5 cursor-pointer flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-pink-600" />
              <span>Roblox 3D Locker (20 Heroes)</span>
            </button>
          </div>
        </div>

        {/* Right Side: 3D Roblox Starter Character 5-Second 360 Spin Showcase */}
        <div className="lg:col-span-5 relative flex flex-col items-center">
          <div className="w-full relative">
            <ThreeCanvas
              character={starterHero}
              stageId="stadium"
              isCompact={true}
              autoSpinSeconds={5}
            />

            {/* Spin indicator badge */}
            <div className="absolute top-3 right-3 bg-white/95 border border-neutral-900 px-2.5 py-1 rounded-xl shadow-xs font-mono font-bold text-[10px] text-neutral-700 pointer-events-none">
              {spinSecondsLeft > 0 ? `💫 360° Spin: ${spinSecondsLeft}s` : '✨ 3D Roblox Preview'}
            </div>
          </div>

          <span className="text-[11px] font-black text-neutral-500 mt-2">
            Default Starter Hero: {starterHero.name} • 100% 3D Roblox R15
          </span>
        </div>
      </div>
    </div>
  );
};
