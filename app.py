import os
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 

import tensorflow as tf
from tensorflow.keras.models import load_model
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
# GANTI INI: Pakai library langsung, jangan joblib load model ST
from sentence_transformers import SentenceTransformer

app = FastAPI(title="Phishing Detection API v3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class URLRequest(BaseModel):
    url: str

# --- LOAD COMPONENTS ---
print("⏳ Memuat Model (.h5) dan Sentence Transformer...")

MODEL_PATH = 'models/phishing_detection_deeplearning.h5'

model = None
processor = None

try:
    # 1. Load Model Keras
    if os.path.exists(MODEL_PATH):
        model = load_model(MODEL_PATH)
        print("✅ Model Keras (.h5) siap.")
    else:
        print("❌ ERROR: File model (.h5) ilang!")

    # 2. Load Sentence Transformer (Ganti 'nama-model' sesuai yang lu pake pas training)
    # Contoh: 'all-MiniLM-L6-v2' atau 'paraphrase-multilingual-MiniLM-L12-v2'
    # Server bakal otomatis download/cache model ini, gak perlu file .pkl 90MB lagi!
    print("⏳ Menghubungkan ke Sentence Transformer...")
    processor = SentenceTransformer('all-MiniLM-L6-v2') 
    print("✅ Sentence Transformer siap.")
    
    print("🚀 SEMUA SISTEM GO!")

except Exception as e:
    print(f"❌ Gagal load: {str(e)}")

@app.get("/")
def home():
    return {"status": "Ready", "model_loaded": model is not None, "processor_loaded": processor is not None}

@app.post("/predict")
def predict(request: URLRequest):
    if model is None or processor is None:
        raise HTTPException(status_code=503, detail="Sistem belum siap.")

    try:
        data_vector = processor.encode([request.url])
        prediction = float(model.predict(data_vector)[0][0])
        
        # Berdasarkan dataset lu: 0 = Phishing, 1 = Legitimate
        # Nilai 'prediction' (0-1) itu sendiri adalah skor Legitimate
        prob_legitimate = prediction
        prob_phishing = 1 - prediction
        
        is_phishing = prob_phishing > 0.5 
        
        return {
            "url": request.url,
            "status": "PHISHING" if is_phishing else "LEGITIMATE",
            "confidence": f"{(prob_phishing if is_phishing else prob_legitimate) * 100:.2f}%",
            "details": {
                "phishing_chance": f"{prob_phishing * 100:.2f}%",
                "legitimate_chance": f"{prob_legitimate * 100:.2f}%"
            },
            "is_dangerous": bool(is_phishing)
        }
    except Exception as e:
        return {"error": str(e)}