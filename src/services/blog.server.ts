const getBaseUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000/api";
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const cleanUrl = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
  return `${cleanUrl}/api`;
};

export const fetchBlogsServer = async (params = {}) => {
  const searchParams = new URLSearchParams(params).toString();
  const url = `${getBaseUrl()}/blogs${searchParams ? `?${searchParams}` : ""}`;

  const response = await fetch(url, {
    next: { revalidate: 600 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch blogs");
  }

  return response.json();
};

export const fetchBlogBySlugServer = async (slug) => {
  const response = await fetch(`${getBaseUrl()}/blogs/${slug}`, {
    next: { revalidate: 86400 },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
};
