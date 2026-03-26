import api from './api';

export const categoriesService = {

  // GET /api/categories
  getAll: async () => {
    const { data } = await api.get('/categories');
    return data; // array directo
  },
};