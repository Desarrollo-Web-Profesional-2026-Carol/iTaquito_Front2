import api from "./api";

export const CocinerosService = {
  getAll: (filters) =>
    api.get("/Cocineros", { params: filters }).then((res) => res.data),
  create: (data) => api.post("/Cocineros", data).then((res) => res.data),
  update: (id, data) =>
    api.put(`/Cocineros/${id}`, data).then((res) => res.data),

  // Usamos delete para el borrado lógico (desactivar)
  delete: (id) => api.delete(`/Cocineros/${id}`).then((res) => res.data),

  // Usamos patch para reactivar
  reactivate: (id) => api.patch(`/Cocineros/${id}`).then((res) => res.data),
};
