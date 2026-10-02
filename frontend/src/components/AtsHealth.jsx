import React from 'react';

export default function AtsHealth({ atsData = {} }) {
  const score = atsData.overall_score ?? 86;
  const checks = atsData.checks || [
    { category: 'Structure', status: 'GOOD', title: 'Clear Section Headings', description: 'Standard section headers detected for easy ATS parsing.' },
    { category: 'Keywords', status: 'GOOD', title: 'Strong Technical Keywords', description: 'Over 84% of core target job keywords are present.' },
    { category: 'Readability', status: 'GOOD', title: 'Optimal Line Length', description: 'Clear sentence structures ideal for automated text extraction.' },
    { category: 'Formatting', status: 'NEEDS_ATTENTION', title: 'Some Project Descriptions Short', description: 'Project bullet points could include stronger action verbs.' },
    { category: 'Section Recognition', status: 'GOOD', title: 'High Parser Confidence', description: 'Contact info, education, and skills recognized with 95%+ confidence.' }
  ];

  return (
    <div class="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-2xl">
            🩺
          </div>
          <div>
            <h3 class="text-lg font-bold text-white font-display">ATS HEALTH CHECK</h3>
            <p class="text-xs text-slate-400">Automated Applicant Tracking System parser compatibility scan.</p>
          </div>
        </div>

        <div class="flex items-center space-x-3 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
          <span class="text-xs font-bold text-slate-400">ATS HEALTH SCORE:</span>
          <span class="text-2xl font-black text-white font-display font-mono">{score}/100</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Keywords', val: atsData.keyword_alignment ?? 84 },
          { label: 'Structure', val: atsData.structure_score ?? 92 },
          { label: 'Readability', val: atsData.readability_score ?? 90 },
          { label: 'Formatting', val: atsData.formatting_score ?? 78 },
          { label: 'Parser Sync', val: atsData.section_recognition ?? 95 }
        ].map((m, idx) => (
          <div key={idx} class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-1">
            <span class="text-[10px] uppercase font-bold text-slate-400 block">{m.label}</span>
            <span class="text-lg font-black text-indigo-300 font-mono">{m.val}%</span>
          </div>
        ))}
      </div>

      {/* Checks Category Lists */}
      <div class="space-y-3 pt-2">
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-300">Detailed Parser Audit</h4>
        
        {checks.map((chk, idx) => (
          <div
            key={idx}
            class={`p-4 rounded-xl border flex items-start space-x-3 transition-all ${
              chk.status === 'GOOD'
                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                : chk.status === 'NEEDS_ATTENTION'
                ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
            }`}
          >
            <span class="text-base mt-0.5">
              {chk.status === 'GOOD' ? '✓' : chk.status === 'NEEDS_ATTENTION' ? '⚠' : '✕'}
            </span>
            <div class="space-y-0.5 text-xs">
              <div class="flex items-center space-x-2">
                <span class="font-bold font-display">{chk.title}</span>
                <span class="text-[10px] font-mono opacity-80 uppercase">[{chk.category}]</span>
              </div>
              <p class="text-slate-300 leading-relaxed">{chk.description}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
