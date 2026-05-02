// Simulacro de feed de cámara (sin imagen real por privacidad)
export default function VideoPlaceholder({ classroom, hasAlert = false }) {
  return (
    <div
      className="relative overflow-hidden rounded-md flex items-center justify-center w-full bg-surface"
      style={{
        height: 160,
        border: `1px solid ${hasAlert ? '#ef4444' : '#1e2d4a'}`,
      }}
    >
      {/* Grid pattern */}
      <svg className="absolute inset-0 opacity-[0.07]" width="100%" height="100%">
        <defs>
          <pattern id={`grid-${classroom}`} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3b82f6" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${classroom})`} />
      </svg>

      {/* Silhouettes */}
      <svg viewBox="0 0 200 120" className="w-[60%] opacity-25">
        {[30, 70, 110, 150, 170].map((x, i) => (
          <g key={i} transform={`translate(${x}, 30)`}>
            <circle cx="0" cy="0" r="7" fill="#64748b" />
            <rect x="-5" y="9" width="10" height="22" rx="3" fill="#64748b" />
            <rect x="-12" y="11" width="7" height="14" rx="3" fill="#64748b" />
            <rect x="5"  y="11" width="7" height="14" rx="3" fill="#64748b" />
            <rect x="-5" y="31" width="4" height="18" rx="2" fill="#64748b" />
            <rect x="1"  y="31" width="4" height="18" rx="2" fill="#64748b" />
          </g>
        ))}
      </svg>

      {/* Alert overlay */}
      {hasAlert && (
        <div className="absolute inset-0 bg-red-500/10 animate-alert-pulse" />
      )}

      {/* Corner label */}
      <div className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[11px] text-text-secondary font-mono">
        {classroom}
      </div>

      {/* Live indicator */}
      <div className="absolute top-2 right-2 flex items-center gap-1.5">
        <span
          className="w-1.5 h-1.5 rounded-full animate-status-pulse"
          style={{ background: hasAlert ? '#ef4444' : '#22c55e' }}
        />
        <span className="text-[10px] text-text-secondary font-mono">EN VIVO</span>
      </div>
    </div>
  );
}
