import chromadb
from chromadb.api.types import EmbeddingFunction, Documents, Embeddings
from typing import List, Dict, Any, Optional
import numpy as np
from backend.rag.embeddings import EmbeddingEngine

class FastTFIDFEmbeddingFunction(EmbeddingFunction):
    """Lightweight custom embedding function for ChromaDB backed by TF-IDF & N-grams."""
    def __init__(self):
        self.engine = EmbeddingEngine()

    def __call__(self, input: Documents) -> Embeddings:
        if not input:
            return []
        dense_matrix = self.engine.transform(input).toarray()
        return dense_matrix.tolist()

class LocalVectorStore:
    """ChromaDB Vector Store with document chunk metadata indexing and semantic similarity query."""

    def __init__(self, doc_id: str):
        self.doc_id = doc_id
        self.chunks: List[Dict[str, Any]] = []
        self.chroma_client = chromadb.Client()
        self.embedding_fn = FastTFIDFEmbeddingFunction()
        # Clean collection name
        safe_col_name = f"doc_{doc_id.replace('-', '_')}"
        try:
            self.collection = self.chroma_client.get_or_create_collection(
                name=safe_col_name,
                embedding_function=self.embedding_fn
            )
        except Exception:
            self.collection = self.chroma_client.get_or_create_collection(name=safe_col_name)

    def add_chunks(self, chunks: List[Dict[str, Any]]):
        self.chunks = chunks
        if not chunks:
            return
        
        texts = [c["text"] for c in chunks]
        metadatas = [
            {
                "section": str(c.get("section", "General")),
                "page": int(c.get("page", 1)),
                "content_type": str(c.get("content_type", "general"))
            }
            for c in chunks
        ]
        ids = [str(c.get("chunk_id", f"chk_{i}")) for i, c in enumerate(chunks)]

        # Fit embedding engine on document texts
        self.embedding_fn.engine.fit_transform(texts)

        # Upsert into ChromaDB
        self.collection.upsert(
            documents=texts,
            metadatas=metadatas,
            ids=ids
        )

    def search(self, query: str, top_k: int = 3, threshold: float = 0.05) -> List[Dict[str, Any]]:
        if not self.chunks:
            return []

        try:
            res = self.collection.query(
                query_texts=[query],
                n_results=min(top_k, len(self.chunks))
            )
            
            results = []
            if res and res.get("documents") and res["documents"][0]:
                docs = res["documents"][0]
                metas = res["metadatas"][0] if res.get("metadatas") else [{}] * len(docs)
                distances = res["distances"][0] if res.get("distances") else [0.5] * len(docs)
                
                for doc_text, meta, dist in zip(docs, metas, distances):
                    # Convert distance score to similarity percentage
                    score = max(0.0, 1.0 - (dist if isinstance(dist, (int, float)) else 0.5))
                    confidence = round(min(99.0, max(45.0, score * 100)), 1)
                    
                    results.append({
                        "text": doc_text,
                        "section": meta.get("section", "General"),
                        "page": meta.get("page", 1),
                        "content_type": meta.get("content_type", "general"),
                        "score": score,
                        "confidence": confidence
                    })
            return results
        except Exception:
            # Fallback search if collection query encounters an issue
            fallback_vecs = self.embedding_fn.engine.transform([c["text"] for c in self.chunks])
            q_vec = self.embedding_fn.engine.transform([query])
            sims = self.embedding_fn.engine.compute_similarity(q_vec, fallback_vecs)[0]
            ranked = np.argsort(sims)[::-1]
            
            res = []
            for idx in ranked[:top_k]:
                sc = float(sims[idx])
                chk = dict(self.chunks[idx])
                chk["score"] = sc
                chk["confidence"] = round(min(99.0, max(45.0, sc * 200 + 40.0)), 1)
                res.append(chk)
            return res

# Global registry for stores per document ID
_STORES: Dict[str, LocalVectorStore] = {}

def get_vector_store(doc_id: str) -> LocalVectorStore:
    if doc_id not in _STORES:
        _STORES[doc_id] = LocalVectorStore(doc_id)
    return _STORES[doc_id]

