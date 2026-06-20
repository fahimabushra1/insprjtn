import axios from "axios";
import { getFirebaseAuth } from "@/lib/firebase";
import API_BASE from "@/constants/api-endpoints";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.request.use(
  async (config) => {
    const auth = getFirebaseAuth();
    const user = auth?.currentUser;

    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    const enhancedError = new Error(message);
    enhancedError.status = error.response?.status;
    enhancedError.errors = error.response?.data?.errors || [];
    enhancedError.original = error;

    return Promise.reject(enhancedError);
  }
);

export default api;
