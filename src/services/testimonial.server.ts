const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

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
