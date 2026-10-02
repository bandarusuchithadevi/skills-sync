from typing import Dict, Any, List
from backend.rag.loader import DocumentLoader
from backend.rag.parser import ResumeParser
from backend.rag.chunker import DocumentChunker
from backend.rag.vector_store import get_vector_store

class ResumeAgent:
    """Agent 1: Ingests resume binary/text, extracts structure, chunks text, and indexes into vector store."""

    @classmethod
    def process_resume(cls, doc_id: str, file_bytes: bytes, filename: str) -> Dict[str, Any]:
        text, pages, file_type = DocumentLoader.load_bytes(file_bytes, filename)
        sections = ResumeParser.parse_sections(text)
        skills = ResumeParser.extract_skills(text)
        projects = ResumeParser.extract_projects(text)

        chunks = DocumentChunker.chunk_document(sections, pages_total=pages)
        
        # Index in vector store for RAG evidence retrieval
        store = get_vector_store(doc_id)
        store.add_chunks(chunks)

        return {
            "doc_id": doc_id,
            "filename": filename,
            "file_type": file_type,
            "pages": pages,
            "raw_text": text,
            "sections": sections,
            "sections_detected": list(sections.keys()),
            "skills_detected": skills,
            "projects_detected": projects,
            "chunks_count": len(chunks)
        }
