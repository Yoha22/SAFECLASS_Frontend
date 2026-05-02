import { useState } from 'react';
import Icon from '@/components/ui/Icon';
import { CameraRow } from '@/components/admin';
import { mockCameras } from '@/data/mockData';
import { useToast } from '@/hooks/useToast';

export default function CamerasTab() {
  const { addToast }          = useToast();
  const [cameras, setCameras] = useState(mockCameras);
  const [testing, setTesting] = useState(null);

  const handleTest = (id) => {
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
