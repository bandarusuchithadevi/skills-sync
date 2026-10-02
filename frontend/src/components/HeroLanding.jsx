import React from 'react';

export default function HeroLanding({ onStartQuest, onExploreDemo }) {
  return (
    <div class="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
      
      {/* Glow Effects */}
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Text Column */}
          <div class="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Pill Tag */}
            <div class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide">
              <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>RAG & Modular AI Agents Powered</span>
            </div>

            {/* Headline */}
            <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.1]">
              Your Resume. <br />
              Your Target Job. <br />
              <span class="gradient-text">One AI-Powered Quest.</span>
            </h1>

            {/* Subheadline */}
            <p class="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Discover exactly how your resume matches a job, uncover hidden skill gaps, and upgrade your application with evidence-backed AI recommendations.
            </p>

            {/* CTAs */}
            <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4 pt-2">
              <button
                onClick={onStartQuest}
                class="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 shadow-xl shadow-indigo-600/30 border border-indigo-400/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-2 group"
              >
                <span>Start Your Quest</span>
                <span class="group-hover:translate-x-1 transition-transform">→</span>
              </button>

              <button
                onClick={onExploreDemo}
                class="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Explore Demo</span>
                <span class="text-cyan-400">⚡</span>
              </button>
            </div>

            {/* Microcopy & Metrics */}
            <div class="pt-6 border-t border-slate-800/60 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-xs text-slate-400">
              <div class="flex items-center space-x-2">
                <span class="text-emerald-400 font-bold">✓</span>
                <span>Truthful Optimization</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-indigo-400 font-bold">✓</span>
                <span>RAG Evidence Retrieval</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-cyan-400 font-bold">✓</span>
                <span>ATS & Design Doctor</span>
              </div>
            </div>

          </div>

          {/* Right Hero Visual Column (Floating Animated Resume Analysis Interface) */}
          <div class="lg:col-span-5">
            <div class="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Card */}
              <div class="glass-card-glow rounded-2xl p-6 relative overflow-hidden animate-pulse-glow">
                
                {/* Header preview */}
                <div class="flex items-center justify-between pb-4 border-b border-slate-800/80">
                  <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-mono text-sm">
                      📄
                    </div>
                    <div>
                      <h4 class="text-sm font-bold text-white">Suchitha_Resume.pdf</h4>
                      <p class="text-[11px] text-slate-400">Python Developer Target</p>
                    </div>
                  </div>
                  <span class="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    SCAN COMPLETE
                  </span>
                </div>

                {/* Animated Analysis Flow Diagram */}
                <div class="py-6 space-y-4">
                  
                  {/* Step 1: Document */}
                  <div class="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div class="flex items-center space-x-3">
                      <span class="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">1</span>
                      <span class="text-xs font-semibold text-slate-200">Resume.pdf</span>
                    </div>
                    <span class="text-[11px] text-slate-400 font-mono">Parsed (5 Sections)</span>
                  </div>

                  {/* Flow Arrow */}
                  <div class="flex justify-center text-indigo-400 text-xs animate-bounce">↓</div>

                  {/* Step 2: AI RAG Analysis */}
                  <div class="flex items-center justify-between p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
                    <div class="flex items-center space-x-3">
                      <span class="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                      <span class="text-xs font-semibold text-indigo-200">AI RAG & Agents</span>
                    </div>
                    <span class="text-[11px] text-cyan-300 font-mono">ChromaDB Indexed</span>
                  </div>

                  {/* Flow Arrow */}
                  <div class="flex justify-center text-indigo-400 text-xs animate-bounce">↓</div>

                  {/* Step 3: Match Result Card */}
                  <div class="p-4 rounded-xl bg-gradient-to-r from-violet-900/40 to-indigo-900/40 border border-violet-500/40 flex items-center justify-between">
                    <div>
                      <span class="text-[10px] uppercase font-bold text-violet-300 tracking-wider">Target Job Alignment</span>
                      <div class="text-2xl font-black text-white font-display">82% Match</div>
                    </div>
                    <div class="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-cyan-400 flex items-center justify-center font-bold text-xs text-white">
                      82%
                    </div>
                  </div>

                  {/* Step 4: Gaps & Upgrades preview */}
                  <div class="grid grid-cols-2 gap-3 pt-1">
                    <div class="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs">
                      <span class="text-[10px] uppercase font-bold text-amber-400 block">Skill Gaps</span>
                      <span class="text-slate-300 font-medium">Docker, AWS</span>
                    </div>
                    <div class="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
                      <span class="text-[10px] uppercase font-bold text-emerald-400 block">Upgrade Quest</span>
                      <span class="text-slate-300 font-medium">+350 XP Reward</span>
                    </div>
                  </div>

                </div>

                {/* Floating Micro Badge */}
                <div class="absolute -bottom-2 -right-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-indigo-500/40 text-[10px] font-bold text-indigo-300 shadow-lg font-mono">
                  ⚡ Quest Engine v1.0
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
