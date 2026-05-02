// Datos de prueba — reemplazar con llamadas a la API en producción

export const mockUsers = [
  { id: 1, name: 'María Torres',   email: 'maria.torres@iecol.edu.co',   role: 'docente',       active: true,  lastSession: '2026-05-02T07:45:00' },
  { id: 2, name: 'Carlos Mendoza', email: 'carlos.coord@iecol.edu.co',   role: 'coordinador',   active: true,  lastSession: '2026-05-02T08:00:00' },
  { id: 3, name: 'Ana Ruiz',       email: 'ana.admin@iecol.edu.co',      role: 'administrador', active: true,  lastSession: '2026-05-01T16:30:00' },
  { id: 4, name: 'Pedro Salcedo',  email: 'pedro.salcedo@iecol.edu.co',  role: 'docente',       active: false, lastSession: '2026-04-28T12:00:00' },
  { id: 5, name: 'Lucía Vargas',   email: 'lucia.vargas@iecol.edu.co',   role: 'docente',       active: true,  lastSession: '2026-05-02T07:55:00' },
];

export const mockClassrooms = [
  { id: '3A', name: 'Aula 3A', status: 'alert',   alertCount: 1, cameraId: 'CAM-01' },
  { id: '3B', name: 'Aula 3B', status: 'active',  alertCount: 0, cameraId: 'CAM-02' },
  { id: '2C', name: 'Aula 2C', status: 'offline', alertCount: 0, cameraId: 'CAM-03' },
];

export const mockCameras = [
  { id: 'CAM-01', name: 'Cámara 1 — Aula 3A', classroom: '3A', rtsp: 'rtsp://192.168.1.10/stream1', status: 'online',  lastCheck: '2026-05-02T14:25:00', fps: 24, resolution: '1080p' },
  { id: 'CAM-02', name: 'Cámara 2 — Aula 3B', classroom: '3B', rtsp: 'rtsp://192.168.1.11/stream1', status: 'online',  lastCheck: '2026-05-02T14:25:00', fps: 22, resolution: '720p'  },
  { id: 'CAM-03', name: 'Cámara 3 — Aula 2C', classroom: '2C', rtsp: 'rtsp://192.168.1.12/stream1', status: 'offline', lastCheck: '2026-05-02T08:12:00', fps: 0,  resolution: '—'     },
  { id: 'CAM-04', name: 'Cámara 4 — Patio',   classroom: 'Patio', rtsp: 'rtsp://192.168.1.13/stream1', status: 'error', lastCheck: '2026-05-02T13:58:00', fps: 0, resolution: '—'    },
];

export const mockAlerts = [
  { id: 'ALT-001', type: 'AGRESIÓN',    classroom: '3A', cameraId: 'CAM-01', timestamp: '2026-05-02T14:23:00', confidence: 0.89, status: 'PENDIENTE',  discardReason: null,             escalated: false, actions: [] },
  { id: 'ALT-002', type: 'AISLAMIENTO', classroom: '3B', cameraId: 'CAM-02', timestamp: '2026-05-02T13:47:00', confidence: 0.76, status: 'CONFIRMADA', discardReason: null,             escalated: false, actions: [{ action: 'Confirmada',           user: 'María Torres', timestamp: '2026-05-02T13:49:00' }] },
  { id: 'ALT-003', type: 'CAÍDA',       classroom: '3A', cameraId: 'CAM-01', timestamp: '2026-05-02T11:12:00', confidence: 0.94, status: 'CONFIRMADA', discardReason: null,             escalated: false, actions: [{ action: 'Confirmada',           user: 'María Torres', timestamp: '2026-05-02T11:14:00' }] },
  { id: 'ALT-004', type: 'OTRO',        classroom: '3B', cameraId: 'CAM-02', timestamp: '2026-05-02T10:05:00', confidence: 0.61, status: 'DESCARTADA', discardReason: 'Juego normal',   escalated: false, actions: [{ action: 'Descartada: Juego normal', user: 'María Torres', timestamp: '2026-05-02T10:07:00' }] },
  { id: 'ALT-005', type: 'AGRESIÓN',    classroom: '3A', cameraId: 'CAM-01', timestamp: '2026-05-01T15:30:00', confidence: 0.82, status: 'CONFIRMADA', discardReason: null,             escalated: true,  actions: [{ action: 'Confirmada', user: 'María Torres', timestamp: '2026-05-01T15:32:00' }, { action: 'Escalada a Coordinador', user: 'María Torres', timestamp: '2026-05-01T15:33:00' }] },
  { id: 'ALT-006', type: 'CAÍDA',       classroom: '3B', cameraId: 'CAM-02', timestamp: '2026-05-01T09:18:00', confidence: 0.91, status: 'CONFIRMADA', discardReason: null,             escalated: false, actions: [{ action: 'Confirmada',           user: 'María Torres', timestamp: '2026-05-01T09:20:00' }] },
  { id: 'ALT-007', type: 'AISLAMIENTO', classroom: '3A', cameraId: 'CAM-01', timestamp: '2026-04-30T14:05:00', confidence: 0.68, status: 'DESCARTADA', discardReason: 'Actividad curricular', escalated: false, actions: [{ action: 'Descartada: Actividad curricular', user: 'María Torres', timestamp: '2026-04-30T14:08:00' }] },
];

