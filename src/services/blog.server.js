const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

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
