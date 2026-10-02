import React, { useState } from 'react';

export default function NextQuest({ quests = [], onCompleteQuest }) {
  const [questList, setQuestList] = useState(quests.length ? quests : [
    { id: 'q_1', title: 'Improve Summary Section', category: 'Summary', difficulty: 'Easy', xp: 75, estimated_time: '5 minutes', description: 'Update your professional summary using the AI-recommended high-impact action template.', completed: false },
    { id: 'q_2', title: 'Strengthen Project Bullet Descriptions', category: 'Projects', difficulty: 'Medium', xp: 100, estimated_time: '10 minutes', description: 'Accept or customize the suggested action-verb rewrites in your top project entries.', completed: false },
    { id: 'q_3', title: 'Fix ATS Formatting', category: 'ATS', difficulty: 'Easy', xp: 75, estimated_time: '3 minutes', description: 'Standardize all bullet point indicators across your projects and experience sections.', completed: false },
    { id: 'q_4', title: 'Address Skill Gaps with Learning Roadmap', category: 'Skills', difficulty: 'Medium', xp: 125, estimated_time: '15 minutes', description: 'Review the 4-week learning roadmap for missing job requirements like Docker/AWS.', completed: false }
  ]);

  const completedCount = questList.filter((q) => q.completed).length;
  const totalXpAvailable = questList.reduce((acc, q) => acc + q.xp, 0);
  const earnedXp = questList.filter((q) => q.completed).reduce((acc, q) => acc + q.xp, 0);

  const handleClaimQuest = (quest) => {
    setQuestList((prev) =>
      prev.map((q) => (q.id === quest.id ? { ...q, completed: true } : q))
    );
    if (onCompleteQuest) {
      onCompleteQuest(quest.xp, `Quest Completed: ${quest.title}`);
    }
  };

  return (
    <div class="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div class="flex items-center space-x-2">
            <span class="text-xl">🚀</span>
            <h3 class="text-lg font-bold text-white font-display">YOUR NEXT QUEST</h3>
          </div>
          <p class="text-xs text-slate-400">Complete application improvement missions to boost candidate profile alignment and earn Career XP.</p>
        </div>

        <div class="flex items-center space-x-3 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-xs">
          <span class="text-slate-400 font-bold">QUEST PROGRESS:</span>
          <span class="text-indigo-300 font-bold font-mono">{completedCount}/{questList.length} Done</span>
          <span class="text-amber-400 font-bold font-mono">+{earnedXp}/{totalXpAvailable} XP</span>
        </div>
      </div>

      {/* Quest Cards Grid */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questList.map((quest) => (
          <div
            key={quest.id}
            class={`p-5 rounded-2xl border transition-all space-y-3 relative overflow-hidden ${
              quest.completed
                ? 'bg-emerald-950/20 border-emerald-500/40'
                : 'bg-slate-900/60 border-slate-800 hover:border-indigo-500/40'
            }`}
          >
            <div class="flex items-center justify-between">
              <span class="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {quest.category}
              </span>
              <div class="flex items-center space-x-2 text-xs font-mono">
                <span class="text-slate-400">{quest.estimated_time}</span>
                <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  +{quest.xp} XP
                </span>
              </div>
            </div>

            <div>
              <h4 class="text-sm font-bold text-white font-display">{quest.title}</h4>
              <p class="text-xs text-slate-300 mt-1 leading-relaxed">{quest.description}</p>
            </div>

            <div class="pt-2 flex items-center justify-between border-t border-slate-800">
              <span class="text-[10px] text-slate-400 uppercase font-mono">Difficulty: {quest.difficulty}</span>
              {quest.completed ? (
                <span class="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                  <span>✓</span>
                  <span>Quest Completed</span>
                </span>
              ) : (
                <button
                  onClick={() => handleClaimQuest(quest)}
                  class="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-md transition-all transform hover:-translate-y-0.5"
                >
                  Start Quest →
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
