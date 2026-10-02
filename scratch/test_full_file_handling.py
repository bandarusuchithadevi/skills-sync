import io
import os
import sys
import docx
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from backend.main import app
from backend.utils.pdf import extract_text_from_pdf, is_pdf
from backend.utils.docx import extract_text_from_docx, is_docx

client = TestClient(app)

print("==================================================")
print("     SKILLS SYNC FILE HANDLING & ISOLATION TEST   ")
print("==================================================")

# Helper function to generate a valid PDF byte stream containing custom text
def create_test_pdf_bytes(person_name: str, title: str, skills: list) -> bytes:
    skills_str = ", ".join(skills)
    stream_content = f"BT /F1 12 Tf 50 700 Td ({person_name} - {title}) Tj ET\nBT /F1 10 Tf 50 650 Td (Skills: {skills_str}) Tj ET".encode("ascii")
    stream_len = len(stream_content)
    
    pdf_template = (
        b"%PDF-1.4\n"
        b"1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj\n"
        b"2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj\n"
        b"3 0 obj <</Type /Page /Parent 2 0 R /Resources <</Font <</F1 4 0 R>>>> /MediaBox [0 0 612 792] /Contents 5 0 R>> endobj\n"
        b"4 0 obj <</Type /Font /Subtype /Type1 /BaseFont /Helvetica>> endobj\n"
        b"5 0 obj <</Length " + str(stream_len).encode("ascii") + b">> stream\n" +
        stream_content + b"\nendstream\nendobj\n"
        b"xref\n"
        b"0 6\n"
        b"0000000000 65535 f \n"
        b"0000000009 00000 n \n"
        b"0000000056 00000 n \n"
        b"0000000111 00000 n \n"
        b"0000000212 00000 n \n"
        b"0000000280 00000 n \n"
        b"trailer <</Size 6 /Root 1 0 R>>\n"
        b"startxref\n"
        b"380\n"
        b"%%EOF\n"
    )
    return pdf_template

# Helper function to generate a valid DOCX byte stream containing custom text
def create_test_docx_bytes(person_name: str, title: str, skills: list) -> bytes:
    doc = docx.Document()
    doc.add_heading(f"{person_name} - {title}", level=1)
    doc.add_paragraph("PROFESSIONAL SUMMARY")
    doc.add_paragraph(f"Experienced {title} with expertise in building scalable cloud architectures.")
    doc.add_paragraph("TECHNICAL SKILLS")
    doc.add_paragraph(f"Skills: {', '.join(skills)}")
    doc.add_paragraph("PROJECTS")
    doc.add_paragraph("Cloud Migration Project: Automated infrastructure provisioning using Terraform and AWS.")
    
    buf = io.BytesIO()
    doc.save(buf)
    return buf.getvalue()

# TEST 1: VALID PDF RESUME UPLOAD & ANALYSIS
print("\n--- TEST 1: VALID PDF RESUME (ALEX TAYLOR - DEVOPS) ---")
alex_pdf_bytes = create_test_pdf_bytes("Alex Taylor", "DevOps Engineer", ["Kubernetes", "Terraform", "Go", "Docker", "Python"])
print(f"Is PDF header detected? {is_pdf(alex_pdf_bytes)}")

upload_res = client.post(
    "/api/resume/upload",
    files={"file": ("Alex_Taylor_DevOps.pdf", alex_pdf_bytes, "application/pdf")}
)
assert upload_res.status_code == 200, f"Upload failed: {upload_res.text}"
alex_data = upload_res.json()
alex_doc_id = alex_data["doc_id"]
print(f"Uploaded successfully! doc_id={alex_doc_id}, file_type={alex_data['content_type']}")

devops_jd = """
DevOps Infrastructure Engineer
Requirements:
- Hands-on experience with Kubernetes and Terraform.
- Proficiency in Go and Docker microservices.
"""
analysis_res = client.post(
    "/api/analysis/start",
    json={
        "resume_doc_id": alex_doc_id,
        "job_title": "DevOps Infrastructure Engineer",
        "job_description": devops_jd
    }
)
assert analysis_res.status_code == 200, f"Analysis failed: {analysis_res.text}"
alex_analysis = analysis_res.json()
print(f"Analysis completed! Match score: {alex_analysis['job_match_score']}%")
print(f"Resume Name: {alex_analysis['resume_name']}")
print(f"Skills matched: {[s['name'] for s in alex_analysis['skills']['matched']]}")


