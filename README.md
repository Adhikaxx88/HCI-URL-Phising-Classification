Phishing URL Detection System
This project is a deep learning-based application designed to classify URLs as either Legitimate or Phishing. It features a FastAPI backend for real-time inference and a modern frontend for a user-friendly experience.

🚀 Key Features
Deep Learning Inference: Uses a pre-trained Keras model (.h5) for high-accuracy classification.

Efficient Embeddings: Implements sentence-transformers (all-MiniLM-L6-v2) to convert URLs into meaningful vector representations.

CPU Optimized: The environment is strictly optimized for CPU usage, ensuring fast builds and low resource consumption without requiring a GPU.

Dockerized Architecture: Fully containerized using Docker Compose for seamless deployment.

🛠️ Tech Stack
Backend: FastAPI, TensorFlow (CPU-version), PyTorch (CPU-version), Uvicorn.

Frontend: React, Vite.

Inference Engine: Sentence-Transformers, Scikit-learn.

📦 Getting Started
Prerequisites
Docker and Docker Compose installed on your machine.

Activation Steps
To activate the containers and run the project, follow these steps:

Clone the repository:

Bash
git clone https://github.com/Adhikaxx88/url-classification.git
cd url-classification
Build and Start the containers:
Use Docker Compose to build the images and start the services:

Bash
docker-compose up --build
Access the Application:

Frontend: Open http://localhost:5173 in your browser.

Backend API: Access the API directly at http://localhost:8000.

Interactive API Docs: Explore the Swagger UI at http://localhost:8000/docs.
