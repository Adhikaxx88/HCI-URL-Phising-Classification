import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Mail, Lock, Eye, EyeOff, ArrowLeft, UserPlus, LogIn, KeyRound } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { CyberParticles } from "../CyberParticles";
import { CustomCursor } from "../CustomCursor";

type Mode = "signin" | "register" | "reset";

function InputField({
  type,
  placeholder,
  value,
  onChange,
  icon: Icon,
  toggleable = false,
}: {
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ElementType;
  toggleable?: boolean;
}) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  const actualType = toggleable ? (show ? "text" : "password") : type;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${focused ? "#00ff9d" : "rgba(0,255,157,0.2)"}`,
        borderRadius: 10,
        boxShadow: focused ? "0 0 12px rgba(0,255,157,0.25)" : "none",
        transition: "all 0.2s",
      }}
    >
      <Icon
        style={{ width: 15, height: 15, color: focused ? "#00ff9d" : "rgba(0,255,157,0.4)", margin: "0 12px", flexShrink: 0 }}
      />
      <input
        type={actualType}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 1,
          padding: "13px 12px 13px 0",
          background: "transparent",
          border: "none",
          outline: "none",
          color: "#e0e0e0",
          fontFamily: "monospace",
          fontSize: 13,
        }}
      />
      {toggleable && (
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "0 12px", color: "rgba(0,255,157,0.4)" }}
        >
          {show ? <EyeOff style={{ width: 14, height: 14 }} /> : <Eye style={{ width: 14, height: 14 }} />}
        </button>
      )}
    </div>
  );
}

export function AuthPage() {
  const { signIn, signUp, resetPassword } = useAuth();
  const { t, lang, setLang } = useLanguage();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const reset = () => { setEmail(""); setPassword(""); setConfirm(""); setError(null); setSuccess(null); };

  const switchMode = (m: Mode) => { setMode(m); reset(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSuccess(null);

    if (mode === "register" && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (mode === "register" && password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    if (mode === "signin") {
      const { error: err } = await signIn(email, password);
      if (err) { setError(err); setLoading(false); return; }
      navigate("/");
    } else if (mode === "register") {
      const { error: err } = await signUp(email, password);
      if (err) { setError(err); setLoading(false); return; }
      setSuccess(t("registrationSuccess"));
    } else {
      const { error: err } = await resetPassword(email);
      if (err) { setError(err); setLoading(false); return; }
      setSuccess(t("resetSent"));
    }

    setLoading(false);
  };

  const modeIcon = mode === "signin" ? LogIn : mode === "register" ? UserPlus : KeyRound;
  const ModeIcon = modeIcon;

  return (
    <div style={{ position: "fixed", inset: 0, background: "#0a0f0f", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 0 }}>
      <CustomCursor />
      <CyberParticles />

      {/* Language toggle */}
      <div style={{ position: "absolute", top: 20, right: 20, zIndex: 20, display: "flex", gap: 6 }}>
        {(["en", "id"] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            style={{
              padding: "5px 12px", borderRadius: 6, fontSize: 11, letterSpacing: "0.12em",
              fontFamily: "monospace", cursor: "pointer", transition: "all 0.2s",
              background: lang === l ? "rgba(0,255,157,0.15)" : "rgba(255,255,255,0.04)",
              border: lang === l ? "1px solid rgba(0,255,157,0.5)" : "1px solid rgba(255,255,255,0.1)",
              color: lang === l ? "#00ff9d" : "rgba(224,224,224,0.4)",
            }}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          position: "relative", zIndex: 10, width: "100%", maxWidth: 420,
          background: "rgba(8,14,14,0.92)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(0,255,157,0.2)", borderRadius: 20,
          boxShadow: "0 0 60px rgba(0,255,157,0.06), 0 0 0 1px rgba(0,255,157,0.05)",
          padding: "36px 32px",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, margin: "0 auto 14px",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,255,157,0.08)", border: "1px solid rgba(0,255,157,0.3)",
            boxShadow: "0 0 20px rgba(0,255,157,0.15)",
          }}>
            <Shield style={{ width: 24, height: 24, color: "#00ff9d" }} />
          </div>
          <p style={{ fontSize: 18, fontWeight: 800, letterSpacing: "0.2em", color: "#00ff9d", textShadow: "0 0 12px #00ff9d", margin: 0 }}>
            PHISHGUARD
          </p>
          <p style={{ fontSize: 10, color: "rgba(0,255,255,0.4)", letterSpacing: "0.15em", marginTop: 4 }}>v3.0</p>
        </div>

        {/* Mode tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 24, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 4 }}>
          {([["signin", t("signIn")], ["register", t("register")]] as [Mode, string][]).map(([m, label]) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              style={{
                flex: 1, padding: "8px 0", borderRadius: 7, fontSize: 12, fontWeight: 600,
                letterSpacing: "0.08em", cursor: "pointer", transition: "all 0.2s",
                border: "none",
                background: mode === m ? "rgba(0,255,157,0.12)" : "transparent",
                color: mode === m ? "#00ff9d" : "rgba(224,224,224,0.4)",
                boxShadow: mode === m ? "inset 0 0 10px rgba(0,255,157,0.08)" : "none",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.18 }}
          >
            {/* Mode header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <ModeIcon style={{ width: 16, height: 16, color: "#00ffff" }} />
              <span style={{ fontSize: 11, letterSpacing: "0.2em", color: "rgba(0,255,255,0.6)" }}>
                {mode === "signin" ? t("signIn").toUpperCase() : mode === "register" ? t("register").toUpperCase() : t("resetPassword").toUpperCase()}
              </span>
            </div>

            {/* Back button (reset only) */}
            {mode === "reset" && (
              <button onClick={() => switchMode("signin")} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "rgba(0,255,157,0.6)", cursor: "pointer", fontSize: 12, marginBottom: 16, padding: 0 }}>
                <ArrowLeft style={{ width: 13, height: 13 }} /> {t("backToLogin")}
              </button>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <InputField type="email" placeholder={t("email")} value={email} onChange={setEmail} icon={Mail} />
              {mode !== "reset" && (
                <InputField type="password" placeholder={t("password")} value={password} onChange={setPassword} icon={Lock} toggleable />
              )}
              {mode === "register" && (
                <InputField type="password" placeholder={t("confirmPassword")} value={confirm} onChange={setConfirm} icon={Lock} toggleable />
              )}

              {/* Error / Success */}
              <AnimatePresence>
                {error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ margin: 0, fontSize: 12, color: "#ff3b3b", background: "rgba(255,59,59,0.07)", border: "1px solid rgba(255,59,59,0.2)", borderRadius: 7, padding: "8px 12px" }}>
                    ⚠ {error}
                  </motion.p>
                )}
                {success && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ margin: 0, fontSize: 12, color: "#00ff9d", background: "rgba(0,255,157,0.07)", border: "1px solid rgba(0,255,157,0.2)", borderRadius: 7, padding: "8px 12px" }}>
                    ✓ {success}
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: 4, padding: "13px 0", borderRadius: 10, width: "100%",
                  background: "linear-gradient(135deg, rgba(0,255,157,0.16), rgba(0,255,255,0.08))",
                  border: "1px solid rgba(0,255,157,0.45)",
                  color: "#00ff9d", textShadow: "0 0 10px #00ff9d",
                  fontSize: 13, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1, transition: "all 0.2s",
                }}
              >
                {loading ? "..." : mode === "signin" ? t("signInBtn") : mode === "register" ? t("registerBtn") : t("resetBtn")}
              </button>
            </form>

            {/* Forgot password */}
            {mode === "signin" && (
              <div style={{ marginTop: 16, textAlign: "center" }}>
                <button onClick={() => switchMode("reset")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "rgba(0,255,255,0.5)", textDecoration: "underline" }}>
                  {t("forgotPassword")}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Divider line */}
        <div style={{ height: 1, background: "rgba(0,255,157,0.08)", margin: "20px 0 0" }} />
        <p style={{ fontSize: 10, textAlign: "center", color: "rgba(0,255,157,0.25)", letterSpacing: "0.2em", marginTop: 14 }}>
          PHISHGUARD SECURITY SYSTEM
        </p>
      </motion.div>

      <style>{`
        html, body, #root { height: 100%; margin: 0; padding: 0; overflow: hidden; }
      `}</style>
    </div>
  );
}
