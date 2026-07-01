const API_BASE = "/api";

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
  BLOGS: {
    LIST: `${API_BASE}/blogs`,
    BY_SLUG: (slug) => `${API_BASE}/blogs/${slug}`,
    BY_ID: (id) => `${API_BASE}/blogs/${id}`,
  },
  GALLERY: {
    LIST: `${API_BASE}/gallery`,
    BY_ID: (id) => `${API_BASE}/gallery/${id}`,
  },
  TESTIMONIALS: {
    LIST: `${API_BASE}/testimonials`,
    BY_ID: (id) => `${API_BASE}/testimonials/${id}`,
  },
  CONTACTS: {
    SUBMIT: `${API_BASE}/contacts`,
    LIST: `${API_BASE}/contacts`,
    BY_ID: (id) => `${API_BASE}/contacts/${id}`,
  },
  USERS: {
    LIST: `${API_BASE}/users`,
    UPDATE_ROLE: (id) => `${API_BASE}/users/${id}/role`,
    BY_ID: (id) => `${API_BASE}/users/${id}`,
  },
  ANALYTICS: {
    STATS: `${API_BASE}/analytics`,
  },
  UPLOAD: `${API_BASE}/upload`,
};

export default API_BASE;
