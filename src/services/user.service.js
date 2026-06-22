import api from "./api";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export const userService = {
  getAll: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.USERS.LIST, { params });
    return response.data;
  },

  updateRole: async (id, role) => {
    const response = await api.patch(API_ENDPOINTS.USERS.UPDATE_ROLE(id), { role });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(API_ENDPOINTS.USERS.BY_ID(id));
    return response.data;
  },
};
