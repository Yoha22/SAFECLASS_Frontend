export default function ConfidenceBar({ value, showLabel = true }) {
  const pct   = Math.round(value * 100);
  const color = pct >= 80 ? '#ef4444' : pct >= 65 ? '#f59e0b' : '#64748b';

  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-[#1e2d4a] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      {showLabel && (
        <span className="font-mono text-xs min-w-[36px]" style={{ color }}>
          {pct}%
        </span>
      )}
    </div>
  );
}
