const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const fetchPackagesServer = async (params = {}) => {
  const searchParams = new URLSearchParams(params).toString();
  const url = `${getBaseUrl()}/packages${searchParams ? `?${searchParams}` : ""}`;

  const response = await fetch(url, {
    next: { revalidate: 120 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch packages");
  }

  return response.json();
};

export const fetchFeaturedServer = async () => {
  const response = await fetch(`${getBaseUrl()}/packages/featured`, {
    next: { revalidate: 120 },
  });

  if (!response.ok) {
    return { data: [] };
  }

  return response.json();
};

export const fetchPackageBySlugServer = async (slug) => {
  const response = await fetch(`${getBaseUrl()}/packages/${slug}`, {
    next: { revalidate: 120 },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
};
