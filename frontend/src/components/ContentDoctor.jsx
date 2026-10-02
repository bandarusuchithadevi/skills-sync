import React, { useState } from 'react';

export default function ContentDoctor({ wordings = [], onAwardXp }) {
  const [items, setItems] = useState(wordings.length ? wordings : [
    {
      id: 'w_1',
      section: 'Projects',
      before: 'Made a data processing script using Python and Pandas.',
      after: 'Developed an automated Python data processing pipeline using Pandas and NumPy, accelerating execution speed by 35%.',
      why: "Replaces passive verb ('Made') with strong action verb ('Developed') and quantifies pipeline outcome.",
      truthful_note: 'Truthful enhancement — uses your existing Python/Pandas experience.',
      status: 'pending'
    },
    {
      id: 'w_2',
      section: 'Summary',
      before: 'Motivated developer looking for a Python developer role.',
      after: 'Results-oriented Developer with hands-on project experience in Python, SQL, and REST APIs, targeting a Python Developer position.',
      why: 'Highlights concrete technical competencies instead of generic self-descriptions.',
      truthful_note: 'Truthful enhancement — references only verified skills from your resume.',
      status: 'pending'
    }
  ]);

  const handleAction = (id, newStatus) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    if (newStatus === 'accepted' && onAwardXp) {
      onAwardXp(100, 'Resume section wording improved');
    }
  };

  return (
    <div class="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div class="flex items-center space-x-2">
            <span class="text-xl">✍️</span>
            <h3 class="text-lg font-bold text-white font-display">BEFORE / AFTER WORDING CHECKUP</h3>
          </div>
          <p class="text-xs text-slate-400">High-impact wording rewrites prioritizing 100% truthful resume optimization.</p>
        </div>

        <div class="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          🛡️ Strict Truthfulness Protocol Active
        </div>
      </div>

      {/* Interactive Wording Cards */}
      <div class="space-y-6">
        {items.map((item) => (
          <div
            key={item.id}
            class={`p-5 rounded-2xl border transition-all space-y-4 ${
              item.status === 'accepted'
                ? 'bg-emerald-950/20 border-emerald-500/40'
                : item.status === 'rejected'
                ? 'bg-slate-900/40 border-slate-800 opacity-60'
                : 'bg-slate-900/60 border-indigo-500/30'
            }`}
          >
            
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <span class="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                Section: {item.section}
              </span>
              {item.status === 'accepted' ? (
                <span class="text-xs font-bold text-emerald-400">✓ ACCEPTED (+100 XP)</span>
              ) : item.status === 'rejected' ? (
                <span class="text-xs font-bold text-slate-500">✕ REJECTED</span>
              ) : (
                <span class="text-[10px] font-mono font-bold text-cyan-300 uppercase">PENDING REVIEW</span>
              )}
            </div>

            {/* Before vs After Grid */}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              
              {/* BEFORE */}
              <div class="p-3.5 rounded-xl bg-slate-950 border border-rose-500/20 space-y-1">
                <span class="text-[10px] uppercase font-bold text-rose-400 block font-sans">BEFORE (Original Text)</span>
                <p class="text-slate-300 line-through opacity-80">"{item.before}"</p>
              </div>

              {/* AFTER */}
              <div class="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-1">
                <span class="text-[10px] uppercase font-bold text-emerald-400 block font-sans">AFTER (AI Upgrade)</span>
                <p class="text-white font-semibold">"{item.after}"</p>
              </div>

            </div>

            {/* WHY & Truthful Note */}
            <div class="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs space-y-1">
              <div class="flex items-center space-x-1.5">
                <span class="font-bold text-indigo-300">WHY:</span>
                <span class="text-slate-200">{item.why}</span>
              </div>
              <p class="text-[10px] text-slate-400 italic">
                {item.truthful_note}
              </p>
            </div>

            {/* Action Buttons */}
            {item.status === 'pending' && (
              <div class="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={() => handleAction(item.id, 'rejected')}
                  class="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleAction(item.id, 'accepted')}
                  class="px-6 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-indigo-600/30"
                >
                  Accept Upgrade (+100 XP)
                </button>
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
}
