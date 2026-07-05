import api from "./api";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export const faqService = {
  getAll: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.FAQS.LIST, { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(API_ENDPOINTS.FAQS.BY_ID(id));
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post(API_ENDPOINTS.FAQS.LIST, data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(API_ENDPOINTS.FAQS.BY_ID(id), data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(API_ENDPOINTS.FAQS.BY_ID(id));
    return response.data;
  },
};
