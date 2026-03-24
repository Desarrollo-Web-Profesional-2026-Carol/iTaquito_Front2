import api from './api';

export const productsService = {

  // GET /api/products — admin ve todos (activos e inactivos) gracias al token
  getAll: async (filters = {}) => {
    const params = {};
    if (filters.sNombre)                   params.sNombre      = filters.sNombre;
    if (filters.iCategoriaId)              params.iCategoriaId = filters.iCategoriaId;
    if (filters.bDisponible !== undefined) params.bDisponible  = filters.bDisponible;
    const { data } = await api.get('/products', { params });
    return data;
  },

  getById: async (id) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  // El admin manda JSON puro (sImagenUrl como string)
  // Si en el futuro usas subida de archivos, cambia a FormData aquí
  create: async (payload) => {
    const { data } = await api.post('/products', payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await api.put(`/products/${id}`, payload);
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },
};