// HU-03 / HU-05: tipos de incidencia detectados por el módulo IA
// Keys match the backend AlertType enum exactly (no accents).
export const ALERT_TYPES = {
  AGRESION:    'AGRESION',
  AISLAMIENTO: 'AISLAMIENTO',
  CAIDA:       'CAIDA',
  OTRO:        'OTRO',
};

export const ALERT_CONFIG = {
  AGRESION: {
    icon:  'fist',
    color: '#ef4444',
    bg:    'rgba(239,68,68,0.12)',
    label: 'Agresión',
  },
  AISLAMIENTO: {
    icon:  'person',
    color: '#f59e0b',
    bg:    'rgba(245,158,11,0.12)',
    label: 'Aislamiento',
  },
  CAIDA: {
    icon:  'personFall',
    color: '#3b82f6',
    bg:    'rgba(59,130,246,0.12)',
    label: 'Caída',
  },
  OTRO: {
    icon:  'alert',
    color: '#64748b',
    bg:    'rgba(100,116,139,0.12)',
    label: 'Otro',
  },
};

export const ALERT_STATUS = {
  PENDIENTE:  'PENDIENTE',
  CONFIRMADA: 'CONFIRMADA',
  DESCARTADA: 'DESCARTADA',
};

export const STATUS_CONFIG = {
  PENDIENTE: {
    color: '#f59e0b',
    bg:    'rgba(245,158,11,0.15)',
    label: 'Pendiente',
  },
  CONFIRMADA: {
    color: '#22c55e',
    bg:    'rgba(34,197,94,0.15)',
    label: 'Confirmada',
  },
  DESCARTADA: {
    color: '#64748b',
    bg:    'rgba(100,116,139,0.15)',
    label: 'Descartada',
  },
};

// Razones predefinidas para descartar una alerta (HU-03)
export const DISCARD_REASONS = [
  'Falsa alarma',
  'Juego normal',
  'Actividad curricular',
  'Error de cámara',
  'Otro',
];

// Umbral de confianza mínimo para mostrar alerta al docente
export const DEFAULT_CONFIDENCE_THRESHOLD = 0.75;
