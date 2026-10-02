import React, { useState } from 'react';
import { evaluateMockInterview } from '../utils/api';

export default function InterviewQuest({ questions = [], onAwardXp }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [completedList, setCompletedList] = useState([]);

  const defaultQuestions = questions.length ? questions : [
    { id: 'iq_1', category: 'Technical', question: 'Can you explain your core experience using Python in real-world applications?', context: 'Target role heavily requires strong Python proficiency.', sample_answer_tips: 'Focus on practical project examples, libraries used, and clean code principles.', difficulty: 'Medium' },
    { id: 'iq_2', category: 'Project', question: 'Tell me about your experience with your Student Data Analyzer project. What was your specific technical contribution?', context: 'Recruiters test deep understanding of listed projects.', sample_answer_tips: 'Use STAR method. State your exact role, tech stack, and measurable results.', difficulty: 'Medium' },
    { id: 'iq_3', category: 'Resume', question: 'How did you use SQL in your recent work or academic projects?', context: 'Validates resume evidence in technical skills section.', sample_answer_tips: 'Mention query writing, schema indexing, and database integration.', difficulty: 'Easy' },
    { id: 'iq_4', category: 'JD', question: 'How would you approach the responsibilities outlined in this Python Developer role during your first 30 days?', context: 'Evaluates role alignment and initiative.', sample_answer_tips: 'Break down into onboarding, first feature contribution, and sprint delivery.', difficulty: 'Hard' }
  ];

  const currentQ = defaultQuestions[currentIdx];

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;
    setIsEvaluating(true);

    try {
      const res = await evaluateMockInterview(currentQ.question, userAnswer);
      setFeedback(res);
      setIsEvaluating(false);

      if (!completedList.includes(currentQ.id)) {
        setCompletedList([...completedList, currentQ.id]);
        if (onAwardXp) onAwardXp(150, 'Mock interview question completed');
      }
    } catch (err) {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    setUserAnswer('');
    setFeedback(null);
    setCurrentIdx((prev) => (prev + 1) % defaultQuestions.length);
  };

  return (
    <div class="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div class="flex items-center space-x-2">
            <span class="text-xl">🎤</span>
            <h3 class="text-lg font-bold text-white font-display">INTERVIEW QUEST (MOCK INTERVIEW)</h3>
          </div>
          <p class="text-xs text-slate-400">Interactive AI mock interview asking tailored question-by-question scenarios.</p>
        </div>

        <div class="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          <span class="text-slate-400 font-bold">Question {currentIdx + 1} of {defaultQuestions.length}</span>
          <span class="text-emerald-400 font-bold font-mono">({completedList.length} Answered)</span>
        </div>
      </div>

      {/* QUESTION CARD */}
      <div class="p-6 rounded-2xl bg-slate-900/80 border border-indigo-500/30 space-y-4 relative">
        
        <div class="flex items-center justify-between">
          <span class="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-bold font-mono border border-violet-500/30">
            Category: {currentQ.category}
          </span>
          <span class="text-xs text-slate-400 font-mono">Difficulty: {currentQ.difficulty}</span>
        </div>

        <div>
          <h4 class="text-lg font-bold text-white font-display leading-snug">
            "{currentQ.question}"
          </h4>
          <p class="text-xs text-indigo-300 mt-1">Context: {currentQ.context}</p>
        </div>

        {/* Answer Input */}
        <div class="space-y-2 pt-2">
          <label class="block text-xs font-bold text-slate-300">Your Answer:</label>
          <textarea
            rows="4"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your response here using the STAR method..."
            class="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed font-mono"
          ></textarea>
        </div>

        {/* Submit & Navigation */}
        <div class="flex items-center justify-between pt-2">
          <button
            onClick={handleNextQuestion}
            class="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-800"
          >
            Skip / Next Question →
          </button>
          
          <button
            disabled={!userAnswer.trim() || isEvaluating}
            onClick={handleSubmitAnswer}
            class="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 shadow-lg shadow-indigo-600/30 flex items-center space-x-2"
          >
            {isEvaluating ? (
              <span>Evaluating Answer...</span>
            ) : (
              <span>Submit Answer (+150 XP) →</span>
            )}
          </button>
        </div>

      </div>

      {/* AI EVALUATION FEEDBACK BOX */}
      {feedback && (
        <div class="p-6 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 space-y-4 animate-fadeIn">
          
          <div class="flex items-center justify-between border-b border-indigo-500/30 pb-3">
            <div class="flex items-center space-x-2">
              <span class="text-xl">🤖</span>
              <span class="text-sm font-bold text-white font-display">AI Coach Evaluation</span>
            </div>
            <span
              class={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                feedback.rating === 'Excellent'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}
            >
              {feedback.rating}
            </span>
          </div>

          <p class="text-xs text-slate-200 leading-relaxed font-medium">{feedback.feedback}</p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div class="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-500/30 space-y-1">
              <span class="text-[10px] uppercase font-bold text-emerald-400 block">Strengths</span>
              {feedback.strengths.map((s, idx) => (
                <p key={idx} class="text-slate-300">• {s}</p>
              ))}
            </div>
            <div class="p-3.5 rounded-xl bg-slate-900/80 border border-amber-500/30 space-y-1">
              <span class="text-[10px] uppercase font-bold text-amber-400 block">Improvement Tips</span>
              {feedback.improvement_tips.map((t, idx) => (
                <p key={idx} class="text-slate-300">• {t}</p>
              ))}
            </div>
          </div>

          {feedback.suggested_rewrite && (
            <div class="p-3.5 rounded-xl bg-slate-900 border border-indigo-500/30 text-xs space-y-1">
              <span class="text-[10px] uppercase font-bold text-cyan-300 block">Suggested Answer Polish</span>
              <p class="text-slate-200 font-mono italic">"{feedback.suggested_rewrite}"</p>
            </div>
          )}

          <div class="flex justify-end pt-2">
            <button
              onClick={handleNextQuestion}
              class="px-6 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500"
            >
              Next Mock Question →
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
