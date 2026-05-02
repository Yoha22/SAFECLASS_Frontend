// HU-01: Roles del sistema SAFECLASS
export const ROLES = {
  DOCENTE:       'docente',
  COORDINADOR:   'coordinador',
  ADMINISTRADOR: 'administrador',
};

export const ROLE_LABELS = {
  docente:       { label: 'Docente',       color: '#3b82f6' },
  coordinador:   { label: 'Coordinador',   color: '#f59e0b' },
  administrador: { label: 'Administrador', color: '#22c55e' },
};

// Vistas a las que tiene acceso cada rol (nav items del Sidebar)
export const ROLE_NAV = {
  docente: ['dashboard', 'history'],
  coordinador: ['dashboard', 'history', 'coordinator'],
  administrador: ['dashboard', 'history', 'coordinator', 'admin'],
};

// Detecta el rol por convención del email institucional
export const getRoleFromEmail = (email) => {
  if (!email) return null;
  if (email.includes('admin')) return ROLES.ADMINISTRADOR;
  if (email.includes('coord')) return ROLES.COORDINADOR;
  if (email.endsWith('@iecol.edu.co')) return ROLES.DOCENTE;
  return null;
};
