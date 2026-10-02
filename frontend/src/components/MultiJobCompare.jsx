import React, { useState } from 'react';

export default function MultiJobCompare() {
  const [jobs, setJobs] = useState([
    { id: 'j_1', title: 'Python Developer', company: 'NextGen AI', score: 82, status: 'Strong Match', skillsMatched: 4, skillsMissing: 2 },
    { id: 'j_2', title: 'Data Analyst', company: 'Analytics Global', score: 78, status: 'Good Match', skillsMatched: 3, skillsMissing: 3 },
    { id: 'j_3', title: 'Java Backend Dev', company: 'Enterprise Systems', score: 71, status: 'Moderate Match', skillsMatched: 2, skillsMissing: 4 },
    { id: 'j_4', title: 'AI / ML Intern', company: 'DeepTech Labs', score: 75, status: 'Good Match', skillsMatched: 3, skillsMissing: 3 }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newJd, setNewJd] = useState('');

  const handleAddJob = () => {
    if (!newTitle.trim()) return;
    const score = Math.floor(Math.random() * 20) + 70;
    setJobs([
      ...jobs,
      {
        id: `j_${jobs.length + 1}`,
        title: newTitle,
        company: 'New Target Company',
        score: score,
        status: score >= 80 ? 'Strong Match' : 'Good Match',
        skillsMatched: 3,
        skillsMissing: 2
      }
    ]);
    setNewTitle('');
    setNewJd('');
  };

  return (
    <div class="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div class="flex items-center space-x-2">
            <span class="text-xl">⚖️</span>
            <h3 class="text-lg font-bold text-white font-display">MULTI-JOB COMPARISON MATRIX</h3>
          </div>
          <p class="text-xs text-slate-400">Compare your resume alignment across multiple target role options.</p>
        </div>

        <div class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-indigo-300 font-semibold">
          {jobs.length} Roles Analyzed
        </div>
      </div>

      {/* Grid Comparison */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            class="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-3 relative"
          >
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{job.company}</span>
              <span
                class={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                  job.score >= 80 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {job.status}
              </span>
            </div>

            <div>
              <h4 class="text-base font-bold text-white font-display">{job.title}</h4>
              <div class="text-3xl font-black text-indigo-300 font-display mt-2">{job.score}%</div>
            </div>

            <div class="space-y-1.5 pt-2 text-xs border-t border-slate-800">
              <div class="flex justify-between text-slate-300">
                <span>Matched Skills:</span>
                <span class="font-bold text-emerald-400">{job.skillsMatched}</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>Missing Skills:</span>
                <span class="font-bold text-rose-400">{job.skillsMissing}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Job Comparison Form */}
      <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <h4 class="text-xs font-bold text-white font-display">Add Another Target Role to Compare</h4>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Target Job Title..."
            class="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
          />
          <input
            type="text"
            value={newJd}
            onChange={(e) => setNewJd(e.target.value)}
            placeholder="Job Description snippet..."
            class="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
          />
          <button
            onClick={handleAddJob}
            class="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md"
          >
            + Add to Comparison
          </button>
        </div>
      </div>

    </div>
  );
}
