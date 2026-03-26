import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import Tables from './pages/Tables';
import Dashboard from './pages/Dashboard';
import Usuarios from './pages/Usuarios';
import Cocineros from './pages/Cocineros';
import MyOrder from './pages/MyOrder';
import MyOrders from './pages/MyOrders';
import MenuCliente from './pages/MenuCliente';
import MenuAdmin from './pages/MenuAdmin';
import AdminUsers from './pages/AdminUsers';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ECF0F1' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid #E83E8C', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

// Solo admin — redirige a login si no está autenticado, a home si no es admin
const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ECF0F1' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid #E83E8C', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;
  return children;
};

// Redirige /menu al componente correcto según rol
const MenuRouter = () => {
  const { isAdmin } = useAuth();
  return isAdmin ? <MenuAdmin /> : <MenuCliente />;
};

function AppContent() {
  return (
    <Layout>
      <Routes>
        {/* Públicas */}
        <Route path="/login" element={<Login />} />
        
        {/* Ruta Home - Pública */}
        <Route path="/" element={<Home />} />
        
        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/tables"
          element={
            <PrivateRoute>
              <Tables />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <Usuarios />
            </PrivateRoute>
          }
        />
        
        {/* Redirección por defecto (opcional, ya tenemos Home en "/") */}
        {/* <Route path="*" element={<Navigate to="/" />} /> */}
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;