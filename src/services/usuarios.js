import api from './api';

export const usuariosService = {
  // Obtener todos los usuarios
  async getAll(params = {}) {
    const response = await api.get('/users', { params });
    return response.data;
  },

  // Obtener usuario actual
  async getMe() {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Crear un usuario
  async create(data) {
    const response = await api.post('/users', data);
    return response.data;
  },

  // Actualizar un usuario
  async update(id, data) {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  // Eliminar un usuario
  async delete(id) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};
