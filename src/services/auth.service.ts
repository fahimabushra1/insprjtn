import api from "./api";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export const authService = {
  register: async (data) => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.patch(API_ENDPOINTS.AUTH.PROFILE, data);
    return response.data;
  },
};
