"use client";

import Link from "next/link";
import { FiCalendar, FiCompass, FiCreditCard, FiCheckCircle } from "react-icons/fi";

import { useAuth } from "@/hooks/useAuth";
import { useBookings } from "@/hooks/useBookings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/utils/format";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const { data: bookingsResponse, isLoading } = useBookings();
  const bookingsData = bookingsResponse?.data;
  const bookings = bookingsData?.bookings || [];

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Calculate statistics
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.bookingStatus === "confirmed").length;
  const paidBookings = bookings.filter((b) => b.paymentStatus === "paid");
  const totalSpent = paidBookings.reduce((sum, b) => sum + b.totalPrice, 0);

  const getStatusVariant = (status) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "cancelled":
        return "destructive";
      default:
        return "warning";
    }
  };

  const getPaymentStatusVariant = (status) => {
    switch (status) {
      case "paid":
        return "success";
      case "failed":
        return "destructive";
      default:
        return "warning";
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground mt-1">Manage your tour reservations and payment proofs here.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Bookings */}
        <Card className="border-slate-100 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Bookings</CardTitle>
            <FiCalendar className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-950">{totalBookings}</div>
            <p className="text-xs text-muted-foreground mt-1">Tours registered in your name</p>
          </CardContent>
        </Card>

        {/* Confirmed Bookings */}
        <Card className="border-slate-100 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Confirmed Tours</CardTitle>
            <FiCheckCircle className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-950">{confirmedBookings}</div>
            <p className="text-xs text-muted-foreground mt-1">Ready to depart</p>
          </CardContent>
        </Card>

        {/* Total Spent */}
        <Card className="border-slate-100 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Payments</CardTitle>
            <FiCreditCard className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-950">{formatCurrency(totalSpent)}</div>
            <p className="text-xs text-muted-foreground mt-1">Verified expenditure</p>
          </CardContent>
        </Card>

        {/* Explore Card */}
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-900">Explore</CardTitle>
            <FiCompass className="h-5 w-5 text-emerald-700" />
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white mt-1" size="sm" asChild>
              <Link href="/packages">Book New Tour</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings Section */}
      <Card className="border-slate-100 bg-white shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg text-slate-900">Recent Bookings</CardTitle>
              <CardDescription>Your latest registered Sundarban tours</CardDescription>
            </div>
            {bookings.length > 0 && (
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/bookings">View All Bookings</Link>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
              <FiCalendar className="h-12 w-12 text-slate-300" />
              <p className="font-semibold text-slate-900">No bookings yet</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                You haven&apos;t reserved any tour packages. Head over to our packages to select one!
              </p>
              <Button className="bg-emerald-700 text-white" asChild>
                <Link href="/packages">Browse Tour Packages</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {bookings.slice(0, 3).map((booking) => (
                <div key={booking._id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-slate-900">{booking.packageId?.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      Travel Date: <span className="font-medium text-slate-700">{formatDate(booking.startDate)}</span> ·
                      Guests: <span className="font-medium text-slate-700">{booking.guests}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total Cost: <span className="font-semibold text-emerald-700">{formatCurrency(booking.totalPrice)}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] text-muted-foreground font-medium">Tour Status</span>
                      <Badge variant={getStatusVariant(booking.bookingStatus)} className="capitalize">
                        {booking.bookingStatus}
                      </Badge>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] text-muted-foreground font-medium">Payment Status</span>
                      <Badge variant={getPaymentStatusVariant(booking.paymentStatus)} className="capitalize">
                        {booking.paymentStatus}
                      </Badge>
                    </div>
                    {booking.paymentStatus === "pending" && !booking.paymentId && (
                      <Button className="bg-amber-600 text-white hover:bg-amber-700" size="sm" asChild>
                        <Link href={`/checkout/${booking._id}/payment`}>Pay Now</Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
