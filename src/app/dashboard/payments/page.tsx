"use client";

import { FiCreditCard, FiCheckCircle, FiInfo } from "react-icons/fi";

import { usePayments } from "@/hooks/usePayments";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import NoPaymentsFound from "@/components/empty-states/NoPaymentsFound";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/utils/format";

export default function PaymentHistoryPage() {
  const { data: paymentsResponse, isLoading } = usePayments();
  const paymentsData = paymentsResponse?.data;
  const payments = paymentsData?.items || [];

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

  const getMethodLabel = (method) => {
    switch (method) {
      case "bkash":
        return "bKash";
      case "nagad":
        return "Nagad";
      case "rocket":
        return "Rocket";
      case "bank":
        return "Bank Transfer";
      default:
        return method;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Payment History</h1>
          <p className="text-muted-foreground mt-1">Review all your transaction logs and approval statuses.</p>
        </div>
        <TableSkeleton columns={5} rows={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Payment History</h1>
        <p className="text-muted-foreground mt-1">Review all your transaction logs and approval statuses.</p>
      </div>

      {payments.length === 0 ? (
        <NoPaymentsFound />
      ) : (
        <div className="rounded-md border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-semibold text-slate-700">Submit Date</TableHead>
                <TableHead className="font-semibold text-slate-700">Booking Reference</TableHead>
                <TableHead className="font-semibold text-slate-700">Amount Paid</TableHead>
                <TableHead className="font-semibold text-slate-700">Method</TableHead>
                <TableHead className="font-semibold text-slate-700">Transaction ID</TableHead>
                <TableHead className="font-semibold text-slate-700">Verification</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment._id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium text-slate-600">
                    {formatDate(payment.createdAt)}
                  </TableCell>
                  <TableCell className="text-slate-950 font-medium">
                    {payment.bookingId?.packageId?.title || "Tour Booking"}
                  </TableCell>
                  <TableCell className="font-bold text-emerald-800">
                    {formatCurrency(payment.amount)}
                  </TableCell>
                  <TableCell className="capitalize text-slate-700 font-medium">
                    {getMethodLabel(payment.paymentMethod)}
                  </TableCell>
                  <TableCell className="font-mono text-slate-600 font-bold uppercase">
                    {payment.transactionId}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <Badge variant={getPaymentStatusVariant(payment.paymentStatus)} className="capitalize w-fit">
                        {payment.paymentStatus}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {payment.verifiedByAdmin ? "Verified by Admin" : "Awaiting Review"}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
