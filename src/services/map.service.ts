import api from "./api";

export const mapService = {
  getPlaces: async (featured?: boolean) => {
    const response = await api.get("/places", {
      params: featured ? { featured: "true" } : {},
    });
    return response.data;
  },
  getPlaceBySlug: async (slug: string) => {
    const response = await api.get(`/places/${slug}`);
    return response.data;
  },
  createPlace: async (data: any) => {
    const response = await api.post("/places", data);
    return response.data;
  },
  updatePlace: async (id: string, data: any) => {
    const response = await api.patch(`/places/${id}`, data);
    return response.data;
  },
  deletePlace: async (id: string) => {
    const response = await api.delete(`/places/${id}`);
    return response.data;
  },

  getRoutes: async () => {
    const response = await api.get("/routes");
    return response.data;
  },
  createRoute: async (data: any) => {
    const response = await api.post("/routes", data);
    return response.data;
  },
  updateRoute: async (id: string, data: any) => {
    const response = await api.patch(`/routes/${id}`, data);
    return response.data;
  },
  deleteRoute: async (id: string) => {
    const response = await api.delete(`/routes/${id}`);
    return response.data;
  },
};
