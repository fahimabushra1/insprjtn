"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiTrash2, FiX, FiUpload } from "react-icons/fi";
import { useGallery, useCreateGallery, useDeleteGallery } from "@/hooks/useGallery";
import { uploadService } from "@/services/upload.service";
import { useSuccessAlert } from "@/hooks/useSuccessAlert";
import { useErrorAlert } from "@/hooks/useErrorAlert";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";
import GallerySkeleton from "@/components/skeletons/GallerySkeleton";
import NoGalleryFound from "@/components/empty-states/NoGalleryFound";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ButtonLoader from "@/components/loaders/ButtonLoader";

const galleryFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export default function AdminGalleryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // File upload state
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const successAlert = useSuccessAlert();
  const errorAlert = useErrorAlert();
  const confirmDelete = useDeleteConfirmation();

  // Queries & Mutations
  const { data: galleryRes, isLoading, isError } = useGallery({ page: 1, limit: 100 });
  const createMutation = useCreateGallery();
  const deleteMutation = useDeleteGallery();

  const items = galleryRes?.data?.items || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(galleryFormSchema),
    defaultValues: {
      title: "",
    },
  });

  const handleOpenModal = () => {
    reset({ title: "" });
    setImageUrl("");
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await uploadService.uploadImage(file, "gallery");
      setImageUrl(res.data.url);
      successAlert("Image Uploaded", "Gallery photo uploaded successfully.");
    } catch (err) {
      errorAlert("Upload Failed", err.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id) => {
    confirmDelete("Delete Gallery Image", () => {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          successAlert("Photo Deleted", "The gallery item was removed.");
        },
        onError: (err) => {
          errorAlert("Deletion Failed", err.message || "Failed to delete gallery item.");
        },
      });
    });
  };

  const onSubmit = (data) => {
    if (!imageUrl) {
      errorAlert("Image Required", "Please upload a photo for the gallery.");
      return;
    }

    const payload = {
      ...data,
      image: imageUrl,
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        successAlert("Photo Added", "New gallery photo added successfully.");
        setIsModalOpen(false);
      },
      onError: (err) => {
        errorAlert("Publish Failed", err.message || "Failed to publish gallery photo.");
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex justify-end">
        <Button onClick={handleOpenModal} className="gap-2 shrink-0">
          <FiPlus className="h-4.5 w-4.5" />
          Add Photo
        </Button>
      </div>

      {/* Gallery Grid */}
      {isLoading ? (
        <GallerySkeleton />
      ) : isError ? (
        <div className="py-12 text-center text-destructive">
          Failed to load gallery items.
        </div>
      ) : items.length === 0 ? (
        <NoGalleryFound />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-square overflow-hidden bg-slate-50">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  onClick={() => handleDelete(item._id)}
                  className="absolute right-3 top-3 rounded-full bg-red-600/90 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                >
                  <FiTrash2 className="h-4.5 w-4.5" />
                </button>
              </div>
              <div className="p-4">
                <h4 className="line-clamp-1 text-sm font-semibold tracking-tight text-slate-800">
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-xl border border-slate-100 space-y-6"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-3 border-b">
                <h3 className="text-lg font-bold text-slate-900">Add Gallery Photo</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="title">Photo Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Royal Bengal Tiger"
                    {...register("title")}
                    className="border-slate-200"
                  />
                  {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                </div>

                {/* Cover Photo upload */}
                <div className="space-y-2">
                  <Label>Image File</Label>
                  {imageUrl ? (
                    <div className="relative aspect-video w-full group rounded-lg overflow-hidden border">
                      <img src={imageUrl} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImageUrl("")}
                        className="absolute inset-0 bg-red-600/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors">
                      <FiUpload className="h-6 w-6 text-slate-400" />
                      <span className="text-xs text-slate-400 mt-2">Upload Photo File</span>
                      <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                    </label>
                  )}
                  {isUploading && <p className="text-xs text-muted-foreground">Uploading image...</p>}
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
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? (
                      <>
                        <ButtonLoader className="mr-2 h-4 w-4" />
                        Saving...
                      </>
                    ) : (
                      "Publish Photo"
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
