import api from "./api";

export const productService = {
  getAll: async (params = {}) => {
    const response = await api.get("/api/products", { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post("/api/products", data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.patch(`/api/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/api/products/${id}`);
    return response.data;
  },
};
