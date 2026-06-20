import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-primary">401</h1>
      <h2 className="mt-4 text-2xl font-semibold">Unauthorized</h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        You need to sign in to access this page.
      </p>
      <Button className="mt-6" asChild>
        <Link href={ROUTES.LOGIN}>Sign In</Link>
      </Button>
    </div>
  );
}
