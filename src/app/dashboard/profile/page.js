"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiUser, FiPhone, FiMapPin, FiCamera } from "react-icons/fi";
import Image from "next/image";

import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth.service";
import { useSuccessAlert } from "@/hooks/useSuccessAlert";
import { useErrorAlert } from "@/hooks/useErrorAlert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().max(20, "Phone number too long").optional().default(""),
  address: z.string().max(500, "Address too long").optional().default(""),
  photo: z.string().url("Invalid image URL").optional().or(z.literal("")).default(""),
});

export default function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const successAlert = useSuccessAlert();
  const errorAlert = useErrorAlert();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
      photo: user?.photo || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await authService.updateProfile(data);
      await refreshProfile();
      successAlert("Profile Updated", "Your profile details have been saved successfully.");
    } catch (err) {
      errorAlert("Update Failed", err.message || "Failed to update profile details.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account information and contact details.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Card: Profile Photo Card */}
        <div className="md:col-span-1">
          <Card className="border-slate-100 bg-white shadow-sm text-center">
            <CardContent className="pt-6 space-y-4">
              <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-emerald-50 bg-slate-100">
                {user?.photo ? (
                  <Image
                    src={user.photo}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    <FiUser className="h-12 w-12" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg leading-tight">{user?.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
                <p className="inline-block mt-2 rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800 capitalize">
                  {user?.role} Account
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Card: Profile Edit Form */}
        <div className="md:col-span-2">
          <Card className="border-slate-100 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-slate-900 font-bold">Personal Information</CardTitle>
              <CardDescription>Update your contact info for tour booking details</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <FiUser className="text-emerald-700" /> Full Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    className="border-slate-200 focus-visible:ring-emerald-700"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-xs font-medium text-destructive">{errors.name.message}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <FiPhone className="text-emerald-700" /> Phone Number
                  </label>
                  <Input
                    id="phone"
                    type="text"
                    placeholder="e.g. +88017XXXXXXXX"
                    className="border-slate-200 focus-visible:ring-emerald-700"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-xs font-medium text-destructive">{errors.phone.message}</p>
                  )}
                </div>

                {/* Profile Image URL */}
                <div className="space-y-2">
                  <label htmlFor="photo" className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <FiCamera className="text-emerald-700" /> Profile Image URL
                  </label>
                  <Input
                    id="photo"
                    type="text"
                    placeholder="e.g. https://example.com/avatar.jpg"
                    className="border-slate-200 focus-visible:ring-emerald-700"
                    {...register("photo")}
                  />
                  {errors.photo && (
                    <p className="text-xs font-medium text-destructive">{errors.photo.message}</p>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label htmlFor="address" className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <FiMapPin className="text-emerald-700" /> Delivery / Billing Address
                  </label>
                  <Textarea
                    id="address"
                    placeholder="Enter your complete home or billing address..."
                    className="min-h-[100px] border-slate-200 focus-visible:ring-emerald-700"
                    {...register("address")}
                  />
                  {errors.address && (
                    <p className="text-xs font-medium text-destructive">{errors.address.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="bg-emerald-700 text-white hover:bg-emerald-800"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving Changes..." : "Save Profile Details"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
