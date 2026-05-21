import { useState, useEffect } from 'react';
import Icon from '@/components/ui/Icon';
import { UserRow } from '@/components/admin';
import { apiFetch } from '@/api/client';
import { useToast } from '@/hooks/useToast';

export default function UsersTab() {
  const { addToast }      = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/users')
      .then(setUsers)
      .catch((err) => addToast(`Error al cargar usuarios: ${err.message}`, 'error'))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (id) => {
    try {
      const updated = await apiFetch(`/api/users/${id}/toggle`, { method: 'PUT' });
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, active: updated.active } : u));
      addToast(`Usuario ${updated.name} ${updated.active ? 'activado' : 'desactivado'}`, 'success');
    } catch (err) {
      addToast(`Error: ${err.message}`, 'error');
    }
  };

  if (loading) {
    return <div className="p-6 text-text-hint text-sm">Cargando usuarios…</div>;
  }

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
          <UserRow key={u.id} user={u} onToggle={handleToggle} />
        ))}
      </div>
    </div>
  );
}
