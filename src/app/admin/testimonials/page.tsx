"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit, FiTrash2, FiX, FiUpload, FiUser } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import {
  useTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
} from "@/hooks/useTestimonials";
import { uploadService } from "@/services/upload.service";
import { useSuccessAlert } from "@/hooks/useSuccessAlert";
import { useErrorAlert } from "@/hooks/useErrorAlert";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ButtonLoader from "@/components/loaders/ButtonLoader";

const testimonialFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  designation: z.string().min(2, "Designation is required"),
  review: z.string().min(5, "Review must be at least 5 characters"),
  rating: z.coerce.number().int().min(1).max(5),
});

export default function AdminTestimonialsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  // Avatar upload state
  const [photoUrl, setPhotoUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const successAlert = useSuccessAlert();
  const errorAlert = useErrorAlert();
  const confirmDelete = useDeleteConfirmation();

  // Queries & Mutations
  const { data: testimonialsRes, isLoading, isError } = useTestimonials({ page: 1, limit: 100 });
  const createMutation = useCreateTestimonial();
  const updateMutation = useUpdateTestimonial();
  const deleteMutation = useDeleteTestimonial();

  const testimonials = testimonialsRes?.data?.items || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      name: "",
      designation: "",
      review: "",
      rating: 5,
    },
  });

  const selectedRating = (watch("rating") as number) || 5;

  const handleOpenModal = (testimonial = null) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      reset({
        name: testimonial.name,
        designation: testimonial.designation,
        review: testimonial.review,
        rating: testimonial.rating,
      });
      setPhotoUrl(testimonial.photo || "");
    } else {
      setEditingTestimonial(null);
      reset({
        name: "",
        designation: "",
        review: "",
        rating: 5,
      });
      setPhotoUrl("");
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await uploadService.uploadImage(file, "testimonials");
      setPhotoUrl(res.data.url);
      successAlert("Image Uploaded", "Traveler photo uploaded successfully.");
    } catch (err) {
      errorAlert("Upload Failed", err.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id) => {
    confirmDelete("Delete Testimonial", () => {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          successAlert("Testimonial Removed", "The review was successfully deleted.");
        },
        onError: (err) => {
          errorAlert("Deletion Failed", err.message || "Failed to delete review.");
        },
      });
    });
  };

  const onSubmit = (data) => {
    const payload = {
      ...data,
      photo: photoUrl,
    };

    if (editingTestimonial) {
      updateMutation.mutate(
        { id: editingTestimonial._id, data: payload },
        {
          onSuccess: () => {
            successAlert("Review Updated", "Testimonial saved successfully.");
            setIsModalOpen(false);
          },
          onError: (err) => {
            errorAlert("Update Failed", err.message || "Failed to update testimonial.");
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          successAlert("Review Added", "New testimonial published successfully.");
          setIsModalOpen(false);
        },
        onError: (err) => {
          errorAlert("Publish Failed", err.message || "Failed to publish review.");
        },
      });
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <FaStar
            key={index}
            className={`h-3.5 w-3.5 ${
              index < rating ? "text-amber-500 fill-amber-500" : "text-slate-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Add Button */}
      <div className="flex justify-end">
        <Button onClick={() => handleOpenModal()} className="gap-2 shrink-0">
          <FiPlus className="h-4.5 w-4.5" />
          Add Testimonial
        </Button>
      </div>

      {/* Testimonials List */}
      {isLoading ? (
        <TableSkeleton rows={6} columns={4} />
      ) : isError ? (
        <div className="py-12 text-center text-destructive">
          Failed to load testimonials.
        </div>
      ) : testimonials.length === 0 ? (
        <div className="py-16 text-center rounded-xl border border-dashed text-muted-foreground">
          No traveler testimonials have been created yet.
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="p-4">Traveler</th>
                  <th className="p-4">Designation</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Review Preview</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {testimonials.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-emerald-600/10">
                          <AvatarImage src={item.photo} alt={item.name} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            <FiUser />
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-semibold text-slate-900">{item.name}</div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 font-medium">{item.designation}</td>
                    <td className="p-4">{renderStars(item.rating)}</td>
                    <td className="p-4 max-w-xs">
                      <p className="truncate text-slate-500 text-xs italic">
                        &ldquo;{item.review}&rdquo;
                      </p>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenModal(item)}
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <FiEdit className="h-4.5 w-4.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item._id)}
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <FiTrash2 className="h-4.5 w-4.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Testimonial CRUD Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-xl border border-slate-100 space-y-5"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-3 border-b">
                <h3 className="text-lg font-bold text-slate-900">
                  {editingTestimonial ? "Edit Testimonial Details" : "Create Traveler Testimonial"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="name">Traveler Name</Label>
                    <Input id="name" {...register("name")} className="border-slate-200 h-9" />
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="designation">Designation (e.g. Traveler)</Label>
                    <Input id="designation" {...register("designation")} className="border-slate-200 h-9" />
                    {errors.designation && <p className="text-xs text-red-500">{errors.designation.message}</p>}
                  </div>
                </div>

                {/* Rating select stars bar */}
                <div className="space-y-1">
                  <Label>Star Rating ({selectedRating} Stars)</Label>
                  <div className="flex gap-1.5 pt-1.5">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setValue("rating", num, { shouldValidate: true })}
                        className="focus:outline-none"
                      >
                        <FaStar
                          className={`h-7 w-7 transition-colors ${
                            num <= selectedRating
                              ? "text-amber-500 fill-amber-500"
                              : "text-slate-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Avatar Image upload */}
                <div className="space-y-2">
                  <Label>Traveler Profile Photo</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border">
                      <AvatarImage src={photoUrl} />
                      <AvatarFallback>
                        <FiUser />
                      </AvatarFallback>
                    </Avatar>
                    <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors">
                      <FiUpload className="h-4 w-4" />
                      Upload Photo
                      <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                    </label>
                  </div>
                  {isUploading && <p className="text-xs text-muted-foreground">Uploading image...</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="review">Review Content</Label>
                  <Textarea id="review" rows={4} {...register("review")} className="border-slate-200" />
                  {errors.review && <p className="text-xs text-red-500">{errors.review.message}</p>}
                </div>

                {/* Footer Submit */}
                <div className="border-t pt-4 flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="border-slate-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {createMutation.isPending || updateMutation.isPending ? (
                      <>
                        <ButtonLoader className="mr-2 h-4 w-4" />
                        Saving...
                      </>
                    ) : (
                      "Save Testimonial"
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
