from typing import List, Dict, Any
from backend.rag.retriever import RAGRetriever
from backend.models.schemas import EvidenceItem, RequirementItem

class EvidenceAgent:
    """Agent 3: RAG Evidence Retrieval Agent that queries vector store for JD requirements."""

    @classmethod
    def get_all_evidence(cls, doc_id: str, requirements: List[RequirementItem]) -> List[EvidenceItem]:
        evidence_list = []
        for req in requirements:
            res = RAGRetriever.retrieve_evidence_for_requirement(doc_id, req.text)
            evidence_list.append(EvidenceItem(
                requirement=req.text,
                matched=res["matched"],
                status=res["status"],
                resume_evidence=res["resume_evidence"],
                source_section=res["source_section"],
                source_page=res["source_page"],
                confidence=res["confidence"],
                matched_keywords=res["matched_keywords"]
            ))
        return evidence_list
