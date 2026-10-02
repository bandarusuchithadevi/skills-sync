import re
from typing import List, Dict, Any

class DocumentChunker:
    """Splits sectioned resume text into chunk units attached with rich metadata (section, page, content_type)."""

    @staticmethod
    def chunk_document(sections: Dict[str, str], pages_total: int = 1) -> List[Dict[str, Any]]:
        chunks = []
        chunk_counter = 0

        for section_name, content in sections.items():
            # Paragraph or sentence level splitting
            paragraphs = [p.strip() for p in re.split(r'\n\s*\n|\n(?=[\u2022\u25cf\u2219\*\-])', content) if p.strip()]
            
            for p_idx, paragraph in enumerate(paragraphs):
                if len(paragraph) < 15:
                    continue
                
                # Estimate page index
                estimated_page = min(pages_total, max(1, (chunk_counter // 5) + 1))
                chunk_counter += 1
                
                chunks.append({
                    "chunk_id": f"chk_{chunk_counter}",
                    "text": paragraph,
                    "section": section_name,
                    "page": estimated_page,
                    "content_type": section_name.lower(),
                    "length": len(paragraph)
                })

        return chunks
