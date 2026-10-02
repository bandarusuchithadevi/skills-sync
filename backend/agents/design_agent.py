from typing import Dict, Any
from backend.analysis.design import DesignDoctor
from backend.models.schemas import DesignDoctorResponse

class DesignAgent:
    """Agent 6: Resume Design Analyzer Agent."""

    @classmethod
    def evaluate(cls, raw_text: str, sections: Dict[str, str], pages: int) -> DesignDoctorResponse:
        return DesignDoctor.analyze(raw_text, sections, pages)
