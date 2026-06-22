import api from "./api";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export const contactService = {
  submit: async (data) => {
    const response = await api.post(API_ENDPOINTS.CONTACTS.SUBMIT, data);
    return response.data;
  },

  getAll: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.CONTACTS.LIST, { params });
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`${API_ENDPOINTS.CONTACTS.BY_ID(id)}/status`, { status });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(API_ENDPOINTS.CONTACTS.BY_ID(id));
    return response.data;
  },
};
