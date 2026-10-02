import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroLanding from './components/HeroLanding';
import OnboardingFlow from './components/OnboardingFlow';
import ScoreCard from './components/ScoreCard';
import SkillMatrix from './components/SkillMatrix';
import EvidenceLab from './components/EvidenceLab';
import AtsHealth from './components/AtsHealth';
import DesignDoctor from './components/DesignDoctor';
import ContentDoctor from './components/ContentDoctor';
import NextQuest from './components/NextQuest';
import LearningRoadmap from './components/LearningRoadmap';
import RecruiterSnapshot from './components/RecruiterSnapshot';
import InterviewQuest from './components/InterviewQuest';
import MultiJobCompare from './components/MultiJobCompare';
import QuestHistory from './components/QuestHistory';
import { fetchDemoPayload } from './utils/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('hero'); // hero, dashboard, skills, evidence, ats, design, content, quests, roadmap, interview, snapshot, compare, history
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // XP & Gamification State
  const [xp, setXp] = useState(720);
  const [toastMessage, setToastMessage] = useState(null);

  // Active Analysis State
  const [analysis, setAnalysis] = useState(null);
  const [resumeText, setResumeText] = useState('');

  // Toast notification helper
  const notifyXp = (amount, reason) => {
    setXp((prev) => prev + amount);
    setToastMessage(`⚡ +${amount} XP Earned! ${reason}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Run 1-Click Demo Mode
  const handleRunDemo = async () => {
    setShowOnboarding(false);
    const demo = await fetchDemoPayload();
    if (demo && demo.preloaded_analysis) {
      setAnalysis(demo.preloaded_analysis);
      setResumeText(demo.resume_text || '');
    } else {
      // Fallback demo object
      setAnalysis({
        job_match_score: 82,
        job_title: 'Python Developer',
        resume_name: 'Suchitha_Resume.pdf',
        score_breakdown: { skills: 84, projects: 81, experience: 68, education: 95, keywords: 76 },
        skills: {
          matched: [
            { name: 'Python', status: 'MATCHED', resume_evidence: 'Developed a Python-based data processing application using Pandas.', jd_requirement: 'Strong Python programming experience required.', match_type: 'Exact', confidence: 94.5 },
            { name: 'SQL', status: 'MATCHED', resume_evidence: 'Optimized SQL database queries using indexing, reducing report generation time by 40%.', jd_requirement: 'SQL database design and query optimization.', match_type: 'Exact', confidence: 91.0 },
            { name: 'Git', status: 'MATCHED', resume_evidence: 'Managed version control using Git with clean feature branch strategies.', jd_requirement: 'Experience with version control systems (Git).', match_type: 'Exact', confidence: 95.0 },
            { name: 'FastAPI', status: 'MATCHED', resume_evidence: 'Engineered RESTful API endpoints for product search using FastAPI.', jd_requirement: 'Backend API microservices built using FastAPI.', match_type: 'Exact', confidence: 92.0 }
          ],
          partial: [
            { name: 'REST API', status: 'PARTIAL', resume_evidence: 'Demonstrated related API development experience.', jd_requirement: 'RESTful microservice design.', match_type: 'Related', confidence: 68.0 }
          ],
          missing: [
            { name: 'Docker', status: 'MISSING', resume_evidence: 'No supporting evidence found in uploaded resume.', jd_requirement: 'Docker containerization experience.', match_type: 'Missing', confidence: 0.0 },
            { name: 'AWS', status: 'MISSING', resume_evidence: 'No supporting evidence found in uploaded resume.', jd_requirement: 'AWS cloud deployment.', match_type: 'Missing', confidence: 0.0 }
          ]
        },
        evidence_list: [
          { requirement: 'Experience with Python', matched: true, status: 'MATCHED', resume_evidence: 'Developed a Python-based data processing application using Pandas and NumPy.', source_section: 'Projects', source_page: 1, confidence: 94.5 },
          { requirement: 'SQL database query optimization', matched: true, status: 'MATCHED', resume_evidence: 'Optimized SQL database queries using indexing, reducing report generation time by 40%.', source_section: 'Projects', source_page: 1, confidence: 91.0 },
          { requirement: 'AWS cloud deployment experience', matched: false, status: 'NOT FOUND', resume_evidence: 'No supporting evidence found in uploaded resume.', source_section: 'None', source_page: 1, confidence: 0.0 }
        ]
      });
    }
    setActiveTab('dashboard');
    notifyXp(100, 'Demo Mode Quest Analyzed');
  };

  const handleAnalysisComplete = (newAnalysis) => {
    setShowOnboarding(false);
    if (newAnalysis) {
      setAnalysis(newAnalysis);
    }
    setActiveTab('dashboard');
    notifyXp(100, 'First Analysis Quest Completed');
  };

  return (
    <div class="min-h-screen flex flex-col font-sans">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div class="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 border border-violet-400/40 text-white text-xs font-bold shadow-2xl animate-bounce flex items-center space-x-2">
          <span>⚡</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        xp={xp}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onStartOnboarding={() => setShowOnboarding(true)}
        onRunDemo={handleRunDemo}
      />

      {/* Main Content Area */}
      <main class="flex-grow">
        
        {/* LANDING PAGE HERO VIEW */}
        {activeTab === 'hero' && (
          <HeroLanding
            onStartQuest={() => setShowOnboarding(true)}
            onExploreDemo={handleRunDemo}
          />
        )}

        {/* ONBOARDING MODAL FLOW */}
        {showOnboarding && (
          <OnboardingFlow
            onCancel={() => setShowOnboarding(false)}
            onAnalysisComplete={handleAnalysisComplete}
          />
        )}

        {/* DASHBOARD QUEST VIEW */}
        {activeTab !== 'hero' && (
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            
            {/* Top Greeting Header */}
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div>
                <span class="text-xs font-bold text-slate-400">YOUR CAREER QUEST</span>
                <h2 class="text-xl font-extrabold text-white font-display flex items-center space-x-2">
                  <span>Good morning 👋</span>
                </h2>
                <div class="flex items-center space-x-3 text-xs text-slate-300 mt-1">
                  <span>Target Role: <strong class="text-cyan-300 font-display">{analysis?.job_title || 'Python Developer'}</strong></span>
                  <span>•</span>
                  <span>Resume: <strong class="text-indigo-300 font-mono">{analysis?.resume_name || 'Suchitha_Resume.pdf'}</strong></span>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <button
                  onClick={() => setShowOnboarding(true)}
                  class="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-xs font-bold text-indigo-300 transition-all"
                >
                  + Upload New Resume
                </button>
              </div>
            </div>

            {/* TAB CONTENT RENDERER */}
            {activeTab === 'dashboard' && (
              <div class="space-y-8">
                <ScoreCard
                  matchScore={analysis?.job_match_score || 82}
                  subscores={analysis?.score_breakdown}
                  weights={analysis?.weights}
                />
                <RecruiterSnapshot snapshot={analysis?.recruiter_snapshot} />
                <SkillMatrix skills={analysis?.skills} />
                <NextQuest quests={analysis?.quests} onCompleteQuest={(amt, reason) => notifyXp(amt, reason)} />
              </div>
            )}

            {activeTab === 'skills' && <SkillMatrix skills={analysis?.skills} />}

            {activeTab === 'evidence' && (
              <EvidenceLab
                evidenceList={analysis?.evidence_list}
                resumeText={resumeText}
              />
            )}

            {activeTab === 'ats' && <AtsHealth atsData={analysis?.ats} />}

            {activeTab === 'design' && <DesignDoctor designData={analysis?.design} />}

            {activeTab === 'content' && (
              <ContentDoctor
                wordings={analysis?.wordings}
                onAwardXp={(amt, reason) => notifyXp(amt, reason)}
              />
            )}

            {activeTab === 'quests' && (
              <NextQuest
                quests={analysis?.quests}
                onCompleteQuest={(amt, reason) => notifyXp(amt, reason)}
              />
            )}

            {activeTab === 'roadmap' && <LearningRoadmap skillGaps={analysis?.skill_gaps} />}

            {activeTab === 'interview' && (
              <InterviewQuest
                questions={analysis?.interview_questions}
                onAwardXp={(amt, reason) => notifyXp(amt, reason)}
              />
            )}

            {activeTab === 'snapshot' && <RecruiterSnapshot snapshot={analysis?.recruiter_snapshot} />}

            {activeTab === 'compare' && <MultiJobCompare />}

            {activeTab === 'history' && <QuestHistory onLoadAnalysis={(item) => setAnalysis(item)} />}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer class="py-8 border-t border-slate-900 bg-slate-950 text-center text-xs text-slate-500">
        <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center space-x-2">
            <span class="font-bold text-slate-300 font-display">RESUMEQUEST AI</span>
            <span>— Turn Your Resume Into Your Next Opportunity</span>
          </div>
          <div class="flex items-center space-x-4">
            <span>RAG Architecture</span>
            <span>•</span>
            <span>ChromaDB Vector Store</span>
            <span>•</span>
            <span>Modular AI Agents</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
