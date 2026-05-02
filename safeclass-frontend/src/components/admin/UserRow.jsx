import { ROLE_LABELS } from '@/constants/roles';
import { fmt } from '@/utils/formatters';

/**
 * Fila de usuario en la tabla de administración.
 * Props:
 *   user       — objeto usuario
 *   onToggle   — cb(userId) activar/desactivar
 */
export default function UserRow({ user, onToggle }) {
  const initials = user.name.split(' ').map((n) => n[0]).join('').slice(0, 2);
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-surface-card border border-[#1e2d4a] rounded-lg">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#253d6b] flex items-center justify-center text-xs font-bold text-blue-300 shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-text-primary">{user.name}</div>
        <div className="text-xs text-text-hint truncate">{user.email}</div>
      </div>
      <span className="text-xs font-semibold shrink-0" style={{ color: ROLE_LABELS[user.role]?.color }}>
        {ROLE_LABELS[user.role]?.label}
      </span>
      <span className="text-[10px] text-text-hint hidden sm:block shrink-0">
        {fmt.datetime(user.lastSession)}
      </span>
      {/* Toggle activo/inactivo */}
      <button
        onClick={() => onToggle?.(user.id)}
        title={user.active ? 'Desactivar usuario' : 'Activar usuario'}
        className={`w-8 h-4 rounded-full transition-colors relative shrink-0 ${user.active ? 'bg-green-500' : 'bg-[#1e2d4a]'}`}
      >
        <span
          className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all"
          style={{ left: user.active ? '50%' : '2px' }}
        />
      </button>
    </div>
  );
}
