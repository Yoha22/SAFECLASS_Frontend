import { useState, useEffect } from 'react';
import { LogViewer, ModuleStatus } from '@/components/admin';
import { KPICard } from '@/components/dashboard';
import { apiFetch } from '@/api/client';

export default function SystemTab() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    apiFetch('/api/stats/system')
      .then((data) => { setStats(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  if (loading) return <div className="p-6 text-text-hint text-sm">Cargando estadísticas del sistema…</div>;
  if (error)   return <div className="p-6 text-red-400 text-sm">Error: {error}</div>;

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="grid grid-cols-4 gap-3">
        <KPICard label="FPS promedio"  value={stats.fps        != null ? `${stats.fps} fps`       : '—'} icon="camera"   color="#3b82f6" />
        <KPICard label="Inferencia IA" value={stats.inferenceMs != null ? `${stats.inferenceMs} ms` : '—'} icon="cpu"     color="#f59e0b" />
        <KPICard label="CPU"           value={`${stats.cpuPercent}%`}  icon="cpu"      color="#22c55e" />
        <KPICard label="RAM"           value={`${stats.ramPercent}%`}  icon="database" color="#64748b" />
      </div>

      <div>
        <h4 className="text-xs font-semibold text-text-secondary mb-3">Estado de módulos</h4>
        <ModuleStatus modules={stats.modules ?? []} />
      </div>

      <div>
        <p className="text-xs text-text-hint">
          Memoria: {stats.ramUsedMB} MB usados / {stats.ramTotalMB} MB totales
        </p>
      </div>
    </div>
  );
}
