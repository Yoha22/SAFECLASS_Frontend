import { useState, useEffect } from 'react';
import Icon from '@/components/ui/Icon';
import { ThresholdSlider } from '@/components/admin';
import { apiFetch } from '@/api/client';
import { fmt } from '@/utils/formatters';
import { useToast } from '@/hooks/useToast';

const DEFAULT_THRESHOLD = 0.75;

export default function AIConfigTab() {
  const { addToast }  = useToast();
  const [threshold,        setThreshold]        = useState(DEFAULT_THRESHOLD);
  const [thresholdHistory, setThresholdHistory] = useState([]);
  const [confirmOpen,      setConfirmOpen]       = useState(false);
  const [saving,           setSaving]            = useState(false);
  const [loadingThreshold, setLoadingThreshold]  = useState(true);

  useEffect(() => {
    apiFetch('/api/stats/threshold')
      .then((data) => setThreshold(data.threshold))
      .catch(() => {})
      .finally(() => setLoadingThreshold(false));
  }, []);

  const apply = async () => {
    setSaving(true);
    try {
      await apiFetch('/api/stats/threshold', {
        method: 'PUT',
        body: JSON.stringify({ threshold }),
      });
      setThresholdHistory((prev) => [
        ...prev.slice(-4),
        { value: threshold, user: 'Admin', timestamp: new Date().toISOString() },
      ]);
      setConfirmOpen(false);
      addToast(`Umbral actualizado a ${threshold.toFixed(2)}`, 'success');
    } catch (err) {
      addToast(`Error al actualizar umbral: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-lg">
      <h3 className="text-sm font-semibold text-text-primary mb-1">Umbral de confianza del modelo IA</h3>
      <p className="text-xs text-text-hint mb-5">
        Las alertas con confianza inferior al umbral no se notifican al docente. Rango recomendado: 0.65 – 0.90.
      </p>

      {loadingThreshold
        ? <div className="text-xs text-text-hint py-4">Cargando umbral actual…</div>
        : <ThresholdSlider value={threshold} onChange={setThreshold} />
      }

      <button
        onClick={() => setConfirmOpen(true)}
        disabled={loadingThreshold}
        className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-md transition-colors disabled:opacity-50"
      >
        <Icon name="check" size={14} /> Aplicar umbral
      </button>

      {confirmOpen && (
        <div className="mt-4 p-4 bg-yellow-500/5 border border-yellow-500/30 rounded-lg">
          <p className="text-sm text-yellow-400 mb-3">
            ¿Confirmar nuevo umbral de <strong className="font-mono">{threshold.toFixed(2)}</strong>?
            Tendrá efecto inmediato en el módulo IA.
          </p>
          <div className="flex gap-2">
            <button
              onClick={apply}
              disabled={saving}
              className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-black text-xs font-bold rounded transition-colors disabled:opacity-50"
            >
              {saving ? 'Guardando…' : 'Confirmar'}
            </button>
            <button
              onClick={() => setConfirmOpen(false)}
              disabled={saving}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-text-secondary text-xs rounded transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {thresholdHistory.length > 0 && (
        <div className="mt-6">
          <h4 className="text-xs font-semibold text-text-secondary mb-2">Historial de cambios (sesión actual)</h4>
          <div className="flex flex-col gap-1.5">
            {[...thresholdHistory].reverse().map((h, i) => (
              <div key={i} className="flex items-center justify-between text-xs text-text-secondary bg-surface-card border border-[#1e2d4a] rounded px-3 py-2">
                <span className="font-mono text-blue-400">{h.value.toFixed(2)}</span>
                <span className="text-text-hint">{h.user}</span>
                <span className="font-mono text-text-hint">{fmt.datetime(h.timestamp)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
