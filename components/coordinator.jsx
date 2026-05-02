// Vista 5: Coordinator Dashboard

const CoordinatorDashboard = ({ stats }) => {
  const [period, setPeriod] = React.useState("weekly");
  const data = stats[period] || stats.weekly;
  const periods = [
    { id: "weekly", label: "Semana" },
    { id: "monthly", label: "Mes" },
    { id: "quarterly", label: "Trimestre" },
    { id: "yearly", label: "Año académico" },
  ];

  const maxDay = Math.max(...data.byDay.map(d => d.alerts));
  const maxRank = data.classroomRanking[0]?.count || 1;
  const totalType = data.byType.reduce((s, t) => s + t.count, 0);

  // Heatmap intensity
  const maxHeat = Math.max(...data.heatmap.map(row => Math.max(...row.slice(1))));

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0", margin: 0 }}>Dashboard Coordinador</h2>
          <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0" }}>Análisis de incidencias — IE Colombia Rural</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* Period selector */}
          <div style={{
            display: "flex", background: "#0b0f1a",
            border: "1px solid #1e2d4a", borderRadius: 6, overflow: "hidden",
          }}>
            {periods.map(p => (
              <button key={p.id} onClick={() => setPeriod(p.id)} style={{
                padding: "7px 14px",
                background: period === p.id ? "rgba(59,130,246,0.15)" : "none",
                border: "none",
                color: period === p.id ? "#3b82f6" : "#64748b",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
                borderRight: "1px solid #1e2d4a",
              }}>{p.label}</button>
            ))}
          </div>
          <button style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
            background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)",
            borderRadius: 6, color: "#3b82f6", fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>
            <Icon name="download" size={13} /> Exportar PDF
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          {
            label: "Total Alertas", value: data.kpis.totalAlerts,
            color: "#3b82f6", icon: "bell",
            sub: "en el periodo", trend: null,
          },
          {
            label: "Falsos Positivos", value: `${Math.round(data.kpis.falsePositiveRate * 100)}%`,
            color: "#f59e0b", icon: "alert",
            sub: "del total de alertas",
            trend: data.kpis.falsePositiveRate > 0.15 ? "up" : "down",
            trendBad: true,
          },
          {
            label: "Aula Más Incidentes", value: data.kpis.topClassroom,
            color: "#ef4444", icon: "camera",
            sub: `${data.kpis.topClassroomCount} alertas`, trend: null,
          },
          {
            label: "T. Respuesta Prom.", value: `${data.kpis.avgResponseMin}min`,
            color: "#22c55e", icon: "history",
            sub: "por alerta", trend: "down", trendBad: false,
          },
        ].map((kpi, i) => (
          <div key={i} style={{
            padding: "16px",
            background: "#131929", border: "1px solid #1e2d4a",
            borderRadius: 8,
            borderTop: `3px solid ${kpi.color}`,
            animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600, letterSpacing: "0.05em" }}>
                {kpi.label.toUpperCase()}
              </span>
              <span style={{ color: `${kpi.color}99` }}>
                <Icon name={kpi.icon} size={14} />
              </span>
            </div>
            <div style={{
              fontSize: 28, fontWeight: 800, color: kpi.color,
              fontFamily: "JetBrains Mono, monospace",
              lineHeight: 1, marginBottom: 4,
            }}>{kpi.value}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {kpi.trend && (
                <span style={{ color: kpi.trend === "up" ? (kpi.trendBad ? "#ef4444" : "#22c55e") : (kpi.trendBad ? "#22c55e" : "#f59e0b") }}>
                  <Icon name={kpi.trend === "up" ? "arrowUp" : "arrowDown"} size={12} />
                </span>
              )}
              <span style={{ fontSize: 11, color: "#475569" }}>{kpi.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, marginBottom: 16 }}>
        {/* Bar chart */}
        <div style={{
          background: "#131929", border: "1px solid #1e2d4a",
          borderRadius: 8, padding: 16,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 16, letterSpacing: "0.05em" }}>
            ALERTAS POR DÍA
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
            {data.byDay.map((d, i) => (
              <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 10, color: "#64748b", fontFamily: "JetBrains Mono, monospace" }}>{d.alerts}</span>
                <div style={{ width: "100%", position: "relative", height: 90 }}>
                  <div style={{
                    position: "absolute", bottom: 0, width: "100%",
                    height: `${(d.alerts / maxDay) * 90}px`,
                    background: `linear-gradient(180deg, #3b82f6, #1d4ed8)`,
                    borderRadius: "3px 3px 0 0",
                    animation: `growUp 0.5s ease ${i * 0.07}s both`,
                    minHeight: 4,
                  }} />
                </div>
                <span style={{ fontSize: 11, color: "#475569" }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Donut chart */}
        <div style={{
          background: "#131929", border: "1px solid #1e2d4a",
          borderRadius: 8, padding: 16,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 12, letterSpacing: "0.05em" }}>
            POR TIPO DE CONDUCTA
          </div>
          <DonutChart data={data.byType} total={totalType} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
            {data.byType.map(t => (
              <div key={t.type} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: "#94a3b8", flex: 1 }}>{t.type}</span>
                <span style={{ fontSize: 11, color: "#64748b", fontFamily: "JetBrains Mono, monospace" }}>
                  {Math.round(t.count / totalType * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap + Ranking */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}>
        {/* Heatmap */}
        <div style={{
          background: "#131929", border: "1px solid #1e2d4a",
          borderRadius: 8, padding: 16,
        }}>
          <Tooltip text="Concentración de alertas por franja horaria y día de la semana">
            <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 12, letterSpacing: "0.05em", cursor: "default" }}>
              MAPA DE CALOR — DISTRIBUCIÓN TEMPORAL
            </div>
          </Tooltip>
          <div style={{ overflowX: "auto" }}>
            <HeatmapChart data={data.heatmap} maxVal={maxHeat} />
          </div>
        </div>

        {/* Ranking */}
        <div style={{
          background: "#131929", border: "1px solid #1e2d4a",
          borderRadius: 8, padding: 16,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 12, letterSpacing: "0.05em" }}>
            RANKING DE AULAS
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {data.classroomRanking.map((cl, i) => (
              <div key={cl.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{
                      width: 18, height: 18,
                      borderRadius: 4,
                      background: i === 0 ? "#ef4444" : i === 1 ? "#f59e0b" : "#3b82f6",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, fontWeight: 700, color: "#fff",
                    }}>{i + 1}</span>
                    <span style={{ fontSize: 13, color: "#e2e8f0" }}>{cl.name}</span>
                  </div>
                  <span style={{ fontSize: 13, color: "#64748b", fontFamily: "JetBrains Mono, monospace" }}>{cl.count}</span>
                </div>
                <div style={{ height: 4, background: "#1e2d4a", borderRadius: 2 }}>
                  <div style={{
                    height: "100%",
                    width: `${(cl.count / maxRank) * 100}%`,
                    background: i === 0 ? "#ef4444" : i === 1 ? "#f59e0b" : "#3b82f6",
                    borderRadius: 2,
                    animation: `growRight 0.5s ease ${i * 0.1}s both`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── DONUT CHART ──────────────────────────────────────────────────────────────
const DonutChart = ({ data, total }) => {
  const size = 100, cx = 50, cy = 50, r = 36, strokeW = 16;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  const segments = data.map(d => {
    const pct = d.count / total;
    const seg = { ...d, pct, dasharray: `${pct * circumference} ${circumference}`, dashoffset: -offset * circumference };
    offset += pct;
    return seg;
  });

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        {segments.map((seg, i) => (
          <circle key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeW}
            strokeDasharray={seg.dasharray}
            strokeDashoffset={seg.dashoffset}
            style={{ animation: `donutGrow 0.6s ease ${i * 0.1}s both` }}
          />
        ))}
        {/* Center */}
        <text x={cx} y={cy + 5} textAnchor="middle" fill="#e2e8f0"
          fontSize="14" fontWeight="700" fontFamily="JetBrains Mono, monospace"
          style={{ transform: "rotate(90deg)", transformOrigin: "50% 50%" }}>
          {total}
        </text>
      </svg>
    </div>
  );
};

// ─── HEATMAP CHART ────────────────────────────────────────────────────────────
const HeatmapChart = ({ data, maxVal }) => {
  const days = ["Lun", "Mar", "Mié", "Jue", "Vie"];
  return (
    <div>
      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "80px repeat(5, 1fr)", gap: 3, marginBottom: 4 }}>
        <div />
        {days.map(d => (
          <div key={d} style={{ fontSize: 10, color: "#475569", textAlign: "center" }}>{d}</div>
        ))}
      </div>
      {data.map((row, ri) => (
        <div key={ri} style={{ display: "grid", gridTemplateColumns: "80px repeat(5, 1fr)", gap: 3, marginBottom: 3 }}>
          <div style={{ fontSize: 10, color: "#475569", display: "flex", alignItems: "center" }}>{row[0]}</div>
          {row.slice(1).map((val, ci) => {
            const intensity = maxVal > 0 ? val / maxVal : 0;
            return (
              <Tooltip key={ci} text={`${days[ci]} ${row[0]}: ${val} alerta${val !== 1 ? "s" : ""}`}>
                <div style={{
                  height: 22, borderRadius: 3,
                  background: intensity === 0
                    ? "#1e2d4a"
                    : `rgba(59,130,246,${0.15 + intensity * 0.85})`,
                  cursor: "default",
                  transition: "background 0.2s",
                }} />
              </Tooltip>
            );
          })}
        </div>
      ))}
      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
        <span style={{ fontSize: 10, color: "#334155" }}>Menos</span>
        {[0.1, 0.3, 0.55, 0.75, 1].map((v, i) => (
          <div key={i} style={{ width: 14, height: 14, borderRadius: 2, background: `rgba(59,130,246,${v})` }} />
        ))}
        <span style={{ fontSize: 10, color: "#334155" }}>Más</span>
      </div>
    </div>
  );
};

Object.assign(window, { CoordinatorDashboard, DonutChart, HeatmapChart });
