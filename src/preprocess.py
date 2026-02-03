from sklearn.base import BaseEstimator,TransformerMixin

from sentence_transformers import SentenceTransformer
import numpy as np

class URLEmbeeddingTransformer(BaseEstimator, TransformerMixin):
    def __init__(self, model_name='all-MiniLM-L6-v2'):
        self.model_name = model_name
        self.encoder = None
        
    def fit(self, X,y=None):
        self.encoder= SentenceTransformer(self.model_name)
        return self
    def transform(self, X):
        if isinstance(X, np.ndarray):
            X = X.flatten().tolist()
            
        return self.encoder.encode(X)