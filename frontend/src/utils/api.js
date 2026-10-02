const API_BASE = '/api';

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return await res.json();
  } catch (err) {
    return { status: 'offline', app: 'RESUMEQUEST AI' };
  }
}

export async function fetchDemoPayload() {
  try {
    const res = await fetch(`${API_BASE}/demo`);
    if (!res.ok) throw new Error('Demo fetch failed');
    return await res.json();
  } catch (err) {
    console.warn('API demo fallback active');
    return null;
  }
}

export async function uploadResumeFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/resume/upload`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    let errorMsg = 'Upload failed';
    try {
      const errorData = await res.json();
      errorMsg = errorData.detail || errorMsg;
    } catch (e) {
      errorMsg = `Upload failed (Status ${res.status})`;
    }
    throw new Error(errorMsg);
  }
  return await res.json();
}

export async function analyzeJobDescription(jobTitle, company, jdText) {
  try {
    const res = await fetch(`${API_BASE}/job/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        job_title: jobTitle,
        company: company,
        job_description: jdText
      })
    });
    if (!res.ok) throw new Error('Job analyze failed');
    return await res.json();
  } catch (err) {
    return {
      job_title: jobTitle || 'Python Developer',
      company: company || 'Tech AI Corp',
      required_skills: ['Python', 'SQL', 'Git', 'FastAPI', 'REST API'],
      preferred_skills: ['AWS', 'Docker', 'Kubernetes'],
      responsibilities: ['Build backend services', 'Design database models', 'Write tests'],
      requirements: [
        { id: 'req_1', text: 'Experience with Python', category: 'skill', importance: 'Required' },
        { id: 'req_2', text: 'AWS cloud deployment experience', category: 'skill', importance: 'Preferred' }
      ]
    };
  }
}

export async function startFullAnalysis(docId, jdText, jobTitle = 'Python Developer', weights = null) {
  try {
    const res = await fetch(`${API_BASE}/analysis/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resume_doc_id: docId,
        job_description: jdText,
        job_title: jobTitle,
        weights: weights
      })
    });
    if (!res.ok) throw new Error('Analysis start failed');
    return await res.json();
  } catch (err) {
    console.error('Analysis API fallback', err);
    return null;
  }
}

export async function evaluateMockInterview(question, answer) {
  try {
    const res = await fetch(`${API_BASE}/analysis/interview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question_id: 'iq_1',
        question: question,
        user_answer: answer
      })
    });
    if (!res.ok) throw new Error('Interview eval failed');
    return await res.json();
  } catch (err) {
    const len = answer.trim().split(' ').length;
    if (len < 10) {
      return {
        rating: 'Needs Improvement',
        feedback: 'Your answer is brief. Use the STAR method to provide technical detail.',
        strengths: ['Started addressing topic'],
        improvement_tips: ['Include tools, libraries, and exact role'],
        suggested_rewrite: 'Elaborate with specific technical project actions.'
      };
    }
    return {
      rating: 'Excellent',
      feedback: 'Great technical detail and clear structure!',
      strengths: ['Detailed technical context', 'Clear problem-solving approach'],
      improvement_tips: ['Add quantifiable metric outcome'],
      suggested_rewrite: answer + ' This resulted in 30% improved efficiency.'
    };
  }
}
