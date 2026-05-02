import { useAlerts } from '@/hooks/useAlerts';
import { AlertTypeBadge, StatusBadge } from '@/components/ui/Badge';
import { fmt } from '@/utils/formatters';

export default function RightPanel({ onAlertClick }) {
  const { alerts } = useAlerts();
  const recent     = alerts.slice(0, 6);

  return (
    <aside className="w-72 shrink-0 flex flex-col border-l border-[#1e2d4a] bg-surface-card overflow-y-auto">
      <div className="px-4 py-3 border-b border-[#1e2d4a]">
        <h3 className="text-sm font-semibold text-text-primary">Alertas recientes</h3>
      </div>

      <div className="flex-1 flex flex-col gap-0 divide-y divide-[#1e2d4a]">
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
              Aula {a.classroom} · {fmt.time(a.timestamp)}
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
