import React from 'react';

export default function LearningRoadmap({ skillGaps = [] }) {
  const gaps = skillGaps.length ? skillGaps : [
    { skill: 'Docker', jd_importance: 'Required', recommendation: 'Learn Docker containerization fundamentals and build a containerized Python app.', timeline_week: 1, resources: ['Docker Docs', 'FreeCodeCamp Docker'] },
    { skill: 'AWS Basics', jd_importance: 'Preferred', recommendation: 'Explore AWS S3, EC2, and IAM role basics.', timeline_week: 2, resources: ['AWS Skill Builder', 'AWS Cloud Practitioner'] },
    { skill: 'REST API Best Practices', jd_importance: 'Required', recommendation: 'Build OpenAPI schemas and implement rate limiting in FastAPI.', timeline_week: 3, resources: ['FastAPI Docs', 'REST Guidelines'] },
    { skill: 'Portfolio Integration', jd_importance: 'Required', recommendation: 'Deploy a fullstack project on cloud hosting with GitHub Actions CI/CD.', timeline_week: 4, resources: ['GitHub Actions', 'Vercel / Render'] }
  ];

  return (
    <div class="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div class="flex items-center space-x-2">
            <span class="text-xl">🧩</span>
            <h3 class="text-lg font-bold text-white font-display">SKILL GAP MAP & LEARNING ROADMAP</h3>
          </div>
          <p class="text-xs text-slate-400">Step-by-step 4-week learning roadmap designed to truthfully eliminate profile gaps.</p>
        </div>

        <div class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300">
          Target Role: Python / Fullstack Developer
        </div>
      </div>

      {/* 4-Week Timeline Steps */}
      <div class="space-y-4 relative border-l-2 border-indigo-500/30 ml-4 pl-6 pt-2">
        {gaps.map((item, idx) => (
          <div key={idx} class="relative space-y-2 group">
            
            {/* Timeline Dot */}
            <div class="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-indigo-400 group-hover:bg-indigo-500 transition-colors"></div>

            <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-2 text-xs">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="font-bold text-indigo-300 font-mono">Week {item.timeline_week || idx + 1}:</span>
                  <span class="font-black text-white font-display uppercase text-sm">{item.skill}</span>
                </div>
                <span class="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 text-[10px] font-bold border border-rose-500/20 font-mono">
                  {item.jd_importance}
                </span>
              </div>

              <p class="text-slate-300 leading-relaxed">{item.recommendation}</p>

              <div class="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800">
                <span class="text-[10px] uppercase font-bold text-slate-500">Recommended Resources:</span>
                {item.resources.map((res, rIdx) => (
                  <span key={rIdx} class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700">
                    📚 {res}
                  </span>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
