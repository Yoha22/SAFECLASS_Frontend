// Vista 1: Login + Vista 2: Teacher Panel

// ─── LOGIN VIEW ───────────────────────────────────────────────────────────────
const LoginView = ({ onLogin }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [attempts, setAttempts] = React.useState(0);
  const [locked, setLocked] = React.useState(false);
  const [lockCountdown, setLockCountdown] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const MAX_ATTEMPTS = 3;

  // Countdown timer when locked
  React.useEffect(() => {
    if (!locked) return;
    setLockCountdown(30);
    const interval = setInterval(() => {
      setLockCountdown(prev => {
        if (prev <= 1) { clearInterval(interval); setLocked(false); setAttempts(0); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [locked]);

  const detectedRole = React.useMemo(() => getRoleFromEmail(email), [email]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (locked) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Accept any @iecol.edu.co email with password "safeclass"
      if (email.endsWith("@iecol.edu.co") && password === "safeclass") {
        const user = window.MOCK_DATA.users.find(u => u.email === email) || window.MOCK_DATA.currentUser;
        onLogin(user);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= MAX_ATTEMPTS) {
          setLocked(true);
          setError("Cuenta bloqueada temporalmente por múltiples intentos fallidos.");
        } else {
          setError(`Credenciales inválidas. ${MAX_ATTEMPTS - newAttempts} intento${MAX_ATTEMPTS - newAttempts !== 1 ? "s" : ""} restante${MAX_ATTEMPTS - newAttempts !== 1 ? "s" : ""}.`);
        }
      }
    }, 900);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0b0f1a",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      {/* Animated hex background */}
      <HexBackground />

      {/* Login card */}
      <div style={{
        width: 420, background: "#131929",
        border: "1px solid #1e2d4a",
        borderRadius: 12,
        padding: "40px 40px 36px",
        position: "relative", zIndex: 10,
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        animation: "fadeIn 0.3s ease",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 12,
            background: "linear-gradient(135deg, #1e3a5f, #1e2d4a)",
            border: "1px solid #253d6b",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
          }}>
            <Icon name="shield" size={28} className="" style={{ color: "#3b82f6" }} />
            <span style={{ color: "#3b82f6" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <circle cx="12" cy="12" r="2" fill="#3b82f6" stroke="none"/>
              </svg>
            </span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#e2e8f0", letterSpacing: "0.12em", margin: 0 }}>SAFECLASS</h1>
          <p style={{ fontSize: 12, color: "#64748b", marginTop: 6, letterSpacing: "0.06em" }}>SISTEMA DE VIGILANCIA ESCOLAR</p>
        </div>

        {/* Role indicator */}
        {detectedRole && (
          <div style={{
            marginBottom: 20,
            padding: "8px 12px",
            background: "rgba(59,130,246,0.08)",
            border: "1px solid rgba(59,130,246,0.2)",
            borderRadius: 6,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: ROLE_LABELS[detectedRole]?.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "#94a3b8" }}>
              Rol detectado: <strong style={{ color: ROLE_LABELS[detectedRole]?.color }}>{ROLE_LABELS[detectedRole]?.label}</strong>
            </span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div style={{
            marginBottom: 16, padding: "10px 12px",
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 6, color: "#f87171", fontSize: 13,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <Icon name="alert" size={14} />
            <span>{error}</span>
          </div>
        )}

        {/* Locked countdown */}
        {locked && (
          <div style={{
            marginBottom: 16, padding: "10px 12px",
            background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)",
            borderRadius: 6, color: "#fbbf24", fontSize: 13,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <Icon name="lock" size={14} />
            <span>Reintento disponible en <strong style={{ fontFamily: "JetBrains Mono, monospace" }}>{lockCountdown}s</strong></span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 6, letterSpacing: "0.04em" }}>
              CORREO INSTITUCIONAL
            </label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#475569", pointerEvents: "none" }}>
                <Icon name="mail" size={15} />
              </div>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                placeholder="usuario@iecol.edu.co"
                disabled={locked}
                required
                style={{
                  width: "100%", padding: "10px 12px 10px 38px",
                  background: "#0b0f1a", border: "1px solid #1e2d4a",
                  borderRadius: 6, color: "#e2e8f0", fontSize: 14,
                  outline: "none", boxSizing: "border-box",
                  transition: "border-color 0.2s",
                  opacity: locked ? 0.5 : 1,
                }}
                onFocus={e => e.target.style.borderColor = "#3b82f6"}
                onBlur={e => e.target.style.borderColor = "#1e2d4a"}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 6, letterSpacing: "0.04em" }}>
              CONTRASEÑA
            </label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#475569", pointerEvents: "none" }}>
                <Icon name="lock" size={15} />
              </div>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                placeholder="••••••••"
                disabled={locked}
                required
                style={{
                  width: "100%", padding: "10px 12px 10px 38px",
                  background: "#0b0f1a", border: "1px solid #1e2d4a",
                  borderRadius: 6, color: "#e2e8f0", fontSize: 14,
                  outline: "none", boxSizing: "border-box",
                  transition: "border-color 0.2s",
                  opacity: locked ? 0.5 : 1,
                }}
                onFocus={e => e.target.style.borderColor = "#3b82f6"}
                onBlur={e => e.target.style.borderColor = "#1e2d4a"}
              />
            </div>
          </div>

          {/* Attempts indicator */}
          {attempts > 0 && !locked && (
            <div style={{ marginBottom: 12, display: "flex", gap: 4, alignItems: "center" }}>
              {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                <div key={i} style={{
                  width: 20, height: 4, borderRadius: 2,
                  background: i < attempts ? "#ef4444" : "#1e2d4a",
                  transition: "background 0.3s",
                }} />
              ))}
              <span style={{ fontSize: 11, color: "#64748b", marginLeft: 4 }}>
                {MAX_ATTEMPTS - attempts} intento{MAX_ATTEMPTS - attempts !== 1 ? "s" : ""} restante{MAX_ATTEMPTS - attempts !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* Forgot password */}
          <div style={{ textAlign: "right", marginBottom: 24 }}>
            <button type="button" style={{ background: "none", border: "none", color: "#3b82f6", fontSize: 13, cursor: "pointer", padding: 0 }}
              onClick={() => alert("Función de recuperación de contraseña: contacte al administrador del sistema.")}>
              Olvidé mi contraseña
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={locked || loading}
            style={{
              width: "100%", padding: "12px",
              background: locked ? "#1e2d4a" : "linear-gradient(135deg, #3b82f6, #2563eb)",
              border: "none", borderRadius: 6,
              color: locked ? "#64748b" : "#fff",
              fontSize: 14, fontWeight: 600, letterSpacing: "0.06em",
              cursor: locked ? "not-allowed" : "pointer",
              transition: "opacity 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {loading ? (
              <>
                <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                Verificando...
              </>
            ) : locked ? "Cuenta bloqueada" : "Iniciar sesión"}
          </button>
        </form>

        {/* Demo hint */}
        <div style={{ marginTop: 24, padding: "10px 12px", background: "rgba(100,116,139,0.08)", borderRadius: 6, border: "1px solid #1e2d4a" }}>
          <p style={{ fontSize: 11, color: "#475569", margin: 0, textAlign: "center" }}>
            Demo: <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#64748b" }}>maria.torres@iecol.edu.co</span> / <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#64748b" }}>safeclass</span>
          </p>
        </div>

        <p style={{ marginTop: 20, textAlign: "center", fontSize: 11, color: "#334155" }}>
          SAFECLASS v2.4.1 — IECol Sistema Educativo Rural
        </p>
      </div>
    </div>
  );
};

// ─── HEX BACKGROUND ──────────────────────────────────────────────────────────
const HexBackground = () => (
  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04 }} aria-hidden="true">
    <defs>
      <pattern id="hexPattern" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
        <polygon points="30,2 58,18 58,34 30,50 2,34 2,18" fill="none" stroke="#3b82f6" strokeWidth="1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#hexPattern)">
      <animateTransform attributeName="transform" type="translate" from="0 0" to="0 52" dur="30s" repeatCount="indefinite"/>
    </rect>
  </svg>
);

// Export
Object.assign(window, { LoginView, HexBackground });
