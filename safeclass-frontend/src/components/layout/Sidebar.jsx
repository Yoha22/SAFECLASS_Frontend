import { Link, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/Icon';
import { ROLE_NAV, ROLE_LABELS } from '@/constants/roles';

const NAV_ITEMS = [
  { id: 'dashboard',   path: '/',            icon: 'dashboard',   label: 'Dashboard'      },
  { id: 'history',     path: '/history',     icon: 'history',     label: 'Historial'      },
  { id: 'coordinator', path: '/coordinator', icon: 'coordinator', label: 'Coordinador'    },
  { id: 'admin',       path: '/admin',       icon: 'settings',    label: 'Administración' },
];

/**
 * Barra lateral de navegación — puramente presentacional.
 * Props:
 *   user         — { name, role } usuario autenticado
 *   classrooms   — lista de aulas con status y alertCount
 *   pendingCount — número de alertas pendientes (badge en Dashboard)
 *   hasCritical  — resalta el borde cuando hay AGRESIÓN pendiente
 *   onLogout     — cb() cerrar sesión
 */
export default function Sidebar({ user, classrooms = [], pendingCount = 0, hasCritical = false, onLogout }) {
  const location    = useLocation();
  const allowedViews = ROLE_NAV[user?.role] ?? ['dashboard'];
  const visibleNav   = NAV_ITEMS.filter((n) => allowedViews.includes(n.id));

  return (
    <aside
      className="w-60 shrink-0 flex flex-col bg-surface-sidebar transition-colors duration-300"
      style={{ borderRight: `1px solid ${hasCritical ? 'rgba(239,68,68,0.2)' : '#1e2d4a'}` }}
    >
      {/* Logo */}
      <div className="px-4 py-5 border-b border-[#1e2d4a]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br from-[#1e3a5f] to-[#1e2d4a] border border-[#253d6b]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <circle cx="12" cy="12" r="2" fill="#3b82f6" stroke="none"/>
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold text-text-primary tracking-widest">SAFECLASS</div>
            <div className="text-[10px] text-text-hint tracking-wider">v2.4.1</div>
          </div>
        </div>
      </div>

      {/* User card */}
      {user && (
        <div className="mx-3 mt-3 p-2.5 rounded-lg bg-[#0b0f1a] border border-[#1e2d4a]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#253d6b] flex items-center justify-center text-xs font-bold text-blue-300 shrink-0">
              {user.name?.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-text-primary truncate">{user.name}</div>
              <div className="text-[10px] font-semibold tracking-wider" style={{ color: ROLE_LABELS[user.role]?.color }}>
                {ROLE_LABELS[user.role]?.label}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Classrooms */}
      <div className="px-3 mt-4 mb-1">
        <div className="text-[10px] text-text-hint tracking-widest font-semibold mb-1.5 px-1">AULAS</div>
        <div className="flex flex-col gap-0.5">
          {classrooms.map((c) => (
            <div key={c.id} className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs hover:bg-white/5 transition-colors">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  background: c.status === 'alert' ? '#ef4444' : c.status === 'offline' ? '#64748b' : '#22c55e',
                  boxShadow: c.status === 'alert' ? '0 0 6px #ef4444' : 'none',
                }}
              />
              <span className="text-text-secondary">{c.name}</span>
              {c.alertCount > 0 && (
                <span className="ml-auto text-[10px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded-full">
                  {c.alertCount}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-4 flex flex-col gap-0.5">
        <div className="text-[10px] text-text-hint tracking-widest font-semibold mb-1.5 px-1">MENÚ</div>
        {visibleNav.map((item) => {
          const active = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors ${
                active
                  ? 'bg-blue-500/10 text-blue-400'
                  : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
              }`}
            >
              <Icon name={item.icon} size={15} />
              {item.label}
              {item.id === 'dashboard' && pendingCount > 0 && (
                <span className="ml-auto text-[10px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-[#1e2d4a]">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-[13px] text-text-hint hover:text-red-400 hover:bg-red-500/5 transition-colors"
        >
          <Icon name="logout" size={14} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
