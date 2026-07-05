import api from "./api";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export const legalService = {
  getBySlug: async (slug: string) => {
    const response = await api.get(API_ENDPOINTS.LEGALS.BY_SLUG(slug));
    return response.data;
  },

  getAllAdmin: async () => {
    const response = await api.get(API_ENDPOINTS.LEGALS.ADMIN_LIST);
    return response.data;
  },

  getByIdAdmin: async (id: string) => {
    const response = await api.get(API_ENDPOINTS.LEGALS.ADMIN_BY_ID(id));
    return response.data;
  },

  createAdmin: async (data: any) => {
    const response = await api.post(API_ENDPOINTS.LEGALS.ADMIN_LIST, data);
    return response.data;
  },

  updateAdmin: async (id: string, data: any) => {
    const response = await api.put(API_ENDPOINTS.LEGALS.ADMIN_BY_ID(id), data);
    return response.data;
  },

  deleteAdmin: async (id: string) => {
    const response = await api.delete(API_ENDPOINTS.LEGALS.ADMIN_BY_ID(id));
    return response.data;
  },
};
