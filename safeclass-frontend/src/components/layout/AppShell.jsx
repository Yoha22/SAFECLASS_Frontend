import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';
import ToastContainer from '@/components/ui/Toast';
import AlertDetail from '@/components/alerts/AlertDetail';
import { useAlerts } from '@/hooks/useAlerts';

import DashboardPage   from '@/pages/dashboard/DashboardPage';
import HistoryPage     from '@/pages/history/HistoryPage';
import CoordinatorPage from '@/pages/coordinator/CoordinatorPage';
import AdminPage       from '@/pages/admin/AdminPage';

const PANEL_ROUTES = ['/'];

export default function AppShell() {
  const { hasCritical }  = useAlerts();
  const [selectedAlert, setSelectedAlert] = useState(null);

  return (
    <div
      className="flex h-full overflow-hidden font-sans transition-colors duration-300"
      style={{ background: hasCritical ? '#100808' : '#0b0f1a' }}
    >
      {/* Critical left-border pulse */}
      {hasCritical && (
        <div className="fixed left-0 top-0 bottom-0 w-1 bg-red-500 animate-critical-pulse z-50" />
      )}

      <Sidebar />

      <div className="flex-1 flex min-w-0 overflow-hidden">
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/"            element={<DashboardPage   />} />
            <Route path="/history"     element={<HistoryPage     />} />
            <Route path="/coordinator" element={<CoordinatorPage />} />
            <Route path="/admin/*"     element={<AdminPage       />} />
          </Routes>
        </main>

        {/* Right panel only on dashboard */}
        <Routes>
          <Route
            path="/"
            element={<RightPanel onAlertClick={setSelectedAlert} />}
          />
        </Routes>
      </div>

      {/* Alert detail modal */}
      {selectedAlert && (
        <AlertDetail
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
        />
      )}

      <ToastContainer />
    </div>
  );
}
