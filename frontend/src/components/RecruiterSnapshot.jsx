import React from 'react';

export default function RecruiterSnapshot({ snapshot = {} }) {
  const topStrengths = snapshot.top_strengths || [
    'Strong foundation in Python, SQL, and REST APIs',
    'Clean section structure with clear project bullet points',
    'High academic alignment for target software engineering role'
  ];

  const relevantSkills = snapshot.relevant_skills || ['Python', 'SQL', 'Git', 'FastAPI', 'Pandas'];
  const topProject = snapshot.top_project || 'Student Data Analyzer (Python & SQL)';
  const perceivedGaps = snapshot.perceived_gaps || ['No direct evidence found for AWS or Docker cloud tools'];
  const hardToFind = snapshot.hard_to_find_info || ['Quantifiable performance metrics on project scale'];

  return (
    <div class="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div class="flex items-center space-x-2">
            <span class="text-xl">👀</span>
            <h3 class="text-lg font-bold text-white font-display">30-SECOND RECRUITER SNAPSHOT</h3>
          </div>
          <p class="text-xs text-slate-400">Simulates what information recruiters immediately digest during a 30-second initial scan.</p>
        </div>

        <div class="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
          AI-generated simulation — not an actual recruiter prediction
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        
        {/* Top Strengths */}
        <div class="p-5 rounded-xl bg-slate-900/60 border border-emerald-500/30 space-y-3">
          <span class="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
            <span>🟢</span>
            <span>TOP RECRUITER STRENGTHS</span>
          </span>
          <ul class="space-y-2">
            {topStrengths.map((str, idx) => (
              <li key={idx} class="flex items-start space-x-2 text-slate-200">
                <span class="text-emerald-400 font-bold">✓</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Perceived Gaps & Hard to Find */}
        <div class="p-5 rounded-xl bg-slate-900/60 border border-amber-500/30 space-y-3">
          <span class="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
            <span>⚠</span>
            <span>PERCEIVED GAPS & HARD-TO-FIND INFO</span>
          </span>
          <div class="space-y-2">
            <div class="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span class="text-[10px] text-amber-400 uppercase font-bold block mb-1">Perceived Gaps:</span>
              {perceivedGaps.map((gap, gIdx) => (
                <p key={gIdx} class="text-slate-300 mb-1">• {gap}</p>
              ))}
            </div>
            <div class="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span class="text-[10px] text-slate-400 uppercase font-bold block mb-1">Hard-to-Find Info:</span>
              {hardToFind.map((ht, hIdx) => (
                <p key={hIdx} class="text-slate-400">• {ht}</p>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Relevant Skills & Top Project */}
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
        <div class="md:col-span-8 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <span class="text-[10px] uppercase font-bold text-indigo-300">Immediately Visible Technical Skills</span>
          <div class="flex flex-wrap gap-2">
            {relevantSkills.map((sk, idx) => (
              <span key={idx} class="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-200 font-semibold border border-indigo-500/30">
                {sk}
              </span>
            ))}
          </div>
        </div>

        <div class="md:col-span-4 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span class="text-[10px] uppercase font-bold text-cyan-300 block">Standout Highlighted Project</span>
          <p class="font-bold text-white font-display">{topProject}</p>
        </div>
      </div>

    </div>
  );
}
