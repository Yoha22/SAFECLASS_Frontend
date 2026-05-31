import { useState, useEffect } from 'react';
import Icon from '@/components/ui/Icon';
import Modal from '@/components/ui/Modal';
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

const EMPTY_FORM = { name: '', classroomId: '', rtspUrl: '' };

export default function CamerasTab() {
  const { addToast }          = useToast();
  const [cameras, setCameras] = useState([]);
  const [testing, setTesting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen]   = useState(false);
  const [classrooms, setClassrooms] = useState([]);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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

  const openModal = async () => {
    setForm(EMPTY_FORM);
    setFormErrors({});
    setModalOpen(true);
    if (classrooms.length === 0) {
      try {
        const data = await apiFetch('/api/classrooms');
        setClassrooms(data);
      } catch (err) {
        addToast(`Error al cargar salones: ${err.message}`, 'error');
      }
    }
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Nombre requerido';
    if (!form.classroomId) errors.classroomId = 'Seleccione un salón';
    if (!form.rtspUrl.trim()) errors.rtspUrl = 'URL RTSP requerida';
    else if (!form.rtspUrl.startsWith('rtsp://')) errors.rtspUrl = 'Debe comenzar con rtsp://';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validate() || submitting) return;
    setSubmitting(true);
    try {
      const created = await apiFetch('/api/cameras', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setCameras((prev) => [...prev, adaptCamera(created)]);
      setModalOpen(false);
      addToast(`Cámara "${created.name}" creada`, 'success');
    } catch (err) {
      addToast(`Error: ${err.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-text-hint text-sm">Cargando cámaras…</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-primary">{cameras.length} cámaras configuradas</h3>
        <button
          onClick={openModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-md text-xs font-semibold hover:bg-blue-500/20 transition-colors"
        >
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} maxWidth={460}>
        <div className="px-6 py-4 border-b border-[#1e2d4a] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary">Agregar cámara</h3>
          <button onClick={() => setModalOpen(false)} className="text-text-hint hover:text-text-primary transition-colors">
            <Icon name="x" size={16} />
          </button>
        </div>

        <form onSubmit={handleCreate} className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className="block text-[11px] text-text-hint tracking-wider mb-1.5">NOMBRE DE LA CÁMARA</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value })); setFormErrors((p) => ({ ...p, name: '' })); }}
              placeholder="Ej: Cámara Aula 3A"
              className="w-full px-3 py-2.5 bg-surface border border-[#1e2d4a] rounded-md text-text-primary text-sm placeholder:text-text-hint focus:outline-none focus:border-blue-500 transition-colors"
            />
            {formErrors.name && <p className="mt-1 text-xs text-red-400">{formErrors.name}</p>}
          </div>

          <div>
            <label className="block text-[11px] text-text-hint tracking-wider mb-1.5">SALÓN</label>
            <select
              value={form.classroomId}
              onChange={(e) => { setForm((p) => ({ ...p, classroomId: e.target.value })); setFormErrors((p) => ({ ...p, classroomId: '' })); }}
              className="w-full px-3 py-2.5 bg-surface border border-[#1e2d4a] rounded-md text-text-primary text-sm focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">Seleccionar salón…</option>
              {classrooms.map((cl) => (
                <option key={cl.id} value={cl.id}>{cl.name}</option>
              ))}
            </select>
            {formErrors.classroomId && <p className="mt-1 text-xs text-red-400">{formErrors.classroomId}</p>}
          </div>

          <div>
            <label className="block text-[11px] text-text-hint tracking-wider mb-1.5">URL RTSP</label>
            <input
              type="text"
              value={form.rtspUrl}
              onChange={(e) => { setForm((p) => ({ ...p, rtspUrl: e.target.value })); setFormErrors((p) => ({ ...p, rtspUrl: '' })); }}
              placeholder="rtsp://192.168.1.100:554/stream"
              className="w-full px-3 py-2.5 bg-surface border border-[#1e2d4a] rounded-md text-text-primary text-sm font-mono placeholder:text-text-hint focus:outline-none focus:border-blue-500 transition-colors"
            />
            {formErrors.rtspUrl && <p className="mt-1 text-xs text-red-400">{formErrors.rtspUrl}</p>}
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-md text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Creando…' : 'Agregar cámara'}
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2.5 rounded-md text-sm text-text-secondary bg-white/5 hover:bg-white/10 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
