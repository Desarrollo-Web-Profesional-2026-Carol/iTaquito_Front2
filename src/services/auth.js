import api from './api';

export const authService = {

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token',   response.data.token);
      localStorage.setItem('user',    JSON.stringify(response.data.user));
      localStorage.setItem('loginAt', new Date().toISOString()); //timestamp de sesión
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginAt'); // limpiar al salir
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  getLoginAt() {
    return localStorage.getItem('loginAt') || null;
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return user?.rol === 'admin';
  },
};