"use client";

import { useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiDollarSign, FiSmartphone, FiCheckCircle, FiCopy, FiInfo } from "react-icons/fi";
import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";
import { useBookingDetails } from "@/hooks/useBookings";
import { useSubmitPayment } from "@/hooks/usePayments";
import { useSuccessAlert } from "@/hooks/useSuccessAlert";
import { useErrorAlert } from "@/hooks/useErrorAlert";
import FullPageLoader from "@/components/loaders/FullPageLoader";
import ButtonLoader from "@/components/loaders/ButtonLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/utils/format";

const paymentSchema = z.object({
  paymentMethod: z.enum(["bkash", "nagad", "rocket", "bank"], {
    required_error: "Please select a payment method",
  }),
  transactionId: z
    .string()
    .min(6, "Transaction ID is too short (minimum 6 characters)")
    .max(30, "Transaction ID is too long")
    .regex(/^[a-zA-Z0-9]+$/, "Transaction ID must only contain alphanumeric characters"),
});

export default function PaymentPage({ params }) {
  const { bookingId } = use(params);
  const { authLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const successAlert = useSuccessAlert();
  const errorAlert = useErrorAlert();

  const { data: bookingResponse, isLoading: bookingLoading, error: bookingError } = useBookingDetails(bookingId);
  const booking = bookingResponse?.data;

  const submitPaymentMutation = useSubmitPayment();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: "",
      transactionId: "",
    },
  });

  const selectedMethod = watch("paymentMethod");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace(`/login?redirect=/checkout/${bookingId}/payment`);
    }
  }, [authLoading, isAuthenticated, router, bookingId]);

  if (authLoading || bookingLoading) {
    return <FullPageLoader />;
  }

  if (bookingError || !booking) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Booking Not Found</CardTitle>
            <CardDescription>
              We couldn&apos;t find this booking record. It might have been deleted or entered incorrectly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard/bookings")} className="w-full">
              Go to My Bookings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect if booking is already paid
  if (booking.paymentStatus === "paid") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Card className="mx-auto max-w-md border-emerald-200">
          <CardHeader className="text-emerald-950">
            <FiCheckCircle className="mx-auto h-16 w-16 text-emerald-600 mb-2" />
            <CardTitle>Already Paid!</CardTitle>
            <CardDescription>
              This booking is already paid and confirmed. You can view your tour details in your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard/bookings")} className="w-full bg-emerald-700">
              View My Bookings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        bookingId: booking._id,
        paymentMethod: data.paymentMethod,
        transactionId: data.transactionId,
      };

      await submitPaymentMutation.mutateAsync(payload);
      successAlert(
        "Payment Submitted!",
        "Your transaction has been submitted for verification. We will verify and confirm your booking soon."
      );
      router.push("/dashboard/bookings");
    } catch (err) {
      errorAlert("Payment Submission Failed", err.message || "Failed to submit payment transaction.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-emerald-950">Complete Your Payment</h1>

        <div className="grid gap-8 md:grid-cols-5">
          {/* Instructions and Details */}
          <div className="md:col-span-3 space-y-6">
            <Card className="border-emerald-100 bg-white shadow-sm">
              <CardHeader className="bg-emerald-50/50">
                <CardTitle className="text-lg text-emerald-950">Manual Payment Instructions</CardTitle>
                <CardDescription>
                  Please send the exact amount to one of our mobile wallets or bank account, then submit the transaction details.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* bKash instructions */}
                <div className="rounded-lg border border-pink-100 bg-pink-50/30 p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-pink-700 text-sm">bKash (Personal)</span>
                    <button
                      onClick={() => handleCopy("+8801700112233")}
                      className="text-xs text-pink-700 hover:underline flex items-center gap-1 font-medium"
                    >
                      <FiCopy /> Copy Number
                    </button>
                  </div>
                  <p className="mt-1 text-lg font-mono font-bold text-pink-950">+8801700112233</p>
                  <p className="mt-1 text-xs text-muted-foreground">Select &quot;Send Money&quot; option in your bKash app.</p>
                </div>

                {/* Nagad instructions */}
                <div className="rounded-lg border border-orange-100 bg-orange-50/30 p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-orange-700 text-sm">Nagad (Personal)</span>
                    <button
                      onClick={() => handleCopy("+8801800112233")}
                      className="text-xs text-orange-700 hover:underline flex items-center gap-1 font-medium"
                    >
                      <FiCopy /> Copy Number
                    </button>
                  </div>
                  <p className="mt-1 text-lg font-mono font-bold text-orange-950">+8801800112233</p>
                  <p className="mt-1 text-xs text-muted-foreground">Select &quot;Send Money&quot; option in your Nagad app.</p>
                </div>

                {/* Rocket instructions */}
                <div className="rounded-lg border border-indigo-100 bg-indigo-50/30 p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-indigo-700 text-sm">Rocket (Personal)</span>
                    <button
                      onClick={() => handleCopy("+8801900112233-1")}
                      className="text-xs text-indigo-700 hover:underline flex items-center gap-1 font-medium"
                    >
                      <FiCopy /> Copy Number
                    </button>
                  </div>
                  <p className="mt-1 text-lg font-mono font-bold text-indigo-950">+8801900112233-1</p>
                  <p className="mt-1 text-xs text-muted-foreground">Select &quot;Send Money&quot; option in your Rocket app.</p>
                </div>

                {/* Bank Account */}
                <div className="rounded-lg border border-emerald-100 bg-emerald-50/20 p-4 space-y-2">
                  <span className="font-bold text-emerald-800 text-sm block">Bank Account Details</span>
                  <div className="text-xs space-y-1 text-muted-foreground">
                    <p><strong className="text-emerald-950">Bank Name:</strong> Dutch-Bangla Bank PLC</p>
                    <p><strong className="text-emerald-950">Account Name:</strong> Insaniat Parjatan Ltd</p>
                    <p><strong className="text-emerald-950">Account Number:</strong> 123.456.789123</p>
                    <p><strong className="text-emerald-950">Branch:</strong> Banani Branch, Dhaka</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form and booking card */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-emerald-100 bg-white shadow-sm">
              <CardHeader className="bg-emerald-950 text-white">
                <CardTitle className="text-md">Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Package</span>
                  <span className="font-medium text-emerald-950 text-right">{booking.packageId?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Departure</span>
                  <span className="font-medium text-emerald-950">{formatDate(booking.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Travelers</span>
                  <span className="font-medium text-emerald-950">{booking.guests} Person(s)</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between items-center pt-1">
                  <span className="font-bold text-emerald-950">Amount to Pay</span>
                  <span className="text-xl font-bold text-emerald-700">{formatCurrency(booking.totalPrice)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-100 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-md text-emerald-950">Submit Transaction ID</CardTitle>
                <CardDescription>Enter payment transaction proof below</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Payment Method */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Payment Method</label>
                    <Select
                      onValueChange={(val) => setValue("paymentMethod", val, { shouldValidate: true })}
                      value={selectedMethod}
                    >
                      <SelectTrigger className="border-emerald-200">
                        <SelectValue placeholder="Select Method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bkash">bKash</SelectItem>
                        <SelectItem value="nagad">Nagad</SelectItem>
                        <SelectItem value="rocket">Rocket</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.paymentMethod && (
                      <p className="text-xs font-medium text-destructive">{errors.paymentMethod.message}</p>
                    )}
                  </div>

                  {/* Transaction ID */}
                  <div className="space-y-2">
                    <label htmlFor="transactionId" className="text-xs font-medium text-muted-foreground">
                      Transaction ID / Reference
                    </label>
                    <Input
                      id="transactionId"
                      type="text"
                      placeholder="e.g. 8K28D9183S"
                      className="border-emerald-200 uppercase"
                      {...register("transactionId")}
                    />
                    {errors.transactionId && (
                      <p className="text-xs font-medium text-destructive">{errors.transactionId.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-emerald-700 text-white hover:bg-emerald-800"
                    disabled={submitPaymentMutation.isPending}
                  >
                    {submitPaymentMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <ButtonLoader /> Submitting...
                      </span>
                    ) : (
                      "Submit Payment Proof"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3 text-xs text-emerald-800 flex items-start gap-2">
              <FiInfo className="mt-0.5 shrink-0" />
              <p className="leading-relaxed">
                Verification takes up to 1-2 hours during business hours. Once verified, your booking status will change to &quot;Confirmed&quot; in the dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
