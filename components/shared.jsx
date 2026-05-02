// Shared components, icons, utilities

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 16, className = "" }) => {
  const icons = {
    shield: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    eye: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    camera: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
    ),
    cameraOff: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="1" y1="1" x2="23" y2="23"/>
        <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
    ),
    alert: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    user: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    users: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    dashboard: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
    history: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="12 8 12 12 14 14"/>
        <path d="M3.05 11a9 9 0 1 0 .5-4.5"/>
        <polyline points="3 3 3 9 9 9"/>
      </svg>
    ),
    settings: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
    check: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
    x: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    ),
    chevronDown: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    ),
    chevronRight: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    ),
    play: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
    ),
    pause: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="4" width="4" height="16"/>
        <rect x="14" y="4" width="4" height="16"/>
      </svg>
    ),
    download: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    ),
    plus: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    ),
    arrowUp: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="19" x2="12" y2="5"/>
        <polyline points="5 12 12 5 19 12"/>
      </svg>
    ),
    arrowDown: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <polyline points="19 12 12 19 5 12"/>
      </svg>
    ),
    wifi: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
        <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
        <path d="M8.53 16.11a6 16 0 0 1 6.95 0"/>
        <line x1="12" y1="20" x2="12.01" y2="20"/>
      </svg>
    ),
    wifiOff: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="1" y1="1" x2="23" y2="23"/>
        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/>
        <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/>
        <path d="M10.71 5.05A16 16 0 0 1 22.56 9"/>
        <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/>
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
        <line x1="12" y1="20" x2="12.01" y2="20"/>
      </svg>
    ),
    fist: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 11V7a2 2 0 0 0-4 0v2M14 9V5a2 2 0 0 0-4 0v4M10 9a2 2 0 0 0-4 0v6a8 8 0 0 0 16 0v-5a2 2 0 0 0-4 0"/>
      </svg>
    ),
    person: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="3"/>
        <path d="M6 21v-2a6 6 0 0 1 12 0v2"/>
        <line x1="12" y1="8" x2="12" y2="14"/>
      </svg>
    ),
    personFall: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="17" cy="4" r="2"/>
        <path d="M15.5 6.5L13 9l-3 1-3.5 6"/>
        <path d="M6 15l-3 5"/>
        <path d="M13 9l3 5"/>
        <path d="M16 14l3 5"/>
      </svg>
    ),
    refresh: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"/>
        <polyline points="1 20 1 14 7 14"/>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
      </svg>
    ),
    filter: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
      </svg>
    ),
    lock: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    mail: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    escalate: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    cpu: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
        <rect x="9" y="9" width="6" height="6"/>
        <line x1="9" y1="1" x2="9" y2="4"/>
        <line x1="15" y1="1" x2="15" y2="4"/>
        <line x1="9" y1="20" x2="9" y2="23"/>
        <line x1="15" y1="20" x2="15" y2="23"/>
        <line x1="20" y1="9" x2="23" y2="9"/>
        <line x1="20" y1="14" x2="23" y2="14"/>
        <line x1="1" y1="9" x2="4" y2="9"/>
        <line x1="1" y1="14" x2="4" y2="14"/>
      </svg>
    ),
    database: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    ),
    bell: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
  };
  return (
    <span className={`inline-flex items-center justify-center ${className}`}>
      {icons[name] || null}
    </span>
  );
};

// ─── ALERT TYPE CONFIG ────────────────────────────────────────────────────────
const ALERT_CONFIG = {
  "AGRESIÓN":    { icon: "fist",       color: "#ef4444", bg: "rgba(239,68,68,0.12)",   label: "Agresión" },
  "AISLAMIENTO": { icon: "person",     color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  label: "Aislamiento" },
  "CAÍDA":       { icon: "personFall", color: "#3b82f6", bg: "rgba(59,130,246,0.12)",  label: "Caída" },
  "OTRO":        { icon: "alert",      color: "#64748b", bg: "rgba(100,116,139,0.12)", label: "Otro" },
};

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  "PENDIENTE":  { color: "#f59e0b", bg: "rgba(245,158,11,0.15)",  label: "Pendiente" },
  "CONFIRMADA": { color: "#22c55e", bg: "rgba(34,197,94,0.15)",   label: "Confirmada" },
  "DESCARTADA": { color: "#64748b", bg: "rgba(100,116,139,0.15)", label: "Descartada" },
};

