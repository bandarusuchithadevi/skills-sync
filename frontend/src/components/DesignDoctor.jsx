import React from 'react';

export default function DesignDoctor({ designData = {} }) {
  const score = designData.overall_score ?? 81;
  const metrics = designData.metrics || [
    { name: 'Typography', score: 82, status: 'Optimal' },
    { name: 'Spacing', score: 74, status: 'Slightly Dense' },
    { name: 'Structure', score: 91, status: 'Clear Hierarchy' },
    { name: 'Consistency', score: 84, status: 'Consistent' }
  ];

  const doctorNotes = designData.doctor_notes || [
    {
      type: 'warning',
      title: 'Inconsistent Bullet Formatting',
      issue: 'Project section uses mixed bullet styles across entries.',
      recommendation: 'Use the same bullet symbol style across all project entries.'
    },
    {
      type: 'suggestion',
      title: 'Header Spacing Optimization',
      issue: 'Padding above section headers is slightly tight.',
      recommendation: 'Add 6pt to 8pt space before each section title to improve visual scannability.'
    },
    {
      type: 'positive',
      title: 'Excellent Visual Hierarchy',
      issue: 'Font weights clearly distinguish section headings from bullet body text.',
      recommendation: 'Maintain bold section titles and clean margins.'
    }
  ];

  return (
    <div class="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-2xl">
            🎨
          </div>
          <div>
            <h3 class="text-lg font-bold text-white font-display">RESUME DESIGN DOCTOR</h3>
            <p class="text-xs text-slate-400">Visual hierarchy, typography, padding, and layout consistency diagnosis.</p>
          </div>
        </div>

        <div class="flex items-center space-x-3 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
          <span class="text-xs font-bold text-slate-400">DESIGN SCORE:</span>
          <span class="text-2xl font-black text-white font-display font-mono">{score}/100</span>
        </div>
      </div>

      {/* Visual Metric Progress Bars */}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="font-semibold text-slate-200">{m.name}</span>
              <div class="flex items-center space-x-2 font-mono">
                <span class="text-slate-400 text-[10px] uppercase">({m.status})</span>
                <span class="font-bold text-indigo-300">{m.score}</span>
              </div>
            </div>
            <div class="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
              <div
                class="bg-gradient-to-r from-violet-500 to-cyan-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${m.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Doctor's Notes */}
      <div class="space-y-4 pt-2">
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
          <span>🩺</span>
          <span>DOCTOR'S DIAGNOSIS & REMEDIATION NOTES</span>
        </h4>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          {doctorNotes.map((note, idx) => (
            <div
              key={idx}
              class={`p-4 rounded-xl border space-y-2 text-xs ${
                note.type === 'warning'
                  ? 'bg-amber-950/20 border-amber-500/30'
                  : note.type === 'suggestion'
                  ? 'bg-indigo-950/20 border-indigo-500/30'
                  : 'bg-emerald-950/20 border-emerald-500/30'
              }`}
            >
              <div class="flex items-center space-x-2 font-bold font-display text-white">
                <span>{note.type === 'warning' ? '⚠' : note.type === 'suggestion' ? '💡' : '✓'}</span>
                <span>{note.title}</span>
              </div>
              <p class="text-slate-300 leading-relaxed">{note.issue}</p>
              <div class="pt-2 border-t border-slate-800/80 text-[11px] font-medium text-slate-200">
                <span class="text-indigo-300 font-bold block mb-0.5">Recommendation:</span>
                {note.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
