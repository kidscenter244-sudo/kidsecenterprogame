import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CHARACTERS } from '../data/characters';
import { CharacterItem } from '../types';
import { ThreeCanvas } from './ThreeCanvas';
import { sounds } from '../utils/audio';
import { Sparkles, Trophy, Check, Lock, Zap, Shield, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CharacterLockerStore: React.FC = () => {
  const { user, unlockCharacter, equipCharacter } = useAuth();

  const [selectedCharId, setSelectedCharId] = useState<string>(
    user?.equippedCharacterId || 'rookie-champ'
  );
  const [activeCategory, setActiveCategory] = useState<'all' | 'football' | 'superhero' | 'anime' | 'legend'>('all');

  const selectedChar = CHARACTERS.find((c) => c.id === selectedCharId) || CHARACTERS[0];
  const isCharUnlocked = user?.unlockedCharacters.includes(selectedChar.id) ?? false;
  const isCharEquipped = user?.equippedCharacterId === selectedChar.id;

  const handleBuyOrEquipChar = (char: CharacterItem) => {
    sounds.playKeyClick();
    if (user?.unlockedCharacters.includes(char.id)) {
      equipCharacter(char.id);
      sounds.playCorrect();
    } else {
      if ((user?.coins ?? 0) >= char.price) {
        const success = unlockCharacter(char.id, char.price);
        if (success) {
          sounds.playUnlock();
          try {
            confetti({
              particleCount: 80,
              spread: 65,
              origin: { y: 0.5 }
            });
          } catch {}
        }
      } else {
        sounds.playWrong();
      }
    }
  };

  const filteredChars = CHARACTERS.filter((c) => {
    if (activeCategory === 'all') return true;
    return c.category === activeCategory;
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Mythic':
        return 'bg-gradient-to-r from-amber-500 to-rose-500 text-white';
      case 'Legendary':
        return 'bg-amber-400 text-neutral-900';
      case 'Epic':
        return 'bg-purple-600 text-white';
      case 'Rare':
        return 'bg-sky-500 text-white';
      default:
        return 'bg-neutral-800 text-white';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Hero Section: Active 3D Roblox Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: 3D Viewport */}
        <div className="lg:col-span-7">
          <ThreeCanvas character={selectedChar} stageId="stadium" />
        </div>

        {/* Right: Character Info & Instant Purchase / Equip Panel */}
        <div className="lg:col-span-5 bg-white border-2 border-neutral-900 rounded-3xl p-6 shadow-[0_8px_0_0_#171717] space-y-5">
          <div className="flex items-center justify-between">
            <span
              className={`px-3 py-1 font-black text-xs uppercase tracking-wider rounded-xl border border-neutral-900 ${getTierColor(
                selectedChar.tier
              )}`}
            >
              {selectedChar.tier} Tier
            </span>

            <div className="flex items-center gap-1.5 font-mono text-sm font-black bg-amber-100 border border-neutral-900 px-3 py-1 rounded-xl">
              <span>🪙</span>
              <span>
                {isCharUnlocked ? 'OWNED' : `${selectedChar.price.toLocaleString()} Coins`}
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-black text-neutral-900 tracking-tight leading-tight">
              {selectedChar.name}
            </h2>
            <p className="text-sm font-bold text-neutral-500 mt-0.5">
              {selectedChar.title}
            </p>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-neutral-600 leading-relaxed">
            {selectedChar.description}
          </p>

          {/* Stat Bars */}
          <div className="space-y-2.5 pt-2 border-t border-neutral-200">
            <div>
              <div className="flex justify-between text-xs font-black text-neutral-700 mb-1">
                <span>Speed Reflex</span>
                <span className="font-mono text-amber-600">{selectedChar.stats.speed} / 100</span>
              </div>
              <div className="w-full h-2.5 bg-neutral-100 border border-neutral-900 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${selectedChar.stats.speed}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-black text-neutral-700 mb-1">
                <span>Power & Stamina</span>
                <span className="font-mono text-rose-600">{selectedChar.stats.power} / 100</span>
              </div>
              <div className="w-full h-2.5 bg-neutral-100 border border-neutral-900 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${selectedChar.stats.power}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-black text-neutral-700 mb-1">
                <span>Mental Math IQ</span>
                <span className="font-mono text-emerald-600">{selectedChar.stats.focus} / 100</span>
              </div>
              <div className="w-full h-2.5 bg-neutral-100 border border-neutral-900 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${selectedChar.stats.focus}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-2">
            {isCharUnlocked ? (
              <button
                onClick={() => handleBuyOrEquipChar(selectedChar)}
                className={`w-full py-4 border-2 border-neutral-900 rounded-2xl font-black text-sm uppercase tracking-wider cursor-pointer shadow-[0_4px_0_0_#171717] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 ${
                  isCharEquipped
                    ? 'bg-neutral-900 text-white'
                    : 'bg-emerald-400 hover:bg-emerald-500 text-neutral-900'
                }`}
              >
                {isCharEquipped ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Currently Equipped</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-neutral-900" />
                    <span>Equip as Active Hero</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => handleBuyOrEquipChar(selectedChar)}
                disabled={(user?.coins ?? 0) < selectedChar.price}
                className={`w-full py-4 border-2 border-neutral-900 rounded-2xl font-black text-sm uppercase tracking-wider cursor-pointer shadow-[0_4px_0_0_#171717] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 ${
                  (user?.coins ?? 0) >= selectedChar.price
                    ? 'bg-amber-400 hover:bg-amber-500 text-neutral-900'
                    : 'bg-neutral-200 text-neutral-400 border-neutral-400 cursor-not-allowed shadow-none'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>
                  {(user?.coins ?? 0) >= selectedChar.price
                    ? `Unlock for 🪙 ${selectedChar.price.toLocaleString()} Coins`
                    : `Need 🪙 ${(selectedChar.price - (user?.coins ?? 0)).toLocaleString()} More Coins`}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 20 Roblox Characters Store Grid */}
      <div className="bg-white border-2 border-neutral-900 rounded-3xl p-6 sm:p-8 shadow-[0_8px_0_0_#171717] space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-neutral-200 pb-4">
          <div>
            <h3 className="text-2xl font-black text-neutral-900">
              Roblox Character Collection
            </h3>
            <p className="text-xs font-semibold text-neutral-500">
              Select any hero to inspect in 3D above and equip into math matches.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 bg-neutral-100 p-1.5 rounded-2xl border border-neutral-300">
            {[
              { id: 'all', label: 'All (20)' },
              { id: 'football', label: '⚽ Football' },
              { id: 'superhero', label: '🦸 Superheroes' },
              { id: 'anime', label: '⚡ Anime' },
              { id: 'legend', label: '👑 Legends' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  sounds.playKeyClick();
                  setActiveCategory(cat.id as any);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* The 20 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredChars.map((char) => {
            const isUnlocked = user?.unlockedCharacters.includes(char.id) ?? false;
            const isEquipped = user?.equippedCharacterId === char.id;
            const isSelected = selectedCharId === char.id;

            return (
              <div
                key={char.id}
                onClick={() => {
                  sounds.playKeyClick();
                  setSelectedCharId(char.id);
                }}
                className={`bg-white border-2 rounded-2xl p-4 cursor-pointer flex flex-col justify-between transition-all hover:-translate-y-1 ${
                  isSelected
                    ? 'border-neutral-900 ring-3 ring-amber-400 shadow-[0_6px_0_0_#171717]'
                    : 'border-neutral-900 shadow-[0_4px_0_0_#171717]'
                }`}
              >
                <div>
                  {/* Top Badge & Status */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 bg-neutral-900 text-white font-black text-[10px] uppercase rounded-md">
                      {char.tier}
                    </span>
                    {isUnlocked ? (
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-400">
                        {isEquipped ? '✓ Equipped' : 'Owned'}
                      </span>
                    ) : (
                      <span className="font-mono text-xs font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-400">
                        🪙 {char.price.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Character Avatar Orb */}
                  <div className="flex items-center gap-3 my-2">
                    <div
                      className="w-12 h-12 rounded-2xl border-2 border-neutral-900 shadow-[0_2px_0_0_#171717] flex items-center justify-center font-black text-lg text-white"
                      style={{ backgroundColor: char.primaryColor }}
                    >
                      {char.jerseyNumber || '★'}
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-neutral-900 leading-tight">
                        {char.name}
                      </h4>
                      <span className="text-[11px] font-bold text-neutral-500 block">
                        {char.title}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] font-medium text-neutral-600 line-clamp-2 mt-2">
                    {char.description}
                  </p>
                </div>

                {/* Inspect button */}
                <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between text-xs font-black">
                  <span className="text-neutral-500">
                    {isSelected ? 'Viewing 3D' : 'Click to Inspect'}
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-500' : 'text-neutral-400'}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
