import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import Tables from './pages/Tables';
import Dashboard from './pages/Dashboard';
import Cocineros from './pages/Cocineros';
import MyOrder from './pages/MyOrder';
import MyOrders from './pages/MyOrders';
import MenuCliente from './pages/MenuCliente';
import MenuAdmin from './pages/MenuAdmin';

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
        <Route path="/"      element={<Home />} />

        {/* Cliente */}
        <Route path="/menu"      element={<MenuRouter />} />
        <Route path="/my-order"  element={<MyOrder />} />
        <Route path="/my-orders" element={<MyOrders />} />

        {/* Staff — protegidas */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/tables"    element={<PrivateRoute><Tables /></PrivateRoute>} />
        <Route path="/cocineros" element={<PrivateRoute><Cocineros /></PrivateRoute>} />

        {/* {<Route path="*" element={<Navigate to="/" />} />} */}
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