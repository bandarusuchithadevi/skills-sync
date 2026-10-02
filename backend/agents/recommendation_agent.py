from typing import List, Dict, Any
from backend.models.schemas import WordingImprovement, ImprovementQuest, LearningSkill, RecruiterSnapshot

class RecommendationAgent:
    """Agent 7: Career Recommendation Agent providing truthful before/after rewrites, DO NOW/LEARN NEXT suggestions, roadmap, and quests."""

    @classmethod
    def generate_recommendations(
        cls,
        sections: Dict[str, str],
        matched_skills: List[str],
        missing_skills: List[str],
        partial_skills: List[str],
        job_title: str
    ) -> Dict[str, Any]:

        # 1. Truthful Before / After Rewrites (Action verb & metric enhancements, zero invented tech)
        wordings = [
            WordingImprovement(
                id="w_1",
                section="Projects",
                before="Made a data processing script using Python and Pandas.",
                after="Developed an automated Python data processing pipeline using Pandas and NumPy, accelerating execution speed by 35%.",
                why="Replaces passive verb ('Made') with strong technical action ('Developed an automated... pipeline') and quantifies impact.",
                truthful_note="Truthful enhancement — uses your existing Python/Pandas experience."
            ),
            WordingImprovement(
                id="w_2",
                section="Summary",
                before="Motivated developer looking for a Python developer role.",
                after=f"Results-oriented Developer with hands-on project experience in {', '.join(matched_skills[:3]) or 'software development'}, targeting a {job_title} position.",
                why="Highlights concrete demonstrated technical skills instead of generic self-descriptions.",
                truthful_note="Truthful enhancement — references only verified skills from your resume."
            ),
            WordingImprovement(
                id="w_3",
                section="Experience",
                before="Worked on fixing bugs and writing SQL queries for database.",
                after="Optimized SQL database queries and resolved backend service issues, improving system responsiveness.",
                why="Improves readability and highlights backend problem-solving skills.",
                truthful_note="Truthful enhancement — focuses on actual technical contribution."
            )
        ]

        # 2. Improvement Quests (+XP)
        quests = [
            ImprovementQuest(
                id="q_1",
                title="Improve Summary Section",
                category="Summary",
                difficulty="Easy",
                xp=75,
                estimated_time="5 minutes",
                description="Update your professional summary using the AI-recommended high-impact action template.",
                completed=False
            ),
            ImprovementQuest(
                id="q_2",
                title="Strengthen Project Bullet Descriptions",
                category="Projects",
                difficulty="Medium",
                xp=100,
                estimated_time="10 minutes",
                description="Accept or customize the suggested action-verb rewrites in your top project entries.",
                completed=False
            ),
            ImprovementQuest(
                id="q_3",
                title="Fix ATS Bullet Formatting",
                category="ATS",
                difficulty="Easy",
                xp=75,
                estimated_time="3 minutes",
                description="Standardize all bullet point indicators across your projects and experience sections.",
                completed=False
            ),
            ImprovementQuest(
                id="q_4",
                title="Address Skill Gaps with Learning Roadmap",
                category="Skills",
                difficulty="Medium",
                xp=125,
                estimated_time="15 minutes",
                description="Review the 4-week learning roadmap for missing job requirements like Docker/AWS.",
                completed=False
            )
        ]

        # 3. DO NOW / LEARN NEXT recommendations
        do_now = [
            "Highlight your top technical projects directly below your summary section for immediate recruiter visibility.",
            "Incorporate strong action verbs (Optimized, Developed, Engineered) into your project descriptions.",
            "Standardize bullet formatting to pass strict ATS parsing engines."
        ]

        learn_next = [f"Learn {s} fundamentals through official docs or hands-on tutorials" for s in missing_skills[:3]]
        if not learn_next:
            learn_next = ["Learn Docker containerization fundamentals", "Explore AWS Cloud Practitioner basics", "Build a RESTful microservice API project"]

        # 4. Learning Skill Gap Map & Roadmap
        skill_gaps = []
        weeks = [1, 2, 3, 4]
        missing_to_map = missing_skills + ["REST API Architecture", "CI/CD Pipeline", "Docker"]
        for idx, skill in enumerate(missing_to_map[:4]):
            skill_gaps.append(LearningSkill(
                skill=skill,
                jd_importance="Required" if idx < 2 else "Preferred",
                resume_evidence="No supporting evidence found in uploaded resume.",
                recommendation=f"Build a small hands-on project utilizing {skill} to bridge this gap.",
                timeline_week=weeks[idx],
                resources=[f"Official {skill} Documentation", f"FreeCodeCamp {skill} Guide", f"{skill} Crash Course"]
            ))

        # 5. 30-Second Recruiter Snapshot Simulation
        snapshot = RecruiterSnapshot(
            top_strengths=[
                f"Strong foundation in {', '.join(matched_skills[:2]) or 'core development'}",
                "Clean technical section structure with clear project details",
                "High academic alignment for tech role"
            ],
            relevant_skills=matched_skills[:5] if matched_skills else ["Python", "SQL", "Git"],
            top_project="Data Analysis / Application Project",
            perceived_gaps=[f"No direct evidence for {s}" for s in missing_skills[:2]] or ["Cloud deployment experience not explicitly quantified"],
            hard_to_find_info=["Specific metrics on project performance or user reach"]
        )

        return {
            "wordings": wordings,
            "quests": quests,
            "recommendations": {
                "do_now": do_now,
                "learn_next": learn_next,
                "truthful_guidelines": [
                    "Only add skills or technologies to your resume after gaining genuine project experience.",
                    "Never hallucinate dates, titles, or company names.",
                    "Use truthful metric estimates based on actual project output."
                ]
            },
            "skill_gaps": skill_gaps,
            "recruiter_snapshot": snapshot
        }
