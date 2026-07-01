import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-primary">403</h1>
      <h2 className="mt-4 text-2xl font-semibold">Forbidden</h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        You don&apos;t have permission to access this resource.
      </p>
      <Button className="mt-6" asChild>
        <Link href={ROUTES.HOME}>Go Home</Link>
      </Button>
    </div>
  );
}
