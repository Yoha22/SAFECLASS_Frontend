import { useState } from 'react';
import Icon from '@/components/ui/Icon';
import { mockCoordinatorStats } from '@/data/mockData';

const PERIODS = [
  { id: 'weekly',    label: 'Semana'         },
  { id: 'monthly',   label: 'Mes'            },
  { id: 'quarterly', label: 'Trimestre'      },
  { id: 'yearly',    label: 'Año académico'  },
];

export default function CoordinatorPage() {
  const [period, setPeriod] = useState('weekly');
  const data = mockCoordinatorStats[period] ?? mockCoordinatorStats.weekly;
  const maxDay  = Math.max(...data.byDay.map((d) => d.alerts), 1);
  const maxRank = data.classroomRanking[0]?.count ?? 1;
  const maxHeat = Math.max(...data.heatmap.map((r) => Math.max(...r.slice(1))), 1);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-3.5 border-b border-[#1e2d4a] flex items-center justify-between shrink-0 flex-wrap gap-3">
        <div>
          <h2 className="text-base font-bold text-text-primary">Dashboard Coordinador</h2>
          <p className="text-xs text-text-hint mt-0.5">Análisis de incidencias — IE Colombia Rural</p>
        </div>

        {/* Period selector */}
        <div className="flex bg-surface border border-[#1e2d4a] rounded-md overflow-hidden">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                period === p.id ? 'bg-blue-500/10 text-blue-400' : 'text-text-hint hover:text-text-secondary'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Alertas totales',   value: data.kpis.totalAlerts,                              icon: 'bell',    color: '#3b82f6' },
            { label: 'Tasa F. Positivos', value: `${(data.kpis.falsePositiveRate * 100).toFixed(0)}%`, icon: 'x',       color: '#64748b' },
            { label: 'Aula más activa',   value: data.kpis.topClassroom,                             icon: 'camera',  color: '#f59e0b' },
            { label: 'T. resp. prom.',    value: `${data.kpis.avgResponseMin}m`,                     icon: 'history', color: '#22c55e' },
          ].map((k) => (
            <div key={k.label} className="bg-surface-card border border-[#1e2d4a] rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <span style={{ color: k.color }}><Icon name={k.icon} size={13} /></span>
                <span className="text-[11px] text-text-hint">{k.label}</span>
              </div>
              <div className="text-lg font-bold text-text-primary font-mono truncate">{k.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Bar chart — by day */}
          <div className="bg-surface-card border border-[#1e2d4a] rounded-lg p-4">
            <h4 className="text-xs font-semibold text-text-secondary mb-4">Alertas por día</h4>
            <div className="flex items-end gap-2 h-28">
              {data.byDay.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-sm bg-blue-500/60 hover:bg-blue-500/80 transition-colors"
                    style={{ height: `${(d.alerts / maxDay) * 100}%` }}
                  />
                  <span className="text-[10px] text-text-hint">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Type distribution */}
          <div className="bg-surface-card border border-[#1e2d4a] rounded-lg p-4">
            <h4 className="text-xs font-semibold text-text-secondary mb-4">Por tipo</h4>
            <div className="flex flex-col gap-2">
              {data.byType.map((t) => {
                const total = data.byType.reduce((s, x) => s + x.count, 0);
                const pct   = Math.round((t.count / total) * 100);
                return (
                  <div key={t.type} className="flex items-center gap-2 text-xs">
                    <span className="w-20 text-text-secondary truncate">{t.type}</span>
                    <div className="flex-1 h-1.5 bg-[#1e2d4a] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: t.color }} />
                    </div>
                    <span className="font-mono text-text-hint w-8 text-right">{t.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Classroom ranking */}
        <div className="bg-surface-card border border-[#1e2d4a] rounded-lg p-4">
          <h4 className="text-xs font-semibold text-text-secondary mb-4">Ranking de aulas</h4>
          <div className="flex flex-col gap-2">
            {data.classroomRanking.map((c, i) => (
              <div key={c.name} className="flex items-center gap-3 text-xs">
                <span className="text-text-hint font-mono w-4">{i + 1}</span>
                <span className="text-text-secondary w-20">{c.name}</span>
                <div className="flex-1 h-1.5 bg-[#1e2d4a] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-blue-500/70" style={{ width: `${(c.count / maxRank) * 100}%` }} />
                </div>
                <span className="font-mono text-text-hint w-6 text-right">{c.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap */}
        <div className="bg-surface-card border border-[#1e2d4a] rounded-lg p-4">
          <h4 className="text-xs font-semibold text-text-secondary mb-4">Mapa de calor — alertas por hora/día</h4>
          <div className="overflow-x-auto">
            <table className="text-[10px] text-text-hint border-collapse w-full">
              <thead>
                <tr>
                  <th className="pr-3 pb-1 text-left font-normal">Hora</th>
                  {['Lun', 'Mar', 'Mié', 'Jue', 'Vie'].map((d) => (
                    <th key={d} className="px-2 pb-1 font-normal text-center">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.heatmap.map(([hour, ...vals]) => (
                  <tr key={hour}>
                    <td className="pr-3 py-0.5 text-text-hint whitespace-nowrap">{hour}</td>
                    {vals.map((v, i) => {
                      const intensity = v / maxHeat;
                      return (
                        <td key={i} className="px-2 py-0.5">
                          <div
                            className="w-7 h-4 rounded-sm mx-auto"
                            style={{ background: `rgba(59,130,246,${intensity * 0.8 + 0.05})` }}
                            title={`${v} alertas`}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
