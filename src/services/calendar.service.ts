import api from "./api";

export const calendarService = {
  getHolidays: async () => {
    const response = await api.get("/holidays");
    return response.data;
  },
  createHoliday: async (data: any) => {
    const response = await api.post("/holidays", data);
    return response.data;
  },
  updateHoliday: async (id: string, data: any) => {
    const response = await api.patch(`/holidays/${id}`, data);
    return response.data;
  },
  deleteHoliday: async (id: string) => {
    const response = await api.delete(`/holidays/${id}`);
    return response.data;
  },

  getSeasons: async () => {
    const response = await api.get("/seasons");
    return response.data;
  },
  updateSeason: async (id: string, data: any) => {
    const response = await api.patch(`/seasons/${id}`, data);
    return response.data;
  },

  getAnnouncements: async () => {
    const response = await api.get("/announcements");
    return response.data;
  },
  createAnnouncement: async (data: any) => {
    const response = await api.post("/announcements", data);
    return response.data;
  },
  updateAnnouncement: async (id: string, data: any) => {
    const response = await api.patch(`/announcements/${id}`, data);
    return response.data;
  },
  deleteAnnouncement: async (id: string) => {
    const response = await api.delete(`/announcements/${id}`);
    return response.data;
  },

  getAvailabilities: async () => {
    const response = await api.get("/tour-availability");
    return response.data;
  },
  upsertAvailability: async (data: any) => {
    const response = await api.post("/tour-availability", data);
    return response.data;
  },
  deleteAvailability: async (id: string) => {
    const response = await api.delete(`/tour-availability/${id}`);
    return response.data;
  },
};
