import Link from "next/link";
import { FiCalendar } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function NoBookingsFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-lg border border-slate-100 p-6">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
        <FiCalendar className="h-8 w-8 text-emerald-700" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-slate-900">No Bookings Found</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        You haven&apos;t booked any Sundarban packages yet. Discover our curated tours and start your journey!
      </p>
      <Button asChild className="bg-emerald-700 hover:bg-emerald-800 text-white">
        <Link href={ROUTES.PACKAGES}>Explore Tour Packages</Link>
      </Button>
    </div>
  );
}
