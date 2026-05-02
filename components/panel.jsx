// Vista 2: Teacher Panel — Sidebar + Main + Right Panel

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
const Sidebar = ({ user, classrooms, activeClassroom, setActiveClassroom, currentView, setView, pendingAlerts, criticalActive }) => {
  const navItems = [
    { id: "dashboard", icon: "dashboard", label: "Dashboard" },
    { id: "history",   icon: "history",   label: "Historial" },
    { id: "settings",  icon: "settings",  label: "Configuración" },
  ];

  return (
    <div style={{
      width: 240, flexShrink: 0,
      background: "#0d1321",
      borderRight: `1px solid ${criticalActive ? "#ef444433" : "#1e2d4a"}`,
      display: "flex", flexDirection: "column",
      transition: "border-color 0.3s",
    }}>
      {/* Logo */}
      <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid #1e2d4a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: "linear-gradient(135deg, #1e3a5f, #1e2d4a)",
            border: "1px solid #253d6b",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <circle cx="12" cy="12" r="2" fill="#3b82f6" stroke="none"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", letterSpacing: "0.1em" }}>SAFECLASS</div>
            <div style={{ fontSize: 10, color: "#334155", letterSpacing: "0.05em" }}>v2.4.1</div>
          </div>
        </div>
      </div>

      {/* User card */}
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #1e2d4a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, #1e3a5f, #2563eb)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: "#e2e8f0", flexShrink: 0,
          }}>
            {user.avatar || user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user.name}
            </div>
            <div style={{ fontSize: 11, color: "#64748b" }}>
              {ROLE_LABELS[user.role]?.label || user.role}
            </div>
          </div>
        </div>
      </div>

      {/* Classrooms */}
      <div style={{ padding: "12px 0", borderBottom: "1px solid #1e2d4a", flex: "0 0 auto" }}>
        <div style={{ padding: "0 16px 8px", fontSize: 10, color: "#475569", letterSpacing: "0.08em", fontWeight: 600 }}>
          AULAS ASIGNADAS
        </div>
        {classrooms.map(cl => (
          <ClassroomItem
            key={cl.id}
            classroom={cl}
            active={activeClassroom === cl.id}
            onClick={() => { setActiveClassroom(cl.id); setView("dashboard"); }}
          />
        ))}
      </div>

      {/* Navigation */}
      <div style={{ padding: "8px 0", flex: 1 }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => setView(item.id)} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "10px 16px",
            background: currentView === item.id ? "rgba(59,130,246,0.1)" : "none",
            border: "none",
            borderLeft: `3px solid ${currentView === item.id ? "#3b82f6" : "transparent"}`,
            color: currentView === item.id ? "#3b82f6" : "#64748b",
            fontSize: 13, cursor: "pointer",
            transition: "all 0.15s",
            textAlign: "left",
          }}>
            <Icon name={item.icon} size={15} />
            <span>{item.label}</span>
            {item.id === "dashboard" && pendingAlerts > 0 && (
              <span style={{
                marginLeft: "auto",
                background: "#ef4444", color: "#fff",
                fontSize: 10, fontWeight: 700,
                padding: "1px 6px", borderRadius: 10,
                animation: "bounce 0.5s ease",
              }}>{pendingAlerts}</span>
            )}
          </button>
        ))}

        {/* Coordinator / Admin shortcuts */}
        {(user.role === "coordinador" || user.role === "administrador") && (
          <>
            <div style={{ padding: "8px 16px 4px", fontSize: 10, color: "#334155", letterSpacing: "0.08em", fontWeight: 600, marginTop: 8 }}>
              ADMINISTRACIÓN
            </div>
            {user.role === "coordinador" && (
              <button onClick={() => setView("coordinator")} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "10px 16px",
                background: currentView === "coordinator" ? "rgba(245,158,11,0.1)" : "none",
                border: "none",
                borderLeft: `3px solid ${currentView === "coordinator" ? "#f59e0b" : "transparent"}`,
                color: currentView === "coordinator" ? "#f59e0b" : "#64748b",
                fontSize: 13, cursor: "pointer", textAlign: "left",
              }}>
                <Icon name="dashboard" size={15} />
                <span>Coordinación</span>
              </button>
            )}
            {user.role === "administrador" && (
              <button onClick={() => setView("admin")} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "10px 16px",
                background: currentView === "admin" ? "rgba(34,197,94,0.1)" : "none",
                border: "none",
                borderLeft: `3px solid ${currentView === "admin" ? "#22c55e" : "transparent"}`,
                color: currentView === "admin" ? "#22c55e" : "#64748b",
                fontSize: 13, cursor: "pointer", textAlign: "left",
              }}>
                <Icon name="settings" size={15} />
                <span>Administración</span>
              </button>
            )}
          </>
        )}
      </div>

      {/* Bottom logout */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid #1e2d4a" }}>
        <button onClick={() => window.location.reload()} style={{
          width: "100%", display: "flex", alignItems: "center", gap: 8,
          padding: "8px 12px",
          background: "none", border: "1px solid #1e2d4a",
          borderRadius: 6, color: "#475569", fontSize: 12,
          cursor: "pointer", transition: "all 0.15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.color = "#ef4444"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e2d4a"; e.currentTarget.style.color = "#475569"; }}
        >
          <Icon name="x" size={13} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

// ─── CLASSROOM ITEM ───────────────────────────────────────────────────────────
const ClassroomItem = ({ classroom, active, onClick }) => {
  const statusCfg = CAM_STATUS[classroom.status] || CAM_STATUS["offline"];
  return (
    <button onClick={onClick} style={{
      width: "100%", display: "flex", alignItems: "center", gap: 10,
      padding: "9px 16px",
      background: active ? "rgba(59,130,246,0.08)" : "none",
      border: "none",
      borderLeft: `3px solid ${active ? "#3b82f6" : "transparent"}`,
      cursor: "pointer", transition: "all 0.15s", textAlign: "left",
    }}>
      <span style={{ position: "relative", width: 10, height: 10, flexShrink: 0 }}>
        <span style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: statusCfg.color,
          animation: statusCfg.pulse ? "statusPulse 1.8s infinite" : "none",
        }} />
      </span>
      <span style={{ fontSize: 13, color: active ? "#e2e8f0" : "#94a3b8", flex: 1, fontWeight: active ? 600 : 400 }}>
        {classroom.name}
      </span>
      {classroom.alertCount > 0 && (
        <span style={{
          background: "#ef4444", color: "#fff",
          fontSize: 10, fontWeight: 700,
          padding: "1px 5px", borderRadius: 8,
          minWidth: 16, textAlign: "center",
        }}>{classroom.alertCount}</span>
      )}
    </button>
  );
};

// ─── CAMERA FEED GRID ─────────────────────────────────────────────────────────
const CameraGrid = ({ classrooms, activeClassroom, alerts, onAlertClick }) => {
  const activeCl = classrooms.find(c => c.id === activeClassroom) || classrooms[0];
  const hasAlert = alerts.some(a => a.classroom === activeCl?.id && a.status === "PENDIENTE");

  return (
    <div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 10, marginBottom: 16,
      }}>
        {classrooms.slice(0, 4).map(cl => (
          <div key={cl.id} style={{ position: "relative" }}>
            <VideoPlaceholder
              classroom={cl.name}
              hasAlert={alerts.some(a => a.classroom === cl.id && a.status === "PENDIENTE")}
              height={170}
            />
            {cl.status === "offline" && (
              <div style={{
                position: "absolute", inset: 0,
                background: "rgba(11,15,26,0.85)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 8, borderRadius: 6,
              }}>
                <Icon name="cameraOff" size={24} className="" />
                <span style={{ color: "#64748b", fontSize: 12 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </span>
                <span style={{ color: "#475569", fontSize: 12 }}>Cámara offline</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── ALERT PANEL (slide-up) ───────────────────────────────────────────────────
const AlertPanel = ({ alert, onConfirm, onDiscard }) => {
  const [showReasons, setShowReasons] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const cfg = ALERT_CONFIG[alert.type] || ALERT_CONFIG["OTRO"];
  const reasons = ["Juego normal", "Actividad curricular", "Error de cámara", "Otro"];

  return (
    <div style={{
      background: "#131929",
      border: `1px solid ${cfg.color}55`,
      borderRadius: 8,
      padding: 16,
      animation: "slideUp 0.25s ease",
      boxShadow: `0 -4px 32px ${cfg.color}22`,
      borderLeft: `4px solid ${cfg.color}`,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        {/* Icon */}
        <div style={{
          width: 52, height: 52, borderRadius: 10,
          background: cfg.bg,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, color: cfg.color,
          animation: "alertPulse 2s infinite",
        }}>
          <Icon name={cfg.icon} size={24} />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: cfg.color }}>
              {alert.type} DETECTADA
            </span>
            <span style={{
              padding: "2px 6px", borderRadius: 4,
              background: "rgba(245,158,11,0.15)", color: "#f59e0b",
              fontSize: 10, fontWeight: 600,
            }}>PENDIENTE</span>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "#64748b" }}>
              <span style={{ color: "#94a3b8" }}>Aula:</span> {alert.classroom}
            </span>
            <span style={{ fontSize: 12, color: "#64748b", fontFamily: "JetBrains Mono, monospace" }}>
              <span style={{ color: "#94a3b8", fontFamily: "Inter, sans-serif" }}>Hora:</span> {fmt.time(alert.timestamp)}
            </span>
          </div>
          {/* Confidence */}
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <Tooltip text="Probabilidad asignada por el modelo YOLOv8 al comportamiento detectado">
              <span style={{ fontSize: 11, color: "#64748b" }}>Confianza del modelo:</span>
            </Tooltip>
            <ConfidenceBar value={alert.confidence} />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
          <button onClick={() => onConfirm(alert.id)} style={{
            padding: "8px 16px",
            background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.4)",
            borderRadius: 6, color: "#22c55e",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
            whiteSpace: "nowrap",
          }}>
            <Icon name="check" size={14} /> CONFIRMAR
          </button>
          <button onClick={() => setShowReasons(!showReasons)} style={{
            padding: "8px 16px",
            background: "rgba(100,116,139,0.12)", border: "1px solid #1e2d4a",
            borderRadius: 6, color: "#64748b",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
            whiteSpace: "nowrap",
          }}>
            <Icon name="x" size={14} /> FALSO POSITIVO
          </button>
          {showReasons && (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {reasons.map(r => (
                <button key={r} onClick={() => onDiscard(alert.id, r)} style={{
                  padding: "6px 10px",
                  background: reason === r ? "rgba(100,116,139,0.2)" : "none",
                  border: "1px solid #1e2d4a", borderRadius: 4,
                  color: "#94a3b8", fontSize: 12, cursor: "pointer",
                  textAlign: "left",
                }}>
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── RIGHT PANEL ──────────────────────────────────────────────────────────────
const RightPanel = ({ alerts, todayStats, threshold, onAlertClick }) => {
  const recent = alerts.slice(0, 5);

  return (
    <div style={{
      width: 288, flexShrink: 0,
      background: "#0d1321",
      borderLeft: "1px solid #1e2d4a",
      display: "flex", flexDirection: "column",
      overflowY: "auto",
    }}>
      {/* Recent alerts */}
      <div style={{ padding: "16px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: "#475569", letterSpacing: "0.08em", fontWeight: 600 }}>
            ALERTAS RECIENTES
          </span>
          <span style={{
            fontSize: 10, color: "#64748b",
            background: "#1e2d4a", padding: "2px 6px", borderRadius: 3,
          }}>TIEMPO REAL</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {recent.map(alert => {
            const cfg = ALERT_CONFIG[alert.type] || ALERT_CONFIG["OTRO"];
            return (
              <button key={alert.id} onClick={() => onAlertClick(alert)} style={{
                width: "100%", padding: "10px 12px",
                background: "#131929", border: `1px solid ${alert.status === "PENDIENTE" ? "#1e3a5f" : "#1e2d4a"}`,
                borderLeft: `3px solid ${cfg.color}`,
                borderRadius: 6, cursor: "pointer",
                textAlign: "left", transition: "background 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#1a2540"}
                onMouseLeave={e => e.currentTarget.style.background = "#131929"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ color: cfg.color }}><Icon name={cfg.icon} size={12} /></span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: cfg.color }}>{alert.type}</span>
                  <span style={{ marginLeft: "auto" }}>
                    <StatusBadge status={alert.status} />
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8, fontSize: 11, color: "#475569" }}>
                  <span>{alert.classroom}</span>
                  <span style={{ fontFamily: "JetBrains Mono, monospace" }}>{fmt.time(alert.timestamp)}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Day stats */}
      <div style={{ padding: 16, borderTop: "1px solid #1e2d4a", marginTop: 16 }}>
        <div style={{ fontSize: 11, color: "#475569", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 12 }}>
          ESTADÍSTICAS HOY
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { label: "Total", value: todayStats.total, color: "#e2e8f0" },
            { label: "Confirmadas", value: todayStats.confirmed, color: "#22c55e" },
            { label: "Falsos Pos.", value: todayStats.falsePositives, color: "#f59e0b" },
            { label: "T. Resp.", value: `${todayStats.avgResponseMin}m`, color: "#3b82f6" },
          ].map(stat => (
            <div key={stat.label} style={{
              padding: "10px 10px",
              background: "#131929", border: "1px solid #1e2d4a",
              borderRadius: 6, textAlign: "center",
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: stat.color, fontFamily: "JetBrains Mono, monospace" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sensitivity threshold */}
      <div style={{ padding: "0 16px 16px", borderTop: "1px solid #1e2d4a", paddingTop: 16 }}>
        <div style={{ fontSize: 11, color: "#475569", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 10 }}>
          <Tooltip text="Umbral de confianza mínimo para disparar una alerta. Valor configurado por el administrador.">
            <span>SENSIBILIDAD IA</span>
          </Tooltip>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>Umbral actual</span>
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 14, color: "#3b82f6", fontWeight: 600 }}>
            {threshold.toFixed(2)}
          </span>
        </div>
        <div style={{ height: 6, background: "#1e2d4a", borderRadius: 3, overflow: "hidden" }}>
          <div style={{
            width: `${(threshold - 0.5) / 0.45 * 100}%`,
            height: "100%", background: "linear-gradient(90deg, #f59e0b, #3b82f6)",
            borderRadius: 3,
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
          <span style={{ fontSize: 10, color: "#334155" }}>0.50</span>
          <span style={{ fontSize: 10, color: "#334155" }}>0.95</span>
        </div>
      </div>
    </div>
  );
};

// ─── DASHBOARD MAIN AREA ──────────────────────────────────────────────────────
const DashboardMain = ({ classrooms, activeClassroom, alerts, todayStats, onAlertConfirm, onAlertDiscard, onAlertClick }) => {
  const activeCl = classrooms.find(c => c.id === activeClassroom) || classrooms[0];
  const pendingAlert = alerts.find(a => a.classroom === activeCl?.id && a.status === "PENDIENTE");
  const [clock, setClock] = React.useState(new Date());

  React.useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflowY: "auto" }}>
      {/* Header */}
      <div style={{
        padding: "14px 20px",
        borderBottom: "1px solid #1e2d4a",
        display: "flex", alignItems: "center", gap: 12, flexShrink: 0,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0", margin: 0 }}>
              {activeCl?.name || "Sin aula"}
            </h1>
            <span style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "2px 8px", borderRadius: 4,
              background: pendingAlert ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.12)",
              color: pendingAlert ? "#ef4444" : "#22c55e",
              fontSize: 11, fontWeight: 600,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", animation: "statusPulse 1.5s infinite" }} />
              {pendingAlert ? "ALERTA ACTIVA" : "MONITOREO ACTIVO"}
            </span>
          </div>
        </div>
        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 14, color: "#64748b" }}>
          {clock.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </div>
        <div style={{ fontSize: 12, color: "#475569" }}>
          {clock.toLocaleDateString("es-CO", { weekday: "short", day: "2-digit", month: "short" })}
        </div>
      </div>

      {/* Camera grid */}
      <div style={{ padding: "16px 20px", flex: pendingAlert ? "0 0 auto" : 1 }}>
        <CameraGrid
          classrooms={classrooms}
          activeClassroom={activeClassroom}
          alerts={alerts}
          onAlertClick={onAlertClick}
        />
      </div>

      {/* Alert panel */}
      {pendingAlert && (
        <div style={{ padding: "0 20px 16px", animation: "slideUp 0.25s ease" }}>
          <AlertPanel
            alert={pendingAlert}
            onConfirm={onAlertConfirm}
            onDiscard={onAlertDiscard}
          />
        </div>
      )}

      {/* Offline state */}
      {activeCl?.status === "offline" && (
        <div style={{
          margin: "0 20px 16px",
          padding: "12px 16px",
          background: "rgba(100,116,139,0.08)", border: "1px solid #1e2d4a",
          borderRadius: 6, display: "flex", alignItems: "center", gap: 10,
        }}>
          <Icon name="wifiOff" size={16} className="" style={{ color: "#64748b" }} />
          <span style={{ fontSize: 13, color: "#64748b" }}>
            Cámara sin conexión — última señal: 08:12
          </span>
        </div>
      )}

      {/* Out of hours banner */}
      <div style={{
        margin: "0 20px 16px",
        padding: "10px 16px",
        background: "rgba(59,130,246,0.05)", border: "1px solid #1e2d4a",
        borderRadius: 6, display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ fontSize: 12, color: "#475569" }}>
          Horario escolar activo: 07:00–16:00 — <strong style={{ color: "#3b82f6" }}>Monitoreo en curso</strong>
        </span>
      </div>
    </div>
  );
};

// Export
Object.assign(window, { Sidebar, ClassroomItem, CameraGrid, AlertPanel, RightPanel, DashboardMain });
