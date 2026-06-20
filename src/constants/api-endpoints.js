const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const API_ENDPOINTS = {
  HEALTH: `${API_BASE}/health`,
  AUTH: {
    REGISTER: `${API_BASE}/auth/register`,
    ME: `${API_BASE}/auth/me`,
    PROFILE: `${API_BASE}/auth/profile`,
  },
  PACKAGES: {
    LIST: `${API_BASE}/packages`,
    FEATURED: `${API_BASE}/packages/featured`,
    BY_SLUG: (slug) => `${API_BASE}/packages/${slug}`,
    BY_ID: (id) => `${API_BASE}/packages/${id}`,
  },
  BOOKINGS: {
    CREATE: `${API_BASE}/bookings`,
    LIST: `${API_BASE}/bookings`,
    BY_ID: (id) => `${API_BASE}/bookings/${id}`,
    CANCEL: (id) => `${API_BASE}/bookings/${id}/cancel`,
    STATUS: (id) => `${API_BASE}/bookings/${id}/status`,
  },
  PAYMENTS: {
    SUBMIT: `${API_BASE}/payments/submit`,
    LIST: `${API_BASE}/payments`,
    VERIFY: (id) => `${API_BASE}/payments/${id}/verify`,
  },
};

export default API_BASE;
