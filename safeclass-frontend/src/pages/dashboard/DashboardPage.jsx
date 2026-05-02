import { useState } from 'react';
import { KPICard, ClassroomTabs } from '@/components/dashboard';
import AlertCard   from '@/components/alerts/AlertCard';
import AlertDetail from '@/components/alerts/AlertDetail';
import Icon        from '@/components/ui/Icon';
import { useAlerts } from '@/hooks/useAlerts';
import { ALERT_STATUS, DISCARD_REASONS } from '@/constants/alertConfig';
import { mockSystemStats } from '@/data/mockData';

export default function DashboardPage() {
  const {
    alerts, classrooms, pendingCount,
    confirmAlert, discardAlert, escalateAlert,
  } = useAlerts();

  const [activeRoom,    setActiveRoom]    = useState(classrooms[0]?.id);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const pendingAlerts = alerts.filter((a) => a.status === ALERT_STATUS.PENDIENTE);
  const todayStats    = mockSystemStats.today;

  const handleConfirm  = (id) => { confirmAlert(id);                     setSelectedAlert(null); };
  const handleDiscard  = (id, reason) => { discardAlert(id, reason);     setSelectedAlert(null); };
  const handleEscalate = (id) => escalateAlert(id);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-3.5 border-b border-[#1e2d4a] flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-base font-bold text-text-primary">Dashboard</h2>
          <p className="text-xs text-text-hint mt-0.5">Monitoreo en tiempo real</p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-md text-red-400 text-xs font-semibold">
            <Icon name="bell" size={13} />
            {pendingCount} alerta{pendingCount !== 1 ? 's' : ''} pendiente{pendingCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-6">
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-3">
          <KPICard label="Hoy total"      value={todayStats.total}           icon="bell"    color="#3b82f6" />
          <KPICard label="Confirmadas"    value={todayStats.confirmed}       icon="check"   color="#22c55e" />
          <KPICard label="Falsas alarmas" value={todayStats.falsePositives}  icon="x"       color="#64748b" />
          <KPICard label="T. respuesta"   value={`${todayStats.avgResponseMin}m`} icon="history" color="#f59e0b" />
        </div>

        {/* Classroom tabs + video feed */}
        <ClassroomTabs
          classrooms={classrooms}
          activeId={activeRoom}
          onSelect={setActiveRoom}
        />

        {/* Pending alerts */}
        {pendingAlerts.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-status-pulse" />
              Alertas pendientes
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {pendingAlerts.map((a) => (
                <AlertCard
                  key={a.id}
                  alert={a}
                  onClick={setSelectedAlert}
                  onConfirm={handleConfirm}
                  onDiscard={(id) => discardAlert(id, DISCARD_REASONS[0])}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedAlert && (
        <AlertDetail
          alert={alerts.find((a) => a.id === selectedAlert.id) ?? selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onConfirm={handleConfirm}
          onDiscard={handleDiscard}
          onEscalate={handleEscalate}
        />
      )}
    </div>
  );
}
