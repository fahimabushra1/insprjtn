import api from "./api";

export const mapService = {
  getPlaces: async (featured?: boolean) => {
    const response = await api.get("/api/places", {
      params: featured ? { featured: "true" } : {},
    });
    return response.data;
  },
  getPlaceBySlug: async (slug: string) => {
    const response = await api.get(`/api/places/${slug}`);
    return response.data;
  },
  createPlace: async (data: any) => {
    const response = await api.post("/api/places", data);
    return response.data;
  },
  updatePlace: async (id: string, data: any) => {
    const response = await api.patch(`/api/places/${id}`, data);
    return response.data;
  },
  deletePlace: async (id: string) => {
    const response = await api.delete(`/api/places/${id}`);
    return response.data;
  },

  getRoutes: async () => {
    const response = await api.get("/api/routes");
    return response.data;
  },
  createRoute: async (data: any) => {
    const response = await api.post("/api/routes", data);
    return response.data;
  },
  updateRoute: async (id: string, data: any) => {
    const response = await api.patch(`/api/routes/${id}`, data);
    return response.data;
  },
  deleteRoute: async (id: string) => {
    const response = await api.delete(`/api/routes/${id}`);
    return response.data;
  },
};
