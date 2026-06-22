"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiCheckSquare, FiX, FiCheck } from "react-icons/fi";
import { usePayments, useVerifyPayment } from "@/hooks/usePayments";
import { useSuccessAlert } from "@/hooks/useSuccessAlert";
import { useErrorAlert } from "@/hooks/useErrorAlert";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ButtonLoader from "@/components/loaders/ButtonLoader";
import { formatCurrency, formatDate } from "@/utils/format";

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const successAlert = useSuccessAlert();
  const errorAlert = useErrorAlert();

  const { data: paymentsRes, isLoading, isError } = usePayments();
  const verifyMutation = useVerifyPayment();

  const allPayments = paymentsRes?.data?.items || [];

  // Filter payments client side
  const filteredPayments = allPayments.filter((payment) => {
    const matchesSearch =
      payment.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
      payment.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      payment.paymentMethod?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || payment.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenVerifyModal = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleVerify = () => {
    verifyMutation.mutate(selectedPayment._id, {
      onSuccess: () => {
        successAlert("Payment Verified", "The transaction proof was approved and booking is confirmed.");
        setIsModalOpen(false);
      },
      onError: (err) => {
        errorAlert("Verification Failed", err.message || "Failed to verify transaction proof.");
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by TxID or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-slate-200"
          />
        </div>
        <div className="flex gap-2">
          {["all", "pending", "paid", "failed"].map((filter) => (
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

      {/* Payments log */}
      {isLoading ? (
        <TableSkeleton rows={6} columns={6} />
      ) : isError ? (
        <div className="py-12 text-center text-destructive">
          Failed to load payments history log.
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="py-16 text-center rounded-xl border border-dashed text-muted-foreground">
          No payment transactions match your current filters.
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="p-4">Customer</th>
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{payment.userId?.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Submitted: {formatDate(payment.createdAt)}
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-900 uppercase">
                      {payment.transactionId}
                    </td>
                    <td className="p-4 uppercase text-xs font-bold text-slate-600">
                      {payment.paymentMethod}
                    </td>
                    <td className="p-4 font-bold text-slate-950">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="p-4 space-y-1">
                      <div>
                        <Badge
                          variant={
                            payment.paymentStatus === "paid"
                              ? "success"
                              : payment.paymentStatus === "failed"
                              ? "destructive"
                              : "warning"
                          }
                          className="capitalize"
                        >
                          {payment.paymentStatus}
                        </Badge>
                      </div>
                      {payment.verifiedByAdmin && (
                        <div className="text-[10px] text-emerald-600 font-semibold">
                          Verified by Admin
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {payment.paymentStatus === "pending" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenVerifyModal(payment)}
                          className="text-primary hover:bg-primary/5 h-8 gap-1.5 font-semibold"
                        >
                          <FiCheckSquare className="h-4 w-4" />
                          Verify
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground font-medium">Verified</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Verify Payment Modal */}
      <AnimatePresence>
        {isModalOpen && selectedPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-xl border border-slate-100 space-y-6"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-3 border-b">
                <h3 className="text-lg font-bold text-slate-900">Verify Payment Transaction</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              {/* Details */}
              <div className="text-sm space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer</span>
                  <span className="font-semibold text-slate-900">{selectedPayment.userId?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono font-bold text-slate-950 uppercase">
                    {selectedPayment.transactionId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-bold uppercase text-slate-700">
                    {selectedPayment.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Paid Amount</span>
                  <span className="font-bold text-emerald-800 text-lg">
                    {formatCurrency(selectedPayment.amount)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed text-center">
                Please confirm that you have checked the mobile wallet or bank statement and successfully received the above amount before verifying.
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => setIsModalOpen(false)}
                  variant="outline"
                  className="flex-1 border-slate-200"
                  disabled={verifyMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleVerify}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                  disabled={verifyMutation.isPending}
                >
                  {verifyMutation.isPending ? (
                    <>
                      <ButtonLoader className="mr-1 h-4 w-4" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <FiCheck className="h-5 w-5" /> Approve Proof
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
