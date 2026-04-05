import api from './api';

export const cajeroService = {

  // Obtener órdenes agrupadas por mesa
  getOrdersByTable: async (estado = 'todos') => {
    const params = estado !== 'todos' ? `?estado=${estado}` : '';
    const { data } = await api.get(`/cajero/orders-by-table${params}`);
    return data;
  },

  // Obtener órdenes de una mesa específica
  getOrdersByMesaId: async (mesaId) => {
    const { data } = await api.get(`/cajero/orders-by-table/${mesaId}`);
    return data;
  },

  // Aprobar pago de mesa.
  // Si el backend devuelve nuevoTokenMesa, lo guarda en localStorage
  // para que la próxima vez que el cliente consulte sus pedidos,
  // su sesión quede limpia (loginAt nuevo).
  approvePayment: async (mesaId, metodoPago, sTokenSesion) => {
    const { data } = await api.post(`/cajero/approve-payment/${mesaId}`, { metodoPago, sTokenSesion });

    // FIX: guardar nuevo token del cliente si el backend lo devuelve
    if (data?.data?.nuevoTokenMesa) {
      // Se guarda bajo una clave distinta — el cliente lo tomará
      // al hacer su próxima consulta (polling o refresh de página).
      localStorage.setItem(
        `token_mesa_${mesaId}`,
        data.data.nuevoTokenMesa
      );
    }

    return data;
  },

  // Cambiar disponibilidad de mesa manualmente
  changeTableStatus: async (mesaId, sEstado) => {
    const { data } = await api.put(`/cajero/change-table-status/${mesaId}`, { sEstado });
    return data;
  },

  // Obtener resumen de ventas del día
  getSalesSummary: async () => {
    const { data } = await api.get('/cajero/sales-summary');
    return data;
  },
};