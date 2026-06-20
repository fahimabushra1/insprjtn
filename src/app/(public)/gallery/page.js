import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { createMetadata } from "@/utils/seo";

export const revalidate = 600;

export const metadata = createMetadata({
  title: "Gallery",
  description: "Photos from Sundarban tours with Insaniat Parjatan.",
  path: "/gallery",
});

export default function GalleryPage() {
  return (
    <div className="container mx-auto px-4 py-10 md:py-16 text-center">
      <h1 className="text-3xl font-bold">Gallery</h1>
      <p className="mt-4 text-muted-foreground">Coming in Phase 3.</p>
      <Link href={ROUTES.HOME} className="mt-4 inline-block text-primary hover:underline">
        Back to Home
      </Link>
    </div>
  );
}
