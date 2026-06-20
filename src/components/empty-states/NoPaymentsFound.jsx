import Link from "next/link";
import { FiCreditCard } from "react-icons/fi";
import { Button } from "@/components/ui/button";

export default function NoPaymentsFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-lg border border-slate-100 p-6">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
        <FiCreditCard className="h-8 w-8 text-emerald-700" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-slate-900">No Payments Found</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        You haven&apos;t submitted any transaction logs. Book a package and make a payment to get started!
      </p>
      <Button asChild className="bg-emerald-700 hover:bg-emerald-800 text-white">
        <Link href="/dashboard/bookings">View My Bookings</Link>
      </Button>
    </div>
  );
}
