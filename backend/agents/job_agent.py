import re
from typing import Dict, Any, List
from backend.models.schemas import RequirementItem

class JobAgent:
    """Agent 2: Analyzes job descriptions, extracting required skills, preferred skills, and requirement items."""

    @classmethod
    def analyze_job(cls, job_title: str, company: str, jd_text: str) -> Dict[str, Any]:
        jd_lower = jd_text.lower()

        # Skill extraction
        known_tech = [
            "Python", "Java", "JavaScript", "TypeScript", "C++", "SQL", "AWS", "Azure", "Docker",
            "Kubernetes", "React", "Node.js", "FastAPI", "Django", "REST API", "GraphQL", "Git",
            "PostgreSQL", "MongoDB", "Redis", "Pandas", "NumPy", "Scikit-Learn", "TensorFlow", "RAG"
        ]

        required_skills = []
        preferred_skills = []

        for skill in known_tech:
            s_lower = skill.lower()
            if s_lower in jd_lower:
                # Determine if required or preferred
                if any(w in jd_lower for w in ["plus", "preferred", "nice to have", "desired"]):
                    preferred_skills.append(skill)
                else:
                    required_skills.append(skill)

        if not required_skills:
            required_skills = ["Python", "SQL", "Git", "REST API"]
        if not preferred_skills:
            preferred_skills = ["AWS", "Docker", "Kubernetes"]

        # Extract structured requirement items
        requirements = []
        req_id = 1

        for skill in required_skills[:5]:
            requirements.append(RequirementItem(
                id=f"req_{req_id}",
                text=f"Experience with {skill}",
                category="skill",
                importance="Required"
            ))
            req_id += 1

        requirements.append(RequirementItem(
            id=f"req_{req_id}",
            text="Ability to collaborate with cross-functional software teams",
            category="responsibility",
            importance="Required"
        ))
        req_id += 1

        for skill in preferred_skills[:3]:
            requirements.append(RequirementItem(
                id=f"req_{req_id}",
                text=f"Familiarity with cloud & containerization tools like {skill}",
                category="skill",
                importance="Preferred"
            ))
            req_id += 1

        return {
            "job_title": job_title or "Target Developer Role",
            "company": company or "Tech Company",
            "required_skills": list(dict.fromkeys(required_skills)),
            "preferred_skills": list(dict.fromkeys(preferred_skills)),
            "responsibilities": [
                "Design, develop, and maintain clean scalable software applications",
                "Integrate backend APIs and manage database operations",
                "Write clear unit tests and documentation"
            ],
            "requirements": requirements
        }
