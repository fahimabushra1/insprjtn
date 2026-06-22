"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiEdit2, FiX, FiCheck, FiAlertTriangle } from "react-icons/fi";
import { useBookings, useUpdateBookingStatus } from "@/hooks/useBookings";
import { useSuccessAlert } from "@/hooks/useSuccessAlert";
import { useErrorAlert } from "@/hooks/useErrorAlert";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import ButtonLoader from "@/components/loaders/ButtonLoader";
import { formatCurrency, formatDate } from "@/utils/format";

export default function AdminBookingsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const successAlert = useSuccessAlert();
  const errorAlert = useErrorAlert();

  const { data: bookingsRes, isLoading, isError } = useBookings();
  const updateStatusMutation = useUpdateBookingStatus();

  const allBookings = bookingsRes?.data?.items || [];

  // Client side searching & filtering
  const filteredBookings = allBookings.filter((booking) => {
    const matchesSearch =
      booking.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      booking.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
      booking.packageId?.title?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || booking.bookingStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenStatusModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = (status) => {
    updateStatusMutation.mutate(
      { id: selectedBooking._id, status },
      {
        onSuccess: () => {
          successAlert("Status Updated", `Booking is now marked as ${status}.`);
          setIsModalOpen(false);
        },
        onError: (err) => {
          errorAlert("Failed to Update", err.message || "Failed to update booking status.");
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by customer or package..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-slate-200"
          />
        </div>
        <div className="flex gap-2">
          {["all", "pending", "confirmed", "cancelled"].map((filter) => (
            <Button
              key={filter}
              variant={statusFilter === filter ? "default" : "outline"}
              onClick={() => setStatusFilter(filter)}
              className="capitalize h-9 text-xs border-slate-200"
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Bookings log */}
      {isLoading ? (
        <TableSkeleton rows={6} columns={6} />
      ) : isError ? (
        <div className="py-12 text-center text-destructive">
          Failed to load bookings log data.
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="py-16 text-center rounded-xl border border-dashed text-muted-foreground">
          No bookings match your current filters.
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="p-4">Customer</th>
                  <th className="p-4">Package</th>
                  <th className="p-4">Guests</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{booking.userId?.name}</div>
                      <div className="text-xs text-muted-foreground">{booking.userId?.email}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Booked: {formatDate(booking.createdAt)}
                      </div>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <div className="font-semibold text-slate-800">
                        {booking.packageId?.title || "Deleted Package"}
                      </div>
                      <div className="text-xs text-slate-500">
                        Departure: {formatDate(booking.startDate)}
                      </div>
                    </td>
                    <td className="p-4 text-slate-900 font-medium">{booking.guests} Guests</td>
                    <td className="p-4 font-bold text-slate-950">
                      {formatCurrency(booking.totalPrice)}
                    </td>
                    <td className="p-4 space-y-1">
                      <div>
                        <Badge
                          variant={
                            booking.bookingStatus === "confirmed"
                              ? "success"
                              : booking.bookingStatus === "cancelled"
                              ? "destructive"
                              : "warning"
                          }
                          className="capitalize"
                        >
                          {booking.bookingStatus}
                        </Badge>
                      </div>
                      <div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wide ${
                            booking.paymentStatus === "paid"
                              ? "text-emerald-600"
                              : booking.paymentStatus === "failed"
                              ? "text-red-600"
                              : "text-amber-600"
                          }`}
                        >
                          Payment: {booking.paymentStatus}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenStatusModal(booking)}
                        className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 h-8 gap-1.5"
                      >
                        <FiEdit2 className="h-3.5 w-3.5" />
                        Update Status
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Update Booking Status Modal */}
      <AnimatePresence>
        {isModalOpen && selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-xl border border-slate-100 space-y-6"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-3 border-b">
                <h3 className="text-lg font-bold text-slate-900">Update Booking Status</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              {/* Details */}
              <div className="text-sm space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer</span>
                  <span className="font-semibold text-slate-900">{selectedBooking.userId?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Package</span>
                  <span className="font-semibold text-slate-900">{selectedBooking.packageId?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Price</span>
                  <span className="font-bold text-emerald-800">
                    {formatCurrency(selectedBooking.totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Status</span>
                  <Badge className="capitalize">{selectedBooking.bookingStatus}</Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Button
                  onClick={() => handleUpdateStatus("confirmed")}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-11"
                  disabled={updateStatusMutation.isPending}
                >
                  <FiCheck className="h-5 w-5" /> Confirm Booking
                </Button>

                <Button
                  onClick={() => handleUpdateStatus("pending")}
                  variant="outline"
                  className="w-full border-slate-200 text-slate-700 h-11"
                  disabled={updateStatusMutation.isPending}
                >
                  Mark as Pending
                </Button>

                <Button
                  onClick={() => handleUpdateStatus("cancelled")}
                  variant="destructive"
                  className="w-full gap-2 h-11"
                  disabled={updateStatusMutation.isPending}
                >
                  <FiAlertTriangle className="h-5 w-5" /> Cancel Booking
                </Button>
              </div>

              {updateStatusMutation.isPending && (
                <div className="text-center text-xs text-muted-foreground">
                  Saving status changes...
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
