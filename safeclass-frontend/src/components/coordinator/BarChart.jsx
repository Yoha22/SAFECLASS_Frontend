/**
 * Gráfico de barras vertical simple — reutilizable.
 * Props:
 *   data  — [{ label, value }]
 *   color — color de las barras (hex/tailwind)
 */
export default function BarChart({ data = [], color = '#3b82f6' }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-28">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-sm transition-[height] duration-300"
            style={{
              height: `${(d.value / max) * 100}%`,
              background: color,
              opacity: 0.7,
            }}
          />
          <span className="text-[10px] text-text-hint">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