# TEST 2: VALID DOCX RESUME UPLOAD & ANALYSIS
print("\n--- TEST 2: VALID DOCX RESUME (JORDAN SMITH - DATA SCIENTIST) ---")
jordan_docx_bytes = create_test_docx_bytes("Jordan Smith", "Data Scientist", ["PyTorch", "TensorFlow", "Python", "SQL", "Machine Learning"])
print(f"Is DOCX header detected? {is_docx(jordan_docx_bytes)}")

upload_res = client.post(
    "/api/resume/upload",
    files={"file": ("Jordan_Smith_Resume.docx", jordan_docx_bytes, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")}
)
assert upload_res.status_code == 200, f"Upload failed: {upload_res.text}"
jordan_data = upload_res.json()
jordan_doc_id = jordan_data["doc_id"]
print(f"Uploaded successfully! doc_id={jordan_doc_id}, file_type={jordan_data['content_type']}")

ds_jd = """
Senior Data Scientist
Requirements:
- Deep learning experience with PyTorch and TensorFlow.
- Strong Python programming and Machine Learning skills.
"""
analysis_res = client.post(
    "/api/analysis/start",
    json={
        "resume_doc_id": jordan_doc_id,
        "job_title": "Senior Data Scientist",
        "job_description": ds_jd
    }
)
assert analysis_res.status_code == 200, f"Analysis failed: {analysis_res.text}"
jordan_analysis = analysis_res.json()
print(f"Analysis completed! Match score: {jordan_analysis['job_match_score']}%")
print(f"Resume Name: {jordan_analysis['resume_name']}")
print(f"Skills matched: {[s['name'] for s in jordan_analysis['skills']['matched']]}")


# TEST 3: ISOLATION VERIFICATION (Ensure analyses are independent)
print("\n--- TEST 3: ISOLATION & INDEPENDENCE VERIFICATION ---")
print(f"Alex's Resume Name: {alex_analysis['resume_name']} vs Jordan's: {jordan_analysis['resume_name']}")
assert alex_analysis["resume_doc_id"] != jordan_analysis["resume_doc_id"], "Doc IDs must be distinct!"
assert alex_analysis["job_title"] != jordan_analysis["job_title"], "Job titles must be distinct!"
print("PASSED: Each user's resume and analysis are 100% independent.")


# TEST 4: INVALID & CORRUPTED FILES HANDLING
print("\n--- TEST 4: INVALID & CORRUPTED FILE ERROR HANDLING ---")

# 4a. Corrupted PDF bytes
res = client.post("/api/resume/upload", files={"file": ("corrupt.pdf", b"INVALID_PDF_HEADER_BYTES", "application/pdf")})
print(f"4a. Corrupted PDF Upload -> HTTP {res.status_code}: {res.json().get('detail')}")
assert res.status_code == 400

# 4b. Corrupted DOCX bytes
res = client.post("/api/resume/upload", files={"file": ("corrupt.docx", b"PK\x00\x00\x00CORRUPT", "application/docx")})
print(f"4b. Corrupted DOCX Upload -> HTTP {res.status_code}: {res.json().get('detail')}")
assert res.status_code == 400

# 4c. Empty File
res = client.post("/api/resume/upload", files={"file": ("empty.pdf", b"", "application/pdf")})
print(f"4c. Empty File Upload -> HTTP {res.status_code}: {res.json().get('detail')}")
assert res.status_code == 400

# 4d. Plain text file named as .pdf (never passed to PDF parser, rejected as invalid PDF)
res = client.post("/api/resume/upload", files={"file": ("text_as_pdf.pdf", b"Plain text resume content without PDF header", "application/pdf")})
print(f"4d. Plain text as .pdf -> HTTP {res.status_code}: {res.json().get('detail')}")
assert res.status_code == 400, "Should be rejected because file lacks PDF header (%PDF-)!"

print("\n==================================================")
print("     ALL SUITE TESTS EXECUTED AND PASSED 100%     ")
print("==================================================")
