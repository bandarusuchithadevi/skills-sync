import re
from typing import Dict, List

class ResumeParser:
    """Parses document text into classified resume sections and extracts core entities."""

    SECTION_PATTERNS = {
        'Summary': r'(summary|objective|profile|about me|professional summary)',
        'Skills': r'(skills|technical skills|core competencies|technologies|expertise|tools)',
        'Projects': r'(projects|academic projects|key projects|personal projects)',
        'Experience': r'(experience|work experience|employment|history|professional experience)',
        'Education': r'(education|academic background|qualifications|degrees)',
        'Certifications': r'(certifications|licenses|courses|awards|achievements)'
    }

    KNOWN_SKILLS = [
        "python", "java", "javascript", "typescript", "c++", "c#", "html", "css", "sql", "nosql",
        "react", "angular", "vue", "next.js", "node.js", "express", "fastapi", "flask", "django",
        "aws", "azure", "gcp", "docker", "kubernetes", "git", "github", "gitlab", "ci/cd",
        "rest api", "graphql", "mongodb", "postgresql", "mysql", "sqlite", "redis",
        "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "keras", "opencv",
        "machine learning", "deep learning", "ai", "rag", "langchain", "vector db", "chromadb",
        "agile", "scrum", "jira", "linux", "bash", "powershell", "devops", "microservices"
    ]

    @classmethod
    def parse_sections(cls, text: str) -> Dict[str, str]:
        lines = text.splitlines()
        current_section = "General"
        sections: Dict[str, List[str]] = {current_section: []}

        for line in lines:
            line_str = line.strip()
            if not line_str:
                continue

            # Check if line matches a known section title
            matched_sec = None
            if len(line_str) < 50:
                for sec_name, pattern in cls.SECTION_PATTERNS.items():
                    if re.search(f'^{pattern}:?$', line_str, flags=re.IGNORECASE):
                        matched_sec = sec_name
                        break

            
            if matched_sec:
                current_section = matched_sec
                if current_section not in sections:
                    sections[current_section] = []
            else:
                sections[current_section].append(line_str)

        return {k: "\n".join(v) for k, v in sections.items() if v}

    @classmethod
    def extract_skills(cls, text: str) -> List[str]:
        found = set()
        text_lower = text.lower()
        for skill in cls.KNOWN_SKILLS:
            # Word boundary regex for matching whole words/phrases
            escaped = re.escape(skill)
            if re.search(r'\b' + escaped + r'\b', text_lower):
                # Capitalize nicely
                if len(skill) <= 4:
                    found.add(skill.upper())
                else:
                    found.add(skill.title())
        return sorted(list(found))

    @classmethod
    def extract_projects(cls, text: str) -> List[str]:
        sections = cls.parse_sections(text)
        proj_text = sections.get('Projects', '')
        if not proj_text:
            return []
        
        # Split project entries by bullet points or empty lines
        bullets = re.split(r'[\u2022\u25cf\u2219\*\-]\s*', proj_text)
        projects = [b.strip() for b in bullets if len(b.strip()) > 15]
        return projects[:6]
