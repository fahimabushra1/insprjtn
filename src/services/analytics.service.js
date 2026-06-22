import api from "./api";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export const analyticsService = {
  getStats: async () => {
    const response = await api.get(API_ENDPOINTS.ANALYTICS.STATS);
    return response.data;
  },
};
