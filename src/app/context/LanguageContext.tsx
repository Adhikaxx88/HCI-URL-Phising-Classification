import { createContext, useContext, useState } from "react";

export type Lang = "en" | "id";

type Translations = typeof translations.en;
export type TKey = keyof Translations;

const translations = {
  en: {
    // Navigation
    home: "Home",
    aboutUs: "About Us",
    settings: "Settings",
    logout: "Logout",
    navigation: "NAVIGATION",
    systemOnline: "SYSTEM ONLINE",
    // Auth
    signIn: "Sign In",
    register: "Register",
    resetPassword: "Reset Password",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    signInBtn: "Sign In",
    registerBtn: "Create Account",
    resetBtn: "Send Reset Link",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    forgotPassword: "Forgot Password?",
    backToLogin: "Back to Sign In",
    resetSent: "Password reset link sent — check your email.",
    registrationSuccess: "Account created! Check your email to confirm.",
    // LinkPredictor
    linkPredictor: "Link Predictor",
    targetUrl: "TARGET URL",
    analyzeUrl: "Analyze URL",
    analyzing: "Scanning...",
    enterUrl: "Enter a URL and click Analyze",
    reportToGoogle: "Report to Google",
    reportSuccess: "URL successfully reported to Google! 🛡️",
    copyUrl: "Copy URL",
    openUrl: "Open URL",
    qrScanner: "QR / BARCODE SCANNER",
    camera: "Camera",
    upload: "Upload",
    systemLog: "SYSTEM LOG",
    analysisResult: "ANALYSIS RESULT",
    statistics: "STATISTICS & HISTORY",
    verdict: "VERDICT",
    confidence: "CONFIDENCE",
    legitimateProb: "LEGITIMATE PROBABILITY",
    loginToUse: "Sign in to analyze URLs",
    loginPrompt: "You need to be signed in to use the analyzer.",
    reporting: "Reporting...",
    // Settings
    settingsTitle: "Settings",
    language: "Language",
    english: "English",
    indonesian: "Indonesian",
    loggedInAs: "Logged in as",
  },
  id: {
    // Navigation
    home: "Beranda",
    aboutUs: "Tentang Kami",
    settings: "Pengaturan",
    logout: "Keluar",
    navigation: "NAVIGASI",
    systemOnline: "SISTEM AKTIF",
    // Auth
    signIn: "Masuk",
    register: "Daftar",
    resetPassword: "Reset Kata Sandi",
    email: "Email",
    password: "Kata Sandi",
    confirmPassword: "Konfirmasi Kata Sandi",
    signInBtn: "Masuk",
    registerBtn: "Buat Akun",
    resetBtn: "Kirim Link Reset",
    noAccount: "Belum punya akun?",
    haveAccount: "Sudah punya akun?",
    forgotPassword: "Lupa Kata Sandi?",
    backToLogin: "Kembali ke Masuk",
    resetSent: "Link reset kata sandi terkirim — cek email Anda.",
    registrationSuccess: "Akun dibuat! Cek email Anda untuk konfirmasi.",
    // LinkPredictor
    linkPredictor: "Detektor Tautan",
    targetUrl: "URL TARGET",
    analyzeUrl: "Analisis URL",
    analyzing: "Memindai...",
    enterUrl: "Masukkan URL dan klik Analisis",
    reportToGoogle: "Laporkan ke Google",
    reportSuccess: "Tautan berhasil dilaporkan ke Google! 🛡️",
    copyUrl: "Salin URL",
    openUrl: "Buka URL",
    qrScanner: "PEMINDAI QR / BARCODE",
    camera: "Kamera",
    upload: "Unggah",
    systemLog: "LOG SISTEM",
    analysisResult: "HASIL ANALISIS",
    statistics: "STATISTIK & RIWAYAT",
    verdict: "VONIS",
    confidence: "KEPERCAYAAN",
    legitimateProb: "PROBABILITAS LEGITIMASI",
    loginToUse: "Masuk untuk analisis URL",
    loginPrompt: "Anda harus masuk untuk menggunakan fitur ini.",
    reporting: "Melaporkan...",
    // Settings
    settingsTitle: "Pengaturan",
    language: "Bahasa",
    english: "Inggris",
    indonesian: "Indonesia",
    loggedInAs: "Masuk sebagai",
  },
} as const;

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TKey) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const LANG_KEY = "phishguard_lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem(LANG_KEY);
    return stored === "id" || stored === "en" ? stored : "en";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem(LANG_KEY, l);
  };

  const t = (key: TKey): string => translations[lang][key];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}
