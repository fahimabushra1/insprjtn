import Link from "next/link";
import { FiImage } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function NoGalleryFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <FiImage className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">No Gallery Items Found</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        We don&apos;t have any gallery items uploaded yet. Check back soon for beautiful photos of Sundarban!
      </p>
      <Button asChild variant="outline">
        <Link href={ROUTES.HOME}>Back to Home</Link>
      </Button>
    </div>
  );
}
