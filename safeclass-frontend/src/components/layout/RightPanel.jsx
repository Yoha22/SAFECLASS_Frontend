import { AlertTypeBadge, StatusBadge } from '@/components/ui/Badge';
import { fmt } from '@/utils/formatters';

/**
 * Panel derecho con alertas recientes — puramente presentacional.
 * Props:
 *   alerts       — lista completa de alertas (muestra las 6 más recientes)
 *   onAlertClick — cb(alert) al seleccionar una fila
 */
export default function RightPanel({ alerts = [], onAlertClick }) {
  const recent = alerts.slice(0, 6);

  return (
    <aside className="w-72 shrink-0 flex flex-col border-l border-[#1e2d4a] bg-surface-card overflow-y-auto">
      <div className="px-4 py-3 border-b border-[#1e2d4a]">
        <h3 className="text-sm font-semibold text-text-primary">Alertas recientes</h3>
      </div>

      <div className="flex-1 flex flex-col divide-y divide-[#1e2d4a]">
        {recent.map((a) => (
          <button
            key={a.id}
            onClick={() => onAlertClick?.(a)}
            className="text-left px-4 py-3 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <AlertTypeBadge type={a.type} />
              <StatusBadge status={a.status} />
            </div>
            <div className="text-xs text-text-secondary">
              {a.classroom?.name ?? `Aula ${a.classroom}`} · {fmt.time(a.createdAt ?? a.timestamp)}
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
