import { useState } from 'react';
import AlertCard from '@/components/alerts/AlertCard';
import AlertDetail from '@/components/alerts/AlertDetail';
import VideoPlaceholder from '@/components/ui/VideoPlaceholder';
import Icon from '@/components/ui/Icon';
import { useAlerts } from '@/hooks/useAlerts';
import { ALERT_STATUS } from '@/constants/alertConfig';
import { mockSystemStats } from '@/data/mockData';

export default function DashboardPage() {
  const { alerts, classrooms, pendingCount } = useAlerts();
  const [activeRoom,     setActiveRoom]     = useState(classrooms[0]?.id);
  const [selectedAlert,  setSelectedAlert]  = useState(null);

  const pendingAlerts  = alerts.filter((a) => a.status === ALERT_STATUS.PENDIENTE);
  const todayStats     = mockSystemStats.today;
  const activeClassroom = classrooms.find((c) => c.id === activeRoom);

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
        {/* KPI row */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Hoy total',       value: todayStats.total,          icon: 'bell',    color: '#3b82f6' },
            { label: 'Confirmadas',     value: todayStats.confirmed,      icon: 'check',   color: '#22c55e' },
            { label: 'Falsas alarmas',  value: todayStats.falsePositives, icon: 'x',       color: '#64748b' },
            { label: 'T. respuesta',    value: `${todayStats.avgResponseMin}m`, icon: 'history', color: '#f59e0b' },
          ].map((k) => (
            <div key={k.label} className="bg-surface-card border border-[#1e2d4a] rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span style={{ color: k.color }}><Icon name={k.icon} size={14} /></span>
                <span className="text-[11px] text-text-hint">{k.label}</span>
              </div>
              <div className="text-2xl font-bold text-text-primary font-mono">{k.value}</div>
            </div>
          ))}
        </div>

        {/* Classroom tabs + video */}
        <div className="bg-surface-card border border-[#1e2d4a] rounded-lg overflow-hidden">
          <div className="flex border-b border-[#1e2d4a]">
            {classrooms.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveRoom(c.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
                  activeRoom === c.id
                    ? 'text-blue-400 bg-blue-500/5 border-b border-blue-500'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: c.status === 'alert' ? '#ef4444' : c.status === 'offline' ? '#64748b' : '#22c55e',
                  }}
                />
                {c.name}
                {c.alertCount > 0 && (
                  <span className="text-[10px] text-red-400 bg-red-500/10 px-1 rounded-full">{c.alertCount}</span>
                )}
              </button>
            ))}
          </div>
          {activeClassroom && (
            <div className="p-4">
              <VideoPlaceholder
                classroom={activeClassroom.name}
                hasAlert={activeClassroom.status === 'alert'}
              />
            </div>
          )}
        </div>

        {/* Pending alerts */}
        {pendingAlerts.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-status-pulse" />
              Alertas pendientes
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {pendingAlerts.map((a) => (
                <AlertCard key={a.id} alert={a} onClick={setSelectedAlert} />
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedAlert && (
        <AlertDetail alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
      )}
    </div>
  );
}
