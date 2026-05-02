// Vista 3: Alert Detail Modal

const AlertDetail = ({ alert, onClose, onConfirm, onDiscard, onEscalate }) => {
  const [playing, setPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(30); // Start at 3s of 10s clip
  const [showReasons, setShowReasons] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const cfg = ALERT_CONFIG[alert.type] || ALERT_CONFIG["OTRO"];
  const reasons = ["Juego normal", "Actividad curricular", "Error de cámara", "Otro"];

  // Simulate playback
  React.useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { setPlaying(false); return 0; }
        return p + 1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [playing]);

  const eventPos = 30; // 3s mark out of 10s

  return (
    <Modal open onClose={onClose} maxWidth={720}>
      {/* Header */}
      <div style={{
        padding: "16px 20px",
        borderBottom: "1px solid #1e2d4a",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: cfg.bg,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: cfg.color, flexShrink: 0,
        }}>
          <Icon name={cfg.icon} size={18} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#e2e8f0" }}>
              Detalle de Alerta — {alert.type}
            </h2>
            <StatusBadge status={alert.status} />
          </div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
            ID: <span style={{ fontFamily: "JetBrains Mono, monospace" }}>{alert.id}</span>
          </div>
        </div>
        <button onClick={onClose} style={{
          background: "none", border: "none",
          color: "#475569", cursor: "pointer", padding: 6,
        }}>
          <Icon name="x" size={18} />
        </button>
      </div>

      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Video player */}
        <div>
          <div style={{ fontSize: 11, color: "#475569", letterSpacing: "0.08em", marginBottom: 8, fontWeight: 600 }}>
            CLIP DEL EVENTO (±10 segundos)
          </div>
          {/* Video area */}
          <div style={{
            width: "100%", height: 220,
            background: "#0b0f1a",
            border: "1px solid #1e2d4a",
            borderRadius: 6,
            position: "relative",
            overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {/* Grid bg */}
            <svg style={{ position: "absolute", inset: 0, opacity: 0.05 }} width="100%" height="100%">
              <defs>
                <pattern id="vgrid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#3b82f6" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#vgrid)"/>
            </svg>
            {/* Silhouettes */}
            <svg viewBox="0 0 300 160" style={{ width: "55%", opacity: 0.3 }}>
              {[50, 100, 160, 220, 260].map((x, i) => (
                <g key={i} transform={`translate(${x}, 40)`}>
                  <circle cx="0" cy="0" r="9" fill="#64748b"/>
                  <rect x="-7" y="11" width="14" height="26" rx="4" fill="#64748b"/>
                  <rect x="-16" y="13" width="9" height="18" rx="4" fill="#64748b"/>
                  <rect x="7" y="13" width="9" height="18" rx="4" fill="#64748b"/>
                  <rect x="-7" y="37" width="5" height="22" rx="3" fill="#64748b"/>
                  <rect x="2" y="37" width="5" height="22" rx="3" fill="#64748b"/>
                </g>
              ))}
              {/* Alert indicator on first two */}
              {alert.type === "AGRESIÓN" && (
                <g transform="translate(50, 40)">
                  <circle cx="30" cy="0" r="12" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,2" opacity="0.8"/>
                </g>
              )}
            </svg>
            {/* Alert overlay */}
            <div style={{
              position: "absolute", inset: 0,
              background: `${cfg.color}0a`,
              pointerEvents: "none",
            }} />
            {/* Type label */}
            <div style={{
              position: "absolute", top: 12, left: 12,
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(0,0,0,0.7)",
              padding: "4px 10px", borderRadius: 4,
            }}>
              <span style={{ color: cfg.color }}><Icon name={cfg.icon} size={12} /></span>
              <span style={{ fontSize: 11, color: cfg.color, fontWeight: 600 }}>{alert.type}</span>
            </div>
            {/* CAM label */}
            <div style={{
              position: "absolute", top: 12, right: 12,
              background: "rgba(0,0,0,0.7)",
              padding: "4px 10px", borderRadius: 4,
              fontSize: 11, color: "#64748b",
              fontFamily: "JetBrains Mono, monospace",
            }}>
              {alert.cameraId}
            </div>
            {/* Play button overlay */}
            {!playing && (
              <button onClick={() => setPlaying(true)} style={{
                position: "absolute",
                width: 48, height: 48, borderRadius: "50%",
                background: "rgba(59,130,246,0.9)",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff",
              }}>
                <Icon name="play" size={20} />
              </button>
            )}
            {playing && (
              <button onClick={() => setPlaying(false)} style={{
                position: "absolute",
                width: 40, height: 40, borderRadius: "50%",
                background: "rgba(0,0,0,0.5)",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff",
              }}>
                <Icon name="pause" size={16} />
              </button>
            )}
          </div>

          {/* Timeline */}
          <div style={{ marginTop: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#475569", fontFamily: "JetBrains Mono, monospace", marginBottom: 4 }}>
              <span>-5s</span>
              <span>Evento: {fmt.time(alert.timestamp)}</span>
              <span>+5s</span>
            </div>
            <div style={{ position: "relative", height: 20, cursor: "pointer" }}
              onClick={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                setProgress(Math.round((e.clientX - rect.left) / rect.width * 100));
              }}
            >
              <div style={{ height: 4, background: "#1e2d4a", borderRadius: 2, marginTop: 8 }}>
                <div style={{ width: `${progress}%`, height: "100%", background: "#3b82f6", borderRadius: 2 }} />
              </div>
              {/* Event marker */}
              <div style={{
                position: "absolute",
                left: `${eventPos}%`,
                top: 0, bottom: 0,
                width: 2, background: cfg.color,
                transform: "translateX(-50%)",
              }}>
                <div style={{
                  position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)",
                  width: 10, height: 10, borderRadius: "50%",
                  background: cfg.color, border: `2px solid ${cfg.bg}`,
                }} />
              </div>
              {/* Playhead */}
              <div style={{
                position: "absolute",
                left: `${progress}%`,
                top: 4, transform: "translateX(-50%)",
                width: 12, height: 12, borderRadius: "50%",
                background: "#3b82f6", border: "2px solid #e2e8f0",
                transition: "left 0.1s linear",
              }} />
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { label: "TIPO DE COMPORTAMIENTO", value: alert.type },
            { label: "NIVEL DE CONFIANZA", value: null, confidence: alert.confidence },
            { label: "AULA", value: alert.classroom },
            { label: "CÁMARA", value: alert.cameraId },
            { label: "TIMESTAMP", value: fmt.datetime(alert.timestamp), mono: true },
            { label: "ESTADO", value: null, status: alert.status },
          ].map((item, i) => (
            <div key={i} style={{
              padding: "10px 12px",
              background: "#0b0f1a", border: "1px solid #1e2d4a",
              borderRadius: 6,
            }}>
              <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 4 }}>
                {item.label}
              </div>
              {item.value !== null && item.value !== undefined ? (
                <div style={{ fontSize: 13, color: "#e2e8f0", fontFamily: item.mono ? "JetBrains Mono, monospace" : "inherit" }}>
                  {item.value}
                </div>
              ) : item.confidence !== undefined ? (
                <ConfidenceBar value={item.confidence} />
              ) : item.status ? (
                <StatusBadge status={item.status} />
              ) : null}
            </div>
          ))}
        </div>

        {/* Action history */}
        {alert.actions && alert.actions.length > 0 && (
          <div>
            <div style={{ fontSize: 11, color: "#475569", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 8 }}>
              HISTORIAL DE ACCIONES
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {alert.actions.map((a, i) => (
                <div key={i} style={{
                  padding: "8px 12px",
                  background: "#0b0f1a", border: "1px solid #1e2d4a",
                  borderRadius: 4, display: "flex", alignItems: "center", gap: 10,
                }}>
                  <Icon name="check" size={12} className="" style={{ color: "#22c55e" }} />
                  <span style={{ fontSize: 13, color: "#94a3b8", flex: 1 }}>{a.action}</span>
                  <span style={{ fontSize: 11, color: "#475569" }}>{a.user}</span>
                  <span style={{ fontSize: 11, color: "#334155", fontFamily: "JetBrains Mono, monospace" }}>
                    {fmt.time(a.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Discard reason if discarded */}
        {alert.discardReason && (
          <div style={{
            padding: "10px 12px", background: "rgba(100,116,139,0.08)",
            border: "1px solid #1e2d4a", borderRadius: 6,
          }}>
            <span style={{ fontSize: 12, color: "#64748b" }}>
              Motivo de descarte: <strong style={{ color: "#94a3b8" }}>{alert.discardReason}</strong>
            </span>
          </div>
        )}

        {/* Action buttons */}
        {alert.status === "PENDIENTE" && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => { onConfirm(alert.id); onClose(); }} style={{
              flex: 1, padding: "10px 16px",
              background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.4)",
              borderRadius: 6, color: "#22c55e", fontSize: 13, fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              <Icon name="check" size={14} /> Confirmar Alerta
            </button>

            <div style={{ flex: 1, position: "relative" }}>
              <button onClick={() => setShowReasons(!showReasons)} style={{
                width: "100%", padding: "10px 16px",
                background: "rgba(100,116,139,0.12)", border: "1px solid #1e2d4a",
                borderRadius: 6, color: "#94a3b8", fontSize: 13, fontWeight: 600,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
                <Icon name="x" size={14} /> Descartar
                <Icon name="chevronDown" size={12} />
              </button>
              {showReasons && (
                <div style={{
                  position: "absolute", bottom: "calc(100% + 4px)", left: 0, right: 0,
                  background: "#131929", border: "1px solid #1e2d4a",
                  borderRadius: 6, overflow: "hidden", zIndex: 100,
                }}>
                  {reasons.map(r => (
                    <button key={r} onClick={() => { onDiscard(alert.id, r); onClose(); }} style={{
                      width: "100%", padding: "10px 14px",
                      background: "none", border: "none", borderBottom: "1px solid #1e2d4a",
                      color: "#94a3b8", fontSize: 13, cursor: "pointer", textAlign: "left",
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = "#1e2d4a"}
                      onMouseLeave={e => e.currentTarget.style.background = "none"}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {!alert.escalated && (
              <button onClick={() => { onEscalate(alert.id); onClose(); }} style={{
                padding: "10px 16px",
                background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)",
                borderRadius: 6, color: "#f59e0b", fontSize: 13, fontWeight: 600,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
              }}>
                <Icon name="escalate" size={14} /> Escalar
              </button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

Object.assign(window, { AlertDetail });
