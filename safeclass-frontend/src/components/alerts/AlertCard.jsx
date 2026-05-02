import { AlertTypeBadge, StatusBadge } from '@/components/ui/Badge';
import ConfidenceBar from '@/components/ui/ConfidenceBar';
import Icon from '@/components/ui/Icon';
import { fmt } from '@/utils/formatters';
import { ALERT_STATUS } from '@/constants/alertConfig';

/**
 * Tarjeta de alerta — puramente presentacional.
 * Props:
 *   alert      — objeto de alerta
 *   onClick    — cb(alert) al hacer clic en la tarjeta
 *   onConfirm  — cb(alertId) botón Confirmar
 *   onDiscard  — cb(alertId) botón Descartar (usa razón por defecto)
 */
export default function AlertCard({ alert, onClick, onConfirm, onDiscard }) {
  const isPending = alert.status === ALERT_STATUS.PENDIENTE;

  return (
    <div
      className="bg-[#131929] border border-[#1e2d4a] rounded-lg p-3 hover:border-[#253d6b] transition-colors cursor-pointer"
      onClick={() => onClick?.(alert)}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <AlertTypeBadge type={alert.type} />
        <StatusBadge status={alert.status} />
      </div>

      <div className="flex items-center gap-2 text-xs text-text-secondary mb-2">
        <Icon name="camera" size={12} />
        <span>{alert.cameraId}</span>
        <span className="text-text-hint">·</span>
        <span>Aula {alert.classroom}</span>
        <span className="text-text-hint">·</span>
        <span className="font-mono">{fmt.time(alert.timestamp)}</span>
      </div>

      <ConfidenceBar value={alert.confidence} />

      {alert.escalated && (
        <div className="mt-2 text-[11px] text-yellow-400 flex items-center gap-1">
          <Icon name="escalate" size={11} />
          Escalada a coordinador
        </div>
      )}

      {isPending && (onConfirm || onDiscard) && (
        <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
          {onConfirm && (
            <button
              onClick={() => onConfirm(alert.id)}
              className="flex-1 flex items-center justify-center gap-1 py-1 rounded text-[12px] font-semibold text-green-400 bg-green-500/10 hover:bg-green-500/20 transition-colors"
            >
              <Icon name="check" size={13} /> Confirmar
            </button>
          )}
          {onDiscard && (
            <button
              onClick={() => onDiscard(alert.id)}
              className="flex-1 flex items-center justify-center gap-1 py-1 rounded text-[12px] font-semibold text-text-hint bg-white/5 hover:bg-white/10 transition-colors"
            >
              <Icon name="x" size={13} /> Descartar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
