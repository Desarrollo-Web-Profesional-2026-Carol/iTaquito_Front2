import api from './api';

export const productsService = {

  // GET /api/products?sNombre=&iCategoriaId=&bDisponible=
  getAll: async (filters = {}) => {
    const params = {};
    if (filters.sNombre)      params.sNombre      = filters.sNombre;
    if (filters.iCategoriaId) params.iCategoriaId = filters.iCategoriaId;
    if (filters.bDisponible !== undefined) params.bDisponible = filters.bDisponible;
    const { data } = await api.get('/products', { params });
    return data; // array directo
  },

  getById: async (id) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },
};