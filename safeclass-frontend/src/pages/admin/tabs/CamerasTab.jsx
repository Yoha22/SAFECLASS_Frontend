import { useState } from 'react';
import Icon from '@/components/ui/Icon';
import { CAM_STATUS } from '@/constants/camStatus';
import { fmt } from '@/utils/formatters';
import { mockCameras } from '@/data/mockData';
import { useToast } from '@/hooks/useToast';

export default function CamerasTab() {
  const { addToast }      = useToast();
  const [cameras, setCameras] = useState(mockCameras);
  const [testing, setTesting] = useState(null);

  const testCamera = (id) => {
    setTesting(id);
    setTimeout(() => {
      const ok = Math.random() > 0.35;
      setTesting(null);
      setCameras((prev) => prev.map((c) => c.id === id ? { ...c, status: ok ? 'online' : 'error' } : c));
      addToast(ok ? `Conexión exitosa con ${id}` : `Error: timeout en ${id}`, ok ? 'success' : 'error');
    }, 1800);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-primary">{cameras.length} cámaras configuradas</h3>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-md text-xs font-semibold hover:bg-blue-500/20 transition-colors">
          <Icon name="plus" size={13} /> Agregar cámara
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {cameras.map((c) => {
          const cfg = CAM_STATUS[c.status] ?? CAM_STATUS.offline;
          return (
            <div key={c.id} className="flex items-center gap-3 px-4 py-3 bg-surface-card border border-[#1e2d4a] rounded-lg">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{
                  background: cfg.color,
                  boxShadow: cfg.pulse ? `0 0 6px ${cfg.color}` : 'none',
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-text-primary">{c.name}</div>
                <div className="text-xs text-text-hint font-mono truncate">{c.rtsp}</div>
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-xs text-text-secondary">{c.fps > 0 ? `${c.fps} fps` : '—'} · {c.resolution}</div>
                <div className="text-[10px] text-text-hint">{fmt.datetime(c.lastCheck)}</div>
              </div>
              <button
                onClick={() => testCamera(c.id)}
                disabled={!!testing}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-text-secondary border border-[#1e2d4a] rounded hover:border-blue-500 hover:text-blue-400 transition-colors disabled:opacity-50"
              >
                {testing === c.id
                  ? <span className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin-slow" />
                  : <Icon name="wifi" size={12} />
                }
                Test
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
