import { notFound } from "next/navigation";
import PackageDetail from "@/features/packages/PackageDetail";
import { fetchPackageBySlugServer } from "@/services/package.server";
import { createMetadata, SITE_NAME } from "@/utils/seo";

export const revalidate = 120;

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const response = await fetchPackageBySlugServer(slug);
    const pkg = response?.data;

    if (!pkg) {
      return { title: `Package Not Found | ${SITE_NAME}` };
    }

    return createMetadata({
      title: pkg.title,
      description: pkg.description?.slice(0, 160),
      path: `/packages/${slug}`,
      image: pkg.images?.[0],
    });
  } catch {
    return { title: `Package | ${SITE_NAME}` };
  }
}

export default async function PackageDetailsPage({ params }) {
  const { slug } = await params;

  let pkg = null;

  try {
    const response = await fetchPackageBySlugServer(slug);
    pkg = response?.data;
  } catch {
    pkg = null;
  }

  if (!pkg) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-10 md:py-16">
      <PackageDetail pkg={pkg} />
    </div>
  );
}
