import { useState } from "react";
import { Link, Outlet, useLocation, Navigate } from "react-router";
import { Home, Info, Shield, Settings as SettingsIcon, LogOut, User, Globe } from "lucide-react";
import { CyberParticles } from "./CyberParticles";
import { ThreeScene } from "./ThreeScene";
import { CustomCursor } from "./CustomCursor";
import { Settings } from "./Settings";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export function Layout() {
  const location = useLocation();
  const { user, isLoading, signOut } = useAuth();
  const { t, lang, setLang } = useLanguage();
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Redirect unauthenticated users to /auth
  if (!isLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  // Show nothing while resolving auth (avoids flash)
  if (isLoading) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#0a0f0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid rgba(0,255,157,0.4)", borderTop: "2px solid #00ff9d", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const navItems = [
    { path: "/", label: t("home"), icon: Home },
    { path: "/about", label: t("aboutUs"), icon: Info },
  ];

  const userEmail = user?.email ?? "";
  const userShort = userEmail.split("@")[0];

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0a0f0f", color: "#e0e0e0", position: "relative", overflow: "hidden" }}>
      <CustomCursor />
      <CyberParticles />
      <ThreeScene />

      {/* Settings panel */}
      <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* Sidebar */}
      <aside style={{
        width: 220, flexShrink: 0, position: "relative", zIndex: 10,
        display: "flex", flexDirection: "column",
        background: "rgba(5,10,10,0.92)", backdropFilter: "blur(16px)",
        borderRight: "1px solid rgba(0,255,157,0.18)",
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(0,255,157,0.12)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(0,255,157,0.1)", border: "1px solid rgba(0,255,157,0.35)",
              boxShadow: "0 0 12px rgba(0,255,157,0.2)",
            }}>
              <Shield style={{ width: 18, height: 18, color: "#00ff9d" }} />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.15em", color: "#00ff9d", textShadow: "0 0 10px #00ff9d", textTransform: "uppercase", margin: 0 }}>
                PhishGuard
              </p>
              <p style={{ fontSize: 10, color: "rgba(224,224,224,0.35)", letterSpacing: "0.1em", margin: 0 }}>v3.0</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          <p style={{ fontSize: 10, letterSpacing: "0.2em", color: "rgba(0,255,157,0.4)", marginBottom: 10, paddingLeft: 8 }}>
            {t("navigation")}
          </p>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "10px 12px", borderRadius: 8,
                      textDecoration: "none", transition: "all 0.2s",
                      ...(isActive
                        ? { background: "rgba(0,255,157,0.1)", border: "1px solid rgba(0,255,157,0.3)", color: "#00ff9d", textShadow: "0 0 6px #00ff9d", boxShadow: "0 0 14px rgba(0,255,157,0.12)" }
                        : { border: "1px solid transparent", color: "rgba(224,224,224,0.55)" }),
                    }}
                  >
                    <Icon style={{ width: 15, height: 15 }} />
                    <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.05em" }}>{item.label}</span>
                    {isActive && <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#00ff9d", boxShadow: "0 0 8px #00ff9d" }} />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom actions — highlighted section */}
        <div style={{
          padding: "14px 12px 12px",
          borderTop: "1px solid rgba(0,255,157,0.3)",
          boxShadow: "0 -4px 20px rgba(0,255,157,0.06)",
          display: "flex", flexDirection: "column", gap: 8,
        }}>
          {/* User chip */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8, padding: "9px 12px",
            borderRadius: 10, background: "rgba(0,255,157,0.07)",
            border: "1px solid rgba(0,255,157,0.22)",
            boxShadow: "0 0 10px rgba(0,255,157,0.06)",
          }}>
            <User style={{ width: 13, height: 13, color: "#00ff9d", flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: "rgba(224,224,224,0.7)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, letterSpacing: "0.04em" }} title={userEmail}>
              {userShort}
            </span>
          </div>

          {/* Settings + Logout row */}
          <div style={{ display: "flex", gap: 6 }}>
            {/* Settings button — prominent */}
            <button
              onClick={() => setSettingsOpen((v) => !v)}
              title={t("settings")}
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                padding: "10px 0", borderRadius: 10, cursor: "pointer", transition: "all 0.25s",
                background: settingsOpen
                  ? "rgba(0,255,157,0.18)"
                  : "rgba(0,255,157,0.08)",
                border: settingsOpen
                  ? "1px solid rgba(0,255,157,0.6)"
                  : "1px solid rgba(0,255,157,0.3)",
                color: settingsOpen ? "#00ff9d" : "rgba(0,255,157,0.75)",
                boxShadow: settingsOpen
                  ? "0 0 16px rgba(0,255,157,0.2), inset 0 0 10px rgba(0,255,157,0.06)"
                  : "0 0 8px rgba(0,255,157,0.08)",
                textShadow: settingsOpen ? "0 0 8px #00ff9d" : "none",
              }}
            >
              <SettingsIcon style={{ width: 14, height: 14 }} />
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em" }}>{t("settings")}</span>
            </button>

            {/* Logout button */}
            <button
              onClick={signOut}
              title={t("logout")}
              style={{
                padding: "10px 14px", borderRadius: 10, cursor: "pointer", transition: "all 0.25s",
                background: "rgba(255,59,59,0.08)", border: "1px solid rgba(255,59,59,0.35)",
                color: "rgba(255,59,59,0.85)", display: "flex", alignItems: "center",
                boxShadow: "0 0 8px rgba(255,59,59,0.08)",
              }}
            >
              <LogOut style={{ width: 14, height: 14 }} />
            </button>
          </div>

          {/* System status */}
          <div style={{ paddingTop: 4 }}>
            <p style={{ fontSize: 10, textAlign: "center", letterSpacing: "0.15em", color: "rgba(0,255,157,0.4)", marginBottom: 6 }}>
              {t("systemOnline")}
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff9d", boxShadow: "0 0 6px #00ff9d", animation: `pulse-dot 1.5s ease-in-out ${i * 0.3}s infinite`, display: "inline-block" }} />
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, position: "relative", zIndex: 10, overflowY: "auto", overflowX: "hidden", padding: "32px 40px" }}>
        {/* Language toggle — fixed top-right, visible on all pages */}
        <div style={{
          position: "fixed", top: 16, right: 20, zIndex: 100,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <Globe style={{ width: 12, height: 12, color: "rgba(0,255,157,0.4)" }} />
          {(["en", "id"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{
                padding: "4px 10px", borderRadius: 6, fontSize: 11,
                fontFamily: "monospace", letterSpacing: "0.12em", cursor: "pointer",
                transition: "all 0.2s",
                background: lang === l ? "rgba(0,255,157,0.15)" : "rgba(255,255,255,0.04)",
                border: lang === l ? "1px solid rgba(0,255,157,0.55)" : "1px solid rgba(255,255,255,0.1)",
                color: lang === l ? "#00ff9d" : "rgba(224,224,224,0.35)",
                boxShadow: lang === l ? "0 0 8px rgba(0,255,157,0.15)" : "none",
                textShadow: lang === l ? "0 0 6px #00ff9d" : "none",
              }}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            style={{ maxWidth: 1400, margin: "0 auto" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1.3); }
        }
        html, body, #root { height: 100%; margin: 0; padding: 0; overflow: hidden; }
      `}</style>
    </div>
  );
}
