const SITE_NAME = "Insaniat Parjatan";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export function createMetadata({ title, description, path = "", image }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const url = `${SITE_URL}${path}`;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      ...(image && { images: [{ url: image }] }),
    },
  };
}

export { SITE_NAME, SITE_URL };
