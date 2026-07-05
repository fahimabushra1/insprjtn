const getBaseUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000/api";
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const cleanUrl = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
  return `${cleanUrl}/api`;
};

export const fetchLegalBySlugServer = async (slug: string) => {
  try {
    const response = await fetch(`${getBaseUrl()}/legal/${slug}`, {
      next: { revalidate: 300 }, // ISR Cache for 5 minutes
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("fetchLegalBySlugServer error:", error);
    return null;
  }
};
