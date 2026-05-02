/**
 * Ranking de aulas por número de alertas.
 * Props:
 *   items — [{ name, count }] ordenados de mayor a menor
 */
export default function ClassroomRanking({ items = [] }) {
  const max = items[0]?.count ?? 1;
  return (
    <div className="flex flex-col gap-2">
      {items.map((c, i) => (
        <div key={c.name} className="flex items-center gap-3 text-xs">
          <span className="text-text-hint font-mono w-4">{i + 1}</span>
          <span className="text-text-secondary w-20">{c.name}</span>
          <div className="flex-1 h-1.5 bg-[#1e2d4a] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-500/70 transition-[width] duration-300"
              style={{ width: `${(c.count / max) * 100}%` }}
            />
          </div>
          <span className="font-mono text-text-hint w-6 text-right">{c.count}</span>
        </div>
      ))}
    </div>
  );
}
