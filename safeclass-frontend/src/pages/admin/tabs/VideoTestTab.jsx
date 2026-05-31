import { useState, useRef, useEffect, useCallback } from 'react';
import { apiFetch, getToken } from '@/api/client';
import Icon from '@/components/ui/Icon';

const POLL_INTERVAL_MS = 2000;

const STATUS_LABEL = {
  pending:    { text: 'En cola',      color: 'text-yellow-400' },
  processing: { text: 'Procesando',  color: 'text-blue-400'   },
  completed:  { text: 'Completado',  color: 'text-green-400'  },
  failed:     { text: 'Fallido',     color: 'text-red-400'    },
};

export default function VideoTestTab() {
  const [file,       setFile]       = useState(null);
  const [dragging,   setDragging]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [job,        setJob]        = useState(null);  // { job_id, camera_name, ... }
  const [jobStatus,  setJobStatus]  = useState(null);  // status object from API
  const inputRef   = useRef(null);
  const pollRef    = useRef(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const pollStatus = useCallback(async (jobId) => {
    try {
      const data = await apiFetch(`/api/admin/video/status/${jobId}`);
      setJobStatus(data);
      if (data.status === 'completed' || data.status === 'failed') {
        stopPolling();
      }
    } catch {
      // network hiccup — keep polling
    }
  }, [stopPolling]);

  const startPolling = useCallback((jobId) => {
    stopPolling();
    pollRef.current = setInterval(() => pollStatus(jobId), POLL_INTERVAL_MS);
  }, [pollStatus, stopPolling]);

  useEffect(() => stopPolling, [stopPolling]);

  const handleFile = (f) => {
    if (!f?.type.startsWith('video/')) {
      setError('Solo se permiten archivos de video (mp4, avi, mov…)');
      return;
    }
    setFile(f);
    setError('');
    setJob(null);
    setJobStatus(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setJob(null);
    setJobStatus(null);

    try {
      const token = getToken();
      const form  = new FormData();
      form.append('video', file);

      const resp = await fetch('/api/admin/video/analyze', {
        method:  'POST',
        body:    form,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        throw new Error(body.error ?? body.message ?? `HTTP ${resp.status}`);
      }

      const data = await resp.json();
      setJob(data);
      // Kick off first poll immediately, then every POLL_INTERVAL_MS
      pollStatus(data.job_id);
      startPolling(data.job_id);
    } catch (err) {
      setError(err.message ?? 'Error al enviar el video.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    stopPolling();
    setFile(null);
    setJob(null);
    setJobStatus(null);
    setError('');
  };

  const progress  = jobStatus?.progress ?? 0;
  const statusMeta = jobStatus ? (STATUS_LABEL[jobStatus.status] ?? STATUS_LABEL.pending) : null;
  const isDone    = jobStatus?.status === 'completed' || jobStatus?.status === 'failed';

  return (
    <div className="p-6 max-w-2xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-1">Prueba con Video</h3>
        <p className="text-xs text-text-hint leading-relaxed">
          Sube un video para que el modelo lo analice frame a frame. Las detecciones
          se enviarán al sistema como si provinieran de una cámara real y aparecerán
          en el dashboard en tiempo real.
        </p>
      </div>

      {/* Camera info */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-blue-500/5 border border-blue-500/20 text-xs text-text-secondary">
        <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
        Las alertas se asociarán a la cámara: <strong className="text-text-primary ml-1">Cámara de Prueba (Video)</strong>
      </div>

      {/* Dropzone */}
      {!job && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-colors py-12 px-6
            ${dragging
              ? 'border-blue-400 bg-blue-500/10'
              : file
                ? 'border-green-500/40 bg-green-500/5'
                : 'border-[#1e2d4a] hover:border-blue-500/40 hover:bg-blue-500/5'
            }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />

          {file ? (
            <>
              <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <Icon name="check" size={20} className="text-green-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-text-primary">{file.name}</p>
                <p className="text-xs text-text-hint mt-0.5">
                  {(file.size / (1024 * 1024)).toFixed(1)} MB — clic para cambiar
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-lg bg-[#1e2d4a] flex items-center justify-center">
                <Icon name="upload" size={20} className="text-text-hint" />
              </div>
              <div className="text-center">
                <p className="text-sm text-text-secondary">Arrastra un video aquí</p>
                <p className="text-xs text-text-hint mt-0.5">o haz clic para seleccionar · mp4, avi, mov · máx 200 MB</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
          <Icon name="alert" size={14} className="shrink-0" />
          {error}
        </div>
      )}

      {/* Submit button */}
      {!job && (
        <button
          onClick={handleSubmit}
          disabled={!file || loading}
          className="w-full py-2.5 rounded-md text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Icon name="play" size={15} />
              Analizar video
            </>
          )}
        </button>
      )}

      {/* Job status card */}
      {job && jobStatus && (
        <div className="rounded-xl border border-[#1e2d4a] bg-surface-card overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e2d4a]">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold ${statusMeta?.color}`}>
                {statusMeta?.text}
              </span>
              {jobStatus.status === 'processing' && (
                <span className="w-3 h-3 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
              )}
            </div>
            <span className="text-[11px] text-text-hint font-mono">{job.job_id.slice(0, 8)}…</span>
          </div>

          {/* Progress bar */}
          <div className="px-4 pt-4 pb-2">
            <div className="flex justify-between text-[11px] text-text-hint mb-1.5">
              <span>Progreso</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-[#1e2d4a] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 divide-x divide-[#1e2d4a] border-t border-[#1e2d4a] mt-2">
            {[
              { label: 'Frames procesados', value: jobStatus.frames_processed.toLocaleString() },
              { label: 'Total frames',       value: jobStatus.total_frames.toLocaleString() },
              { label: 'Alertas generadas',  value: jobStatus.alerts_sent },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center py-3 px-2">
                <span className="text-base font-bold text-text-primary">{value}</span>
                <span className="text-[10px] text-text-hint mt-0.5 text-center leading-tight">{label}</span>
              </div>
            ))}
          </div>

          {/* Error message if failed */}
          {jobStatus.status === 'failed' && jobStatus.error && (
            <div className="mx-4 mb-4 px-3 py-2 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              {jobStatus.error}
            </div>
          )}

          {/* Completion message */}
          {jobStatus.status === 'completed' && (
            <div className="mx-4 mb-4 px-3 py-2 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 text-xs flex items-center gap-2">
              <Icon name="check" size={13} className="shrink-0" />
              Análisis completo. Revisa las alertas en el Dashboard o en Historial.
            </div>
          )}

          {/* Analyse another / done */}
          {isDone && (
            <div className="px-4 pb-4">
              <button
                onClick={reset}
                className="w-full py-2 rounded-md text-xs font-semibold text-text-secondary border border-[#1e2d4a] hover:border-blue-500/40 hover:text-text-primary transition-colors"
              >
                Analizar otro video
              </button>
            </div>
          )}
        </div>
      )}

      {/* Live hint while processing */}
      {jobStatus?.status === 'processing' && (
        <p className="text-[11px] text-text-hint text-center">
          Las alertas detectadas aparecen en tiempo real en el Dashboard.
        </p>
      )}
    </div>
  );
}
