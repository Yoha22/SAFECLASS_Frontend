import Icon from '@/components/ui/Icon';
import { CAM_STATUS } from '@/constants/camStatus';
import { fmt } from '@/utils/formatters';

/**
 * Fila de cámara con botón de test de conexión.
 * Props:
 *   camera      — objeto cámara
 *   isTesting   — bool muestra spinner en el botón
 *   onTest      — cb(cameraId)
 */
export default function CameraRow({ camera, isTesting = false, onTest }) {
  const cfg = CAM_STATUS[camera.status] ?? CAM_STATUS.offline;
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-surface-card border border-[#1e2d4a] rounded-lg">
      <span
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{
          background: cfg.color,
          boxShadow: cfg.pulse ? `0 0 6px ${cfg.color}` : 'none',
        }}
      />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-text-primary">{camera.name}</div>
        <div className="text-xs text-text-hint font-mono truncate">{camera.rtsp}</div>
      </div>
      <div className="text-right hidden sm:block shrink-0">
        <div className="text-xs text-text-secondary">
          {camera.fps > 0 ? `${camera.fps} fps` : '—'} · {camera.resolution}
        </div>
        <div className="text-[10px] text-text-hint">{fmt.datetime(camera.lastCheck)}</div>
      </div>
      <button
        onClick={() => onTest?.(camera.id)}
        disabled={isTesting}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-text-secondary border border-[#1e2d4a] rounded hover:border-blue-500 hover:text-blue-400 transition-colors disabled:opacity-50 shrink-0"
      >
        {isTesting
          ? <span className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin-slow" />
          : <Icon name="wifi" size={12} />
        }
        Test
      </button>
    </div>
  );
}