export const mockSystemStats = {
  today:    { total: 7, confirmed: 5, falsePositives: 2, avgResponseMin: 2.3 },
  threshold: 0.75,
  thresholdHistory: [
    { value: 0.70, user: 'Ana Ruiz',       timestamp: '2026-04-15T09:00:00' },
    { value: 0.75, user: 'Ana Ruiz',       timestamp: '2026-04-20T10:30:00' },
    { value: 0.75, user: 'Carlos Mendoza', timestamp: '2026-05-02T07:00:00' },
  ],
};

export const mockCoordinatorStats = {
  weekly: {
    kpis: { totalAlerts: 34, falsePositiveRate: 0.18, topClassroom: 'Aula 3A', topClassroomCount: 14, avgResponseMin: 2.3 },
    byDay:  [{ day: 'Lun', alerts: 8 }, { day: 'Mar', alerts: 5 }, { day: 'Mié', alerts: 7 }, { day: 'Jue', alerts: 6 }, { day: 'Vie', alerts: 8 }],
    byType: [
      { type: 'AGRESIÓN',    count: 12, color: '#ef4444' },
      { type: 'AISLAMIENTO', count: 8,  color: '#f59e0b' },
      { type: 'CAÍDA',       count: 9,  color: '#3b82f6' },
      { type: 'OTRO',        count: 5,  color: '#64748b' },
    ],
    heatmap: [
      ['7:00–8:00',   1,0,1,0,0], ['8:00–9:00',   2,1,2,1,2],
      ['9:00–10:00',  3,2,1,2,3], ['10:00–11:00', 1,1,2,3,2],
      ['11:00–12:00', 2,3,1,1,2], ['12:00–13:00', 0,1,0,0,1],
      ['13:00–14:00', 2,1,2,1,1], ['14:00–15:00', 4,2,3,2,3],
      ['15:00–16:00', 1,1,0,1,2],
    ],
    classroomRanking: [
      { name: 'Aula 3A', count: 14 }, { name: 'Aula 3B', count: 10 },
      { name: 'Aula 2C', count: 6  }, { name: 'Patio',   count: 4  },
    ],
  },
};

export const mockSystemLogs = [
  { id: 1, level: 'INFO',  module: 'Captura',        msg: 'Stream CAM-01 estable — 24fps',              time: '14:25:11' },
  { id: 2, level: 'INFO',  module: 'IA',             msg: 'Inferencia batch completada — 38ms/frame',   time: '14:25:08' },
  { id: 3, level: 'WARN',  module: 'Captura',        msg: 'CAM-04 sin respuesta — reconectando...',     time: '14:24:55' },
  { id: 4, level: 'ERROR', module: 'Captura',        msg: 'CAM-03 offline desde 08:12',                 time: '14:24:00' },
  { id: 5, level: 'INFO',  module: 'BD',             msg: 'Backup incremental completado',              time: '14:20:00' },
  { id: 6, level: 'INFO',  module: 'Notificaciones', msg: 'Alerta ALT-001 enviada a María Torres',      time: '14:23:05' },
  { id: 7, level: 'INFO',  module: 'Sistema',        msg: 'SAFECLASS v2.4.1 — módulos activos',         time: '07:00:00' },
];

export const mockSystemModules = [
  { name: 'Módulo de Captura',          status: 'warn', detail: '1 cámara offline' },
  { name: 'Módulo IA (YOLOv8)',         status: 'ok',   detail: '38ms/frame'       },
  { name: 'Base de Datos',              status: 'ok',   detail: 'Latencia 4ms'     },
  { name: 'Servicio de Notificaciones', status: 'ok',   detail: '100% entregado'   },
];

export const mockPerformanceStats = {
  fps: 22.4, inferenceMs: 38, cpuPercent: 34, ramPercent: 51,
};
