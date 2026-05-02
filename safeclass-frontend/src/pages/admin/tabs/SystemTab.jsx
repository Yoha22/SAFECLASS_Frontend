import Icon from '@/components/ui/Icon';
import { mockSystemLogs, mockSystemModules, mockPerformanceStats } from '@/data/mockData';

const LOG_COLORS = {
  INFO:  '#3b82f6',
  WARN:  '#f59e0b',
  ERROR: '#ef4444',
};

export default function SystemTab() {
  const perf    = mockPerformanceStats;
  const modules = mockSystemModules;
  const logs    = mockSystemLogs;

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Performance */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'FPS promedio',    value: perf.fps,         unit: 'fps', icon: 'camera' },
          { label: 'Inferencia IA',   value: perf.inferenceMs, unit: 'ms',  icon: 'cpu'    },
          { label: 'CPU',             value: perf.cpuPercent,  unit: '%',   icon: 'cpu'    },
          { label: 'RAM',             value: perf.ramPercent,  unit: '%',   icon: 'database'},
        ].map((s) => (
          <div key={s.label} className="bg-surface-card border border-[#1e2d4a] rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Icon name={s.icon} size={13} className="text-text-hint" />
              <span className="text-[11px] text-text-hint">{s.label}</span>
            </div>
            <div className="font-mono text-xl font-bold text-text-primary">
              {s.value}<span className="text-sm font-normal text-text-hint ml-1">{s.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modules status */}
      <div>
        <h4 className="text-xs font-semibold text-text-secondary mb-3">Estado de módulos</h4>
        <div className="grid grid-cols-2 gap-2">
          {modules.map((m) => (
            <div key={m.name} className="flex items-center gap-3 px-3 py-2.5 bg-surface-card border border-[#1e2d4a] rounded-lg">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: m.status === 'ok' ? '#22c55e' : m.status === 'warn' ? '#f59e0b' : '#ef4444' }}
              />
              <div className="min-w-0">
                <div className="text-xs font-medium text-text-primary truncate">{m.name}</div>
                <div className="text-[10px] text-text-hint">{m.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System logs */}
      <div>
        <h4 className="text-xs font-semibold text-text-secondary mb-3">Logs del sistema</h4>
        <div className="bg-[#070a12] border border-[#1e2d4a] rounded-lg overflow-hidden">
          {logs.map((l) => (
            <div key={l.id} className="flex items-start gap-3 px-3 py-2 border-b border-[#1e2d4a] last:border-0 font-mono text-xs">
              <span className="font-mono text-text-hint shrink-0">{l.time}</span>
              <span className="font-bold shrink-0 w-11" style={{ color: LOG_COLORS[l.level] ?? '#64748b' }}>{l.level}</span>
              <span className="text-text-hint shrink-0 w-28 truncate">{l.module}</span>
              <span className="text-text-secondary flex-1">{l.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