// ─── CAMERA STATUS CONFIG ─────────────────────────────────────────────────────
const CAM_STATUS = {
  "alert":  { color: "#ef4444", label: "Alerta activa", pulse: true },
  "active": { color: "#22c55e", label: "Activo",        pulse: true },
  "low":    { color: "#f59e0b", label: "Baja calidad",  pulse: false },
  "offline":{ color: "#64748b", label: "Offline",       pulse: false },
  "online": { color: "#22c55e", label: "En línea",      pulse: true },
  "error":  { color: "#ef4444", label: "Error",         pulse: true },
  "reconnecting": { color: "#f59e0b", label: "Reconectando", pulse: true },
};

// ─── ROLE UTILS ───────────────────────────────────────────────────────────────
const getRoleFromEmail = (email) => {
  if (!email) return null;
  if (email.includes("admin")) return "administrador";
  if (email.includes("coord")) return "coordinador";
  if (email.endsWith("@iecol.edu.co")) return "docente";
  return null;
};

const ROLE_LABELS = {
  docente: { label: "Docente", color: "#3b82f6" },
  coordinador: { label: "Coordinador", color: "#f59e0b" },
  administrador: { label: "Administrador", color: "#22c55e" },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = {
  time: (ts) => new Date(ts).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
  datetime: (ts) => new Date(ts).toLocaleString("es-CO", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" }),
  percent: (v) => `${Math.round(v * 100)}%`,
  confidence: (v) => `${Math.round(v * 100)}%`,
};

// ─── CONFIDENCE BAR ───────────────────────────────────────────────────────────
const ConfidenceBar = ({ value, showLabel = true }) => {
  const pct = Math.round(value * 100);
  const color = pct >= 80 ? "#ef4444" : pct >= 65 ? "#f59e0b" : "#64748b";
  return (
    <div className="flex items-center gap-2">
      <div style={{ width: 80, height: 6, background: "#1e2d4a", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.4s ease" }} />
      </div>
      {showLabel && <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color, minWidth: 36 }}>{pct}%</span>}
    </div>
  );
};

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["PENDIENTE"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "2px 8px", borderRadius: 4,
      background: cfg.bg, color: cfg.color,
      fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase",
    }}>
      {cfg.label}
    </span>
  );
};

// ─── ALERT TYPE BADGE ─────────────────────────────────────────────────────────
const AlertTypeBadge = ({ type }) => {
  const cfg = ALERT_CONFIG[type] || ALERT_CONFIG["OTRO"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "2px 8px", borderRadius: 4,
      background: cfg.bg, color: cfg.color,
      fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase",
    }}>
      <Icon name={cfg.icon} size={11} />
      {cfg.label}
    </span>
  );
};

// ─── TOAST ────────────────────────────────────────────────────────────────────
const ToastContainer = ({ toasts, removeToast }) => (
  <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none" }}>
    {toasts.map(t => (
      <div key={t.id} style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 16px",
        background: "#131929", border: `1px solid ${t.type === "success" ? "#22c55e" : t.type === "error" ? "#ef4444" : "#3b82f6"}`,
        borderRadius: 6, color: "#e2e8f0", fontSize: 14,
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        animation: "slideInRight 0.2s ease",
        pointerEvents: "all",
        maxWidth: 320,
      }}>
        <span style={{ color: t.type === "success" ? "#22c55e" : t.type === "error" ? "#ef4444" : "#3b82f6", flexShrink: 0 }}>
          <Icon name={t.type === "success" ? "check" : t.type === "error" ? "x" : "alert"} size={16} />
        </span>
        <span style={{ flex: 1 }}>{t.message}</span>
        <button onClick={() => removeToast(t.id)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: 2 }}>
          <Icon name="x" size={14} />
        </button>
      </div>
    ))}
  </div>
);

