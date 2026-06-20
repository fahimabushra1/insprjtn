import PackageGrid from "@/features/packages/PackageGrid";
import NoPackagesFound from "@/components/empty-states/NoPackagesFound";
import { fetchPackagesServer } from "@/services/package.server";
import { createMetadata } from "@/utils/seo";

export const revalidate = 120;

export const metadata = createMetadata({
  title: "Tour Packages",
  description:
    "Browse Sundarban tour packages — day trips, overnight stays, and multi-day adventures with Insaniat Parjatan.",
  path: "/packages",
});

export default async function PackagesPage() {
  let packages = [];

  try {
    const response = await fetchPackagesServer({ limit: 50 });
    packages = response?.data?.items || [];
  } catch {
    packages = [];
  }

  return (
    <div className="container mx-auto px-4 py-10 md:py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold md:text-4xl">Tour Packages</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Choose from our curated Sundarban tour packages. Each adventure is designed
          to showcase the beauty and biodiversity of the mangrove forest.
        </p>
      </div>

      {packages.length > 0 ? (
        <PackageGrid packages={packages} />
      ) : (
        <NoPackagesFound />
      )}
    </div>
  );
}
