import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Icon from '@/components/ui/Icon';
import { AlertTypeBadge, StatusBadge } from '@/components/ui/Badge';
import ConfidenceBar from '@/components/ui/ConfidenceBar';
import VideoPlaceholder from '@/components/ui/VideoPlaceholder';
import { fmt } from '@/utils/formatters';
import { ALERT_STATUS, DISCARD_REASONS } from '@/constants/alertConfig';

/**
 * Modal de detalle de alerta — puramente presentacional.
 * Props:
 *   alert       — objeto de alerta
 *   onClose     — cb() cerrar modal
 *   onConfirm   — cb(alertId) confirmar incidente
 *   onDiscard   — cb(alertId, reason) descartar con razón
 *   onEscalate  — cb(alertId) escalar a coordinador
 */
export default function AlertDetail({ alert, onClose, onConfirm, onDiscard, onEscalate }) {
  const [discardReason, setDiscardReason] = useState(DISCARD_REASONS[0]);
  const isPending = alert.status === ALERT_STATUS.PENDIENTE;

  const handleConfirm  = () => { onConfirm?.(alert.id);                  onClose(); };
  const handleDiscard  = () => { onDiscard?.(alert.id, discardReason);   onClose(); };
  const handleEscalate = () => onEscalate?.(alert.id);

  return (
    <Modal open onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2d4a]">
        <div className="flex items-center gap-2.5">
          <AlertTypeBadge type={alert.type} />
          <span className="text-text-hint font-mono text-xs">{alert.id}</span>
        </div>
        <button onClick={onClose} className="text-text-hint hover:text-text-primary transition-colors p-1">
          <Icon name="x" size={16} />
        </button>
      </div>

      {/* Body */}
      <div className="px-5 py-4 flex flex-col gap-4">
        <VideoPlaceholder
          classroom={alert.classroom?.name ?? alert.classroom ?? ''}
          hasAlert={isPending}
        />

        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { label: 'Estado',  value: <StatusBadge status={alert.status} /> },
            { label: 'Cámara',  value: alert.camera?.name ?? alert.cameraId },
            { label: 'Aula',    value: alert.classroom?.name ?? `Aula ${alert.classroom}` },
            { label: 'Hora',    value: <span className="font-mono">{fmt.datetime(alert.createdAt ?? alert.timestamp)}</span> },
          ].map(({ label, value }) => (
            <div key={label} className="bg-[#0b0f1a] border border-[#1e2d4a] rounded-md p-2.5">
              <div className="text-text-hint mb-1">{label}</div>
              <div className="text-text-primary">{value}</div>
            </div>
          ))}
        </div>

        <div className="bg-[#0b0f1a] border border-[#1e2d4a] rounded-md p-3">
          <div className="text-xs text-text-hint mb-2">Confianza del modelo IA</div>
          <ConfidenceBar value={alert.confidence} />
        </div>

        {isPending && onDiscard && (
          <div>
            <label className="text-xs text-text-hint block mb-1.5">Razón de descarte</label>
            <select
              value={discardReason}
              onChange={(e) => setDiscardReason(e.target.value)}
              className="w-full bg-[#0b0f1a] border border-[#1e2d4a] text-text-primary text-sm rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              {DISCARD_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        )}

        {alert.actions?.length > 0 && (
          <div>
            <div className="text-xs text-text-hint mb-2">Historial de acciones</div>
            <div className="flex flex-col gap-1.5">
              {alert.actions.map((a, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                  <Icon name="check" size={12} className="mt-0.5 text-green-400 shrink-0" />
                  <span>{a.action} — <span className="text-text-hint">{a.user?.name ?? a.user}</span></span>
                  <span className="ml-auto font-mono text-text-hint">{fmt.time(a.createdAt ?? a.timestamp)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      {isPending && (
        <div className="px-5 py-4 border-t border-[#1e2d4a] flex gap-2">
          {onConfirm && (
            <button
              onClick={handleConfirm}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-semibold text-white bg-green-500 hover:bg-green-600 transition-colors"
            >
              <Icon name="check" size={14} /> Confirmar incidente
            </button>
          )}
          {onDiscard && (
            <button
              onClick={handleDiscard}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-semibold text-text-secondary bg-white/5 hover:bg-white/10 transition-colors"
            >
              <Icon name="x" size={14} /> Descartar
            </button>
          )}
          {onEscalate && !alert.escalated && (
            <button
              onClick={handleEscalate}
              title="Escalar a coordinador"
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors"
            >
              <Icon name="escalate" size={14} />
            </button>
          )}
        </div>
      )}
    </Modal>
  );
}
