"use client";

import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { FiCalendar, FiUsers, FiFileText, FiMapPin, FiClock } from "react-icons/fi";

import { useAuth } from "@/hooks/useAuth";
import { usePackageById } from "@/hooks/usePackages";
import { useCreateBooking } from "@/hooks/useBookings";
import { useSuccessAlert } from "@/hooks/useSuccessAlert";
import { useErrorAlert } from "@/hooks/useErrorAlert";
import { trackInitiateCheckout } from "@/lib/analytics/facebook/events";
import FullPageLoader from "@/components/loaders/FullPageLoader";
import ButtonLoader from "@/components/loaders/ButtonLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import BDHolidaysCalendar from "@/components/shared/BDHolidaysCalendar";

const checkoutSchema = z.object({
  startDate: z.string().refine((val) => {
    const date = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return !isNaN(date.getTime()) && date >= today;
  }, "Travel date must be today or in the future"),
  guests: z.coerce
    .number()
    .int()
    .min(1, "Must have at least 1 guest")
    .max(50, "For bookings larger than 50, please contact us directly"),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional().default(""),
});

function CheckoutContent() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageId = searchParams.get("packageId");

  const successAlert = useSuccessAlert();
  const errorAlert = useErrorAlert();

  const { data: pkgResponse, isLoading: pkgLoading, error: pkgError } = usePackageById(packageId);
  const pkg = pkgResponse?.data;

  const createBookingMutation = useCreateBooking();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      startDate: "",
      guests: 1,
      notes: "",
    },
  });

  const guestsCount = (watch("guests", 1) as number) || 1;
  const selectedDate = watch("startDate", "");

  const hasInitiatedRef = useRef(false);
  useEffect(() => {
    if (pkg && !hasInitiatedRef.current) {
      trackInitiateCheckout(pkg, guestsCount || 1, user || undefined);
      hasInitiatedRef.current = true;
    }
  }, [pkg, guestsCount, user]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace(`/login?redirect=/checkout?packageId=${packageId || ""}`);
    }
  }, [authLoading, isAuthenticated, router, packageId]);

  if (authLoading || pkgLoading) {
    return <FullPageLoader />;
  }

  if (!packageId || pkgError || !pkg) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Invalid Checkout Request</CardTitle>
            <CardDescription>
              We couldn&apos;t find the package you are trying to book. Please select a valid package.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/packages")} className="w-full">
              Browse Packages
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pricePerPerson = pkg.price;
  const totalPrice = pricePerPerson * (guestsCount > 0 ? guestsCount : 1);

  const onSubmit = async (data) => {
    try {
      const payload = {
        packageId: pkg._id,
        startDate: data.startDate,
        guests: parseInt(data.guests),
        notes: data.notes,
      };

      const res = await createBookingMutation.mutateAsync(payload);
      successAlert("Booking Created!", "Your tour reservation has been logged. Please proceed to payment.");
      router.push(`/checkout/${res.data._id}/payment`);
    } catch (err) {
      errorAlert("Booking Failed", err.message || "Something went wrong while booking.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 md:py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-emerald-950 dark:text-emerald-50">Book Your Sundarban Adventure</h1>
        
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="border-emerald-100/50 bg-white/80 dark:bg-card/80 dark:border-emerald-950/20 shadow-md backdrop-blur-sm">
              <CardHeader className="bg-emerald-950/5 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-50">
                <CardTitle>Traveler & Departure Details</CardTitle>
                <CardDescription className="dark:text-muted-foreground">Enter details about your upcoming Sundarban journey</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Customer Info (Read-only) */}
                  <div className="grid gap-4 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/10 p-4 sm:grid-cols-2">
                    <div>
                      <span className="text-xs text-muted-foreground">Primary Traveler</span>
                      <p className="font-semibold text-emerald-950 dark:text-emerald-100">{user?.name}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Contact Email</span>
                      <p className="font-semibold text-emerald-950 dark:text-emerald-100">{user?.email}</p>
                    </div>
                  </div>

                  {/* Travel Date */}
                  <div className="space-y-2">
                    <label htmlFor="startDate" className="flex items-center gap-2 text-sm font-medium text-emerald-900 dark:text-emerald-100">
                      <FiCalendar className="text-emerald-700 dark:text-emerald-400" /> Departure Date
                    </label>
                    <Input
                      id="startDate"
                      type="date"
                      className="border-emerald-200 dark:border-emerald-900 focus-visible:ring-emerald-700 bg-transparent"
                      {...register("startDate")}
                    />
                    {errors.startDate && (
                      <p className="text-xs font-medium text-destructive">{errors.startDate.message}</p>
                    )}
                  </div>

                  {/* Guests */}
                  <div className="space-y-2">
                    <label htmlFor="guests" className="flex items-center gap-2 text-sm font-medium text-emerald-900 dark:text-emerald-100">
                      <FiUsers className="text-emerald-700 dark:text-emerald-400" /> Number of Guests / Travelers
                    </label>
                    <Input
                      id="guests"
                      type="number"
                      min="1"
                      className="border-emerald-200 dark:border-emerald-900 focus-visible:ring-emerald-700 bg-transparent"
                      {...register("guests")}
                    />
                    {errors.guests && (
                      <p className="text-xs font-medium text-destructive">{errors.guests.message}</p>
                    )}
                  </div>

                  {/* Special Requests */}
                  <div className="space-y-2">
                    <label htmlFor="notes" className="flex items-center gap-2 text-sm font-medium text-emerald-900 dark:text-emerald-100">
                      <FiFileText className="text-emerald-700 dark:text-emerald-400" /> Special Requests (Optional)
                    </label>
                    <Textarea
                      id="notes"
                      placeholder="Any food preferences, physical conditions, or extra requirements..."
                      className="min-h-[120px] border-emerald-200 dark:border-emerald-900 focus-visible:ring-emerald-700 bg-transparent"
                      {...register("notes")}
                    />
                    {errors.notes && (
                      <p className="text-xs font-medium text-destructive">{errors.notes.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-emerald-700 text-white hover:bg-emerald-800"
                    size="lg"
                    disabled={createBookingMutation.isPending}
                  >
                    {createBookingMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <ButtonLoader /> Processing Reservation...
                      </span>
                    ) : (
                      "Confirm & Proceed to Payment"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Package Summary Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card className="overflow-hidden border-emerald-100/50 dark:border-emerald-950/20 bg-white/80 dark:bg-card/80 shadow-md">
                <div className="relative h-48 w-full bg-muted">
                  {pkg.images?.[0] ? (
                    <Image
                      src={pkg.images[0]}
                      alt={pkg.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-bold text-lg leading-tight">{pkg.title}</h3>
                    <div className="mt-1 flex items-center gap-3 text-xs opacity-90">
                      <span className="flex items-center gap-0.5"><FiMapPin /> {pkg.location}</span>
                      <span className="flex items-center gap-0.5"><FiClock /> {pkg.duration}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="pt-6">
                  <h4 className="font-semibold text-emerald-950 dark:text-emerald-50 mb-3">Booking Summary</h4>
                  
                  <div className="space-y-3 text-sm text-muted-foreground border-b pb-4">
                    <div className="flex justify-between">
                      <span>Base Fare (Per Person)</span>
                      <span className="font-medium text-emerald-950 dark:text-emerald-100">{formatCurrency(pricePerPerson)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Travelers</span>
                      <span className="font-medium text-emerald-950 dark:text-emerald-100">{guestsCount > 0 ? guestsCount : 1}</span>
                    </div>
                    {selectedDate && (
                      <div className="flex justify-between">
                        <span>Travel Date</span>
                        <span className="font-medium text-emerald-950 dark:text-emerald-100">{selectedDate}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <span className="font-bold text-emerald-950 dark:text-emerald-100">Total Price</span>
                    <span className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">{formatCurrency(totalPrice)}</span>
                  </div>

                  <div className="mt-6 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900/20 p-3 text-xs text-yellow-800 dark:text-yellow-200">
                    <p className="font-medium">Please Note:</p>
                    <p className="mt-1 leading-relaxed">
                      Confirming this booking reserves your slot temporarily. You must complete the payment within 24 hours to secure your tour.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <BDHolidaysCalendar
                onSelectDate={(dateStr) => setValue("startDate", dateStr, { shouldDirty: true, shouldValidate: true })}
                selectedDate={selectedDate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <CheckoutContent />
    </Suspense>
  );
}
