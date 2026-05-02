import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { AlertProvider } from '@/context/AlertContext';
import AppShell from '@/components/layout/AppShell';
import LoginPage from '@/pages/auth/LoginPage';

// Route guard: redirects to /login if unauthenticated
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AlertProvider>
          <AppRoutes />
        </AlertProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
