from typing import Dict, Any, List

class ScoringEngine:
    """Calculates an explainable match score based on configurable category weights."""

    DEFAULT_WEIGHTS = {
        "skills": 0.40,
        "projects": 0.20,
        "experience": 0.20,
        "education": 0.10,
        "keywords": 0.10
    }

    @classmethod
    def calculate_match_score(
        cls,
        skills_matched_pct: float,
        projects_matched_pct: float,
        experience_matched_pct: float,
        education_matched_pct: float,
        keyword_density_pct: float,
        custom_weights: Dict[str, float] = None
    ) -> tuple[int, Dict[str, int], Dict[str, float]]:

        weights = dict(cls.DEFAULT_WEIGHTS)
        if custom_weights:
            weights.update(custom_weights)
            total = sum(weights.values())
            if total > 0:
                weights = {k: v / total for k, v in weights.items()}

        subscores = {
            "skills": int(round(skills_matched_pct)),
            "projects": int(round(projects_matched_pct)),
            "experience": int(round(experience_matched_pct)),
            "education": int(round(education_matched_pct)),
            "keywords": int(round(keyword_density_pct))
        }

        weighted_score = sum(subscores[k] * weights[k] for k in subscores)
        final_score = int(round(max(0, min(100, weighted_score))))

        return final_score, subscores, weights
