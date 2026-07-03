const getBaseUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000/api";
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const cleanUrl = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
  return `${cleanUrl}/api`;
};

export const fetchProductsServer = async (params = {}) => {
  const searchParams = new URLSearchParams(params).toString();
  const url = `${getBaseUrl()}/products${searchParams ? `?${searchParams}` : ""}`;

  const response = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
};

export const fetchProductByIdServer = async (id: string) => {
  const response = await fetch(`${getBaseUrl()}/products/${id}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
};
