import { notFound } from "next/navigation";
import { fetchLegalBySlugServer } from "@/services/legal.server";
import { createMetadata, SITE_NAME } from "@/utils/seo";
import LegalPageClient from "@/components/shared/LegalPageClient";

const SLUG = "cookie-policy";

export const revalidate = 300; // Cache for 5 minutes (ISR)

export async function generateMetadata() {
  try {
    const response = await fetchLegalBySlugServer(SLUG);
    const page = response?.data;

    if (!page) {
      return { title: `Cookie Policy | ${SITE_NAME}` };
    }

    return createMetadata({
      title: page.seoTitle || page.title,
      description: page.seoDescription || "Read our cookie usage policy guidelines.",
      path: `/${SLUG}`,
      image: page.ogImage,
    });
  } catch {
    return { title: `Cookie Policy | ${SITE_NAME}` };
  }
}

export default async function CookiePolicyPage() {
  const response = await fetchLegalBySlugServer(SLUG);
  const page = response?.data;

  if (!page) {
    notFound();
  }

  return <LegalPageClient page={page} />;
}
