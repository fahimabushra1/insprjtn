import api from "./api";

export const reviewService = {
  getByPackage: async (slugOrId: string) => {
    const response = await api.get(`/api/packages/${slugOrId}/reviews`);
    return response.data;
  },

  create: async (slugOrId: string, data: { rating: number; comment: string }) => {
    const response = await api.post(`/api/packages/${slugOrId}/reviews`, data);
    return response.data;
  },
};
