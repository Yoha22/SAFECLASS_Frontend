import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { apiFetch, openAlertsStream } from '@/api/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ALERT_STATUS, ALERT_CONFIG } from '@/constants/alertConfig';

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const { user }     = useAuth();
  const { addToast } = useToast();

  const [alerts,     setAlerts]     = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading,    setLoading]    = useState(false);
  const esRef = useRef(null);

  // ── Initial data load ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) {
      setAlerts([]);
      setClassrooms([]);
      return;
    }

    setLoading(true);

    Promise.all([
      apiFetch('/api/alerts?limit=100'),
      apiFetch('/api/classrooms'),
    ])
      .then(([alertsRes, classroomsRes]) => {
        setAlerts(alertsRes.data ?? alertsRes);
        setClassrooms(classroomsRes);
      })
      .catch((err) => addToast(`Error cargando datos: ${err.message}`, 'error'))
      .finally(() => setLoading(false));
  }, [user]);

  // ── SSE real-time stream ───────────────────────────────────────────────────
  useEffect(() => {
    if (!user) {
      esRef.current?.close();
      esRef.current = null;
      return;
    }

    esRef.current = openAlertsStream(
      (newAlert) => {
        // Prepend new alert and mark its classroom as 'alert'
        setAlerts((prev) => {
          const exists = prev.some((a) => a.id === newAlert.id);
          return exists ? prev : [newAlert, ...prev];
        });
        setClassrooms((prev) =>
          prev.map((c) =>
            c.id === newAlert.classroomId ? { ...c, status: 'alert' } : c
          )
        );
        const cfg   = ALERT_CONFIG[newAlert.type];
        const label = cfg?.label ?? newAlert.type;
        const room  = newAlert.classroom?.name ?? newAlert.classroomId ?? '';
        addToast(`Nueva alerta: ${label} en ${room}`, 'error');
      },
      () => {
        // SSE error — silent reconnect handled by the browser automatically
      }
    );

    return () => {
      esRef.current?.close();
      esRef.current = null;
    };
  }, [user]);

  // ── Actions ────────────────────────────────────────────────────────────────

  // HU-03: Confirmar alerta
  const confirmAlert = useCallback(async (alertId, notes) => {
    const updated = await apiFetch(`/api/alerts/${alertId}/confirm`, {
      method: 'PUT',
      body: JSON.stringify({ notes }),
    });
    setAlerts((prev) => prev.map((a) => a.id === alertId ? updated : a));
    _syncClassroomStatus(alertId, updated);
    addToast('Alerta confirmada correctamente', 'success');
  }, []);

  // HU-03: Descartar alerta
  const discardAlert = useCallback(async (alertId, reason) => {
    const updated = await apiFetch(`/api/alerts/${alertId}/discard`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
    setAlerts((prev) => prev.map((a) => a.id === alertId ? updated : a));
    _syncClassroomStatus(alertId, updated);
    addToast(`Alerta descartada: ${reason}`, 'info');
  }, []);

  // HU-03: Escalar alerta al coordinador
  const escalateAlert = useCallback(async (alertId, coordinatorId) => {
    const updated = await apiFetch(`/api/alerts/${alertId}/escalate`, {
      method: 'PUT',
      body: JSON.stringify({ coordinatorId }),
    });
    setAlerts((prev) => prev.map((a) => a.id === alertId ? updated : a));
    addToast('Alerta escalada al coordinador', 'info');
  }, []);

  // Recompute classroom status after an alert action
  const _syncClassroomStatus = useCallback((alertId, updatedAlert) => {
    setAlerts((currentAlerts) => {
      const allAlerts = currentAlerts.map((a) => a.id === alertId ? updatedAlert : a);
      setClassrooms((prev) =>
        prev.map((c) => {
          const hasPending = allAlerts.some(
            (a) => a.classroomId === c.id && a.status === ALERT_STATUS.PENDIENTE
          );
          return { ...c, status: hasPending ? 'alert' : 'active' };
        })
      );
      return currentAlerts;
    });
  }, []);

  const pendingCount = alerts.filter((a) => a.status === ALERT_STATUS.PENDIENTE).length;
  const hasCritical  = alerts.some(
    (a) => a.status === ALERT_STATUS.PENDIENTE && a.type === 'AGRESION'
  );

  return (
    <AlertContext.Provider value={{
      alerts, classrooms, loading,
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
