import api from "./api";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export const testimonialService = {
  getAll: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.TESTIMONIALS.LIST, { params });
    return response.data;
  },

  create: async (data) => {
    const response = await api.post(API_ENDPOINTS.TESTIMONIALS.LIST, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(API_ENDPOINTS.TESTIMONIALS.BY_ID(id), data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(API_ENDPOINTS.TESTIMONIALS.BY_ID(id));
    return response.data;
  },
};
