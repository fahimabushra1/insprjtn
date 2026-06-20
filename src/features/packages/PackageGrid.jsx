import PackageCard from "./PackageCard";
import PackageCardSkeleton from "@/components/skeletons/PackageCardSkeleton";

export default function PackageGrid({ packages = [], loading = false, skeletonCount = 6 }) {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <PackageCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {packages.map((pkg) => (
        <PackageCard key={pkg._id} pkg={pkg} />
      ))}
    </div>
  );
}
