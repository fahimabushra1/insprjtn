import axios from "axios";
import { getFirebaseAuth } from "@/lib/firebase";

const api = axios.create({
  // Since API_ENDPOINTS constants already contain the "/api" prefix,
  // we do not prepend it in baseURL to prevent double-prefixing (/api/api/...).
  baseURL: typeof window !== "undefined"
    ? window.location.origin
    : (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
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

    const enhancedError: any = new Error(message);
    enhancedError.status = error.response?.status;
    enhancedError.errors = error.response?.data?.errors || [];
    enhancedError.original = error;

    return Promise.reject(enhancedError);
  }
);

export default api;
