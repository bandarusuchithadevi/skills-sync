import React, { useState } from 'react';

export default function ScoreCard({ matchScore = 82, subscores = {}, weights = {}, onRecalculate }) {
  const [showWeightsModal, setShowWeightsModal] = useState(false);
  const [customWeights, setCustomWeights] = useState({
    skills: weights.skills || 0.40,
    projects: weights.projects || 0.20,
    experience: weights.experience || 0.20,
    education: weights.education || 0.10,
    keywords: weights.keywords || 0.10
  });

  const circleRadius = 54;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (matchScore / 100) * circumference;

  const defaultSubscores = {
    skills: subscores.skills ?? 84,
    projects: subscores.projects ?? 81,
    experience: subscores.experience ?? 68,
    education: subscores.education ?? 95,
    keywords: subscores.keywords ?? 76
  };

  const handleApplyWeights = () => {
    setShowWeightsModal(false);
    if (onRecalculate) onRecalculate(customWeights);
  };

  return (
    <div class="glass-card-glow rounded-2xl p-6 sm:p-8 relative overflow-hidden">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Score Ring Box */}
        <div class="lg:col-span-5 flex flex-col items-center justify-center text-center border-b lg:border-b-0 lg:border-r border-slate-800/80 pb-6 lg:pb-0 lg:pr-8">
          <span class="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">JOB MATCH SCORE</span>
          
          {/* Circular Progress Ring */}
          <div class="relative w-40 h-40 flex items-center justify-center my-2">
            <svg class="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r={circleRadius}
                stroke="currentColor"
                stroke-width="12"
                class="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r={circleRadius}
                stroke="url(#scoreGradient)"
                stroke-width="12"
                stroke-dasharray={circumference}
                stroke-dashoffset={strokeDashoffset}
                stroke-linecap="round"
                class="progress-ring-circle"
                fill="transparent"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#8b5cf6" />
                  <stop offset="50%" stop-color="#6366f1" />
                  <stop offset="100%" stop-color="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div class="absolute flex flex-col items-center">
              <span class="text-4xl font-black text-white font-display">{matchScore}%</span>
              <span class="text-[10px] uppercase font-bold text-cyan-300 tracking-wider">STRONG ALIGNMENT</span>
            </div>
          </div>

          <p class="text-xs text-slate-300 mt-2 max-w-xs leading-relaxed">
            Strong alignment with this role, with key skill and resume optimization opportunities.
          </p>

          {/* Explainable Score Trigger */}
          <button
            onClick={() => setShowWeightsModal(true)}
            class="mt-4 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-indigo-300 flex items-center space-x-1.5 transition-colors"
          >
            <span>💡 How was this calculated?</span>
          </button>

        </div>

        {/* Right Subscores Breakdown */}
        <div class="lg:col-span-7 space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-slate-800/60">
            <h4 class="text-sm font-bold text-white font-display">Score Breakdown</h4>
            <span class="text-[11px] text-slate-400 font-mono">5 Evaluation Vectors</span>
          </div>

          {[
            { label: 'Skills Alignment', val: defaultSubscores.skills, color: 'from-violet-500 to-indigo-500' },
            { label: 'Projects Relevance', val: defaultSubscores.projects, color: 'from-indigo-500 to-blue-500' },
            { label: 'Experience Depth', val: defaultSubscores.experience, color: 'from-blue-500 to-cyan-500' },
            { label: 'Academic / Education', val: defaultSubscores.education, color: 'from-emerald-500 to-teal-500' },
            { label: 'ATS Keyword Match', val: defaultSubscores.keywords, color: 'from-amber-500 to-orange-500' }
          ].map((item, i) => (
            <div key={i} class="space-y-1">
              <div class="flex items-center justify-between text-xs">
                <span class="text-slate-300 font-medium">{item.label}</span>
                <span class="font-bold text-white font-mono">{item.val}%</span>
              </div>
              <div class="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                <div
                  class={`bg-gradient-to-r ${item.color} h-full rounded-full transition-all duration-1000`}
                  style={{ width: `${item.val}%` }}
                ></div>
              </div>
            </div>
          ))}

          <p class="text-[10px] text-slate-400 italic pt-2">
            * Disclaimer: This match score is an explainable AI synthesis based on resume content evidence. It does not guarantee employment or interview selection.
          </p>
        </div>

      </div>

      {/* HOW WAS THIS CALCULATED MODAL */}
      {showWeightsModal && (
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div class="glass-card-glow w-full max-w-lg rounded-2xl p-6 relative space-y-6">
            <div class="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 class="text-lg font-bold text-white font-display">Transparent Score Engine</h3>
              <button onClick={() => setShowWeightsModal(false)} class="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <p class="text-xs text-slate-300 leading-relaxed">
              Your match score is calculated using weighted analysis across 5 dimensions. You can adjust weights below to customize scoring priorities for your specific career target.
            </p>

            <div class="space-y-4 text-xs">
              {[
                { key: 'skills', label: 'Skills Match Weight', defaultVal: 40 },
                { key: 'projects', label: 'Projects Weight', defaultVal: 20 },
                { key: 'experience', label: 'Experience Weight', defaultVal: 20 },
                { key: 'education', label: 'Education Weight', defaultVal: 10 },
                { key: 'keywords', label: 'Keyword Alignment Weight', defaultVal: 10 }
              ].map((w) => (
                <div key={w.key} class="flex items-center justify-between space-x-4">
                  <span class="text-slate-200 font-medium">{w.label}</span>
                  <div class="flex items-center space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={customWeights[w.key] * 100}
                      onChange={(e) => setCustomWeights({ ...customWeights, [w.key]: parseFloat(e.target.value) / 100 })}
                      class="w-28 accent-indigo-500"
                    />
                    <span class="w-10 text-right font-mono font-bold text-indigo-300">{Math.round(customWeights[w.key] * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div class="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
              <button onClick={() => setShowWeightsModal(false)} class="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400">Cancel</button>
              <button onClick={handleApplyWeights} class="px-6 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md">
                Apply Custom Weights
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
