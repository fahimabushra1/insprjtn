import api from "./api";

export const calendarService = {
  getHolidays: async () => {
    const response = await api.get("/api/holidays");
    return response.data;
  },
  createHoliday: async (data: any) => {
    const response = await api.post("/api/holidays", data);
    return response.data;
  },
  updateHoliday: async (id: string, data: any) => {
    const response = await api.patch(`/api/holidays/${id}`, data);
    return response.data;
  },
  deleteHoliday: async (id: string) => {
    const response = await api.delete(`/api/holidays/${id}`);
    return response.data;
  },

  getSeasons: async () => {
    const response = await api.get("/api/seasons");
    return response.data;
  },
  updateSeason: async (id: string, data: any) => {
    const response = await api.patch(`/api/seasons/${id}`, data);
    return response.data;
  },

  getAnnouncements: async () => {
    const response = await api.get("/api/announcements");
    return response.data;
  },
  createAnnouncement: async (data: any) => {
    const response = await api.post("/api/announcements", data);
    return response.data;
  },
  updateAnnouncement: async (id: string, data: any) => {
    const response = await api.patch(`/api/announcements/${id}`, data);
    return response.data;
  },
  deleteAnnouncement: async (id: string) => {
    const response = await api.delete(`/api/announcements/${id}`);
    return response.data;
  },

  getAvailabilities: async () => {
    const response = await api.get("/api/tour-availability");
    return response.data;
  },
  upsertAvailability: async (data: any) => {
    const response = await api.post("/api/tour-availability", data);
    return response.data;
  },
  deleteAvailability: async (id: string) => {
    const response = await api.delete(`/api/tour-availability/${id}`);
    return response.data;
  },
};
