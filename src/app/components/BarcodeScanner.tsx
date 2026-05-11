import { useState, useRef, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, Upload, X, AlertCircle } from 'lucide-react';

interface BarcodeScannerProps {
  onScanSuccess: (url: string) => void;
}

export function BarcodeScanner({ onScanSuccess }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fungsi untuk mematikan kamera dengan bersih
  const stopScanning = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (err) {
        console.error("Gagal stop scanner:", err);
      }
    }
    setIsScanning(false);
  };

  // Cleanup otomatis pas ganti halaman/component unmount
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  const startCameraScanning = async () => {
    setError(null);
    setIsScanning(true);

    // Tunggu sebentar sampai div 'qr-reader' beneran muncul di DOM
    setTimeout(async () => {
      try {
        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        };

        // Langsung tembak kamera belakang (environment) atau kamera utama
        await scanner.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            onScanSuccess(decodedText);
            stopScanning();
          },
          () => {
            // Callback pas lagi nyari kode (di-ignore biar gak menuhin console)
          }
        );
      } catch (err: any) {
        setIsScanning(false);
        if (err.toString().includes("NotAllowedError")) {
          setError("Izin kamera ditolak. Klik ikon gembok/pengaturan di URL bar dan pilih 'Allow' Camera.");
        } else {
          setError("Kamera tidak ditemukan atau sedang dipakai aplikasi lain (Zoom/Meet). Cek Fn+F6 di MSI lu.");
        }
        console.error("Scan error:", err);
      }
    }, 300);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    const html5QrCode = new Html5Qrcode("qr-file-reader");
    
    try {
      const result = await html5QrCode.scanFile(file, true);
      onScanSuccess(result);
    } catch (err) {
      setError('QR/Barcode tidak terdeteksi di gambar ini. Coba foto yang lebih jelas.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-gray-100">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Phishing Link Scanner</h2>
        <p className="text-gray-600">Scan QR Code atau Barcode untuk cek keamanan link</p>
      </div>

      {!isScanning ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <button
            onClick={startCameraScanning}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg active:scale-95"
          >
            <Camera className="w-5 h-5" />
            Scan via Kamera
          </button>
          
          <label className="flex items-center justify-center gap-3 px-6 py-4 bg-gray-50 hover:bg-gray-100 text-gray-700 border-2 border-dashed border-gray-300 rounded-xl font-semibold transition-all cursor-pointer">
            <Upload className="w-5 h-5" />
            Upload Gambar
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="mb-6 animate-in fade-in zoom-in duration-300">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-medium text-indigo-600 animate-pulse">Kamera Aktif: Arahkan ke Kode...</p>
            <button
              onClick={stopScanning}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-bold transition-colors"
            >
              <X className="w-4 h-4" />
              Batal
            </button>
          </div>
          <div 
            id="qr-reader" 
            className="rounded-xl overflow-hidden border-4 border-indigo-100 bg-black aspect-square sm:aspect-video"
          ></div>
        </div>
      )}

      {/* Hidden element buat processing file */}
      <div id="qr-file-reader" className="hidden"></div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6 flex gap-3 items-start">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-800 font-medium">{error}</p>
        </div>
      )}

      <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
        <p className="text-xs text-indigo-800 leading-relaxed">
          <strong>Pro Tip:</strong> Pastikan kode berada di dalam kotak tengah dan pencahayaan cukup. 
          Kamera MSI Katana butuh jarak sekitar 15-20cm agar fokus maksimal.
        </p>
      </div>
    </div>
  );
}