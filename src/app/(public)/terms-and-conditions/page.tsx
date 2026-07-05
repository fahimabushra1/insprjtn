import { notFound } from "next/navigation";
import { fetchLegalBySlugServer } from "@/services/legal.server";
import { createMetadata, SITE_NAME } from "@/utils/seo";
import LegalPageClient from "@/components/shared/LegalPageClient";

const SLUG = "terms-and-conditions";

export const revalidate = 300; // Cache for 5 minutes (ISR)

export async function generateMetadata() {
  try {
    const response = await fetchLegalBySlugServer(SLUG);
    const page = response?.data;

    if (!page) {
      return { title: `Terms and Conditions | ${SITE_NAME}` };
    }

    return createMetadata({
      title: page.seoTitle || page.title,
      description: page.seoDescription || "Read our terms and conditions guidelines.",
      path: `/${SLUG}`,
      image: page.ogImage,
    });
  } catch {
    return { title: `Terms and Conditions | ${SITE_NAME}` };
  }
}

export default async function TermsAndConditionsPage() {
  const response = await fetchLegalBySlugServer(SLUG);
  const page = response?.data;

  if (!page) {
    notFound();
  }

  return <LegalPageClient page={page} />;
}
