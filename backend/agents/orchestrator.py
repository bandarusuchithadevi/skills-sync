import datetime
import uuid
from typing import Dict, Any, Optional

from backend.agents.resume_agent import ResumeAgent
from backend.agents.job_agent import JobAgent
from backend.agents.evidence_agent import EvidenceAgent
from backend.agents.skill_agent import SkillAgent
from backend.agents.ats_agent import AtsAgent
from backend.agents.design_agent import DesignAgent
from backend.agents.recommendation_agent import RecommendationAgent
from backend.agents.interview_agent import InterviewAgent
from backend.analysis.scoring import ScoringEngine

class CareerQuestOrchestrator:
    """Main Orchestrator Agent that coordinates all 8 specialized sub-agents to deliver a complete quest report."""

    @classmethod
    def run_full_analysis(
        cls,
        resume_doc_id: str,
        resume_data: Dict[str, Any],
        job_title: str,
        company: str,
        jd_text: str,
        weights: Optional[Dict[str, float]] = None
    ) -> Dict[str, Any]:

        # 1. Job Agent Analysis
        job_analysis = JobAgent.analyze_job(job_title, company, jd_text)
        
        # 2. Skill Agent Evaluation
        sections = resume_data.get("sections", {})
        resume_skills = resume_data.get("skills_detected", [])
        jd_required = job_analysis["required_skills"]
        jd_preferred = job_analysis["preferred_skills"]

        skill_matrix = SkillAgent.evaluate(resume_skills, jd_required, jd_preferred, sections)

        # 3. Evidence Agent RAG Search
        evidence_list = EvidenceAgent.get_all_evidence(resume_doc_id, job_analysis["requirements"])

        # 4. ATS Agent Scan
        matched_count = len(skill_matrix.matched)
        total_jd = max(1, len(jd_required) + len(jd_preferred))
        ats_report = AtsAgent.evaluate(resume_data.get("raw_text", ""), sections, matched_count, total_jd)

        # 5. Design Agent Scan
        design_report = DesignAgent.evaluate(resume_data.get("raw_text", ""), sections, resume_data.get("pages", 1))

        # 6. Scoring Engine
        skills_matched_pct = (matched_count / total_jd) * 100
        projects_matched_pct = 81.0 if resume_data.get("projects_detected") else 60.0
        experience_matched_pct = 75.0 if 'Experience' in sections else 55.0
        education_matched_pct = 95.0 if 'Education' in sections else 70.0
        keyword_density_pct = ats_report.keyword_alignment

        final_score, score_breakdown, applied_weights = ScoringEngine.calculate_match_score(
            skills_matched_pct,
            projects_matched_pct,
            experience_matched_pct,
            education_matched_pct,
            keyword_density_pct,
            custom_weights=weights
        )

        # 7. Recommendation Agent
        matched_names = [s.name for s in skill_matrix.matched]
        missing_names = [s.name for s in skill_matrix.missing]
        partial_names = [s.name for s in skill_matrix.partial]

        recs = RecommendationAgent.generate_recommendations(
            sections,
            matched_names,
            missing_names,
            partial_names,
            job_analysis["job_title"]
        )

        # 8. Interview Preparation Agent
        interview_qs = InterviewAgent.generate_questions(
            job_analysis["job_title"],
            matched_names,
            resume_data.get("projects_detected", [])
        )

        analysis_id = f"quest_{uuid.uuid4().hex[:8]}"
        created_at = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")

        # Calculate initial XP (+100 XP for analysis completed)
        xp_earned = 100

        return {
            "analysis_id": analysis_id,
            "created_at": created_at,
            "resume_doc_id": resume_doc_id,
            "resume_name": resume_data.get("filename", "Resume.pdf"),
            "job_title": job_analysis["job_title"],
            "job_match_score": final_score,
            "score_breakdown": score_breakdown,
            "weights": applied_weights,
            "xp_earned": xp_earned,
            "skills": skill_matrix,
            "evidence_list": evidence_list,
            "ats": ats_report,
            "design": design_report,
            "wordings": recs["wordings"],
            "quests": recs["quests"],
            "recommendations": recs["recommendations"],
            "skill_gaps": recs["skill_gaps"],
            "recruiter_snapshot": recs["recruiter_snapshot"],
            "interview_questions": interview_qs
        }
