import { useState, useEffect } from 'react';
import Icon from '@/components/ui/Icon';
import Modal from '@/components/ui/Modal';
import { UserRow } from '@/components/admin';
import { apiFetch } from '@/api/client';
import { useToast } from '@/hooks/useToast';
import { ROLES } from '@/constants/roles';

const EMPTY_FORM = { name: '', email: '', role: ROLES.DOCENTE, password: '' };

export default function UsersTab() {
  const { addToast }      = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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

  const openModal = () => {
    setForm(EMPTY_FORM);
    setFormErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Nombre requerido';
    if (!form.email.trim()) errors.email = 'Correo requerido';
    else if (!form.email.endsWith('@iecol.edu.co')) errors.email = 'Debe ser un correo @iecol.edu.co';
    if (!form.role) errors.role = 'Rol requerido';
    if (!form.password || form.password.length < 6) errors.password = 'Mínimo 6 caracteres';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validate() || submitting) return;
    setSubmitting(true);
    try {
      const created = await apiFetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setUsers((prev) => [...prev, created]);
      setModalOpen(false);
      addToast(`Usuario "${created.name}" creado`, 'success');
    } catch (err) {
      addToast(`Error: ${err.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-text-hint text-sm">Cargando usuarios…</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-primary">{users.length} usuarios registrados</h3>
        <button
          onClick={openModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-md text-xs font-semibold hover:bg-blue-500/20 transition-colors"
        >
          <Icon name="plus" size={13} /> Nuevo usuario
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {users.map((u) => (
          <UserRow key={u.id} user={u} onToggle={handleToggle} />
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} maxWidth={460}>
        <div className="px-6 py-4 border-b border-[#1e2d4a] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary">Nuevo usuario</h3>
          <button onClick={() => setModalOpen(false)} className="text-text-hint hover:text-text-primary transition-colors">
            <Icon name="x" size={16} />
          </button>
        </div>

        <form onSubmit={handleCreate} className="px-6 py-5 flex flex-col gap-4">
          {[
            { id: 'name',     label: 'NOMBRE COMPLETO',      type: 'text',     placeholder: 'Ej: María Torres' },
            { id: 'email',    label: 'CORREO INSTITUCIONAL', type: 'email',    placeholder: 'usuario@iecol.edu.co' },
            { id: 'password', label: 'CONTRASEÑA',           type: 'password', placeholder: 'Mínimo 6 caracteres' },
          ].map(({ id, label, type, placeholder }) => (
            <div key={id}>
              <label className="block text-[11px] text-text-hint tracking-wider mb-1.5">{label}</label>
              <input
                type={type}
                value={form[id]}
                onChange={(e) => { setForm((p) => ({ ...p, [id]: e.target.value })); setFormErrors((p) => ({ ...p, [id]: '' })); }}
                placeholder={placeholder}
                className="w-full px-3 py-2.5 bg-surface border border-[#1e2d4a] rounded-md text-text-primary text-sm placeholder:text-text-hint focus:outline-none focus:border-blue-500 transition-colors"
              />
              {formErrors[id] && <p className="mt-1 text-xs text-red-400">{formErrors[id]}</p>}
            </div>
          ))}

          <div>
            <label className="block text-[11px] text-text-hint tracking-wider mb-1.5">ROL</label>
            <select
              value={form.role}
              onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
              className="w-full px-3 py-2.5 bg-surface border border-[#1e2d4a] rounded-md text-text-primary text-sm focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value={ROLES.DOCENTE}>Docente</option>
              <option value={ROLES.COORDINADOR}>Coordinador</option>
              <option value={ROLES.ADMINISTRADOR}>Administrador</option>
            </select>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-md text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Creando…' : 'Crear usuario'}
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2.5 rounded-md text-sm text-text-secondary bg-white/5 hover:bg-white/10 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
