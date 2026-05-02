// Vista 6: Admin Panel

const AdminPanel = ({ users: initialUsers, cameras: initialCameras, systemStats, addToast }) => {
  const [tab, setTab] = React.useState("usuarios");
  const [users, setUsers] = React.useState(initialUsers);
  const [cameras, setCameras] = React.useState(initialCameras);
  const [threshold, setThreshold] = React.useState(systemStats.threshold);
  const [thresholdHistory, setThresholdHistory] = React.useState(systemStats.thresholdHistory);
  const [showUserDrawer, setShowUserDrawer] = React.useState(false);
  const [showCameraForm, setShowCameraForm] = React.useState(false);
  const [confirmModal, setConfirmModal] = React.useState(null);
  const [logs, setLogs] = React.useState(window.MOCK_DATA.systemLogs);
  const [testingCam, setTestingCam] = React.useState(null);
  const [testResults, setTestResults] = React.useState({});

  const tabs = [
    { id: "usuarios", label: "Usuarios" },
    { id: "camaras", label: "Cámaras" },
    { id: "ia", label: "Configuración IA" },
    { id: "sistema", label: "Sistema" },
  ];

  const testCamera = (camId) => {
    setTestingCam(camId);
    setTestResults(prev => ({ ...prev, [camId]: null }));
    setTimeout(() => {
      const success = Math.random() > 0.35;
      setTestingCam(null);
      setTestResults(prev => ({ ...prev, [camId]: success ? "ok" : "error" }));
      addToast(success ? "Conexión exitosa con " + camId : "Error: timeout en " + camId, success ? "success" : "error");
    }, 1800);
  };

  const toggleUser = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u));
    const u = users.find(u => u.id === id);
    addToast(`Usuario ${u?.name} ${u?.active ? "desactivado" : "activado"}`, "success");
  };

  const applyThreshold = () => {
    const newEntry = {
      value: threshold,
      user: "Ana Ruiz",
      timestamp: new Date().toISOString(),
    };
    setThresholdHistory(prev => [...prev.slice(-4), newEntry]);
    addToast(`Umbral actualizado a ${threshold.toFixed(2)}`, "success");
    setConfirmModal(null);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
      {/* Header */}
      <div style={{
        padding: "14px 24px",
        borderBottom: "1px solid #1e2d4a",
        display: "flex", alignItems: "center", gap: 12, flexShrink: 0,
      }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0", margin: 0 }}>Administración del Sistema</h2>
        <span style={{
          padding: "2px 8px", borderRadius: 4,
          background: "rgba(34,197,94,0.12)", color: "#22c55e",
          fontSize: 11, fontWeight: 600,
        }}>SAFECLASS v2.4.1</span>
      </div>

      {/* Tab bar */}
      <div style={{
        display: "flex", borderBottom: "1px solid #1e2d4a",
        padding: "0 24px", flexShrink: 0,
        background: "#0d1321",
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "12px 18px",
            background: "none", border: "none",
            borderBottom: `2px solid ${tab === t.id ? "#3b82f6" : "transparent"}`,
            color: tab === t.id ? "#3b82f6" : "#64748b",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            transition: "all 0.15s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        {tab === "usuarios" && (
          <UsersTab users={users} onToggle={toggleUser} onAdd={() => setShowUserDrawer(true)}
            showDrawer={showUserDrawer} setShowDrawer={setShowUserDrawer} addToast={addToast} setUsers={setUsers} />
        )}
        {tab === "camaras" && (
          <CamerasTab cameras={cameras} testingCam={testingCam} testResults={testResults}
            onTest={testCamera} onAdd={() => setShowCameraForm(true)}
            showForm={showCameraForm} setShowForm={setShowCameraForm} addToast={addToast} setCameras={setCameras} />
        )}
        {tab === "ia" && (
          <IATab threshold={threshold} setThreshold={setThreshold}
            history={thresholdHistory}
            onApply={() => setConfirmModal("threshold")} />
        )}
        {tab === "sistema" && (
          <SistemaTab logs={logs} setLogs={setLogs} />
        )}
      </div>

      {/* Confirm modal */}
      <Modal open={!!confirmModal} onClose={() => setConfirmModal(null)} maxWidth={400}>
        <div style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0", margin: "0 0 12px" }}>
            ¿Aplicar cambio de umbral?
          </h3>
          <p style={{ fontSize: 14, color: "#94a3b8", margin: "0 0 20px" }}>
            El nuevo umbral de sensibilidad será <strong style={{ color: "#3b82f6", fontFamily: "JetBrains Mono, monospace" }}>{threshold.toFixed(2)}</strong>.
            Este cambio afectará inmediatamente la detección de alertas en todas las aulas.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={applyThreshold} style={{
              flex: 1, padding: "10px",
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              border: "none", borderRadius: 6,
              color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>Confirmar cambio</button>
            <button onClick={() => setConfirmModal(null)} style={{
              flex: 1, padding: "10px",
              background: "none", border: "1px solid #1e2d4a",
              borderRadius: 6, color: "#64748b", fontSize: 13, cursor: "pointer",
            }}>Cancelar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ─── USERS TAB ────────────────────────────────────────────────────────────────
const UsersTab = ({ users, onToggle, onAdd, showDrawer, setShowDrawer, addToast, setUsers }) => {
  const [form, setForm] = React.useState({ name: "", email: "", role: "docente", password: "" });
  const [errors, setErrors] = React.useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Nombre requerido";
    if (!form.email.includes("@iecol.edu.co")) e.email = "Debe ser un correo @iecol.edu.co";
    if (form.password.length < 6) e.password = "Mínimo 6 caracteres";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;
    const newUser = {
      id: Date.now(), name: form.name, email: form.email,
      role: form.role, active: true, lastSession: "—",
    };
    setUsers(prev => [...prev, newUser]);
    addToast(`Usuario ${form.name} registrado`, "success");
    setShowDrawer(false);
    setForm({ name: "", email: "", role: "docente", password: "" });
    setErrors({});
  };

  return (
    <div style={{ display: "flex", gap: 16 }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 14, color: "#94a3b8" }}>
            {users.length} usuario{users.length !== 1 ? "s" : ""} registrado{users.length !== 1 ? "s" : ""}
          </span>
          <button onClick={onAdd} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
            background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)",
            borderRadius: 6, color: "#3b82f6", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>
            <Icon name="plus" size={14} /> Registrar usuario
          </button>
        </div>
        <div style={{ background: "#131929", border: "1px solid #1e2d4a", borderRadius: 8, overflow: "hidden" }}>
          {/* Table header */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 100px 80px 120px 80px",
            padding: "10px 16px", borderBottom: "1px solid #1e2d4a",
            background: "#0d1321",
          }}>
            {["NOMBRE", "CORREO", "ROL", "ESTADO", "ÚLTIMA SESIÓN", "ACCIONES"].map(h => (
              <div key={h} style={{ fontSize: 10, color: "#475569", fontWeight: 600, letterSpacing: "0.06em" }}>{h}</div>
            ))}
          </div>
          {users.map((u, i) => {
            const roleCfg = ROLE_LABELS[u.role] || { label: u.role, color: "#64748b" };
            return (
              <div key={u.id} style={{
                display: "grid", gridTemplateColumns: "1fr 1fr 100px 80px 120px 80px",
                padding: "12px 16px", alignItems: "center",
                borderBottom: i < users.length - 1 ? "1px solid #1e2d4a" : "none",
              }}>
                <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 500 }}>{u.name}</div>
                <div style={{ fontSize: 12, color: "#64748b", fontFamily: "JetBrains Mono, monospace", overflow: "hidden", textOverflow: "ellipsis" }}>{u.email}</div>
                <div>
                  <span style={{
                    padding: "2px 8px", borderRadius: 4,
                    background: `${roleCfg.color}20`, color: roleCfg.color,
                    fontSize: 11, fontWeight: 600,
                  }}>{roleCfg.label}</span>
                </div>
                <div>
                  <span style={{
                    padding: "2px 8px", borderRadius: 4,
                    background: u.active ? "rgba(34,197,94,0.12)" : "rgba(100,116,139,0.12)",
                    color: u.active ? "#22c55e" : "#64748b",
                    fontSize: 11, fontWeight: 600,
                  }}>{u.active ? "Activo" : "Inactivo"}</span>
                </div>
                <div style={{ fontSize: 11, color: "#475569", fontFamily: "JetBrains Mono, monospace" }}>
                  {u.lastSession === "—" ? "—" : fmt.datetime(u.lastSession)}
                </div>
                <div>
                  <button onClick={() => onToggle(u.id)} style={{
                    padding: "4px 8px",
                    background: u.active ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
                    border: `1px solid ${u.active ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`,
                    borderRadius: 4,
                    color: u.active ? "#ef4444" : "#22c55e",
                    fontSize: 11, cursor: "pointer",
                  }}>
                    {u.active ? "Desactivar" : "Activar"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Drawer */}
      {showDrawer && (
        <div style={{
          width: 300, background: "#131929",
          border: "1px solid #1e2d4a", borderRadius: 8,
          padding: 16, flexShrink: 0,
          animation: "slideInRight 0.2s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>Nuevo Usuario</span>
            <button onClick={() => setShowDrawer(false)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}>
              <Icon name="x" size={16} />
            </button>
          </div>
          {[
            { id: "name", label: "NOMBRE COMPLETO", type: "text", placeholder: "Ej: María Torres" },
            { id: "email", label: "CORREO INSTITUCIONAL", type: "email", placeholder: "usuario@iecol.edu.co" },
            { id: "password", label: "CONTRASEÑA TEMPORAL", type: "password", placeholder: "Mínimo 6 caracteres" },
          ].map(field => (
            <div key={field.id} style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 10, color: "#475569", marginBottom: 4, letterSpacing: "0.06em", fontWeight: 600 }}>
                {field.label}
              </label>
              <input type={field.type} value={form[field.id]}
                onChange={e => setForm(prev => ({ ...prev, [field.id]: e.target.value }))}
                placeholder={field.placeholder}
                style={{
                  width: "100%", padding: "8px 10px",
                  background: "#0b0f1a",
                  border: `1px solid ${errors[field.id] ? "#ef4444" : "#1e2d4a"}`,
                  borderRadius: 4, color: "#e2e8f0", fontSize: 13,
                  outline: "none", boxSizing: "border-box",
                }}
              />
              {errors[field.id] && (
                <div style={{ fontSize: 11, color: "#ef4444", marginTop: 3 }}>{errors[field.id]}</div>
              )}
            </div>
          ))}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 10, color: "#475569", marginBottom: 4, letterSpacing: "0.06em", fontWeight: 600 }}>ROL</label>
            <select value={form.role} onChange={e => setForm(prev => ({ ...prev, role: e.target.value }))}
              style={{
                width: "100%", padding: "8px 10px",
                background: "#0b0f1a", border: "1px solid #1e2d4a",
                borderRadius: 4, color: "#e2e8f0", fontSize: 13, outline: "none",
              }}>
              <option value="docente">Docente</option>
              <option value="coordinador">Coordinador</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>
          <button onClick={handleAdd} style={{
            width: "100%", padding: "10px",
            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            border: "none", borderRadius: 6,
            color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>Registrar usuario</button>
        </div>
      )}
    </div>
  );
};

// ─── CAMERAS TAB ──────────────────────────────────────────────────────────────
const CamerasTab = ({ cameras, testingCam, testResults, onTest, onAdd, showForm, setShowForm, addToast, setCameras }) => {
  const [form, setForm] = React.useState({ name: "", rtsp: "", classroom: "" });

  const handleAdd = () => {
    if (!form.name || !form.rtsp) { addToast("Completa todos los campos", "error"); return; }
    const newCam = {
      id: `CAM-0${cameras.length + 1}`, name: form.name, classroom: form.classroom,
      rtsp: form.rtsp, status: "offline", lastCheck: new Date().toISOString(), fps: 0, resolution: "—",
    };
    setCameras(prev => [...prev, newCam]);
    addToast(`Cámara ${form.name} registrada`, "success");
    setShowForm(false);
    setForm({ name: "", rtsp: "", classroom: "" });
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ fontSize: 14, color: "#94a3b8" }}>{cameras.length} cámara{cameras.length !== 1 ? "s" : ""} registrada{cameras.length !== 1 ? "s" : ""}</span>
        <button onClick={onAdd} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
          background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)",
          borderRadius: 6, color: "#3b82f6", fontSize: 13, fontWeight: 600, cursor: "pointer",
        }}>
          <Icon name="plus" size={14} /> Agregar cámara
        </button>
      </div>

      {showForm && (
        <div style={{
          background: "#131929", border: "1px solid #3b82f6", borderRadius: 8,
          padding: 16, marginBottom: 16, animation: "slideDown 0.2s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>Nueva Cámara</span>
            <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}>
              <Icon name="x" size={16} />
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 10, alignItems: "flex-end" }}>
            {[
              { id: "name", label: "NOMBRE / ID", placeholder: "Cámara 5 — Patio" },
              { id: "rtsp", label: "URL RTSP", placeholder: "rtsp://192.168.1.x/stream" },
              { id: "classroom", label: "AULA ASIGNADA", placeholder: "Ej: Aula 4A" },
            ].map(f => (
              <div key={f.id}>
                <label style={{ display: "block", fontSize: 10, color: "#475569", marginBottom: 4, letterSpacing: "0.06em", fontWeight: 600 }}>{f.label}</label>
                <input value={form[f.id]} onChange={e => setForm(prev => ({ ...prev, [f.id]: e.target.value }))}
                  placeholder={f.placeholder}
                  style={{
                    width: "100%", padding: "8px 10px", background: "#0b0f1a",
                    border: "1px solid #1e2d4a", borderRadius: 4,
                    color: "#e2e8f0", fontSize: 13, outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>
            ))}
            <button onClick={handleAdd} style={{
              padding: "9px 16px",
              background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.4)",
              borderRadius: 6, color: "#22c55e", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>Registrar</button>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {cameras.map(cam => {
          const statusCfg = CAM_STATUS[cam.status] || CAM_STATUS["offline"];
          const testResult = testResults[cam.id];
          const testing = testingCam === cam.id;
          return (
            <div key={cam.id} style={{
              background: "#131929", border: "1px solid #1e2d4a",
              borderRadius: 8, padding: 14,
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: statusCfg.color,
                      display: "inline-block",
                      animation: statusCfg.pulse ? "statusPulse 1.8s infinite" : "none",
                    }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{cam.name}</span>
                  </div>
                  <span style={{
                    fontSize: 10, padding: "2px 6px", borderRadius: 3,
                    background: `${statusCfg.color}20`, color: statusCfg.color,
                    fontWeight: 600,
                  }}>{statusCfg.label.toUpperCase()}</span>
                </div>
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#475569", background: "#0b0f1a", padding: "3px 8px", borderRadius: 3 }}>
                  {cam.id}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 10 }}>
                {[
                  { label: "Aula", value: cam.classroom },
                  { label: "Resolución", value: cam.resolution },
                  { label: "FPS", value: cam.fps > 0 ? cam.fps : "—" },
                  { label: "RTSP", value: cam.rtsp.replace(/(\d+\.\d+\.\d+\.)\d+/, "$1***") },
                ].map(item => (
                  <div key={item.label}>
                    <span style={{ fontSize: 10, color: "#475569" }}>{item.label}: </span>
                    <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "JetBrains Mono, monospace" }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 10, color: "#334155", marginBottom: 10 }}>
                Última verificación: <span style={{ fontFamily: "JetBrains Mono, monospace" }}>
                  {fmt.datetime(cam.lastCheck)}
                </span>
              </div>
              {/* Test result */}
              {testResult && (
                <div style={{
                  padding: "6px 10px", borderRadius: 4, marginBottom: 8,
                  background: testResult === "ok" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                  border: `1px solid ${testResult === "ok" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                  color: testResult === "ok" ? "#22c55e" : "#ef4444",
                  fontSize: 12, display: "flex", alignItems: "center", gap: 6,
                }}>
                  <Icon name={testResult === "ok" ? "check" : "x"} size={12} />
                  {testResult === "ok" ? "Conexión exitosa ✓" : "Error: timeout ✗"}
                </div>
              )}
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => onTest(cam.id)} disabled={testing} style={{
                  flex: 1, padding: "6px 10px",
                  background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)",
                  borderRadius: 4, color: "#3b82f6", fontSize: 12, cursor: testing ? "wait" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                }}>
                  {testing ? (
                    <span style={{ width: 12, height: 12, border: "1.5px solid rgba(59,130,246,0.3)", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                  ) : <Icon name="refresh" size={12} />}
                  {testing ? "Probando..." : "Probar"}
                </button>
                <button style={{
                  flex: 1, padding: "6px 10px",
                  background: "none", border: "1px solid #1e2d4a",
                  borderRadius: 4, color: "#64748b", fontSize: 12, cursor: "pointer",
                }}>Editar</button>
                <button style={{
                  flex: 1, padding: "6px 10px",
                  background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)",
                  borderRadius: 4, color: "#22c55e", fontSize: 12, cursor: "pointer",
                }}>Stream</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── IA TAB ───────────────────────────────────────────────────────────────────
const IATab = ({ threshold, setThreshold, history, onApply }) => {
  const [dragging, setDragging] = React.useState(false);
  const sliderRef = React.useRef(null);
  const minVal = 0.50, maxVal = 0.95;

  const handleSlider = (e) => {
    const rect = sliderRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const val = Math.max(minVal, Math.min(maxVal, minVal + x * (maxVal - minVal)));
    setThreshold(Math.round(val * 100) / 100);
  };

  const pct = ((threshold - minVal) / (maxVal - minVal)) * 100;
  const isLow = threshold < 0.60;
  const isRecommended = threshold >= 0.73 && threshold <= 0.77;

  return (
    <div style={{ maxWidth: 640 }}>
      {/* Warning banner */}
      {isLow && (
        <div style={{
          marginBottom: 20, padding: "10px 14px",
          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: 6, color: "#f87171",
          display: "flex", alignItems: "center", gap: 8, fontSize: 13,
        }}>
          <Icon name="alert" size={16} />
          Umbral bajo: mayor riesgo de falsos positivos. Se recomienda un valor ≥ 0.60.
        </div>
      )}
      {isRecommended && (
        <div style={{
          marginBottom: 20, padding: "10px 14px",
          background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)",
          borderRadius: 6, color: "#22c55e",
          display: "flex", alignItems: "center", gap: 8, fontSize: 13,
        }}>
          <Icon name="check" size={16} />
          Valor dentro del rango recomendado (0.73–0.77).
        </div>
      )}

      <div style={{ background: "#131929", border: "1px solid #1e2d4a", borderRadius: 8, padding: 24, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 4 }}>
              Umbral de Sensibilidad del Modelo
            </div>
            <Tooltip text="Confianza mínima requerida para disparar una alerta. Valores más altos = menos alertas pero más precisas.">
              <div style={{ fontSize: 12, color: "#64748b", cursor: "default" }}>
                Probabilidad mínima de detección — YOLOv8
              </div>
            </Tooltip>
          </div>
          <div style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 32, fontWeight: 800,
            color: isLow ? "#ef4444" : isRecommended ? "#22c55e" : "#3b82f6",
          }}>
            {threshold.toFixed(2)}
          </div>
        </div>

        {/* Slider */}
        <div style={{ marginBottom: 8, position: "relative", paddingTop: 28 }}
          ref={sliderRef}
          onMouseDown={e => { setDragging(true); handleSlider(e); }}
          onMouseMove={e => { if (dragging) handleSlider(e); }}
          onMouseUp={() => setDragging(false)}
          onMouseLeave={() => setDragging(false)}
        >
          {/* Thumb value label */}
          <div style={{
            position: "absolute", top: 0,
            left: `${pct}%`, transform: "translateX(-50%)",
            background: isLow ? "#ef4444" : "#3b82f6",
            color: "#fff", fontSize: 11, fontWeight: 700,
            padding: "2px 6px", borderRadius: 4,
            fontFamily: "JetBrains Mono, monospace",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}>
            {threshold.toFixed(2)}
          </div>

          {/* Track */}
          <div style={{ height: 8, background: "#1e2d4a", borderRadius: 4, cursor: "pointer", position: "relative" }}>
            {/* Fill */}
            <div style={{
              position: "absolute", left: 0, top: 0, height: "100%",
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${isLow ? "#ef4444" : "#f59e0b"}, ${isRecommended ? "#22c55e" : "#3b82f6"})`,
              borderRadius: 4,
            }} />
            {/* Markers */}
            <div style={{ position: "absolute", left: `${((0.60 - minVal) / (maxVal - minVal)) * 100}%`, top: -6, transform: "translateX(-50%)" }}>
              <div style={{ width: 1, height: 20, background: "#f59e0b", opacity: 0.5 }} />
              <div style={{ fontSize: 9, color: "#f59e0b", whiteSpace: "nowrap", marginTop: 2, transform: "translateX(-50%)" }}>0.60</div>
            </div>
            <div style={{ position: "absolute", left: `${((0.75 - minVal) / (maxVal - minVal)) * 100}%`, top: -6, transform: "translateX(-50%)" }}>
              <div style={{ width: 1, height: 20, background: "#22c55e", opacity: 0.5 }} />
              <div style={{ fontSize: 9, color: "#22c55e", whiteSpace: "nowrap", marginTop: 2, transform: "translateX(-50%)" }}>0.75 ✓</div>
            </div>
            {/* Thumb */}
            <div style={{
              position: "absolute", top: "50%",
              left: `${pct}%`, transform: "translate(-50%, -50%)",
              width: 20, height: 20, borderRadius: "50%",
              background: isLow ? "#ef4444" : "#3b82f6",
              border: "3px solid #e2e8f0",
              cursor: "grab", boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
            }} />
          </div>

          {/* Scale labels */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
            <span style={{ fontSize: 10, color: "#475569", fontFamily: "JetBrains Mono, monospace" }}>0.50</span>
            <span style={{ fontSize: 10, color: "#475569", fontFamily: "JetBrains Mono, monospace" }}>0.95</span>
          </div>
        </div>

        {/* Impact preview */}
        <div style={{
          marginTop: 16, padding: "12px", background: "#0b0f1a",
          border: "1px solid #1e2d4a", borderRadius: 6,
        }}>
          <div style={{ fontSize: 11, color: "#475569", marginBottom: 6, fontWeight: 600, letterSpacing: "0.05em" }}>
            IMPACTO ESTIMADO DEL CAMBIO
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { label: "Alertas estimadas", value: Math.round(12 * (1 - (threshold - 0.5) * 1.2)) + "/día", color: "#e2e8f0" },
              { label: "Precisión aprox.", value: `${Math.round(60 + threshold * 45)}%`, color: "#22c55e" },
              { label: "Falsos pos. aprox.", value: `${Math.round(40 - threshold * 40)}%`, color: isLow ? "#ef4444" : "#f59e0b" },
            ].map(item => (
              <div key={item.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: item.color, fontFamily: "JetBrains Mono, monospace" }}>{item.value}</div>
                <div style={{ fontSize: 10, color: "#475569" }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={onApply} style={{
          marginTop: 16, width: "100%", padding: "10px",
          background: "linear-gradient(135deg, #3b82f6, #2563eb)",
          border: "none", borderRadius: 6,
          color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
        }}>Aplicar cambio</button>
      </div>

      {/* History */}
      <div style={{ background: "#131929", border: "1px solid #1e2d4a", borderRadius: 8, padding: 16 }}>
        <div style={{ fontSize: 11, color: "#475569", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 12 }}>
          ÚLTIMOS CAMBIOS DE UMBRAL
        </div>
        {history.slice(-5).reverse().map((h, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 0",
            borderBottom: i < history.slice(-5).length - 1 ? "1px solid #1e2d4a" : "none",
          }}>
            <span style={{
              fontFamily: "JetBrains Mono, monospace", fontSize: 14,
              fontWeight: 700, color: "#3b82f6", minWidth: 40,
            }}>{h.value.toFixed(2)}</span>
            <span style={{ fontSize: 12, color: "#94a3b8", flex: 1 }}>{h.user}</span>
            <span style={{ fontSize: 11, color: "#475569", fontFamily: "JetBrains Mono, monospace" }}>
              {fmt.datetime(h.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── SISTEMA TAB ──────────────────────────────────────────────────────────────
const SistemaTab = ({ logs, setLogs }) => {
  const logsEndRef = React.useRef(null);
  const perf = window.MOCK_DATA.performanceStats;
  const modules = window.MOCK_DATA.systemModules;

  React.useEffect(() => {
    const interval = setInterval(() => {
      const msgs = [
        "Frame procesado — latencia 36ms",
        "Stream CAM-01 estable",
        "Inferencia batch OK — 39ms/frame",
        "Keep-alive BD confirmado",
        "CAM-04 sin respuesta — reintentando...",
      ];
      const levels = ["INFO", "INFO", "INFO", "WARN"];
      const modules_list = ["IA", "Captura", "BD", "Notificaciones"];
      setLogs(prev => [
        ...prev.slice(-19),
        {
          id: Date.now(),
          level: levels[Math.floor(Math.random() * levels.length)],
          module: modules_list[Math.floor(Math.random() * modules_list.length)],
          msg: msgs[Math.floor(Math.random() * msgs.length)],
          time: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        }
      ]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.parentElement.scrollTop = logsEndRef.current.parentElement.scrollHeight;
    }
  }, [logs]);

  const LOG_COLORS = { INFO: "#3b82f6", WARN: "#f59e0b", ERROR: "#ef4444" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Module status */}
      <div style={{ background: "#131929", border: "1px solid #1e2d4a", borderRadius: 8, padding: 16 }}>
        <div style={{ fontSize: 11, color: "#475569", fontWeight: 600, letterSpacing: "0.08em", marginBottom: 12 }}>
          ESTADO DE MÓDULOS
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          {modules.map((mod) => (
            <div key={mod.name} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px",
              background: "#0b0f1a", border: "1px solid #1e2d4a",
              borderRadius: 6,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: mod.status === "ok" ? "#22c55e" : mod.status === "warn" ? "#f59e0b" : "#ef4444",
                animation: "statusPulse 2s infinite",
                flexShrink: 0,
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "#e2e8f0" }}>{mod.name}</div>
                <div style={{ fontSize: 11, color: "#475569" }}>{mod.detail}</div>
              </div>
              <span style={{
                fontSize: 10, padding: "2px 6px", borderRadius: 3,
                background: mod.status === "ok" ? "rgba(34,197,94,0.12)" : mod.status === "warn" ? "rgba(245,158,11,0.12)" : "rgba(239,68,68,0.12)",
                color: mod.status === "ok" ? "#22c55e" : mod.status === "warn" ? "#f59e0b" : "#ef4444",
                fontWeight: 600,
              }}>{mod.status === "ok" ? "OK" : mod.status === "warn" ? "WARN" : "ERROR"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Performance stats */}
      <div style={{ background: "#131929", border: "1px solid #1e2d4a", borderRadius: 8, padding: 16 }}>
        <div style={{ fontSize: 11, color: "#475569", fontWeight: 600, letterSpacing: "0.08em", marginBottom: 12 }}>
          RENDIMIENTO EN TIEMPO REAL
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {[
            { label: "FPS prom.", value: perf.fps, suffix: "fps", color: "#3b82f6" },
            { label: "Inferencia", value: perf.inferenceMs, suffix: "ms", color: "#22c55e" },
            { label: "CPU", value: perf.cpuPercent, suffix: "%", color: perf.cpuPercent > 70 ? "#ef4444" : "#f59e0b" },
            { label: "RAM", value: perf.ramPercent, suffix: "%", color: perf.ramPercent > 70 ? "#ef4444" : "#3b82f6" },
          ].map(item => (
            <div key={item.label} style={{
              padding: "12px", background: "#0b0f1a",
              border: "1px solid #1e2d4a", borderRadius: 6, textAlign: "center",
            }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: item.color, fontFamily: "JetBrains Mono, monospace" }}>
                {item.value}<span style={{ fontSize: 12 }}>{item.suffix}</span>
              </div>
              <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Logs */}
      <div style={{ background: "#131929", border: "1px solid #1e2d4a", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", borderBottom: "1px solid #1e2d4a", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#475569", fontWeight: 600, letterSpacing: "0.08em", flex: 1 }}>LOG DE EVENTOS</span>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", animation: "statusPulse 1.5s infinite" }} />
          <span style={{ fontSize: 10, color: "#22c55e" }}>EN VIVO</span>
        </div>
        <div style={{
          height: 220, overflowY: "auto", padding: "8px 0",
          fontFamily: "JetBrains Mono, monospace",
          background: "#070a12",
        }}>
          {logs.map((log, i) => (
            <div key={log.id} style={{
              padding: "3px 14px",
              fontSize: 12,
              display: "flex", gap: 10, alignItems: "flex-start",
              animation: i === logs.length - 1 ? "fadeIn 0.3s ease" : "none",
            }}>
              <span style={{ color: "#334155", minWidth: 60 }}>{log.time}</span>
              <span style={{
                minWidth: 46, fontSize: 10, fontWeight: 700,
                color: LOG_COLORS[log.level] || "#64748b",
              }}>{log.level}</span>
              <span style={{ color: "#475569", minWidth: 100 }}>[{log.module}]</span>
              <span style={{ color: "#64748b" }}>{log.msg}</span>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { AdminPanel, UsersTab, CamerasTab, IATab, SistemaTab });
