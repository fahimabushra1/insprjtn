import api from "./api";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export const uploadService = {
  uploadImage: async (file, folder = "insprjtn") => {
    const formData = new FormData();
    formData.append("image", file);
    
    const response = await api.post(API_ENDPOINTS.UPLOAD, formData, {
      params: { folder },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    return response.data;
  },
};
