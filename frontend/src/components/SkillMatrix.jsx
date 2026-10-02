import React, { useState } from 'react';

export default function SkillMatrix({ skills = { matched: [], partial: [], missing: [] } }) {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [filter, setFilter] = useState('ALL'); // ALL, MATCHED, PARTIAL, MISSING

  const matched = skills.matched || [];
  const partial = skills.partial || [];
  const missing = skills.missing || [];

  return (
    <div class="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
      
      {/* Header & Filter Tabs */}
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div class="flex items-center space-x-2">
            <span class="text-xl">⚡</span>
            <h3 class="text-lg font-bold text-white font-display">SKILL MATRIX</h3>
          </div>
          <p class="text-xs text-slate-400">Semantic comparison of resume skills against target job description requirements.</p>
        </div>

        {/* Filter Pills */}
        <div class="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          {[
            { id: 'ALL', label: `All (${matched.length + partial.length + missing.length})` },
            { id: 'MATCHED', label: `🟢 Matched (${matched.length})` },
            { id: 'PARTIAL', label: `🟡 Partial (${partial.length})` },
            { id: 'MISSING', label: `🔴 Missing (${missing.length})` }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              class={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filter === f.id ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* SKILL MATRIX CATEGORIES */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 🟢 MATCHED SKILLS */}
        {(filter === 'ALL' || filter === 'MATCHED') && (
          <div class="space-y-3 p-4 rounded-xl bg-slate-900/40 border border-emerald-500/20">
            <div class="flex items-center justify-between pb-2 border-b border-emerald-500/20">
              <span class="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                <span>🟢</span>
                <span>MATCHED SKILLS</span>
              </span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                {matched.length} Verified
              </span>
            </div>
            
            <div class="flex flex-wrap gap-2 pt-1">
              {matched.map((sk, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSkill(sk)}
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 hover:border-emerald-400 transition-all flex items-center space-x-1.5 transform hover:-translate-y-0.5"
                >
                  <span>✓</span>
                  <span>{sk.name}</span>
                </button>
              ))}
              {matched.length === 0 && (
                <span class="text-xs text-slate-500 italic">No exact matched skills.</span>
              )}
            </div>
          </div>
        )}

        {/* 🟡 PARTIAL / RELATED SKILLS */}
        {(filter === 'ALL' || filter === 'PARTIAL') && (
          <div class="space-y-3 p-4 rounded-xl bg-slate-900/40 border border-amber-500/20">
            <div class="flex items-center justify-between pb-2 border-b border-amber-500/20">
              <span class="text-xs font-bold text-amber-400 flex items-center space-x-1">
                <span>🟡</span>
                <span>PARTIAL / RELATED</span>
              </span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                {partial.length} Related
              </span>
            </div>

            <div class="flex flex-wrap gap-2 pt-1">
              {partial.map((sk, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSkill(sk)}
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-200 hover:border-amber-400 transition-all flex items-center space-x-1.5 transform hover:-translate-y-0.5"
                >
                  <span>⚡</span>
                  <span>{sk.name}</span>
                </button>
              ))}
              {partial.length === 0 && (
                <span class="text-xs text-slate-500 italic">No partial/related skills identified.</span>
              )}
            </div>
          </div>
        )}

        {/* 🔴 MISSING SKILLS */}
        {(filter === 'ALL' || filter === 'MISSING') && (
          <div class="space-y-3 p-4 rounded-xl bg-slate-900/40 border border-rose-500/20">
            <div class="flex items-center justify-between pb-2 border-b border-rose-500/20">
              <span class="text-xs font-bold text-rose-400 flex items-center space-x-1">
                <span>🔴</span>
                <span>MISSING SKILLS</span>
              </span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono">
                {missing.length} Gaps
              </span>
            </div>

            <div class="flex flex-wrap gap-2 pt-1">
              {missing.map((sk, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSkill(sk)}
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-200 hover:border-rose-400 transition-all flex items-center space-x-1.5 transform hover:-translate-y-0.5"
                >
                  <span>✕</span>
                  <span>{sk.name}</span>
                </button>
              ))}
              {missing.length === 0 && (
                <span class="text-xs text-slate-500 italic">No missing skills detected!</span>
              )}
            </div>
          </div>
        )}

      </div>

      {/* SKILL EVIDENCE DETAIL DRAWER/MODAL */}
      {selectedSkill && (
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div class="glass-card-glow w-full max-w-lg rounded-2xl p-6 relative space-y-6">
            
            <div class="flex items-center justify-between border-b border-slate-800 pb-4">
              <div class="flex items-center space-x-3">
                <span class="text-2xl">
                  {selectedSkill.status === 'MATCHED' ? '🟢' : selectedSkill.status === 'PARTIAL' ? '🟡' : '🔴'}
                </span>
                <div>
                  <h3 class="text-lg font-black text-white uppercase font-display">{selectedSkill.name}</h3>
                  <span class="text-xs text-indigo-300 font-semibold">{selectedSkill.status} SKILL</span>
                </div>
              </div>
              <button onClick={() => setSelectedSkill(null)} class="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <div class="space-y-4 text-xs">
              
              {/* Evidence Found Box */}
              <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span class="text-[10px] uppercase font-bold text-slate-400 block">Resume Evidence Found</span>
                <p class="text-slate-200 font-mono leading-relaxed">
                  "{selectedSkill.resume_evidence || 'No supporting evidence found in uploaded resume.'}"
                </p>
              </div>

              {/* JD Requirement Box */}
              <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span class="text-[10px] uppercase font-bold text-slate-400 block">Target Job Requirement</span>
                <p class="text-slate-200 leading-relaxed">
                  {selectedSkill.jd_requirement || `Required proficiency in ${selectedSkill.name}.`}
                </p>
              </div>

              {/* Metadata row */}
              <div class="grid grid-cols-2 gap-3 pt-2">
                <div class="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-center">
                  <span class="text-[10px] uppercase font-bold text-indigo-300 block">Match Type</span>
                  <span class="text-white font-bold">{selectedSkill.match_type || 'Exact'}</span>
                </div>
                <div class="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-center">
                  <span class="text-[10px] uppercase font-bold text-cyan-300 block">AI Confidence Score</span>
                  <span class="text-white font-bold font-mono">{selectedSkill.confidence || 90}%</span>
                </div>
              </div>

            </div>

            <div class="flex justify-end pt-2">
              <button onClick={() => setSelectedSkill(null)} class="px-6 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500">
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
