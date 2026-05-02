import React, { createContext, useContext, useState, useCallback } from 'react';
import { mockUsers } from '@/data/mockData';
import { getRoleFromEmail } from '@/constants/roles';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // HU-01: Autenticación con email institucional y contraseña
  const login = useCallback((email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email.endsWith('@iecol.edu.co') && password === 'safeclass') {
          const found = mockUsers.find((u) => u.email === email);
          const role  = getRoleFromEmail(email);
          const logged = found ?? {
            id: 0, name: email.split('@')[0], email, role, active: true,
          };
          setUser(logged);
          resolve(logged);
        } else {
          reject(new Error('Credenciales inválidas'));
        }
      }, 900);
    });
  }, []);

  const logout = useCallback(() => setUser(null), []);

  // HU-02: Solicitud de recuperación de contraseña
  const requestPasswordReset = useCallback((email) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email.endsWith('@iecol.edu.co')) {
          resolve({ email });
        } else {
          reject(new Error('El correo no pertenece al dominio institucional'));
        }
      }, 900);
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
