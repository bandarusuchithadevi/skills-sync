import os
from backend.utils.pdf import extract_text_from_pdf, is_pdf
from backend.utils.docx import extract_text_from_docx, is_docx

class DocumentLoader:
    """Loads and normalizes resume documents from PDF, DOCX, or TXT based on content magic bytes and strict format validation."""

    @staticmethod
    def load_bytes(file_bytes: bytes, filename: str) -> tuple[str, int, str]:
        if not file_bytes or len(file_bytes.strip()) == 0:
            raise ValueError(f"File '{filename}' is empty or contains no readable data.")

        ext = os.path.splitext(filename)[1].lower()

        # 1. Content Magic Bytes Routing (Check actual contents first)
        if is_pdf(file_bytes):
            text, pages = extract_text_from_pdf(file_bytes)
            return text, pages, 'pdf'

        if is_docx(file_bytes):
            text, pages = extract_text_from_docx(file_bytes)
            return text, pages, 'docx'

        # 2. Format Strictness: If header bytes did NOT match PDF or DOCX
        if ext == '.pdf':
            raise ValueError(f"File '{filename}' does not contain a valid PDF header (%PDF-) or is corrupted.")

        if ext in ['.docx', '.doc']:
            raise ValueError(f"File '{filename}' is not a valid DOCX document or is corrupted.")

        # 3. Plain Text (.txt) Handling
        if ext == '.txt':
            try:
                decoded_text = file_bytes.decode('utf-8').strip()
                if decoded_text and len(decoded_text) > 5:
                    pages = max(1, (len(decoded_text.split()) + 299) // 300)
                    return decoded_text, pages, 'txt'
            except UnicodeDecodeError:
                pass
            raise ValueError(f"File '{filename}' is not valid plain text or is corrupted.")

        raise ValueError(f"Unsupported file format '{filename}'. Please upload a valid PDF, DOCX, or TXT resume.")
