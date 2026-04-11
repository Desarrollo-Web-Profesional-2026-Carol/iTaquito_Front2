import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://itaquitobackend-production.up.railway.app/api';
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 — sesión expirada
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // 500 — error interno del servidor
    if (error.response?.status === 500) {
      window.location.href = '/500';
      return Promise.reject(error);
    }
      // 403 — acceso sin permiso
    if (error.response?.status === 403) {
  return Promise.reject(error);
    }

    // Sin respuesta — servidor caído o sin internet
    if (!error.response) {
      window.location.href = '/500';
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;