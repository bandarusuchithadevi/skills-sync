import io
import os
import sys

# Ensure backend can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.rag.loader import DocumentLoader
from backend.utils.pdf import extract_text_from_pdf, is_pdf
from backend.utils.docx import extract_text_from_docx, is_docx

print("--- TESTING RESUME EXTRACTION & VALIDATION ---")

# Test Case 1: Plain text saved as .pdf (The exact error reported by user: invalid pdf header: b'\nSUCH')
invalid_pdf_bytes = b"\nSUCHITHA R.\nPython Developer\n"
print("\n1. Testing invalid PDF file (plain text content)...")
try:
    text, pages, ftype = DocumentLoader.load_bytes(invalid_pdf_bytes, "Suchitha_Resume.pdf")
    print(f"Result: Loaded as {ftype}, pages={pages}, text_snippet={text[:30]!r}")
except Exception as e:
    print(f"Caught expected validation error: {e}")

# Test Case 2: Minimal valid PDF bytes
# Minimal valid 1-page PDF file bytes structure
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
    b"00000000111 00000 n \n"
    b"0000000212 00000 n \n"
    b"0000000280 00000 n \n"
    b"trailer <</Size 6 /Root 1 0 R>>\n"
    b"startxref\n"
    b"374\n"
    b"%%EOF\n"
)

print("\n2. Testing minimal valid PDF document...")
try:
    text, pages, ftype = DocumentLoader.load_bytes(minimal_pdf_bytes, "test_resume.pdf")
    print(f"Result: SUCCESS! Loaded as '{ftype}', pages={pages}, extracted_text:\n{text}")
except Exception as e:
    print(f"Unexpected error: {e}")

# Test Case 3: Empty file (0 bytes)
print("\n3. Testing empty file (0 bytes)...")
try:
    DocumentLoader.load_bytes(b"", "empty_resume.pdf")
    print("FAILED: Did not catch empty file")
except Exception as e:
    print(f"Caught expected validation error: {e}")

# Test Case 4: Corrupted binary bytes
print("\n4. Testing corrupted binary file...")
try:
    DocumentLoader.load_bytes(b"\x00\x01\x02\x03\x04\x05\x06\x07\x08", "corrupt.pdf")
    print("FAILED: Did not catch corrupt file")
except Exception as e:
    print(f"Caught expected validation error: {e}")

print("\n--- ALL DIRECT EXTRACTION TESTS COMPLETED ---")
