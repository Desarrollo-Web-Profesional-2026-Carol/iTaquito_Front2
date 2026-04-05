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

  create: async (payload) => {
    let dataPayload = payload;
    let headers = {};
    if (payload.imagenFile) {
      dataPayload = new FormData();
      Object.keys(payload).forEach(key => {
        if (key === 'imagenFile') dataPayload.append('imagen', payload[key]);
        else if (payload[key] !== undefined && payload[key] !== null) dataPayload.append(key, payload[key]);
      });
      headers = { 'Content-Type': 'multipart/form-data' };
    }
    const { data } = await api.post('/products', dataPayload, { headers });
    return data;
  },

  update: async (id, payload) => {
    let dataPayload = payload;
    let headers = {};
    if (payload.imagenFile) {
      dataPayload = new FormData();
      Object.keys(payload).forEach(key => {
        if (key === 'imagenFile') dataPayload.append('imagen', payload[key]);
        else if (payload[key] !== undefined && payload[key] !== null) dataPayload.append(key, payload[key]);
      });
      headers = { 'Content-Type': 'multipart/form-data' };
    }
    const { data } = await api.put(`/products/${id}`, dataPayload, { headers });
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },
};