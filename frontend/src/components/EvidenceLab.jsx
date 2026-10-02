import React, { useState } from 'react';

export default function EvidenceLab({ evidenceList = [], resumeText = '' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSourceModal, setActiveSourceModal] = useState(null);

  const filteredList = evidenceList.filter((e) =>
    e.requirement.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.resume_evidence.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div class="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div class="flex items-center space-x-2">
            <span class="text-xl">🔎</span>
            <h3 class="text-lg font-bold text-white font-display">EVIDENCE LAB</h3>
          </div>
          <p class="text-xs text-slate-400">Why does AI think this matches? Powered by ChromaDB vector similarity & RAG retrieval.</p>
        </div>

        {/* Search Filter Bar */}
        <div class="relative w-full md:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search requirement or evidence..."
            class="w-full px-3 py-2 pl-9 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
          <span class="absolute left-3 top-2.5 text-slate-500 text-xs">🔍</span>
        </div>
      </div>

      {/* Requirement Evidence Grid */}
      <div class="space-y-4">
        {filteredList.map((item, idx) => (
          <div
            key={idx}
            class={`p-5 rounded-2xl border transition-all ${
              item.status === 'MATCHED'
                ? 'bg-slate-900/60 border-emerald-500/30 hover:border-emerald-500/60'
                : item.status === 'PARTIAL'
                ? 'bg-slate-900/60 border-amber-500/30 hover:border-amber-500/60'
                : 'bg-slate-900/60 border-rose-500/30 hover:border-rose-500/60'
            }`}
          >
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              
              <div class="flex items-center space-x-2">
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">JOB REQUIREMENT:</span>
                <span class="text-xs font-bold text-white font-display">{item.requirement}</span>
              </div>

              <div class="flex items-center space-x-2">
                <span
                  class={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                    item.status === 'MATCHED'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : item.status === 'PARTIAL'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}
                >
                  {item.status === 'MATCHED' ? '🟢 MATCHED' : item.status === 'PARTIAL' ? '🟡 PARTIAL' : '🔴 NOT FOUND'}
                </span>
                <span class="text-xs font-mono font-semibold text-cyan-300">
                  {item.confidence}% Confidence
                </span>
              </div>

            </div>

            {/* Evidence & Metadata Body */}
            <div class="pt-3 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              <div class="md:col-span-9 space-y-1">
                <span class="text-[10px] uppercase font-bold text-indigo-300">Retrieved Resume Snippet</span>
                <p class="text-xs text-slate-200 font-mono bg-slate-950/80 p-3 rounded-xl border border-slate-800 leading-relaxed">
                  "{item.resume_evidence}"
                </p>
              </div>

              <div class="md:col-span-3 flex flex-col justify-between space-y-2 text-xs">
                <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span class="text-[9px] uppercase font-bold text-slate-500 block">Source Location</span>
                  <span class="font-bold text-slate-300 block">{item.source_section}</span>
                  <span class="text-[10px] text-slate-400 font-mono">Page {item.source_page}</span>
                </div>

                <button
                  onClick={() => setActiveSourceModal(item)}
                  class="w-full py-2 rounded-lg text-xs font-bold text-indigo-300 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 transition-colors flex items-center justify-center space-x-1"
                >
                  <span>📄 View Source</span>
                </button>
              </div>

            </div>
          </div>
        ))}

        {filteredList.length === 0 && (
          <div class="text-center py-12 text-slate-500 text-xs">
            No matching requirement evidence found for search term.
          </div>
        )}
      </div>

      {/* VIEW SOURCE MODAL */}
      {activeSourceModal && (
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div class="glass-card-glow w-full max-w-2xl rounded-2xl p-6 relative space-y-4">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 class="text-base font-bold text-white font-display">Resume Document Source View</h3>
                <span class="text-xs text-slate-400">Section: {activeSourceModal.source_section} | Page {activeSourceModal.source_page}</span>
              </div>
              <button onClick={() => setActiveSourceModal(null)} class="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 space-y-3 max-h-80 overflow-y-auto">
              <div class="p-2.5 rounded bg-indigo-950/80 border border-indigo-500/50 text-indigo-200 font-bold">
                🎯 Matched Evidence Chunk: <br />
                "{activeSourceModal.resume_evidence}"
              </div>
              <div class="whitespace-pre-wrap text-slate-400 pt-2 border-t border-slate-800">
                {resumeText || "Full document text indexed in ChromaDB vector collection."}
              </div>
            </div>

            <div class="flex justify-end pt-2">
              <button onClick={() => setActiveSourceModal(null)} class="px-5 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500">
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
