const STATUS_COLOR = {
  ok:   '#22c55e',
  warn: '#f59e0b',
  error:'#ef4444',
};

/**
 * Indicador de estado de un módulo del sistema.
 * Props:
 *   modules — [{ name, status, detail }]
 */
export default function ModuleStatus({ modules = [] }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {modules.map((m) => (
        <div key={m.name} className="flex items-center gap-3 px-3 py-2.5 bg-surface-card border border-[#1e2d4a] rounded-lg">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: STATUS_COLOR[m.status] ?? '#64748b' }}
          />
          <div className="min-w-0">
            <div className="text-xs font-medium text-text-primary truncate">{m.name}</div>
            <div className="text-[10px] text-text-hint">{m.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
