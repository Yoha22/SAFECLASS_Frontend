import { useState } from 'react';
import UsersTab    from './tabs/UsersTab';
import CamerasTab  from './tabs/CamerasTab';
import AIConfigTab from './tabs/AIConfigTab';
import SystemTab   from './tabs/SystemTab';

const TABS = [
  { id: 'usuarios', label: 'Usuarios'         },
  { id: 'camaras',  label: 'Cámaras'          },
  { id: 'ia',       label: 'Configuración IA'  },
  { id: 'sistema',  label: 'Sistema'           },
];

export default function AdminPage() {
  const [tab, setTab] = useState('usuarios');

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-3.5 border-b border-[#1e2d4a] flex items-center gap-3 shrink-0">
        <h2 className="text-base font-bold text-text-primary">Administración del Sistema</h2>
        <span className="text-[10px] font-semibold tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
          ADMIN
        </span>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-[#1e2d4a] px-6 shrink-0">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              tab === t.id
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-text-hint hover:text-text-secondary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'usuarios' && <UsersTab />}
        {tab === 'camaras'  && <CamerasTab />}
        {tab === 'ia'       && <AIConfigTab />}
        {tab === 'sistema'  && <SystemTab />}
      </div>
    </div>
  );
}
