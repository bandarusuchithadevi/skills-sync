from typing import List, Dict, Any
from backend.models.schemas import SkillItem, SkillMatrixResponse

class SkillMatcher:
    """Categorizes skills into MATCHED, PARTIAL, and MISSING with evidence links."""

    RELATED_MAP = {
        "aws": ["cloud", "azure", "gcp", "docker", "devops"],
        "docker": ["kubernetes", "containers", "ci/cd", "aws"],
        "rest api": ["graphql", "fastapi", "express", "node.js", "http"],
        "python": ["django", "fastapi", "pandas", "numpy", "data analysis"],
        "sql": ["postgresql", "mysql", "sqlite", "nosql", "database"],
        "react": ["javascript", "typescript", "frontend", "vue", "next.js"],
        "kubernetes": ["docker", "containers", "microservices"]
    }

    @classmethod
    def match_skills(
        cls,
        resume_skills: List[str],
        jd_required: List[str],
        jd_preferred: List[str],
        sections: Dict[str, str]
    ) -> SkillMatrixResponse:
        resume_skills_lower = {s.lower(): s for s in resume_skills}
        matched_items = []
        partial_items = []
        missing_items = []

        all_jd_skills = list(dict.fromkeys(jd_required + jd_preferred))

        for jd_skill in all_jd_skills:
            jd_lower = jd_skill.lower()
            category = "Required" if jd_skill in jd_required else "Preferred"

            # Check direct exact match (case-insensitive)
            if jd_lower in resume_skills_lower or any(r.lower() == jd_lower for r in resume_skills_lower):
                matched_name = resume_skills_lower.get(jd_lower, jd_skill)
                evidence = cls._find_evidence_snippet(matched_name, sections)
                matched_items.append(SkillItem(
                    name=jd_skill,
                    status="MATCHED",
                    category=category,
                    resume_evidence=evidence,
                    jd_requirement=f"Strong {jd_skill} experience required for key project deliverables.",
                    match_type="Exact",
                    confidence=94.5
                ))
            else:
                # Check for partial / related skills in resume
                related_candidates = cls.RELATED_MAP.get(jd_lower, [])
                found_related = [r for r in related_candidates if r in resume_skills_lower]

                if found_related:
                    rel_skill = resume_skills_lower[found_related[0]]
                    partial_items.append(SkillItem(
                        name=jd_skill,
                        status="PARTIAL",
                        category=category,
                        resume_evidence=f"Demonstrated related skill in resume: '{rel_skill}'",
                        jd_requirement=f"Hands-on experience with {jd_skill} or related infrastructure tools.",
                        match_type="Related",
                        confidence=68.0
                    ))
                else:
                    missing_items.append(SkillItem(
                        name=jd_skill,
                        status="MISSING",
                        category=category,
                        resume_evidence="No evidence found in uploaded resume.",
                        jd_requirement=f"Required proficiency in {jd_skill}.",
                        match_type="Missing",
                        confidence=0.0
                    ))


        # Add additional resume skills as matched if relevant
        for r_skill_lower, r_skill_orig in resume_skills_lower.items():
            if r_skill_orig not in [m.name for m in matched_items + partial_items]:
                matched_items.append(SkillItem(
                    name=r_skill_orig,
                    status="MATCHED",
                    category="Additional Demonstrated",
                    resume_evidence=cls._find_evidence_snippet(r_skill_orig, sections),
                    jd_requirement="Bonus skill present on candidate resume.",
                    match_type="Demonstrated",
                    confidence=90.0
                ))

        return SkillMatrixResponse(
            matched=matched_items,
            partial=partial_items,
            missing=missing_items
        )

    @staticmethod
    def _find_evidence_snippet(skill_name: str, sections: Dict[str, str]) -> str:
        s_lower = skill_name.lower()
        for sec_name, content in sections.items():
            for line in content.splitlines():
                if s_lower in line.lower() and len(line.strip()) > 15:
                    return line.strip()
        return f"Explicitly listed under technical competencies in candidate resume."
