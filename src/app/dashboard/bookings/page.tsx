"use client";

import Link from "next/link";
import { FiCalendar, FiClock, FiUsers, FiDollarSign, FiTrash2, FiFileText } from "react-icons/fi";

import { useBookings, useCancelBooking } from "@/hooks/useBookings";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";
import { useSuccessAlert } from "@/hooks/useSuccessAlert";
import { useErrorAlert } from "@/hooks/useErrorAlert";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import NoBookingsFound from "@/components/empty-states/NoBookingsFound";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/utils/format";

export default function MyBookingsPage() {
  const { data: bookingsResponse, isLoading, error } = useBookings();
  const bookingsData = bookingsResponse?.data;
  const bookings = bookingsData?.bookings || [];

  const cancelBookingMutation = useCancelBooking();
  const confirmDelete = useDeleteConfirmation();
  const successAlert = useSuccessAlert();
  const errorAlert = useErrorAlert();

  const handleCancelBooking = (bookingId) => {
    confirmDelete(
      "Cancel Tour Booking?",
      async () => {
        try {
          await cancelBookingMutation.mutateAsync(bookingId);
          successAlert("Booking Cancelled", "Your reservation has been cancelled successfully.");
        } catch (err) {
          errorAlert("Cancellation Failed", err.message || "Failed to cancel the booking.");
        }
      },
      "Are you sure you want to cancel this booking? This request will release your slot."
    );
  };

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Bookings</h1>
          <p className="text-muted-foreground mt-1">Manage and track your tour reservations.</p>
        </div>
        <TableSkeleton columns={5} rows={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Bookings</h1>
        <p className="text-muted-foreground mt-1">Manage and track your tour reservations.</p>
      </div>

      {bookings.length === 0 ? (
        <NoBookingsFound />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block rounded-md border bg-white shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">Tour Details</TableHead>
                  <TableHead className="font-semibold text-slate-700">Departure</TableHead>
                  <TableHead className="font-semibold text-slate-700">Price</TableHead>
                  <TableHead className="font-semibold text-slate-700">Status</TableHead>
                  <TableHead className="font-semibold text-slate-700">Payment</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking._id} className="hover:bg-slate-50/50">
                    <TableCell>
                      <div className="space-y-1">
                        <span className="font-semibold text-slate-950 block">{booking.packageId?.title}</span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-0.5"><FiUsers /> {booking.guests} guest(s)</span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5"><FiClock /> {booking.packageId?.duration}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-slate-700">
                      {formatDate(booking.startDate)}
                    </TableCell>
                    <TableCell className="font-semibold text-emerald-800">
                      {formatCurrency(booking.totalPrice)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(booking.bookingStatus)} className="capitalize">
                        {booking.bookingStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant={getPaymentStatusVariant(booking.paymentStatus)} className="capitalize w-fit">
                          {booking.paymentStatus}
                        </Badge>
                        {booking.paymentId?.transactionId && (
                          <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[120px]">
                            Tx: {booking.paymentId.transactionId}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {booking.paymentStatus === "pending" && !booking.paymentId && (
                          <Button className="bg-amber-600 hover:bg-amber-700 text-white" size="sm" asChild>
                            <Link href={`/checkout/${booking._id}/payment`}>Pay Now</Link>
                          </Button>
                        )}
                        {booking.bookingStatus === "pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleCancelBooking(booking._id)}
                            disabled={cancelBookingMutation.isPending}
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="grid gap-4 md:hidden">
            {bookings.map((booking) => (
              <Card key={booking._id} className="border-slate-100 bg-white shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-base text-slate-900">{booking.packageId?.title}</CardTitle>
                    <Badge variant={getStatusVariant(booking.bookingStatus)} className="capitalize shrink-0">
                      {booking.bookingStatus}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Booked on: {formatDate(booking.createdAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-muted-foreground block">Departure Date</span>
                      <span className="font-semibold text-slate-700">{formatDate(booking.startDate)}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Travelers</span>
                      <span className="font-semibold text-slate-700">{booking.guests} guest(s)</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Total Fare</span>
                      <span className="font-semibold text-emerald-800">{formatCurrency(booking.totalPrice)}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Payment Status</span>
                      <Badge variant={getPaymentStatusVariant(booking.paymentStatus)} className="capitalize mt-0.5">
                        {booking.paymentStatus}
                      </Badge>
                    </div>
                  </div>

                  {booking.paymentId?.transactionId && (
                    <div className="rounded bg-slate-50 p-2 text-xs font-mono text-slate-600">
                      Transaction ID: {booking.paymentId.transactionId}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-2 border-t justify-end">
                    {booking.paymentStatus === "pending" && !booking.paymentId && (
                      <Button className="bg-amber-600 hover:bg-amber-700 text-white w-full" size="sm" asChild>
                        <Link href={`/checkout/${booking._id}/payment`}>Pay Now</Link>
                      </Button>
                    )}
                    {booking.bookingStatus === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancelBookingMutation.isPending}
                      >
                        <FiTrash2 className="mr-1.5 h-4 w-4" /> Cancel Booking
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
