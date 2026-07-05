import { notFound } from "next/navigation";
import { fetchLegalBySlugServer } from "@/services/legal.server";
import { createMetadata, SITE_NAME } from "@/utils/seo";
import LegalPageClient from "@/components/shared/LegalPageClient";

const SLUG = "privacy-policy";

export const revalidate = 300; // Cache for 5 minutes (ISR)

export async function generateMetadata() {
  try {
    const response = await fetchLegalBySlugServer(SLUG);
    const page = response?.data;

    if (!page) {
      return { title: `Privacy Policy | ${SITE_NAME}` };
    }

    return createMetadata({
      title: page.seoTitle || page.title,
      description: page.seoDescription || "Read our privacy policy guidelines.",
      path: `/${SLUG}`,
      image: page.ogImage,
    });
  } catch {
    return { title: `Privacy Policy | ${SITE_NAME}` };
  }
}

export default async function PrivacyPolicyPage() {
  const response = await fetchLegalBySlugServer(SLUG);
  const page = response?.data;

  if (!page) {
    notFound();
  }

  return <LegalPageClient page={page} />;
}
