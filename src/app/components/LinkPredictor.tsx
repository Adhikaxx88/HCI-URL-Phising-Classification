import { useState, useRef } from "react";
import {
  ClipboardPaste,
  TrendingUp,
  Camera,
  Upload,
  X,
} from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

interface LinkPredictorProps {
  initialUrl?: string;
}

export function LinkPredictor({ initialUrl = "" }: LinkPredictorProps) {
  const [url, setUrl] = useState(initialUrl);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 🔹 RESULT
  const [label, setLabel] = useState<string | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [legitProb, setLegitProb] = useState<number | null>(null);

  // 🔹 BAR
  const [displayLegit, setDisplayLegit] = useState(100);

  // 🔹 ANALYZE PROGRESS
  const [progress, setProgress] = useState(0);

  // 🔹 QR
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ================= CLIPBOARD ================= */
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch {
      alert("Clipboard access denied");
    }
  };

  /* ================= ANALYZE ================= */
  const handleAnalyze = async () => {
    if (!url.trim()) return alert("Masukkan URL dulu");

    setIsAnalyzing(true);
    setProgress(0);
    setLabel(null);
    setAccuracy(null);
    setLegitProb(null);
    setDisplayLegit(100);

    // Progress 5 detik
    const progressInterval = setInterval(() => {
      setProgress((p) => (p >= 98 ? p : p + 2));
    }, 100);

    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) throw new Error("Backend error");

      const data = await res.json();

      setTimeout(() => {
        clearInterval(progressInterval);
        setProgress(100);

        setLabel(data.label);
        setAccuracy(data.confidence);
        setLegitProb(data.legitimate_chance);
        setIsAnalyzing(false);

        // Animate legitimate bar (100 ➝ result)
        let current = 100;
        const target = data.legitimate_chance;

        const barInterval = setInterval(() => {
          current -= 1;
          setDisplayLegit(current);
          if (current <= target) {
            setDisplayLegit(target);
            clearInterval(barInterval);
          }
        }, 20);
      }, 5000);
    } catch (err) {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      alert("Tidak bisa terhubung ke FastAPI");
      console.error(err);
    }
  };

  /* ================= QR CAMERA ================= */
  const startCameraScanning = async () => {
    setScanError(null);
    setIsScanning(true);

    try {
      const qr = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = qr;

      await qr.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          setUrl(decodedText);
          stopScanning();
        },
        () => {}
      );
    } catch {
      setScanError("Camera error / permission denied");
      setIsScanning(false);
    }
  };

  const stopScanning = async () => {
    if (html5QrCodeRef.current) {
      await html5QrCodeRef.current.stop();
      html5QrCodeRef.current.clear();
      html5QrCodeRef.current = null;
    }
    setIsScanning(false);
  };

  /* ================= QR IMAGE UPLOAD ================= */
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanError(null);

    try {
      const qr = new Html5Qrcode("qr-file-reader");
      const result = await qr.scanFile(file, true);
      setUrl(result);
      qr.clear();
    } catch {
      setScanError("QR / Barcode tidak terbaca");
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ================= UI ================= */
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
      <div className="text-center mb-6">
        <TrendingUp className="mx-auto w-10 h-10 text-indigo-600" />
        <h1 className="text-2xl font-bold">Link Predictor</h1>
      </div>

      {/* INPUT */}
      <div className="flex gap-2 mb-4">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="flex-1 border rounded-lg px-4 py-2"
        />
        <button onClick={handlePaste}>
          <ClipboardPaste />
        </button>
      </div>

      {/* ACTION */}
      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg mb-4"
      >
        {isAnalyzing ? "Analyzing..." : "Analyze"}
      </button>

      {/* ANALYZE PROGRESS */}
      {isAnalyzing && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Analyzing</span>
            <span>{progress}%</span>
          </div>
          <div className="h-4 bg-gray-200 rounded-full">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* RESULT */}
      {label && accuracy !== null && legitProb !== null && (
        <div className="border rounded-lg p-4 space-y-3">
          <h2 className="font-bold text-lg">
            Status:{" "}
            <span
              className={
                label === "PHISHING" ? "text-red-600" : "text-green-600"
              }
            >
              {label}
            </span>
          </h2>

          <p>
            Confidence: <b>{accuracy}%</b>
          </p>

          {/* LEGIT BAR */}
          <div>
            <div className="flex justify-between text-sm">
              <span>Legitimate Probability</span>
              <span>{displayLegit}%</span>
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${displayLegit}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* QR SECTION */}
      <div className="mt-6">
        {!isScanning && (
          <div className="flex gap-3">
            <button
              onClick={startCameraScanning}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-lg"
            >
              <Camera size={18} /> Camera
            </button>

            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer">
              <Upload size={18} /> Upload
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        )}

        {isScanning && (
          <div className="mt-3">
            <button
              onClick={stopScanning}
              className="flex items-center gap-2 mb-2 text-red-600"
            >
              <X size={18} /> Stop Camera
            </button>
            <div id="qr-reader" />
          </div>
        )}

        <div id="qr-file-reader" className="hidden" />
        {scanError && <p className="text-red-600 mt-2">{scanError}</p>}
      </div>
    </div>
  );
}
