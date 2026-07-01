import Link from "next/link";
import { FiBookOpen } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function NoBlogsFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <FiBookOpen className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">No Blogs Found</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        We couldn&apos;t find any blog posts matching your search. Check back soon for stories, guides, and tips!
      </p>
      <Button asChild variant="outline">
        <Link href={ROUTES.HOME}>Back to Home</Link>
      </Button>
    </div>
  );
}
