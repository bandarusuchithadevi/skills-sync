from typing import Dict, Any
from backend.analysis.ats import AtsAnalyzer
from backend.models.schemas import AtsHealthResponse

class AtsAgent:
    """Agent 5: ATS Analyzer Agent."""

    @classmethod
    def evaluate(cls, raw_text: str, sections: Dict[str, str], matched_count: int, total_jd_skills: int) -> AtsHealthResponse:
        return AtsAnalyzer.analyze(raw_text, sections, matched_count, total_jd_skills)
