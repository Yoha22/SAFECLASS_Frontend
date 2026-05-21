import { useState, useEffect } from 'react';
import Icon from '@/components/ui/Icon';
import { CameraRow } from '@/components/admin';
import { apiFetch } from '@/api/client';
import { useToast } from '@/hooks/useToast';

function adaptCamera(c) {
  return {
    ...c,
    rtsp:       c.rtspUrl ?? '',
    fps:        c.fps     ?? 0,
    resolution: c.resolution ?? '—',
    lastCheck:  c.lastCheck ?? null,
  };
}

export default function CamerasTab() {
  const { addToast }          = useToast();
  const [cameras, setCameras] = useState([]);
  const [testing, setTesting] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/cameras')
      .then((data) => setCameras(data.map(adaptCamera)))
      .catch((err) => addToast(`Error al cargar cámaras: ${err.message}`, 'error'))
      .finally(() => setLoading(false));
  }, []);

  const handleTest = async (id) => {
    setTesting(id);
    try {
      const result = await apiFetch(`/api/cameras/${id}/test`, { method: 'POST' });
      setCameras((prev) => prev.map((c) => c.id === id ? { ...c, status: result.status, lastCheck: result.lastCheck } : c));
      addToast(
        result.status === 'online' ? `Conexión exitosa con ${id}` : `Error: timeout en ${id}`,
        result.status === 'online' ? 'success' : 'error',
      );
    } catch (err) {
      addToast(`Error al testear ${id}: ${err.message}`, 'error');
    } finally {
      setTesting(null);
    }
  };

  if (loading) {
    return <div className="p-6 text-text-hint text-sm">Cargando cámaras…</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-primary">{cameras.length} cámaras configuradas</h3>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-md text-xs font-semibold hover:bg-blue-500/20 transition-colors">
          <Icon name="plus" size={13} /> Agregar cámara
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {cameras.map((c) => (
          <CameraRow
            key={c.id}
            camera={c}
            isTesting={testing === c.id}
            onTest={handleTest}
          />
        ))}
      </div>
    </div>
  );
}
