import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // No hay sesión
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Tiene sesión pero no el rol requerido
  if (requiredRole && user.rol !== requiredRole) {
    return <Navigate to="/403" replace />;
  }

  // Todo bien, muestra el componente
  return children;
}