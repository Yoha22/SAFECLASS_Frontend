import { useState, useEffect } from 'react';
import { KPICard }          from '@/components/dashboard';
import { BarChart, TypeChart, Heatmap, ClassroomRanking } from '@/components/coordinator';
import { apiFetch } from '@/api/client';

const PERIODS = [
  { id: 'weekly',    label: 'Semana'        },
  { id: 'monthly',   label: 'Mes'           },
  { id: 'quarterly', label: 'Trimestre'     },
  { id: 'yearly',    label: 'Año académico' },
];

const TYPE_COLORS = {
  AGRESION:    '#ef4444',
  AISLAMIENTO: '#f59e0b',
  CAIDA:       '#3b82f6',
  OTRO:        '#64748b',
};

const TYPE_LABELS = {
  AGRESION: 'Agresión', AISLAMIENTO: 'Aislamiento', CAIDA: 'Caída', OTRO: 'Otro',
};

function buildBarData(byDay) {
  return byDay.map((d) => ({ label: d.date.slice(5), value: d.count }));
}

function buildTypeData(byType) {
  return byType.map((t) => ({
    type:  TYPE_LABELS[t.type] ?? t.type,
    count: t.count,
    color: TYPE_COLORS[t.type] ?? '#64748b',
  }));
}

function buildHeatmapRows(flat) {
  const workHours = Array.from({ length: 11 }, (_, i) => i + 7);
  return workHours.map((h) => {
    const label = `${h}:00–${h + 1}:00`;
    const vals = [1, 2, 3, 4, 5].map((d) => {
      const entry = flat.find((e) => e.day === d && e.hour === h);
      return entry?.count ?? 0;
    });
    return [label, ...vals];
  });
}

function buildKPIs(raw) {
  const total   = raw.byDay.reduce((s, d) => s + d.count, 0);
  const top     = raw.classroomRanking[0] ?? null;
  const discarded = raw.byType.reduce((s) => s, 0);
  return {
    totalAlerts:        total,
    falsePositiveRate:  null,
    topClassroom:       top ? top.classroom : '—',
    avgResponseMin:     null,
  };
}

export default function CoordinatorPage() {
  const [period,  setPeriod]  = useState('weekly');
  const [raw,     setRaw]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    apiFetch(`/api/stats/coordinator?period=${period}`)
      .then((data) => { setRaw(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [period]);

  const kpis        = raw ? buildKPIs(raw)                       : null;
  const barData     = raw ? buildBarData(raw.byDay)              : [];
  const typeData    = raw ? buildTypeData(raw.byType)            : [];
  const heatmapRows = raw ? buildHeatmapRows(raw.heatmap)        : [];
  const rankingItems= raw ? raw.classroomRanking.map((r) => ({ name: r.classroom, count: r.count })) : [];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-3.5 border-b border-[#1e2d4a] flex items-center justify-between shrink-0 flex-wrap gap-3">
        <div>
          <h2 className="text-base font-bold text-text-primary">Dashboard Coordinador</h2>
          <p className="text-xs text-text-hint mt-0.5">Análisis de incidencias — IE Colombia Rural</p>
        </div>
        <div className="flex bg-surface border border-[#1e2d4a] rounded-md overflow-hidden">
          {PERIODS.map((p) => (
            <button key={p.id} onClick={() => setPeriod(p.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                period === p.id ? 'bg-blue-500/10 text-blue-400' : 'text-text-hint hover:text-text-secondary'
              }`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex-1 flex items-center justify-center text-text-hint text-sm">
          Cargando estadísticas…
        </div>
      )}

      {error && !loading && (
        <div className="flex-1 flex items-center justify-center text-red-400 text-sm">
          Error al cargar datos: {error}
        </div>
      )}

      {!loading && !error && raw && (
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {/* KPIs */}
          <div className="grid grid-cols-4 gap-3">
            <KPICard label="Alertas totales"   value={kpis.totalAlerts}                                    icon="bell"    color="#3b82f6" />
            <KPICard label="Tasa F. Positivos" value="—"                                                   icon="x"       color="#64748b" />
            <KPICard label="Aula más activa"   value={kpis.topClassroom}                                   icon="camera"  color="#f59e0b" />
            <KPICard label="T. resp. prom."    value="—"                                                   icon="history" color="#22c55e" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-card border border-[#1e2d4a] rounded-lg p-4">
              <h4 className="text-xs font-semibold text-text-secondary mb-4">Alertas por día</h4>
              <BarChart data={barData} />
            </div>

            <div className="bg-surface-card border border-[#1e2d4a] rounded-lg p-4">
              <h4 className="text-xs font-semibold text-text-secondary mb-4">Por tipo</h4>
              <TypeChart data={typeData} />
            </div>
          </div>

          <div className="bg-surface-card border border-[#1e2d4a] rounded-lg p-4">
            <h4 className="text-xs font-semibold text-text-secondary mb-4">Ranking de aulas</h4>
            <ClassroomRanking items={rankingItems} />
          </div>

          <div className="bg-surface-card border border-[#1e2d4a] rounded-lg p-4">
            <h4 className="text-xs font-semibold text-text-secondary mb-4">Mapa de calor — alertas por hora/día</h4>
            <Heatmap rows={heatmapRows} />
          </div>
        </div>
      )}
    </div>
  );
}
