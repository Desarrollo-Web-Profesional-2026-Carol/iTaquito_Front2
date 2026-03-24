import api from './api';

export const usersService = {

  getAll: async () => {
    const { data } = await api.get('/users');
    return data;
  },

  getMesasDisponibles: async () => {
    const { data } = await api.get('/users/mesas-disponibles');
    return data;
  },

  create: async (payload) => {
    const { data } = await api.post('/users', payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await api.put(`/users/${id}`, payload);
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  },
};