from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from typing import List

class EmbeddingEngine:
    """Fast, local TF-IDF & N-gram Vector Embedding Generator for RAG vector index."""

    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            stop_words='english',
            sublinear_tf=True
        )
        self.is_fitted = False

    def fit_transform(self, texts: List[str]) -> np.ndarray:
        if not texts:
            return np.array([])
        matrix = self.vectorizer.fit_transform(texts)
        self.is_fitted = True
        return matrix

    def transform(self, texts: List[str]) -> np.ndarray:
        if not self.is_fitted:
            return self.fit_transform(texts)
        return self.vectorizer.transform(texts)

    @staticmethod
    def compute_similarity(matrix_a, matrix_b) -> np.ndarray:
        return cosine_similarity(matrix_a, matrix_b)