// ─── SKELETON LOADER ──────────────────────────────────────────────────────────
const Skeleton = ({ width = "100%", height = 16, borderRadius = 4, className = "" }) => (
  <div style={{
    width, height, borderRadius,
    background: "linear-gradient(90deg, #1e2d4a 25%, #253552 50%, #1e2d4a 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  }} className={className} />
);

// ─── VIDEO PLACEHOLDER ────────────────────────────────────────────────────────
const VideoPlaceholder = ({ classroom, hasAlert = false, width = "100%", height = 160 }) => (
  <div style={{
    width, height,
    background: "#0b0f1a",
    border: `1px solid ${hasAlert ? "#ef4444" : "#1e2d4a"}`,
    borderRadius: 6,
    position: "relative",
    overflow: "hidden",
    display: "flex", alignItems: "center", justifyContent: "center",
  }}>
    {/* Grid pattern */}
    <svg style={{ position: "absolute", inset: 0, opacity: 0.07 }} width="100%" height="100%">
      <defs>
        <pattern id={`grid-${classroom}`} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3b82f6" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#grid-${classroom})`}/>
    </svg>
    {/* Silhouettes - no faces */}
    <svg viewBox="0 0 200 120" style={{ width: "60%", opacity: 0.25 }}>
      {[30, 70, 110, 150, 170].map((x, i) => (
        <g key={i} transform={`translate(${x}, 30)`}>
          <circle cx="0" cy="0" r="7" fill="#64748b"/>
          <rect x="-5" y="9" width="10" height="22" rx="3" fill="#64748b"/>
          <rect x="-12" y="11" width="7" height="14" rx="3" fill="#64748b"/>
          <rect x="5" y="11" width="7" height="14" rx="3" fill="#64748b"/>
          <rect x="-5" y="31" width="4" height="18" rx="2" fill="#64748b"/>
          <rect x="1" y="31" width="4" height="18" rx="2" fill="#64748b"/>
        </g>
      ))}
    </svg>
    {/* Alert overlay */}
    {hasAlert && (
      <div style={{ position: "absolute", inset: 0, background: "rgba(239,68,68,0.1)", animation: "alertPulse 2s infinite" }} />
    )}
    {/* Corner tag */}
    <div style={{ position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,0.7)", padding: "2px 8px", borderRadius: 3, fontSize: 11, color: "#94a3b8", fontFamily: "JetBrains Mono, monospace" }}>
      {classroom}
    </div>
    {/* Live indicator */}
    <div style={{ position: "absolute", top: 8, right: 8, display: "flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: hasAlert ? "#ef4444" : "#22c55e", display: "inline-block", animation: "statusPulse 1.5s infinite" }} />
      <span style={{ fontSize: 10, color: "#94a3b8", fontFamily: "JetBrains Mono, monospace" }}>EN VIVO</span>
    </div>
    {/* Timestamp */}
    <div style={{ position: "absolute", bottom: 8, right: 8, fontSize: 11, color: "#475569", fontFamily: "JetBrains Mono, monospace" }}>
      {new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
    </div>
  </div>
);

// ─── TOOLTIP ─────────────────────────────────────────────────────────────────
const Tooltip = ({ text, children }) => {
  const [show, setShow] = React.useState(false);
  return (
    <div style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)",
          background: "#0b0f1a", border: "1px solid #1e2d4a",
          padding: "5px 10px", borderRadius: 4,
          fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap",
          zIndex: 1000, boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          pointerEvents: "none",
        }}>
          {text}
        </div>
      )}
    </div>
  );
};

// ─── MODAL WRAPPER ────────────────────────────────────────────────────────────
const Modal = ({ open, onClose, children, maxWidth = 680 }) => {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 500,
      background: "rgba(7,10,18,0.85)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "fadeIn 0.15s ease",
    }} onClick={onClose}>
      <div style={{
        background: "#131929", border: "1px solid #1e2d4a",
        borderRadius: 8, width: "100%", maxWidth,
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
        animation: "slideUp 0.2s ease",
      }} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

// Export
Object.assign(window, {
  Icon, ALERT_CONFIG, STATUS_CONFIG, CAM_STATUS,
  getRoleFromEmail, ROLE_LABELS,
  fmt, ConfidenceBar, StatusBadge, AlertTypeBadge,
  ToastContainer, Skeleton, VideoPlaceholder, Tooltip, Modal,
});
