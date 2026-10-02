import os
import sys
from pathlib import Path

# Add project root to sys.path
root_dir = Path(__file__).resolve().parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

import uuid
from fastapi import FastAPI, File, UploadFile, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from typing import Dict, Any, List, Optional

from backend.models.schemas import (

    ResumeUploadResponse, JobAnalyzeRequest, JobAnalyzeResponse,
    AnalysisStartRequest, EvidenceItem, SkillMatrixResponse,
    AtsHealthResponse, DesignDoctorResponse, InterviewFeedbackRequest,
    InterviewFeedbackResponse
)
from backend.agents.resume_agent import ResumeAgent
from backend.agents.job_agent import JobAgent
from backend.agents.evidence_agent import EvidenceAgent
from backend.agents.skill_agent import SkillAgent
from backend.agents.ats_agent import AtsAgent
from backend.agents.design_agent import DesignAgent
from backend.agents.recommendation_agent import RecommendationAgent
from backend.agents.interview_agent import InterviewAgent
from backend.agents.orchestrator import CareerQuestOrchestrator

app = FastAPI(
    title="RESUMEQUEST AI",
    description="Your Resume. Your Target. Your Next Quest. Powered by RAG & Modular AI Agents.",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory document & analysis cache
_RESUME_CACHE: Dict[str, Dict[str, Any]] = {}
_ANALYSIS_HISTORY: List[Dict[str, Any]] = []

# Pre-load realistic Demo dataset
DEMO_RESUME_TEXT = """
SUCHITHA R.
Python & Full-Stack Software Developer
Email: suchitha.dev@example.com | GitHub: github.com/suchitha-dev | LinkedIn: linkedin.com/in/suchitha-dev

PROFESSIONAL SUMMARY
Results-oriented Software Developer with 2+ years of experience engineering data pipelines, web services, and REST APIs using Python, SQL, and Git. Proven ability to build clean, maintainable code and collaborate effectively across Agile software engineering teams.

TECHNICAL SKILLS
- Programming: Python, SQL, JavaScript, HTML, CSS, Java
- Frameworks & Tools: FastAPI, Pandas, NumPy, Git, GitHub, SQLite, PostgreSQL
- Concepts: REST API Design, Data Analysis, Unit Testing, Object-Oriented Programming

PROJECTS
1. Student Data Analyzer (Python, Pandas, SQL)
   - Developed a Python-based data processing application that ingests CSV/SQL datasets and generates automated analytical reports.
   - Optimized database queries using indexing, reducing report generation time by 40%.
   - Wrote comprehensive unit tests ensuring 90%+ code coverage.

2. E-Commerce Backend Service (Python, FastAPI, SQLite)
   - Engineered RESTful API endpoints for product search, user authentication, and order processing.
   - Designed database schemas and integrated JWT token authentication.
   - Managed version control using Git with clean feature branch strategies.

EDUCATION
Bachelor of Engineering in Computer Science | 2020 - 2024
GPA: 3.8 / 4.0
"""

DEMO_JOB_DESCRIPTION = """
Senior Python Developer
Company: NextGen AI Tech

We are seeking an experienced Python Developer to join our core AI product team.

Responsibilities:
- Design, build, and deploy high-performance backend microservices using Python and FastAPI.
- Engineer data extraction, RAG vector search pipelines, and REST API integrations.
- Manage containerized deployments using Docker and Kubernetes on AWS cloud infrastructure.
- Collaborate with frontend engineers and maintain high test coverage.

Requirements:
- Strong hands-on proficiency in Python, REST API development, and SQL database design.
- Experience with version control systems (Git) and automated testing frameworks.
- Required skills: Python, REST API, SQL, Git, FastAPI.
- Preferred skills: AWS, Docker, Kubernetes, RAG Architecture, Vector Databases.
"""

def _init_demo_data():
    doc_id = "demo_doc_1"
    if doc_id not in _RESUME_CACHE:
        parsed = ResumeAgent.process_resume(
            doc_id=doc_id,
            file_bytes=DEMO_RESUME_TEXT.encode("utf-8"),
            filename="Suchitha_Resume.txt"
        )
        _RESUME_CACHE[doc_id] = parsed
        
        # Pre-run full demo analysis
        analysis = CareerQuestOrchestrator.run_full_analysis(
            resume_doc_id=doc_id,
            resume_data=parsed,
            job_title="Python Developer",
            company="NextGen AI Tech",
            jd_text=DEMO_JOB_DESCRIPTION
        )
        _ANALYSIS_HISTORY.insert(0, analysis)

_init_demo_data()

# ==================== API ENDPOINTS ====================

@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": "RESUMEQUEST AI", "rag_engine": "ChromaDB + Local Embedding Fallback"}

@app.get("/api/demo")
def get_demo_payload():
    """Returns pre-loaded demo resume and job description for 1-click Demo Mode."""
    demo_doc_id = "demo_doc_1"
    latest_analysis = _ANALYSIS_HISTORY[0] if _ANALYSIS_HISTORY else None
    return {
        "doc_id": demo_doc_id,
        "resume_name": "Suchitha_Resume.pdf",
        "resume_text": DEMO_RESUME_TEXT,
        "job_title": "Python Developer",
        "company": "NextGen AI Tech",
        "job_description": DEMO_JOB_DESCRIPTION,
        "preloaded_analysis": latest_analysis
    }

@app.post("/api/resume/upload", response_model=ResumeUploadResponse)
async def upload_resume(file: UploadFile = File(...)):
    """POST /resume/upload: Upload PDF/DOCX resume file using multipart/form-data."""
    filename = file.filename or "uploaded_file"
    if not filename.lower().endswith(('.pdf', '.docx', '.doc', '.txt')):
        raise HTTPException(status_code=400, detail="Unsupported file format. Please upload a PDF, DOCX, or TXT file.")
    
    contents = await file.read()
    if not contents or len(contents.strip()) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty. Please select a valid document.")

    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds 10MB limit.")

    doc_id = f"doc_{uuid.uuid4().hex[:8]}"
    try:
        parsed = ResumeAgent.process_resume(doc_id, contents, filename)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process uploaded document: {str(e)}")

    _RESUME_CACHE[doc_id] = parsed

    return ResumeUploadResponse(
        filename=filename,
        content_type=parsed["file_type"],
        pages=parsed["pages"],
        sections_detected=parsed["sections_detected"],
        skills_detected=parsed["skills_detected"],
        projects_detected=parsed["projects_detected"],
        raw_text=parsed["raw_text"],
        doc_id=doc_id
    )

@app.post("/api/job/analyze", response_model=JobAnalyzeResponse)
def analyze_job(payload: JobAnalyzeRequest):
    """POST /job/analyze: Analyze job description text."""
    res = JobAgent.analyze_job(payload.job_title, payload.company, payload.job_description)
    return JobAnalyzeResponse(
        job_title=res["job_title"],
        company=res["company"],
        required_skills=res["required_skills"],
        preferred_skills=res["preferred_skills"],
        responsibilities=res["responsibilities"],
        requirements=res["requirements"]
    )

@app.post("/api/analysis/start")
def start_analysis(payload: AnalysisStartRequest):
    """POST /analysis/start: Execute full RAG & Agent orchestrator pipeline."""
    resume_data = _RESUME_CACHE.get(payload.resume_doc_id)
    if not resume_data:
        raise HTTPException(status_code=404, detail="Uploaded resume document not found. Please re-upload.")

    analysis = CareerQuestOrchestrator.run_full_analysis(
        resume_doc_id=payload.resume_doc_id,
        resume_data=resume_data,
        job_title=payload.job_title or "Software Engineer",
        company="Target Company",
        jd_text=payload.job_description,
        weights=payload.weights
    )

    _ANALYSIS_HISTORY.insert(0, analysis)
    return analysis

@app.post("/api/analysis/skills")
def get_skills_analysis(payload: Dict[str, Any] = Body(...)):
    """POST /analysis/skills: Return skill matrix categorization."""
    doc_id = payload.get("doc_id") or "demo_doc_1"
    resume_data = _RESUME_CACHE.get(doc_id)
    if not resume_data:
        raise HTTPException(status_code=404, detail=f"Resume document '{doc_id}' not found.")
    jd_text = payload.get("job_description", DEMO_JOB_DESCRIPTION)

    job_info = JobAgent.analyze_job("Target Role", "", jd_text)
    return SkillAgent.evaluate(
        resume_data.get("skills_detected", []),
        job_info["required_skills"],
        job_info["preferred_skills"],
        resume_data.get("sections", {})
    )

@app.post("/api/analysis/evidence")
def get_evidence_analysis(payload: Dict[str, Any] = Body(...)):
    """POST /analysis/evidence: Return RAG evidence snippets for requirements."""
    doc_id = payload.get("doc_id") or "demo_doc_1"
    if doc_id not in _RESUME_CACHE:
        raise HTTPException(status_code=404, detail=f"Resume document '{doc_id}' not found.")
    requirement = payload.get("requirement", "Experience with Python")
    
    from backend.rag.retriever import RAGRetriever
    res = RAGRetriever.retrieve_evidence_for_requirement(doc_id, requirement)
    return res

@app.post("/api/analysis/ats")
def get_ats_analysis(payload: Dict[str, Any] = Body(...)):
    """POST /analysis/ats: Return ATS score breakdown."""
    doc_id = payload.get("doc_id") or "demo_doc_1"
    resume_data = _RESUME_CACHE.get(doc_id)
    if not resume_data:
        raise HTTPException(status_code=404, detail=f"Resume document '{doc_id}' not found.")
    return AtsAgent.evaluate(
        resume_data.get("raw_text", ""),
        resume_data.get("sections", {}),
        matched_count=len(resume_data.get("skills_detected", [])),
        total_jd_skills=max(1, len(resume_data.get("skills_detected", [])) + 2)
    )

@app.post("/api/analysis/design")
def get_design_analysis(payload: Dict[str, Any] = Body(...)):
    """POST /analysis/design: Return Design Doctor metrics."""
    doc_id = payload.get("doc_id") or "demo_doc_1"
    resume_data = _RESUME_CACHE.get(doc_id)
    if not resume_data:
        raise HTTPException(status_code=404, detail=f"Resume document '{doc_id}' not found.")
    return DesignAgent.evaluate(
        resume_data.get("raw_text", ""),
        resume_data.get("sections", {}),
        resume_data.get("pages", 1)
    )

@app.post("/api/analysis/recommendations")
def get_recommendations(payload: Dict[str, Any] = Body(...)):
    """POST /analysis/recommendations: Return recommendations & roadmap."""
    doc_id = payload.get("doc_id") or "demo_doc_1"
    resume_data = _RESUME_CACHE.get(doc_id)
    if not resume_data:
        raise HTTPException(status_code=404, detail=f"Resume document '{doc_id}' not found.")
    return RecommendationAgent.generate_recommendations(
        resume_data.get("sections", {}),
        resume_data.get("skills_detected", [])[:4],
        ["Docker", "AWS", "Kubernetes"],
        ["REST API"],
        payload.get("job_title", "Python Developer")
    )

@app.post("/api/analysis/interview", response_model=InterviewFeedbackResponse)
def evaluate_interview_answer(payload: InterviewFeedbackRequest):
    """POST /analysis/interview: Evaluate user mock interview answer."""
    return InterviewAgent.evaluate_answer(payload.question, payload.user_answer)

@app.get("/api/analysis/history")
def get_history():
    """GET /analysis/history: Return list of past analyses."""
    return _ANALYSIS_HISTORY

# Serve frontend build static files if frontend/dist exists
frontend_dist = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
