import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};

const HOME_BY_ROL = {
  admin:   '/dashboard',
  mesero:  '/tables',
  cajero:    '/cajero',
  cliente: '/menu',
};

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loginAt, setLoginAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const saved   = authService.getCurrentUser();
    const savedAt = authService.getLoginAt();
    if (saved)   setUser(saved);
    if (savedAt) setLoginAt(savedAt);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    setLoginAt(authService.getLoginAt());
    navigate(HOME_BY_ROL[data.user.rol] || '/dashboard');
    return data;
  };

  const logout = async () => {
    await authService.logout(); // llama al backend → libera la mesa
    setUser(null);
    setLoginAt(null);
    navigate('/');
  };

  // Helpers para leer la mesa desde el user guardado en estado
  const getMesaId    = () => user?.iMesaId || null;
  const mesaNombre   = user?.mesa?.sNombre || (user?.iMesaId ? `Mesa ${user.iMesaId}` : null);

  const value = {
    user,
    loginAt,
    login,
    logout,
    loading,
    getMesaId,
    mesaNombre,
    iMesaId:   user?.iMesaId || null,
    isAdmin:   user?.rol === 'admin',
    isMesero:  user?.rol === 'mesero',
    isCajero:    user?.rol === 'cajero',
    isCliente: user?.rol === 'cliente',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};