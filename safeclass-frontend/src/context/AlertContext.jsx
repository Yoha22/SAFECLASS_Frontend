import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { mockAlerts, mockClassrooms } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ALERT_STATUS } from '@/constants/alertConfig';

const AlertContext = createContext(null);

const ALERT_TYPES_SIM = ['AGRESIÓN', 'AISLAMIENTO', 'CAÍDA', 'OTRO'];
const ROOMS_SIM        = ['3A', '3B'];

export function AlertProvider({ children }) {
  const { user }    = useAuth();
  const { addToast } = useToast();

  const [alerts,     setAlerts]     = useState(mockAlerts);
  const [classrooms, setClassrooms] = useState(mockClassrooms);

  // Simula alertas entrantes cada 45 s (HU-02)
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      const type  = ALERT_TYPES_SIM[Math.floor(Math.random() * ALERT_TYPES_SIM.length)];
      const room  = ROOMS_SIM[Math.floor(Math.random() * ROOMS_SIM.length)];
      const alert = {
        id:           `ALT-${String(Date.now()).slice(-4)}`,
        type,
        classroom:    room,
        cameraId:     room === '3A' ? 'CAM-01' : 'CAM-02',
        timestamp:    new Date().toISOString(),
        confidence:   0.60 + Math.random() * 0.35,
        status:       ALERT_STATUS.PENDIENTE,
        discardReason: null,
        escalated:    false,
        actions:      [],
      };
      setAlerts((prev) => [alert, ...prev]);
      setClassrooms((prev) =>
        prev.map((c) => c.id === room ? { ...c, alertCount: c.alertCount + 1, status: 'alert' } : c)
      );
      addToast(`Nueva alerta: ${type} en Aula ${room}`, 'error');
    }, 45000);
    return () => clearInterval(interval);
  }, [user, addToast]);

  // HU-03: Confirmar alerta
  const confirmAlert = useCallback((alertId) => {
    setAlerts((prev) => prev.map((a) =>
      a.id === alertId ? {
        ...a,
        status: ALERT_STATUS.CONFIRMADA,
        actions: [...a.actions, { action: 'Confirmada', user: user?.name ?? 'Usuario', timestamp: new Date().toISOString() }],
      } : a
    ));
    setClassrooms((prev) => prev.map((c) => {
      const alert = alerts.find((a) => a.id === alertId);
      if (!alert || c.id !== alert.classroom) return c;
      const next = Math.max(0, c.alertCount - 1);
      return { ...c, alertCount: next, status: next === 0 ? 'active' : 'alert' };
    }));
    addToast('Alerta confirmada correctamente', 'success');
  }, [alerts, user, addToast]);

  // HU-03: Descartar alerta
  const discardAlert = useCallback((alertId, reason) => {
    setAlerts((prev) => prev.map((a) =>
      a.id === alertId ? {
        ...a,
        status: ALERT_STATUS.DESCARTADA,
        discardReason: reason,
        actions: [...a.actions, { action: `Descartada: ${reason}`, user: user?.name ?? 'Usuario', timestamp: new Date().toISOString() }],
      } : a
    ));
    setClassrooms((prev) => prev.map((c) => {
      const alert = alerts.find((a) => a.id === alertId);
      if (!alert || c.id !== alert.classroom) return c;
      const next = Math.max(0, c.alertCount - 1);
      return { ...c, alertCount: next, status: next === 0 ? 'active' : 'alert' };
    }));
    addToast(`Alerta descartada: ${reason}`, 'info');
  }, [alerts, user, addToast]);

  // HU-03: Escalar alerta al coordinador
  const escalateAlert = useCallback((alertId) => {
    setAlerts((prev) => prev.map((a) =>
      a.id === alertId ? {
        ...a,
        escalated: true,
        actions: [...a.actions, { action: 'Escalada a Coordinador', user: user?.name ?? 'Usuario', timestamp: new Date().toISOString() }],
      } : a
    ));
    addToast('Alerta escalada al coordinador', 'info');
  }, [user, addToast]);

  const pendingCount = alerts.filter((a) => a.status === ALERT_STATUS.PENDIENTE).length;
  const hasCritical  = alerts.some((a) => a.status === ALERT_STATUS.PENDIENTE && a.type === 'AGRESIÓN');

  return (
    <AlertContext.Provider value={{
      alerts, classrooms,
      pendingCount, hasCritical,
      confirmAlert, discardAlert, escalateAlert,
    }}>
      {children}
    </AlertContext.Provider>
  );
}

export const useAlerts = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlerts debe usarse dentro de <AlertProvider>');
  return ctx;
};
