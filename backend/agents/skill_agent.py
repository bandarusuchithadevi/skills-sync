from typing import List, Dict, Any
from backend.analysis.skills import SkillMatcher
from backend.models.schemas import SkillMatrixResponse

class SkillAgent:
    """Agent 4: Skill Matching Agent that maps resume skills against JD requirements."""

    @classmethod
    def evaluate(
        cls,
        resume_skills: List[str],
        jd_required: List[str],
        jd_preferred: List[str],
        sections: Dict[str, str]
    ) -> SkillMatrixResponse:
        return SkillMatcher.match_skills(resume_skills, jd_required, jd_preferred, sections)
