import React, { useState } from 'react';
import { uploadResumeFile, analyzeJobDescription, startFullAnalysis } from '../utils/api';

export default function OnboardingFlow({ onAnalysisComplete, onCancel }) {
  const [step, setStep] = useState(1); // 1: Resume, 2: Job Description, 3: Analysis Animation
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [parsedResume, setParsedResume] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const [jobTitle, setJobTitle] = useState('Python Developer');
  const [company, setCompany] = useState('NextGen AI Tech');
  const [jobDescription, setJobDescription] = useState(`Senior Python Developer
Company: NextGen AI Tech

Responsibilities:
- Build microservices using Python and FastAPI.
- Deploy RAG search pipelines and REST APIs.
- Manage Docker containerization and AWS infrastructure.

Requirements:
- Python, REST API, SQL, Git, FastAPI.
- Preferred: AWS, Docker, Kubernetes.`);

  // Stepped Analysis Animation State
  const [analysisStepIndex, setAnalysisStepIndex] = useState(0);

  const analysisSteps = [
    { title: 'SCANNING RESUME', detail: 'Resume structure and sections detected' },
    { title: 'ANALYZING JOB', detail: 'Job requirements and skills extracted' },
    { title: 'BUILDING KNOWLEDGE', detail: 'Resume chunks & TF-IDF embeddings created' },
    { title: 'RETRIEVING EVIDENCE', detail: 'RAG evidence search over ChromaDB vector store' },
    { title: 'MATCHING SKILLS', detail: 'Matched, partial, and missing skills compared' },
    { title: 'ANALYZING ATS', detail: 'ATS health scan completed' },
    { title: 'GENERATING RECOMMENDATIONS', detail: 'Career insights and improvement quests generated' }
  ];

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files ? e.target.files[0] : null;
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setIsUploading(true);
    setUploadError(null);
    setParsedResume(null);

    try {
      const res = await uploadResumeFile(uploadedFile);
      setParsedResume(res);
      setIsUploading(false);
    } catch (err) {
      setUploadError(err.message || 'Upload failed');
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleBeginAnalysis = async () => {
    setStep(3);
    setAnalysisStepIndex(0);

    // Animate progress steps sequentially
    for (let i = 0; i < analysisSteps.length; i++) {
      setAnalysisStepIndex(i);
      await new Promise((r) => setTimeout(r, 650));
    }

    // Call API backend for orchestrator execution
    const docId = parsedResume ? parsedResume.doc_id : 'demo_doc_1';
    const result = await startFullAnalysis(docId, jobDescription, jobTitle);

    await new Promise((r) => setTimeout(r, 500));
    onAnalysisComplete(result);
  };

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div class="glass-card-glow w-full max-w-2xl rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onCancel}
          class="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center"
        >
          ✕
        </button>

        {/* Progress Header */}
        <div class="flex items-center justify-between pb-6 border-b border-slate-800">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-indigo-400">QUEST ONBOARDING</span>
            <h3 class="text-xl font-bold text-white font-display">
              {step === 1 && 'Step 1: Upload Your Resume'}
              {step === 2 && 'Step 2: Target Your Job'}
              {step === 3 && 'Step 3: AI Analysis Sequence'}
            </h3>
          </div>
          <div class="flex items-center space-x-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                class={`w-8 h-2 rounded-full transition-all duration-300 ${
                  step >= s ? 'bg-gradient-to-r from-violet-500 to-cyan-400' : 'bg-slate-800'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* STEP 1: RESUME UPLOAD */}
        {step === 1 && (
          <div class="py-6 space-y-6">
            
            {/* Drag & Drop Box */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              class="border-2 border-dashed border-indigo-500/40 hover:border-indigo-400/80 rounded-2xl p-8 text-center bg-slate-900/50 transition-all duration-200 cursor-pointer group relative"
            >
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileUpload}
                class="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                📄
              </div>
              <h4 class="text-base font-bold text-white mb-1">
                {file ? file.name : 'Drop your resume here or click to browse'}
              </h4>
              <p class="text-xs text-slate-400">Supported formats: PDF, DOCX (Max size: 10MB)</p>
            </div>

            {/* Upload Error Banner */}
            {uploadError && !isUploading && (
              <div class="p-4 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs font-semibold text-rose-200 flex items-center justify-between shadow-lg">
                <div class="flex items-center space-x-2">
                  <span class="text-base">⚠️</span>
                  <span>{uploadError}</span>
                </div>
                <button onClick={() => setUploadError(null)} class="text-slate-400 hover:text-white font-bold ml-2">
                  ✕
                </button>
              </div>
            )}

            {/* Uploading indicator */}
            {isUploading && (
              <div class="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center space-x-3">
                <div class="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                <span class="text-xs font-semibold text-indigo-200">Scanning document structure & section headers...</span>
              </div>
            )}

            {/* Uploaded Success Preview */}
            {parsedResume && !isUploading && (
              <div class="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                    <span>✓</span>
                    <span>Resume successfully scanned</span>
                  </span>
                  <span class="text-[11px] font-mono text-slate-400">{parsedResume.pages} Pages detected</span>
                </div>
                <div class="grid grid-cols-2 gap-2 text-xs">
                  <div class="p-2 rounded bg-slate-900/60 text-slate-300">
                    <span class="text-[10px] text-slate-500 uppercase block">Sections</span>
                    <span class="font-semibold">{parsedResume.sections_detected.length} Detected</span>
                  </div>
                  <div class="p-2 rounded bg-slate-900/60 text-slate-300">
                    <span class="text-[10px] text-slate-500 uppercase block">Skills Found</span>
                    <span class="font-semibold">{parsedResume.skills_detected.length} Skills</span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Button */}
            <div class="flex justify-end pt-2">
              <button
                disabled={!parsedResume && !file}
                onClick={() => setStep(2)}
                class="px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 shadow-lg shadow-indigo-600/30 transition-all"
              >
                Target Your Job →
              </button>
            </div>

          </div>
        )}

        {/* STEP 2: TARGET JOB */}
        {step === 2 && (
          <div class="py-6 space-y-4">
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">Target Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Python Developer"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">Company (Optional)</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. NextGen AI Tech"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Job Description</label>
              <textarea
                rows="6"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
                placeholder="Paste the target job description requirements..."
              ></textarea>
            </div>

            {/* Navigation Buttons */}
            <div class="flex items-center justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                class="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
              >
                ← Back
              </button>
              <button
                onClick={handleBeginAnalysis}
                class="px-8 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 shadow-xl shadow-indigo-600/30 transition-all hover:scale-105"
              >
                Begin Analysis →
              </button>
            </div>

          </div>
        )}

        {/* STEP 3: ANALYSIS ANIMATION SEQUENCE */}
        {step === 3 && (
          <div class="py-8 space-y-6 text-center">
            
            <div class="w-16 h-16 mx-auto rounded-full bg-indigo-600/20 border-2 border-indigo-400 border-t-cyan-400 animate-spin flex items-center justify-center">
              <span class="text-xl">🤖</span>
            </div>

            <div class="space-y-2">
              <h4 class="text-lg font-bold text-white font-display">
                {analysisSteps[analysisStepIndex]?.title}
              </h4>
              <p class="text-xs text-slate-400">
                {analysisSteps[analysisStepIndex]?.detail}
              </p>
            </div>

            {/* Step Checkmark List */}
            <div class="max-w-md mx-auto space-y-2 text-left bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              {analysisSteps.map((s, idx) => (
                <div key={idx} class="flex items-center space-x-3 text-xs">
                  {idx < analysisStepIndex ? (
                    <span class="text-emerald-400 font-bold">✓</span>
                  ) : idx === analysisStepIndex ? (
                    <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  ) : (
                    <span class="text-slate-600">○</span>
                  )}
                  <span class={idx <= analysisStepIndex ? 'text-slate-200 font-semibold' : 'text-slate-500'}>
                    {s.title}
                  </span>
                </div>
              ))}
            </div>

            {analysisStepIndex === analysisSteps.length - 1 && (
              <div class="text-sm font-bold text-cyan-300 animate-pulse">
                Your Quest Results Are Ready!
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
