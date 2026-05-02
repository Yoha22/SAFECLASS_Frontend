import Icon from './Icon';
import { ALERT_CONFIG, STATUS_CONFIG } from '@/constants/alertConfig';

export function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDIENTE;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider uppercase"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
}

export function AlertTypeBadge({ type }) {
  const cfg = ALERT_CONFIG[type] ?? ALERT_CONFIG.OTRO;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider uppercase"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <Icon name={cfg.icon} size={11} />
      {cfg.label}
    </span>
  );
}
