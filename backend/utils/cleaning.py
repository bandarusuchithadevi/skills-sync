import re

def clean_text(text: str) -> str:
    """Normalize whitespace and remove non-printable characters."""
    if not text:
        return ""
    # Replace multiple newlines or tabs with normalized spaces
    text = re.sub(r'[\r\n\t]+', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def extract_section_headers(text: str) -> list[str]:
    """Extract candidate section headers from text."""
    known_sections = [
        "summary", "objective", "professional summary", "about me",
        "skills", "technical skills", "core competencies", "tools & technologies",
        "experience", "work experience", "professional experience", "employment history",
        "projects", "personal projects", "academic projects", "key projects",
        "education", "academic background", "degrees",
        "certifications", "licenses & certifications", "achievements", "awards"
    ]
    lines = [line.strip().lower() for line in text.splitlines() if line.strip()]
    found = []
    for line in lines:
        cleaned_line = re.sub(r'[^a-z0-9 ]', '', line).strip()
        if cleaned_line in known_sections:
            found.append(line.title())
    return list(dict.fromkeys(found))
