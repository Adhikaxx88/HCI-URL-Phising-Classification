import { motion, AnimatePresence } from "framer-motion";
import { X, Globe } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface SettingsProps {
  open: boolean;
  onClose: () => void;
}

export function Settings({ open, onClose }: SettingsProps) {
  const { lang, setLang, t } = useLanguage();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="settings-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }}
          />

          {/* Panel */}
          <motion.div
            key="settings-panel"
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            style={{
              position: "fixed", left: 220, top: 0, bottom: 0, width: 280, zIndex: 51,
              background: "rgba(5,12,12,0.97)", backdropFilter: "blur(20px)",
              borderRight: "1px solid rgba(0,255,157,0.18)",
              borderLeft: "1px solid rgba(0,255,157,0.1)",
              display: "flex", flexDirection: "column",
            }}
          >
            {/* Header */}
            <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid rgba(0,255,157,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", color: "#00ff9d", textShadow: "0 0 8px #00ff9d" }}>
                {t("settingsTitle").toUpperCase()}
              </span>
              <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(0,255,157,0.5)", display: "flex", alignItems: "center" }}>
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "20px 20px", flex: 1 }}>
              {/* Language section */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <Globe style={{ width: 14, height: 14, color: "rgba(0,255,255,0.6)" }} />
                  <span style={{ fontSize: 10, letterSpacing: "0.2em", color: "rgba(0,255,255,0.6)" }}>
                    {t("language").toUpperCase()}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {([
                    ["en", t("english"), "EN"],
                    ["id", t("indonesian"), "ID"],
                  ] as const).map(([code, label, badge]) => (
                    <button
                      key={code}
                      onClick={() => setLang(code)}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "11px 14px", borderRadius: 10, cursor: "pointer", transition: "all 0.2s",
                        background: lang === code ? "rgba(0,255,157,0.1)" : "rgba(255,255,255,0.03)",
                        border: lang === code ? "1px solid rgba(0,255,157,0.4)" : "1px solid rgba(255,255,255,0.08)",
                        color: lang === code ? "#00ff9d" : "rgba(224,224,224,0.55)",
                        boxShadow: lang === code ? "0 0 12px rgba(0,255,157,0.08)" : "none",
                      }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
                      <span style={{
                        fontSize: 10, padding: "2px 7px", borderRadius: 4, fontFamily: "monospace",
                        background: lang === code ? "rgba(0,255,157,0.2)" : "rgba(255,255,255,0.06)",
                        color: lang === code ? "#00ff9d" : "rgba(224,224,224,0.35)",
                        border: lang === code ? "1px solid rgba(0,255,157,0.3)" : "1px solid transparent",
                      }}>
                        {badge}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(0,255,157,0.08)" }}>
              <p style={{ fontSize: 10, color: "rgba(0,255,157,0.2)", letterSpacing: "0.15em", margin: 0, textAlign: "center" }}>
                PHISHGUARD v3.0
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
