import { useState } from 'react';
import Icon from '@/components/ui/Icon';
import { ROLE_LABELS } from '@/constants/roles';
import { fmt } from '@/utils/formatters';
import { mockUsers } from '@/data/mockData';
import { useToast } from '@/hooks/useToast';

export default function UsersTab() {
  const { addToast }    = useToast();
  const [users, setUsers] = useState(mockUsers);

  const toggleActive = (id) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, active: !u.active } : u));
    const u = users.find((u) => u.id === id);
    addToast(`Usuario ${u?.name} ${u?.active ? 'desactivado' : 'activado'}`, 'success');
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-primary">{users.length} usuarios registrados</h3>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-md text-xs font-semibold hover:bg-blue-500/20 transition-colors">
          <Icon name="plus" size={13} /> Nuevo usuario
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {users.map((u) => (
          <div key={u.id} className="flex items-center gap-3 px-4 py-3 bg-surface-card border border-[#1e2d4a] rounded-lg">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#253d6b] flex items-center justify-center text-xs font-bold text-blue-300 shrink-0">
              {u.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-text-primary">{u.name}</div>
              <div className="text-xs text-text-hint truncate">{u.email}</div>
            </div>
            <span className="text-xs font-semibold" style={{ color: ROLE_LABELS[u.role]?.color }}>
              {ROLE_LABELS[u.role]?.label}
            </span>
            <span className="text-[10px] text-text-hint hidden sm:block">
              {fmt.datetime(u.lastSession)}
            </span>
            <button
              onClick={() => toggleActive(u.id)}
              className={`w-8 h-4 rounded-full transition-colors relative ${u.active ? 'bg-green-500' : 'bg-[#1e2d4a]'}`}
            >
              <span
                className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all"
                style={{ left: u.active ? '50%' : '2px' }}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
