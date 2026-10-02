from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ResumeUploadResponse(BaseModel):
    filename: str
    content_type: str
    pages: int
    sections_detected: List[str]
    skills_detected: List[str]
    projects_detected: List[str]
    raw_text: str
    doc_id: str

class JobAnalyzeRequest(BaseModel):
    job_title: Optional[str] = "Target Role"
    company: Optional[str] = ""
    job_description: str

class RequirementItem(BaseModel):
    id: str
    text: str
    category: str  # skill, experience, qualification, responsibility
    importance: str  # Required, Preferred

class JobAnalyzeResponse(BaseModel):
    job_title: str
    company: str
    required_skills: List[str]
    preferred_skills: List[str]
    responsibilities: List[str]
    requirements: List[RequirementItem]

class AnalysisStartRequest(BaseModel):
    resume_doc_id: str
    job_description: str
    job_title: Optional[str] = "Software Engineer"
    weights: Optional[Dict[str, float]] = None

class EvidenceItem(BaseModel):
    requirement: str
    matched: bool
    status: str  # MATCHED, PARTIAL, NOT FOUND
    resume_evidence: str
    source_section: str
    source_page: int
    confidence: float
    matched_keywords: List[str] = []

class SkillItem(BaseModel):
    name: str
    status: str  # MATCHED, PARTIAL, MISSING
    category: str
    resume_evidence: Optional[str] = None
    jd_requirement: Optional[str] = None
    match_type: Optional[str] = "Exact"  # Exact, Related, Missing
    confidence: float = 0.0

class SkillMatrixResponse(BaseModel):
    matched: List[SkillItem]
    partial: List[SkillItem]
    missing: List[SkillItem]

class AtsCheckItem(BaseModel):
    category: str
    status: str  # GOOD, NEEDS_ATTENTION, POTENTIAL_ISSUE
    title: str
    description: str

class AtsHealthResponse(BaseModel):
    overall_score: int
    keyword_alignment: int
    structure_score: int
    readability_score: int
    formatting_score: int
    section_recognition: int
    checks: List[AtsCheckItem]

class DesignMetric(BaseModel):
    name: str
    score: int
    status: str

class DesignDoctorResponse(BaseModel):
    overall_score: int
    metrics: List[DesignMetric]
    doctor_notes: List[Dict[str, str]]

class WordingImprovement(BaseModel):
    id: str
    section: str
    before: str
    after: str
    why: str
    truthful_note: str
    status: str = "pending"  # pending, accepted, rejected

class ImprovementQuest(BaseModel):
    id: str
    title: str
    category: str
    difficulty: str  # Easy, Medium, Hard
    xp: int
    estimated_time: str
    description: str
    completed: bool = False

class LearningSkill(BaseModel):
    skill: str
    jd_importance: str
    resume_evidence: str
    recommendation: str
    timeline_week: int
    resources: List[str]

class RecruiterSnapshot(BaseModel):
    top_strengths: List[str]
    relevant_skills: List[str]
    top_project: str
    perceived_gaps: List[str]
    hard_to_find_info: List[str]

class InterviewQuestion(BaseModel):
    id: str
    category: str  # Technical, Resume, Project, JD, HR
    question: str
    context: str
    sample_answer_tips: str
    difficulty: str

class AnalysisResult(BaseModel):
    analysis_id: str
    created_at: str
    resume_doc_id: str
    resume_name: str
    job_title: str
    job_match_score: int
    score_breakdown: Dict[str, int]
    weights: Dict[str, float]
    xp_earned: int
    skills: SkillMatrixResponse
    evidence_list: List[EvidenceItem]
    ats: AtsHealthResponse
    design: DesignDoctorResponse
    wordings: List[WordingImprovement]
    quests: List[ImprovementQuest]
    recommendations: Dict[str, List[str]]
    skill_gaps: List[LearningSkill]
    recruiter_snapshot: RecruiterSnapshot
    interview_questions: List[InterviewQuestion]

class InterviewFeedbackRequest(BaseModel):
    question_id: str
    question: str
    user_answer: str

class InterviewFeedbackResponse(BaseModel):
    rating: str  # Excellent, Good, Needs Improvement
    feedback: str
    strengths: List[str]
    improvement_tips: List[str]
    suggested_rewrite: str
