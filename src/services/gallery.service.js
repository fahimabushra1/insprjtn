import api from "./api";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export const galleryService = {
  getAll: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.GALLERY.LIST, { params });
    return response.data;
  },

  create: async (data) => {
    const response = await api.post(API_ENDPOINTS.GALLERY.LIST, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(API_ENDPOINTS.GALLERY.BY_ID(id));
    return response.data;
  },
};
