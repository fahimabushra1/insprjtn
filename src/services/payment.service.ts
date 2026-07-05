import api from "./api";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export const paymentService = {
  submit: async (data) => {
    const response = await api.post(API_ENDPOINTS.PAYMENTS.SUBMIT, data);
    return response.data;
  },

  getAll: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.PAYMENTS.LIST, { params });
    return response.data;
  },

  verify: async (id) => {
    const response = await api.patch(API_ENDPOINTS.PAYMENTS.VERIFY(id));
    return response.data;
  },
};
