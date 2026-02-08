import os
# Matikan GPU agar stabil di lokal & siap buat Vercel/Render
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 

import joblib
import tensorflow as tf
from tensorflow.keras.models import load_model
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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
print("⏳ Memuat Processor (.pkl) dan Model (.h5)...")

# Path relatif dari lokasi app.py
MODEL_PATH = 'models/phishing_detection_deeplearning.h5'
PROCESSOR_PATH = 'models/url_processor.pkl'

model = None
processor = None

try:
    if os.path.exists(MODEL_PATH) and os.path.exists(PROCESSOR_PATH):
        model = load_model(MODEL_PATH)
        processor = joblib.load(PROCESSOR_PATH)
        print("SEMUA SISTEM GO! Model dan Processor siap.")
    else:
        print("ERROR: Salah satu file model/processor ilang!")
except Exception as e:
    print(f"Gagal load: {str(e)}")

@app.get("/")
def home():
    return {"status": "Ready", "model_loaded": model is not None}

@app.post("/predict")
def predict(request: URLRequest):
    if model is None or processor is None:
        raise HTTPException(status_code=503, detail="Sistem belum siap.")

    try:

        data_vector = processor.transform([request.url])

        prediction = model.predict(data_vector)[0][0]
        
        is_phishing = prediction > 0.5
        confidence = float(prediction) if is_phishing else 1 - float(prediction)
        
        return {
            "url": request.url,
            "status": "PHISHING" if is_phishing else "AMAN",
            "confidence": f"{confidence * 100:.2f}%",
            "is_dangerous": bool(is_phishing)
        }
    except Exception as e:
        return {"error": str(e)}

