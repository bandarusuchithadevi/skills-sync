import React, { useState } from 'react';

export default function QuestHistory({ historyList = [], onLoadAnalysis }) {
  const [items, setItems] = useState(historyList.length ? historyList : [
    { analysis_id: 'q_hist_1', created_at: 'Today', resume_name: 'Suchitha_Resume.pdf', job_title: 'Python Developer', job_match_score: 82 },
    { analysis_id: 'q_hist_2', created_at: 'Yesterday', resume_name: 'Suchitha_Resume.pdf', job_title: 'Data Analyst', job_match_score: 78 },
    { analysis_id: 'q_hist_3', created_at: '3 days ago', resume_name: 'Suchitha_Resume.pdf', job_title: 'AI Intern', job_match_score: 74 }
  ]);

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((item) => item.analysis_id !== id));
  };

  return (
    <div class="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div class="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <div class="flex items-center space-x-2">
            <span class="text-xl">📜</span>
            <h3 class="text-lg font-bold text-white font-display">QUEST HISTORY LOG</h3>
          </div>
          <p class="text-xs text-slate-400">View and review past resume analysis quests and job target evaluations.</p>
        </div>

        <span class="text-xs font-mono text-indigo-300 font-bold bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
          {items.length} Logged Quests
        </span>
      </div>

      {/* History Table */}
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="bg-slate-900/80 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
            <tr>
              <th class="p-3">Target Role</th>
              <th class="p-3">Resume Document</th>
              <th class="p-3">Match Score</th>
              <th class="p-3">Date</th>
              <th class="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60">
            {items.map((item) => (
              <tr key={item.analysis_id} class="hover:bg-slate-900/40 transition-colors">
                <td class="p-3 font-bold text-white font-display">{item.job_title}</td>
                <td class="p-3 font-mono text-slate-400">{item.resume_name}</td>
                <td class="p-3 font-mono">
                  <span
                    class={`px-2.5 py-0.5 rounded-full font-bold ${
                      item.job_match_score >= 80 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-indigo-500/20 text-indigo-300'
                    }`}
                  >
                    {item.job_match_score}%
                  </span>
                </td>
                <td class="p-3 text-slate-400">{item.created_at}</td>
                <td class="p-3 text-right space-x-2">
                  <button
                    onClick={() => onLoadAnalysis && onLoadAnalysis(item)}
                    class="px-3 py-1 rounded bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-bold border border-indigo-500/30"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(item.analysis_id)}
                    class="px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold border border-rose-500/20"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <div class="text-center py-8 text-slate-500 text-xs">
            No logged quest history yet.
          </div>
        )}
      </div>

    </div>
  );
}
