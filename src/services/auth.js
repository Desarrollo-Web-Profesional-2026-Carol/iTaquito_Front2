import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'https://itaquitobackend-production-b582.up.railway.app/api';

const api = axios.create({ baseURL: API });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authService = {

  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.token) {
      localStorage.setItem('token',   data.token);
      localStorage.setItem('user',    JSON.stringify(data.user));
      localStorage.setItem('loginAt', new Date().toISOString());
    }
    return data;
  },

  logout: async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Notifica al backend ANTES de borrar el token
        await api.post('/auth/logout');
      }
    } catch (e) {
      console.warn('Error al notificar logout al backend:', e.message);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('loginAt');
    }
  },

  register: async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },

  getCurrentUser: () => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  getLoginAt: () => localStorage.getItem('loginAt') || null,

  getToken: () => localStorage.getItem('token') || null,
};