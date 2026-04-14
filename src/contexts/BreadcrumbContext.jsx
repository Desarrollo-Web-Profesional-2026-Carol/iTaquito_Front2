import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ROUTE_NAMES = {
  '':               'Inicio',
  'dashboard':      'Dashboard',
  'tables':         'Mesas',
  'menu':           'Menú',
  'menu-admin':     'Menú',
  'users':          'Usuarios',
  'admin-users':    'Usuarios',
  'cajero':         'Cajero',
  'history':        'Historial',
  'my-order':       'Mi Pedido',
  'my-orders':      'Mis Órdenes',
  'orders':         'Pedidos',
  'sitemap':        'Mapa del Sitio',
  'reset-password': 'Recuperar Contraseña',
  '403':            'Acceso Denegado',
  '404':            'No Encontrado',
  '500':            'Error del Servidor',
};

// Rutas que reinician el historial (puntos de entrada)
const RESET_ROUTES = ['/', '/login', '/reset-password'];

// Máximo de items en el historial
const MAX_HISTORY = 4;

const BreadcrumbContext = createContext(null);

export const BreadcrumbProvider = ({ children }) => {
  const location = useLocation();
  const [history, setHistory] = useState([{ label: 'Inicio', path: '/' }]);

  useEffect(() => {
    const path = location.pathname;
    const segment = path.split('/').filter(Boolean).pop() || '';
    const label = ROUTE_NAMES[segment] || segment;

    // Si es una ruta de reset, limpiar historial
    if (RESET_ROUTES.includes(path)) {
      setHistory([{ label: 'Inicio', path: '/' }]);
      return;
    }

    setHistory(prev => {
      // Si ya estamos en esta ruta, no hacer nada
      if (prev[prev.length - 1]?.path === path) return prev;

      // Si la ruta ya existe en el historial, cortar hasta ese punto
      const existingIndex = prev.findIndex(item => item.path === path);
      if (existingIndex !== -1) {
        return prev.slice(0, existingIndex + 1);
      }

      // Agregar nueva ruta al historial
      const newHistory = [...prev, { label, path }];

      // Limitar el tamaño del historial
      if (newHistory.length > MAX_HISTORY) {
        return [{ label: 'Inicio', path: '/' }, ...newHistory.slice(-MAX_HISTORY + 1)];
      }

      return newHistory;
    });
  }, [location.pathname]);

  return (
    <BreadcrumbContext.Provider value={{ history }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumb = () => {
  const ctx = useContext(BreadcrumbContext);
  if (!ctx) throw new Error('useBreadcrumb debe usarse dentro de <BreadcrumbProvider>');
  return ctx;
};