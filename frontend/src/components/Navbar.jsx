import React from 'react';

export default function Navbar({ xp, levelInfo, activeTab, setActiveTab, onStartOnboarding, onRunDemo }) {
  const levelNames = [
    'Resume Explorer',
    'Profile Builder',
    'Resume Strategist',
    'Career Optimizer',
    'Interview Ready',
    'Career Master'
  ];

  const currentLevel = Math.min(6, Math.floor(xp / 300) + 1);
  const currentLevelName = levelNames[currentLevel - 1] || 'Resume Strategist';
  const progressToNext = ((xp % 300) / 300) * 100;

  return (
    <header class="sticky top-0 z-50 glass-card border-b border-indigo-950/60 bg-slate-950/80 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div class="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('hero')}>
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div class="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span class="text-xl font-black gradient-text">Q</span>
              </div>
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <span class="text-lg font-black tracking-tight text-white font-display">RESUMEQUEST</span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-indigo-500/30 text-cyan-300 font-bold font-mono">AI</span>
              </div>
              <p class="text-[10px] text-slate-400 font-medium tracking-wide">Your Target. Your Next Quest.</p>
            </div>
          </div>

          {/* XP & Gamification Bar */}
          <div class="hidden md:flex items-center space-x-4 bg-slate-900/80 border border-indigo-500/20 rounded-full px-4 py-1.5">
            <div class="flex items-center space-x-2">
              <span class="text-xs font-bold text-amber-400 flex items-center">
                <span class="mr-1">⚡</span> {xp} XP
              </span>
              <div class="w-24 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                <div 
                  class="bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(100, progressToNext)}%` }}
                ></div>
              </div>
            </div>
            <div class="h-4 w-px bg-slate-700"></div>
            <div class="flex items-center space-x-1.5">
              <span class="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Level {currentLevel}:</span>
              <span class="text-xs font-bold text-indigo-300 font-display">{currentLevelName}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div class="flex items-center space-x-3">
            <button
              onClick={onRunDemo}
              class="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all duration-200 hover:border-slate-600 flex items-center space-x-1.5"
            >
              <span>⚡ Try Demo</span>
            </button>
            <button
              onClick={onStartOnboarding}
              class="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-indigo-600/30 border border-violet-400/30 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center space-x-1"
            >
              <span>Start Quest</span>
              <span>→</span>
            </button>
          </div>

        </div>

        {/* Secondary Navigation Bar (Visible when in Dashboard mode) */}
        {activeTab !== 'hero' && (
          <div class="flex items-center space-x-1 overflow-x-auto py-2 border-t border-slate-800/60 no-scrollbar text-xs">
            {[
              { id: 'dashboard', label: '🎯 Career Quest', icon: '📊' },
              { id: 'skills', label: '🟢 Skill Matrix', icon: '⚡' },
              { id: 'evidence', label: '🔎 Evidence Lab', icon: '🔬' },
              { id: 'ats', label: '🩺 ATS Health', icon: '🛡️' },
              { id: 'design', label: '🎨 Design Doctor', icon: '✨' },
              { id: 'content', label: '✍️ Wording Checkup', icon: '📝' },
              { id: 'quests', label: '🚀 Next Quest', icon: '🏆' },
              { id: 'roadmap', label: '🧩 Skill Gap Map', icon: '🗺️' },
              { id: 'interview', label: '🎤 Mock Interview', icon: '💬' },
              { id: 'snapshot', label: '👀 Recruiter Eye', icon: '👁️' },
              { id: 'compare', label: '⚖️ Multi-Job Compare', icon: '📈' },
              { id: 'history', label: '📜 Quest History', icon: '⏱️' }
            ].map((nav) => (
              <button
                key={nav.id}
                onClick={() => setActiveTab(nav.id)}
                class={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-all duration-150 flex items-center space-x-1.5 ${
                  activeTab === nav.id
                    ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span>{nav.icon}</span>
                <span>{nav.label}</span>
              </button>
            ))}
          </div>
        )}

      </div>
    </header>
  );
}
