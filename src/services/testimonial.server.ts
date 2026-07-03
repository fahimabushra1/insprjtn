const getBaseUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000/api";
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const cleanUrl = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
  return `${cleanUrl}/api`;
};

export const fetchTestimonialsServer = async (params = {}) => {
  const searchParams = new URLSearchParams(params).toString();
  const url = `${getBaseUrl()}/testimonials${searchParams ? `?${searchParams}` : ""}`;

  const response = await fetch(url, {
    next: { revalidate: 600 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch testimonials");
  }

  return response.json();
};
