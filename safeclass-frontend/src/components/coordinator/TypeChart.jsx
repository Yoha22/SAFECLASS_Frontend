/**
 * Distribución de alertas por tipo — barras horizontales.
 * Props:
 *   data — [{ type, count, color }]
 */
export default function TypeChart({ data = [] }) {
  const total = data.reduce((s, t) => s + t.count, 0) || 1;
  return (
    <div className="flex flex-col gap-2">
      {data.map((t) => {
        const pct = Math.round((t.count / total) * 100);
        return (
          <div key={t.type} className="flex items-center gap-2 text-xs">
            <span className="w-20 text-text-secondary truncate">{t.type}</span>
            <div className="flex-1 h-1.5 bg-[#1e2d4a] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-[width] duration-300"
                style={{ width: `${pct}%`, background: t.color }}
              />
            </div>
            <span className="font-mono text-text-hint w-8 text-right">{t.count}</span>
          </div>
        );
      })}
    </div>
  );
}
