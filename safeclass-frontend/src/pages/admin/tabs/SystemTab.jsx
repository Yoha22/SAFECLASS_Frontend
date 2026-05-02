import Icon from '@/components/ui/Icon';
import { LogViewer, ModuleStatus } from '@/components/admin';
import { KPICard } from '@/components/dashboard';
import { mockSystemLogs, mockSystemModules, mockPerformanceStats } from '@/data/mockData';

export default function SystemTab() {
  const perf = mockPerformanceStats;
  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Performance KPIs — reutiliza KPICard */}
      <div className="grid grid-cols-4 gap-3">
        <KPICard label="FPS promedio"  value={`${perf.fps} fps`}          icon="camera"   color="#3b82f6" />
        <KPICard label="Inferencia IA" value={`${perf.inferenceMs} ms`}   icon="cpu"      color="#f59e0b" />
        <KPICard label="CPU"           value={`${perf.cpuPercent}%`}      icon="cpu"      color="#22c55e" />
        <KPICard label="RAM"           value={`${perf.ramPercent}%`}      icon="database" color="#64748b" />
      </div>

      <div>
        <h4 className="text-xs font-semibold text-text-secondary mb-3">Estado de módulos</h4>
        <ModuleStatus modules={mockSystemModules} />
      </div>

      <div>
        <h4 className="text-xs font-semibold text-text-secondary mb-3">Logs del sistema</h4>
        <LogViewer logs={mockSystemLogs} />
      </div>
    </div>
  );
}
