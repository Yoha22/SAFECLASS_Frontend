const LEVEL_COLORS = {
  INFO:  '#3b82f6',
  WARN:  '#f59e0b',
  ERROR: '#ef4444',
};

/**
 * Visor de logs del sistema en formato terminal.
 * Props:
 *   logs — [{ id, level, module, msg, time }]
 */
export default function LogViewer({ logs = [] }) {
  return (
    <div className="bg-[#070a12] border border-[#1e2d4a] rounded-lg overflow-hidden">
      {logs.map((l) => (
        <div
          key={l.id}
          className="flex items-start gap-3 px-3 py-2 border-b border-[#1e2d4a] last:border-0 font-mono text-xs"
        >
          <span className="text-text-hint shrink-0">{l.time}</span>
          <span className="font-bold shrink-0 w-11" style={{ color: LEVEL_COLORS[l.level] ?? '#64748b' }}>
            {l.level}
          </span>
          <span className="text-text-hint shrink-0 w-28 truncate">{l.module}</span>
          <span className="text-text-secondary flex-1">{l.msg}</span>
        </div>
      ))}
    </div>
  );
}
