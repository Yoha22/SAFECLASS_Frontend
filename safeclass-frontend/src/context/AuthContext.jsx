import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { apiFetch, setToken, clearToken, getToken } from '@/api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Restore session from a token already in localStorage on page load
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    apiFetch('/api/auth/refresh', { method: 'POST', credentials: 'include' })
      .then((data) => {
        setToken(data.token);
        setUser(data.user);
      })
      .catch(() => {
        clearToken();
      });
  }, []);

  // HU-01: Autenticación con email institucional y contraseña
  const login = useCallback(async (email, password) => {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } finally {
      clearToken();
      setUser(null);
    }
  }, []);

  // HU-02: Solicitud de recuperación de contraseña
  const requestPasswordReset = useCallback(async (email) => {
    return apiFetch('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, requestPasswordReset }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
};
