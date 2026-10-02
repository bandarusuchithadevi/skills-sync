import io
from pypdf import PdfReader

def is_pdf(file_bytes: bytes) -> bool:
    """Check if raw bytes contain a PDF magic header (%PDF-)."""
    return bool(file_bytes) and b"%PDF-" in file_bytes[:1024]

def extract_text_from_pdf(file_bytes: bytes) -> tuple[str, int]:
    """Extract text and page count from raw PDF bytes."""
    if not file_bytes or len(file_bytes.strip()) == 0:
        raise ValueError("File is empty.")

    if not is_pdf(file_bytes):
        raise ValueError("File does not contain a valid PDF header (%PDF-).")

    try:
        pdf_file = io.BytesIO(file_bytes)
        reader = PdfReader(pdf_file)
        if len(reader.pages) == 0:
            raise ValueError("PDF document contains 0 pages.")

        pages_text = []
        for i, page in enumerate(reader.pages):
            text = (page.extract_text() or "").strip()
            if text:
                pages_text.append(f"--- Page {i+1} ---\n" + text)

        full_text = "\n\n".join(pages_text).strip()
        if not full_text:
            raise ValueError("Could not extract readable text from PDF. The document may be empty, password-protected, or image-only/scanned without OCR.")

        return full_text, len(reader.pages)
    except ValueError:
        raise
    except Exception as e:
        raise ValueError(f"Failed to parse PDF document: {str(e)}")
