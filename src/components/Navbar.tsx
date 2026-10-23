import React from 'react';
import { useAuth } from '../context/AuthContext';
import { sounds } from '../utils/audio';
import { Calculator, Sparkles, GraduationCap, Trophy, Volume2, VolumeX } from 'lucide-react';
import { CHARACTERS } from '../data/characters';

interface NavbarProps {
  activeTab: 'training' | 'locker' | 'teacher' | 'history';
  setActiveTab: (tab: 'training' | 'locker' | 'teacher' | 'history') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { user, openAuthModal, isAuthenticated, isTeacher } = useAuth();

  const equippedChar = CHARACTERS.find((c) => c.id === user?.equippedCharacterId) || CHARACTERS[0];

  return (
    <header className="sticky top-3 z-40 w-full px-2 py-1">
      {/* 80% Width Navbar with Rounded Border and Black Shadow */}
      <div className="w-[92%] sm:w-[85%] md:w-[80%] max-w-6xl mx-auto bg-white border-2 border-neutral-900 shadow-[0_6px_0_0_#171717] rounded-2xl px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div
          onClick={() => {
            sounds.playKeyClick();
            setActiveTab('training');
          }}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-400 border-2 border-neutral-900 shadow-[0_2px_0_0_#171717] flex items-center justify-center font-black text-xl group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-neutral-900 leading-none">
              Kids Center
            </h1>
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-amber-600">
              Pro Games
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl border border-neutral-300">
          <button
            onClick={() => {
              sounds.playKeyClick();
              setActiveTab('training');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'training'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Math Arena</span>
          </button>

          <button
            onClick={() => {
              sounds.playKeyClick();
              setActiveTab('locker');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'locker'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>3D Roblox Heroes</span>
          </button>

          <button
            onClick={() => {
              sounds.playKeyClick();
              setActiveTab('teacher');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'teacher'
                ? 'bg-amber-400 text-neutral-900 font-black shadow-sm'
                : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
            <span>Teacher Portal {isTeacher && '✓'}</span>
          </button>

          <button
            onClick={() => {
              sounds.playKeyClick();
              setActiveTab('history');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>My Stats</span>
          </button>
        </nav>

        {/* Right side: Coins, Sound, Account */}
        <div className="flex items-center gap-2">
          {/* Coins Badge */}
          <div
            onClick={() => {
              sounds.playCoin();
              setActiveTab('locker');
            }}
            className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 border-2 border-neutral-900 px-3 py-1.5 rounded-xl shadow-[0_2px_0_0_#171717] cursor-pointer transition-all active:translate-y-0.5"
            title="Your current coins - Click to spend in 3D Roblox Locker!"
          >
            <span className="text-base">🪙</span>
            <span className="font-black text-xs sm:text-sm text-neutral-900 font-mono">
              {user?.coins.toLocaleString() ?? 0}
            </span>
            <span className="text-[10px] font-black uppercase text-amber-800 hidden sm:inline">
              Coins
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              sounds.setEnabled(!sounds.isEnabled());
              sounds.playKeyClick();
            }}
            className="p-2 bg-neutral-100 hover:bg-neutral-200 border-2 border-neutral-900 rounded-xl cursor-pointer text-neutral-800 shadow-[0_2px_0_0_#171717] active:translate-y-0.5"
            title="Toggle Sound Effects"
          >
            {sounds.isEnabled() ? '🔊' : '🔇'}
          </button>

          {/* Account Modal Button */}
          <button
            onClick={() => {
              sounds.playKeyClick();
              openAuthModal();
            }}
            className="flex items-center gap-2 bg-white hover:bg-neutral-100 border-2 border-neutral-900 px-3 py-1.5 rounded-xl shadow-[0_2px_0_0_#171717] text-xs font-bold cursor-pointer transition-all active:translate-y-0.5"
            title="Sign in or sync account"
          >
            <div
              className="w-5 h-5 rounded-full border border-neutral-900 flex items-center justify-center text-[11px] font-black"
              style={{ backgroundColor: equippedChar.primaryColor, color: '#ffffff' }}
            >
              {equippedChar.jerseyNumber || '★'}
            </div>
            <span className="max-w-[80px] sm:max-w-[120px] truncate text-neutral-900 hidden sm:inline">
              {isTeacher ? 'Coach (Teacher)' : user?.nickname || 'Sign In'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile sub-tabs */}
      <div className="flex lg:hidden justify-center mt-2 px-2">
        <div className="w-[92%] sm:w-[85%] bg-white border-2 border-neutral-900 rounded-xl shadow-[0_4px_0_0_#171717] p-1 flex justify-between gap-1 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => {
              sounds.playKeyClick();
              setActiveTab('training');
            }}
            className={`px-2.5 py-1.5 rounded-lg flex-1 text-center whitespace-nowrap cursor-pointer ${
              activeTab === 'training' ? 'bg-neutral-900 text-white' : 'text-neutral-700'
            }`}
          >
            Arena
          </button>
          <button
            onClick={() => {
              sounds.playKeyClick();
              setActiveTab('locker');
            }}
            className={`px-2.5 py-1.5 rounded-lg flex-1 text-center whitespace-nowrap cursor-pointer ${
              activeTab === 'locker' ? 'bg-neutral-900 text-white' : 'text-neutral-700'
            }`}
          >
            3D Heroes
          </button>
          <button
            onClick={() => {
              sounds.playKeyClick();
              setActiveTab('teacher');
            }}
            className={`px-2.5 py-1.5 rounded-lg flex-1 text-center whitespace-nowrap cursor-pointer ${
              activeTab === 'teacher' ? 'bg-amber-400 text-neutral-900' : 'text-neutral-700'
            }`}
          >
            Teacher
          </button>
          <button
            onClick={() => {
              sounds.playKeyClick();
              setActiveTab('history');
            }}
            className={`px-2.5 py-1.5 rounded-lg flex-1 text-center whitespace-nowrap cursor-pointer ${
              activeTab === 'history' ? 'bg-neutral-900 text-white' : 'text-neutral-700'
            }`}
          >
            Stats
          </button>
        </div>
      </div>
    </header>
  );
};
