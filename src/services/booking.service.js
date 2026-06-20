import api from "./api";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export const bookingService = {
  create: async (data) => {
    const response = await api.post(API_ENDPOINTS.BOOKINGS.CREATE, data);
    return response.data;
  },

  getAll: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.BOOKINGS.LIST, { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(API_ENDPOINTS.BOOKINGS.BY_ID(id));
    return response.data;
  },

  cancel: async (id) => {
    const response = await api.patch(API_ENDPOINTS.BOOKINGS.CANCEL(id));
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(API_ENDPOINTS.BOOKINGS.STATUS(id), { status });
    return response.data;
  },
};
