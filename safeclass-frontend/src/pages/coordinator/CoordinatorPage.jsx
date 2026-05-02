import { useState } from 'react';
import { KPICard }          from '@/components/dashboard';
import { BarChart, TypeChart, Heatmap, ClassroomRanking } from '@/components/coordinator';
import { mockCoordinatorStats } from '@/data/mockData';

const PERIODS = [
  { id: 'weekly',    label: 'Semana'        },
  { id: 'monthly',   label: 'Mes'           },
  { id: 'quarterly', label: 'Trimestre'     },
  { id: 'yearly',    label: 'Año académico' },
];

export default function CoordinatorPage() {
  const [period, setPeriod] = useState('weekly');
  const data = mockCoordinatorStats[period] ?? mockCoordinatorStats.weekly;

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

      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
        {/* KPIs — reutiliza KPICard del dashboard */}
        <div className="grid grid-cols-4 gap-3">
          <KPICard label="Alertas totales"    value={data.kpis.totalAlerts}                              icon="bell"    color="#3b82f6" />
          <KPICard label="Tasa F. Positivos"  value={`${(data.kpis.falsePositiveRate * 100).toFixed(0)}%`} icon="x"       color="#64748b" />
          <KPICard label="Aula más activa"    value={data.kpis.topClassroom}                             icon="camera"  color="#f59e0b" />
          <KPICard label="T. resp. prom."     value={`${data.kpis.avgResponseMin}m`}                     icon="history" color="#22c55e" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-card border border-[#1e2d4a] rounded-lg p-4">
            <h4 className="text-xs font-semibold text-text-secondary mb-4">Alertas por día</h4>
            <BarChart data={data.byDay.map((d) => ({ label: d.day, value: d.alerts }))} />
          </div>

          <div className="bg-surface-card border border-[#1e2d4a] rounded-lg p-4">
            <h4 className="text-xs font-semibold text-text-secondary mb-4">Por tipo</h4>
            <TypeChart data={data.byType} />
          </div>
        </div>

        <div className="bg-surface-card border border-[#1e2d4a] rounded-lg p-4">
          <h4 className="text-xs font-semibold text-text-secondary mb-4">Ranking de aulas</h4>
          <ClassroomRanking items={data.classroomRanking} />
        </div>

        <div className="bg-surface-card border border-[#1e2d4a] rounded-lg p-4">
          <h4 className="text-xs font-semibold text-text-secondary mb-4">Mapa de calor — alertas por hora/día</h4>
          <Heatmap rows={data.heatmap} />
        </div>
      </div>
    </div>
  );
}
