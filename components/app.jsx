// Main App — wires all views + state management

const App = () => {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState(null);
  const [currentView, setCurrentView] = React.useState("dashboard");
  const [activeClassroom, setActiveClassroom] = React.useState("3A");
  const [alerts, setAlerts] = React.useState(window.MOCK_DATA.alerts);
  const [classrooms, setClassrooms] = React.useState(window.MOCK_DATA.classrooms);
  const [selectedAlert, setSelectedAlert] = React.useState(null);
  const [toasts, setToasts] = React.useState([]);
  const [criticalActive, setCriticalActive] = React.useState(false);
  const [bgFlash, setBgFlash] = React.useState(false);

  // Toast helpers
  const addToast = React.useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const removeToast = React.useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Detect critical alert state
  React.useEffect(() => {
    const hasCritical = alerts.some(a => a.status === "PENDIENTE" && a.type === "AGRESIÓN");
    setCriticalActive(hasCritical);
    if (hasCritical) {
      setBgFlash(true);
      setTimeout(() => setBgFlash(false), 600);
    }
  }, [alerts]);

  // Simulate incoming alert every 45s
  React.useEffect(() => {
    if (!loggedIn) return;
    const interval = setInterval(() => {
      const types = ["AGRESIÓN", "AISLAMIENTO", "CAÍDA", "OTRO"];
      const rooms = ["3A", "3B"];
      const type = types[Math.floor(Math.random() * types.length)];
      const room = rooms[Math.floor(Math.random() * rooms.length)];
      const newAlert = {
        id: `ALT-${String(Date.now()).slice(-4)}`,
        type,
        classroom: room,
        cameraId: room === "3A" ? "CAM-01" : "CAM-02",
        timestamp: new Date().toISOString(),
        confidence: 0.60 + Math.random() * 0.35,
        status: "PENDIENTE",
        discardReason: null,
        escalated: false,
        actions: [],
      };
      setAlerts(prev => [newAlert, ...prev]);
      setClassrooms(prev => prev.map(c =>
        c.id === room ? { ...c, alertCount: c.alertCount + 1, status: "alert" } : c
      ));
      addToast(`Nueva alerta: ${type} en Aula ${room}`, "error");
    }, 45000);
    return () => clearInterval(interval);
  }, [loggedIn, addToast]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setLoggedIn(true);
    addToast(`Bienvenida, ${user.name.split(" ")[0]}`, "success");
  };

  const handleConfirm = (alertId) => {
    setAlerts(prev => prev.map(a =>
      a.id === alertId
        ? {
          ...a,
          status: "CONFIRMADA",
          actions: [...(a.actions || []), {
            action: "Confirmada",
            user: currentUser?.name || "Usuario",
            timestamp: new Date().toISOString(),
          }]
        }
        : a
    ));
    // Update classroom alert count
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      setClassrooms(prev => prev.map(c =>
        c.id === alert.classroom
          ? { ...c, alertCount: Math.max(0, c.alertCount - 1), status: c.alertCount <= 1 ? "active" : "alert" }
          : c
      ));
    }
    addToast("Alerta confirmada correctamente", "success");
  };

  const handleDiscard = (alertId, reason) => {
    setAlerts(prev => prev.map(a =>
      a.id === alertId
        ? {
          ...a,
          status: "DESCARTADA",
          discardReason: reason,
          actions: [...(a.actions || []), {
            action: `Descartada: ${reason}`,
            user: currentUser?.name || "Usuario",
            timestamp: new Date().toISOString(),
          }]
        }
        : a
    ));
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      setClassrooms(prev => prev.map(c =>
        c.id === alert.classroom
          ? { ...c, alertCount: Math.max(0, c.alertCount - 1), status: c.alertCount <= 1 ? "active" : "alert" }
          : c
      ));
    }
    addToast(`Alerta descartada: ${reason}`, "info");
  };

  const handleEscalate = (alertId) => {
    setAlerts(prev => prev.map(a =>
      a.id === alertId
        ? {
          ...a,
          escalated: true,
          actions: [...(a.actions || []), {
            action: "Escalada a Coordinador",
            user: currentUser?.name || "Usuario",
            timestamp: new Date().toISOString(),
          }]
        }
        : a
    ));
    addToast("Alerta escalada al coordinador", "info");
  };

  const pendingAlerts = alerts.filter(a => a.status === "PENDIENTE").length;

  if (!loggedIn) {
    return (
      <>
        <LoginView onLogin={handleLogin} />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </>
    );
  }

  const renderMainContent = () => {
    switch (currentView) {
      case "history":
        return (
          <HistoryView
            alerts={alerts}
            classrooms={classrooms}
            onAlertClick={setSelectedAlert}
          />
        );
      case "coordinator":
        return (
          <CoordinatorDashboard
            stats={window.MOCK_DATA.coordinatorStats}
          />
        );
      case "admin":
        return (
          <AdminPanel
            users={window.MOCK_DATA.users}
            cameras={window.MOCK_DATA.cameras}
            systemStats={window.MOCK_DATA.systemStats}
            addToast={addToast}
          />
        );
      case "settings":
        return (
          <AdminPanel
            users={window.MOCK_DATA.users}
            cameras={window.MOCK_DATA.cameras}
            systemStats={window.MOCK_DATA.systemStats}
            addToast={addToast}
          />
        );
      default:
        return (
          <DashboardMain
            classrooms={classrooms}
            activeClassroom={activeClassroom}
            alerts={alerts}
            todayStats={window.MOCK_DATA.systemStats.today}
            onAlertConfirm={handleConfirm}
            onAlertDiscard={handleDiscard}
            onAlertClick={setSelectedAlert}
          />
        );
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: bgFlash ? "#1a0a0a" : "#0b0f1a",
      color: "#e2e8f0",
      display: "flex", flexDirection: "column",
      fontFamily: "Inter, sans-serif",
      transition: "background 0.3s",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Critical alert: left border pulse */}
      {criticalActive && (
        <div style={{
          position: "fixed", left: 0, top: 0, bottom: 0, width: 4,
          background: "#ef4444",
          animation: "criticalPulse 1.2s infinite",
          zIndex: 1000,
        }} />
      )}

      {/* Main layout */}
      <div style={{ display: "flex", flex: 1, minHeight: "100vh", overflow: "hidden" }}>
        <Sidebar
          user={currentUser}
          classrooms={classrooms}
          activeClassroom={activeClassroom}
          setActiveClassroom={(id) => {
            setActiveClassroom(id);
            setCurrentView("dashboard");
          }}
          currentView={currentView}
          setView={setCurrentView}
          pendingAlerts={pendingAlerts}
          criticalActive={criticalActive}
        />

        {/* Right area: main + aside */}
        <div style={{ flex: 1, display: "flex", minWidth: 0, overflow: "hidden" }}>
          {renderMainContent()}

          {/* Right panel — only on dashboard */}
          {(currentView === "dashboard" || !["history", "coordinator", "admin", "settings"].includes(currentView)) && (
            <RightPanel
              alerts={alerts}
              todayStats={window.MOCK_DATA.systemStats.today}
              threshold={window.MOCK_DATA.systemStats.threshold}
              onAlertClick={setSelectedAlert}
            />
          )}
        </div>
      </div>

      {/* Alert detail modal */}
      {selectedAlert && (
        <AlertDetail
          alert={alerts.find(a => a.id === selectedAlert.id) || selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onConfirm={(id) => { handleConfirm(id); setSelectedAlert(null); }}
          onDiscard={(id, reason) => { handleDiscard(id, reason); setSelectedAlert(null); }}
          onEscalate={(id) => { handleEscalate(id); }}
        />
      )}

      {/* Toasts */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

// Mount
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
