// Vista 4: Historial de Alertas

const HistoryView = ({ alerts: initialAlerts, classrooms, onAlertClick }) => {
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState([]);
  const [statusFilter, setStatusFilter] = React.useState("Todos");
  const [classroomFilter, setClassroomFilter] = React.useState("Todas");
  const [page, setPage] = React.useState(1);
  const [expandedId, setExpandedId] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const PER_PAGE = 5;

  const allTypes = ["AGRESIÓN", "AISLAMIENTO", "CAÍDA", "OTRO"];
  const statusChips = ["Todos", "PENDIENTE", "CONFIRMADA", "DESCARTADA"];

  const filtered = initialAlerts.filter(a => {
    if (typeFilter.length > 0 && !typeFilter.includes(a.type)) return false;
    if (statusFilter !== "Todos" && a.status !== statusFilter) return false;
    if (classroomFilter !== "Todas" && a.classroom !== classroomFilter) return false;
    if (dateFrom) {
      const from = new Date(dateFrom);
      if (new Date(a.timestamp) < from) return false;
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setDate(to.getDate() + 1);
      if (new Date(a.timestamp) > to) return false;
    }
    return true;
  });

  const paginated = filtered.slice(0, page * PER_PAGE);
  const hasMore = paginated.length < filtered.length;

  const toggleType = (t) => {
    setTypeFilter(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
    setPage(1);
  };

  const loadMore = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setPage(p => p + 1); }, 600);
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0", margin: 0 }}>Historial de Alertas</h2>
          <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0" }}>
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 14px",
          background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)",
          borderRadius: 6, color: "#3b82f6", fontSize: 13, fontWeight: 600,
          cursor: "pointer",
        }}>
          <Icon name="download" size={14} /> Exportar PDF
        </button>
      </div>

      {/* Filters */}
      <div style={{
        background: "#131929", border: "1px solid #1e2d4a",
        borderRadius: 8, padding: 16, marginBottom: 16,
        display: "flex", flexWrap: "wrap", gap: 14, alignItems: "flex-end",
      }}>
        {/* Date range */}
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <div>
            <label style={{ display: "block", fontSize: 10, color: "#475569", marginBottom: 4, letterSpacing: "0.06em" }}>DESDE</label>
            <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }}
              style={{
                background: "#0b0f1a", border: "1px solid #1e2d4a", borderRadius: 4,
                color: "#e2e8f0", fontSize: 13, padding: "6px 10px", outline: "none",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, color: "#475569", marginBottom: 4, letterSpacing: "0.06em" }}>HASTA</label>
            <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }}
              style={{
                background: "#0b0f1a", border: "1px solid #1e2d4a", borderRadius: 4,
                color: "#e2e8f0", fontSize: 13, padding: "6px 10px", outline: "none",
              }}
            />
          </div>
        </div>

        {/* Type multi-select */}
        <div>
          <label style={{ display: "block", fontSize: 10, color: "#475569", marginBottom: 4, letterSpacing: "0.06em" }}>TIPO DE CONDUCTA</label>
          <div style={{ display: "flex", gap: 6 }}>
            {allTypes.map(t => {
              const cfg = ALERT_CONFIG[t];
              const active = typeFilter.includes(t);
              return (
                <button key={t} onClick={() => toggleType(t)} style={{
                  padding: "5px 10px",
                  background: active ? cfg.bg : "none",
                  border: `1px solid ${active ? cfg.color : "#1e2d4a"}`,
                  borderRadius: 4, color: active ? cfg.color : "#64748b",
                  fontSize: 11, fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  <Icon name={cfg.icon} size={10} /> {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status chips */}
        <div>
          <label style={{ display: "block", fontSize: 10, color: "#475569", marginBottom: 4, letterSpacing: "0.06em" }}>ESTADO</label>
          <div style={{ display: "flex", gap: 6 }}>
            {statusChips.map(s => {
              const active = statusFilter === s;
              const cfg = STATUS_CONFIG[s];
              return (
                <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} style={{
                  padding: "5px 10px",
                  background: active ? (cfg?.bg || "rgba(59,130,246,0.12)") : "none",
                  border: `1px solid ${active ? (cfg?.color || "#3b82f6") : "#1e2d4a"}`,
                  borderRadius: 4,
                  color: active ? (cfg?.color || "#3b82f6") : "#64748b",
                  fontSize: 11, fontWeight: 600, cursor: "pointer",
                }}>
                  {s === "Todos" ? "Todos" : (cfg?.label || s)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Classroom */}
        <div>
          <label style={{ display: "block", fontSize: 10, color: "#475569", marginBottom: 4, letterSpacing: "0.06em" }}>AULA</label>
          <select value={classroomFilter} onChange={e => { setClassroomFilter(e.target.value); setPage(1); }}
            style={{
              background: "#0b0f1a", border: "1px solid #1e2d4a", borderRadius: 4,
              color: "#e2e8f0", fontSize: 13, padding: "6px 10px", outline: "none",
            }}>
            <option value="Todas">Todas las aulas</option>
            {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#131929", border: "1px solid #1e2d4a", borderRadius: 8, overflow: "hidden" }}>
        {/* Header row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "160px 80px 160px 120px 120px 100px",
          gap: 0, padding: "10px 16px",
          borderBottom: "1px solid #1e2d4a",
          background: "#0d1321",
        }}>
          {["TIPO", "AULA", "FECHA Y HORA", "CONFIANZA", "ESTADO", "ACCIONES"].map(h => (
            <div key={h} style={{ fontSize: 10, color: "#475569", fontWeight: 600, letterSpacing: "0.06em" }}>{h}</div>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{
            padding: "48px 24px", textAlign: "center",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
          }}>
            <div style={{ color: "#1e2d4a" }}>
              <Icon name="filter" size={40} />
            </div>
            <div style={{ fontSize: 15, color: "#64748b", fontWeight: 500 }}>Sin resultados</div>
            <div style={{ fontSize: 13, color: "#334155" }}>
              Ninguna alerta coincide con los filtros seleccionados
            </div>
            <button onClick={() => { setTypeFilter([]); setStatusFilter("Todos"); setClassroomFilter("Todas"); setDateFrom(""); setDateTo(""); }}
              style={{
                padding: "8px 14px",
                background: "none", border: "1px solid #1e2d4a",
                borderRadius: 6, color: "#64748b", fontSize: 13, cursor: "pointer",
              }}>
              Limpiar filtros
            </button>
          </div>
        ) : (
          paginated.map((alert, idx) => {
            const cfg = ALERT_CONFIG[alert.type] || ALERT_CONFIG["OTRO"];
            const expanded = expandedId === alert.id;
            return (
              <div key={alert.id} style={{
                borderBottom: idx < paginated.length - 1 ? "1px solid #1e2d4a" : "none",
                background: expanded ? "rgba(59,130,246,0.04)" : "transparent",
                transition: "background 0.15s",
              }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "160px 80px 160px 120px 120px 100px",
                    gap: 0, padding: "12px 16px",
                    cursor: "pointer", alignItems: "center",
                  }}
                  onClick={() => setExpandedId(expanded ? null : alert.id)}
                >
                  {/* Type */}
                  <div>
                    <AlertTypeBadge type={alert.type} />
                  </div>
                  {/* Classroom */}
                  <div style={{ fontSize: 13, color: "#94a3b8" }}>{alert.classroom}</div>
                  {/* Timestamp */}
                  <div style={{ fontSize: 12, color: "#64748b", fontFamily: "JetBrains Mono, monospace" }}>
                    {fmt.datetime(alert.timestamp)}
                  </div>
                  {/* Confidence */}
                  <div><ConfidenceBar value={alert.confidence} /></div>
                  {/* Status */}
                  <div><StatusBadge status={alert.status} /></div>
                  {/* Actions */}
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={e => { e.stopPropagation(); onAlertClick(alert); }} style={{
                      padding: "4px 8px",
                      background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
                      borderRadius: 4, color: "#3b82f6", fontSize: 11, cursor: "pointer",
                    }}>
                      Ver
                    </button>
                  </div>
                </div>

                {/* Expanded row */}
                {expanded && (
                  <div style={{
                    padding: "12px 16px 16px",
                    borderTop: "1px solid #1e2d4a",
                    display: "flex", gap: 16, alignItems: "flex-start",
                    animation: "slideDown 0.2s ease",
                  }}>
                    {/* Thumbnail */}
                    <div style={{
                      width: 120, height: 80,
                      background: "#0b0f1a", border: "1px solid #1e2d4a",
                      borderRadius: 4, flexShrink: 0, overflow: "hidden",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      position: "relative",
                    }}>
                      <svg viewBox="0 0 120 80" style={{ width: "100%", opacity: 0.25 }}>
                        {[20, 50, 80, 100].map((x, i) => (
                          <g key={i} transform={`translate(${x}, 20)`}>
                            <circle cx="0" cy="0" r="5" fill="#64748b"/>
                            <rect x="-4" y="7" width="8" height="14" rx="2" fill="#64748b"/>
                          </g>
                        ))}
                      </svg>
                      <div style={{
                        position: "absolute", top: 4, left: 4,
                        background: "rgba(0,0,0,0.7)", padding: "1px 5px",
                        borderRadius: 2, fontSize: 9, color: "#64748b",
                        fontFamily: "JetBrains Mono, monospace",
                      }}>{alert.cameraId}</div>
                      <div style={{
                        position: "absolute", bottom: 4, right: 4,
                        background: `${cfg.color}22`, border: `1px solid ${cfg.color}44`,
                        padding: "1px 5px", borderRadius: 2,
                        fontSize: 9, color: cfg.color, fontWeight: 600,
                      }}>{alert.type}</div>
                    </div>
                    {/* Meta */}
                    <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {[
                        { label: "Cámara", value: alert.cameraId },
                        { label: "ID Alerta", value: alert.id, mono: true },
                        { label: "Confianza IA", value: fmt.confidence(alert.confidence) },
                        { label: "Motivo descarte", value: alert.discardReason || "—" },
                      ].map(item => (
                        <div key={item.label}>
                          <span style={{ fontSize: 11, color: "#475569" }}>{item.label}: </span>
                          <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: item.mono ? "JetBrains Mono, monospace" : "inherit" }}>
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button onClick={e => { e.stopPropagation(); onAlertClick(alert); }} style={{
                      padding: "8px 14px",
                      background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)",
                      borderRadius: 6, color: "#3b82f6", fontSize: 12, fontWeight: 600,
                      cursor: "pointer", flexShrink: 0,
                    }}>
                      Ver detalle completo
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Load more */}
        {hasMore && (
          <div style={{ padding: "14px", borderTop: "1px solid #1e2d4a", textAlign: "center" }}>
            <button onClick={loadMore} disabled={loading} style={{
              padding: "8px 20px",
              background: "none", border: "1px solid #1e2d4a",
              borderRadius: 6, color: "#64748b", fontSize: 13, cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}>
              {loading ? (
                <span style={{ width: 14, height: 14, border: "2px solid #1e2d4a", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
              ) : <Icon name="chevronDown" size={14} />}
              {loading ? "Cargando..." : `Cargar más (${filtered.length - paginated.length} restantes)`}
            </button>
          </div>
        )}
      </div>

      {/* Pagination info */}
      {filtered.length > 0 && (
        <div style={{ marginTop: 12, fontSize: 12, color: "#475569", textAlign: "center" }}>
          Mostrando {Math.min(paginated.length, filtered.length)} de {filtered.length} registros
        </div>
      )}
    </div>
  );
};

Object.assign(window, { HistoryView });
