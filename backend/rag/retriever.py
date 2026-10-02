from typing import List, Dict, Any
from backend.rag.vector_store import get_vector_store

class RAGRetriever:
    """Retriever agent that queries vector store for requirement evidence."""

    @staticmethod
    def retrieve_evidence_for_requirement(doc_id: str, requirement: str) -> Dict[str, Any]:
        store = get_vector_store(doc_id)
        results = store.search(requirement, top_k=2)

        if not results or results[0]["score"] < 0.05:
            return {
                "requirement": requirement,
                "matched": False,
                "status": "NOT FOUND",
                "resume_evidence": "No supporting evidence found in the uploaded resume.",
                "source_section": "None",
                "source_page": 1,
                "confidence": 0.0,
                "matched_keywords": []
            }

        top_match = results[0]
        confidence = top_match["confidence"]
        status = "MATCHED" if confidence >= 60.0 else "PARTIAL"

        return {
            "requirement": requirement,
            "matched": status != "NOT FOUND",
            "status": status,
            "resume_evidence": top_match["text"],
            "source_section": top_match["section"],
            "source_page": top_match["page"],
            "confidence": confidence,
            "matched_keywords": [w for w in requirement.split() if len(w) > 3][:3]
        }
