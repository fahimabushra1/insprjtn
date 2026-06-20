import Link from "next/link";
import { FiPackage } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function NoPackagesFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <FiPackage className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">No Packages Found</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        We couldn&apos;t find any tour packages matching your criteria. Check back soon for new adventures!
      </p>
      <Button asChild variant="outline">
        <Link href={ROUTES.HOME}>Back to Home</Link>
      </Button>
    </div>
  );
}
