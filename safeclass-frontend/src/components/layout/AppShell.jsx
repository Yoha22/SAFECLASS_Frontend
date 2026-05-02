import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar      from './Sidebar';
import RightPanel   from './RightPanel';
import ToastContainer from '@/components/ui/Toast';
import AlertDetail  from '@/components/alerts/AlertDetail';
import { useAuth }   from '@/hooks/useAuth';
import { useAlerts } from '@/hooks/useAlerts';

import DashboardPage   from '@/pages/dashboard/DashboardPage';
import HistoryPage     from '@/pages/history/HistoryPage';
import CoordinatorPage from '@/pages/coordinator/CoordinatorPage';
import AdminPage       from '@/pages/admin/AdminPage';

/**
 * Contenedor raíz de la aplicación autenticada.
 * Es el único punto donde se conectan contexto + layout + rutas.
 * Los componentes hijos solo reciben props.
 */
export default function AppShell() {
  const { user, logout }                                        = useAuth();
  const { alerts, classrooms, pendingCount, hasCritical,
          confirmAlert, discardAlert, escalateAlert }           = useAlerts();

  const [selectedAlert, setSelectedAlert] = useState(null);

  const handleCloseDetail = () => setSelectedAlert(null);
  const handleConfirm     = (id) => { confirmAlert(id);         handleCloseDetail(); };
  const handleDiscard     = (id, reason) => { discardAlert(id, reason); handleCloseDetail(); };
  const handleEscalate    = (id) => escalateAlert(id);

  return (
    <div
      className="flex h-full overflow-hidden font-sans transition-colors duration-300"
      style={{ background: hasCritical ? '#100808' : '#0b0f1a' }}
    >
      {hasCritical && (
        <div className="fixed left-0 top-0 bottom-0 w-1 bg-red-500 animate-critical-pulse z-50" />
      )}

      {/* Sidebar recibe datos, no consume contexto */}
      <Sidebar
        user={user}
        classrooms={classrooms}
        pendingCount={pendingCount}
        hasCritical={hasCritical}
        onLogout={logout}
      />

      <div className="flex-1 flex min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/"            element={<DashboardPage   />} />
            <Route path="/history"     element={<HistoryPage     />} />
            <Route path="/coordinator" element={<CoordinatorPage />} />
            <Route path="/admin/*"     element={<AdminPage       />} />
          </Routes>
        </main>

        {/* RightPanel solo en la ruta raíz */}
        <Routes>
          <Route
            path="/"
            element={
              <RightPanel
                alerts={alerts}
                onAlertClick={setSelectedAlert}
              />
            }
          />
        </Routes>
      </div>

      {/* Modal global de detalle — manejado aquí para poder mostrase desde cualquier página */}
      {selectedAlert && (
        <AlertDetail
          alert={alerts.find((a) => a.id === selectedAlert.id) ?? selectedAlert}
          onClose={handleCloseDetail}
          onConfirm={handleConfirm}
          onDiscard={handleDiscard}
          onEscalate={handleEscalate}
        />
      )}

      <ToastContainer />
    </div>
  );
}
