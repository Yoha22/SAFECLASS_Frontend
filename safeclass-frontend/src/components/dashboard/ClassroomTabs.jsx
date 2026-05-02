import VideoPlaceholder from '@/components/ui/VideoPlaceholder';

/**
 * Selector de aulas con vista de cámara — reutilizable en Dashboard.
 * Props:
 *   classrooms      — lista de aulas
 *   activeId        — id del aula activa
 *   onSelect        — cb(classroomId)
 */
export default function ClassroomTabs({ classrooms = [], activeId, onSelect }) {
  const active = classrooms.find((c) => c.id === activeId);

  return (
    <div className="bg-surface-card border border-[#1e2d4a] rounded-lg overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-[#1e2d4a]">
        {classrooms.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect?.(c.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
              activeId === c.id
                ? 'text-blue-400 bg-blue-500/5 border-b border-blue-500'
                : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: c.status === 'alert' ? '#ef4444'
                  : c.status === 'offline' ? '#64748b'
                  : '#22c55e',
              }}
            />
            {c.name}
            {c.alertCount > 0 && (
              <span className="text-[10px] text-red-400 bg-red-500/10 px-1 rounded-full">
                {c.alertCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Camera feed */}
      {active && (
        <div className="p-4">
          <VideoPlaceholder
            classroom={active.name}
            hasAlert={active.status === 'alert'}
          />
        </div>
      )}
    </div>
  );
}
