import api from "./api";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export const packageService = {
  getAll: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.PACKAGES.LIST, { params });
    return response.data;
  },

  getFeatured: async () => {
    const response = await api.get(API_ENDPOINTS.PACKAGES.FEATURED);
    return response.data;
  },

  getBySlug: async (slug) => {
    const response = await api.get(API_ENDPOINTS.PACKAGES.BY_SLUG(slug));
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(API_ENDPOINTS.PACKAGES.BY_ID(id));
    return response.data;
  },

  create: async (data) => {
    const response = await api.post(API_ENDPOINTS.PACKAGES.LIST, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(API_ENDPOINTS.PACKAGES.BY_ID(id), data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(API_ENDPOINTS.PACKAGES.BY_ID(id));
    return response.data;
  },
};
