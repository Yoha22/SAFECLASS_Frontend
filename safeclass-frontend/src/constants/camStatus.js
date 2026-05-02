// HU-06: Estados posibles de una cámara IP
export const CAM_STATUS = {
  alert:        { color: '#ef4444', label: 'Alerta activa',  pulse: true  },
  active:       { color: '#22c55e', label: 'Activo',         pulse: true  },
  online:       { color: '#22c55e', label: 'En línea',       pulse: true  },
  low:          { color: '#f59e0b', label: 'Baja calidad',   pulse: false },
  reconnecting: { color: '#f59e0b', label: 'Reconectando',   pulse: true  },
  offline:      { color: '#64748b', label: 'Offline',        pulse: false },
  error:        { color: '#ef4444', label: 'Error',          pulse: true  },
};
