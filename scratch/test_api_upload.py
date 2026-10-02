import os
import sys
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from backend.main import app

client = TestClient(app)

print("--- TESTING FASTAPI /api/resume/upload ENDPOINT ---")

# 1. Valid PDF upload
minimal_pdf_bytes = (
    b"%PDF-1.4\n"
    b"1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj\n"
    b"2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj\n"
    b"3 0 obj <</Type /Page /Parent 2 0 R /Resources <</Font <</F1 4 0 R>>>> /MediaBox [0 0 612 792] /Contents 5 0 R>> endobj\n"
    b"4 0 obj <</Type /Font /Subtype /Type1 /BaseFont /Helvetica>> endobj\n"
    b"5 0 obj <</Length 44>> stream\n"
    b"BT /F1 12 Tf 100 700 Td (Hello Python Resume) Tj ET\n"
    b"endstream\n"
    b"endobj\n"
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
    b"374\n"
    b"%%EOF\n"
)

response = client.post(
    "/api/resume/upload",
    files={"file": ("valid_resume.pdf", minimal_pdf_bytes, "application/pdf")}
)
print(f"\n1. Valid PDF Upload status: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    print(f"Response: filename={data['filename']}, content_type={data['content_type']}, doc_id={data['doc_id']}")
else:
    print(f"Error: {response.text}")

# 2. Corrupted file upload with .pdf extension
response = client.post(
    "/api/resume/upload",
    files={"file": ("corrupt.pdf", b"\x00\x01\x02\x03\x04\x05", "application/pdf")}
)
print(f"\n2. Corrupted File Upload status: {response.status_code}")
print(f"Response detail: {response.json().get('detail')}")

# 3. Empty file upload (0 bytes)
response = client.post(
    "/api/resume/upload",
    files={"file": ("empty.pdf", b"", "application/pdf")}
)
print(f"\n3. Empty File Upload status: {response.status_code}")
print(f"Response detail: {response.json().get('detail')}")

# 4. Valid TXT upload
response = client.post(
    "/api/resume/upload",
    files={"file": ("text_resume.txt", b"SUCHITHA R.\nPython Developer\nExperience with FastAPI and SQL.", "text/plain")}
)
print(f"\n4. Valid TXT Upload status: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    print(f"Response: filename={data['filename']}, content_type={data['content_type']}, doc_id={data['doc_id']}")

print("\n--- FASTAPI ENDPOINT TESTS COMPLETED SUCCESSFULLY ---")
