"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiCheck,
  FiX,
  FiUpload,
  FiMapPin,
  FiClock,
  FiDollarSign,
} from "react-icons/fi";
import {
  usePackages,
  useCreatePackage,
  useUpdatePackage,
  useDeletePackage,
} from "@/hooks/usePackages";
import { uploadService } from "@/services/upload.service";
import { useSuccessAlert } from "@/hooks/useSuccessAlert";
import { useErrorAlert } from "@/hooks/useErrorAlert";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import NoPackagesFound from "@/components/empty-states/NoPackagesFound";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import ButtonLoader from "@/components/loaders/ButtonLoader";
import { formatCurrency } from "@/utils/format";

// Package Form Validation Schema
const packageFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  duration: z.string().min(1, "Duration is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  location: z.string().min(1, "Location is required"),
  featured: z.boolean().default(false),
  included: z.array(z.string()).default([]),
  excluded: z.array(z.string()).default([]),
  itinerary: z
    .array(
      z.object({
        day: z.coerce.number().int().min(1),
        title: z.string().min(1, "Itinerary title is required"),
        description: z.string().min(1, "Itinerary description is required"),
      })
    )
    .default([]),
});

export default function AdminPackagesPage() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  
  // File upload state
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Alerts & Confirmations
  const successAlert = useSuccessAlert();
  const errorAlert = useErrorAlert();
  const confirmDelete = useDeleteConfirmation();

  // Queries & Mutations
  const { data: packagesRes, isLoading, isError } = usePackages({ search });
  const createMutation = useCreatePackage();
  const updateMutation = useUpdatePackage();
  const deleteMutation = useDeletePackage();

  const packages = packagesRes?.data?.items || [];

  // React Hook Form Setup
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(packageFormSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: "",
      price: 0,
      location: "",
      featured: false,
      included: [],
      excluded: [],
      itinerary: [],
    },
  });

  // Dynamic Array Fields
  const {
    fields: itineraryFields,
    append: appendItinerary,
    remove: removeItinerary,
  } = useFieldArray({
    control,
    name: "itinerary",
  });

  const [newIncluded, setNewIncluded] = useState("");
  const [newExcluded, setNewExcluded] = useState("");

  const includedList = watch("included") || [];
  const excludedList = watch("excluded") || [];

  // Handle open modal for Create vs Edit
  const handleOpenModal = (pkg = null) => {
    if (pkg) {
      setEditingPackage(pkg);
      reset({
        title: pkg.title,
        description: pkg.description,
        duration: pkg.duration,
        price: pkg.price,
        location: pkg.location,
        featured: pkg.featured,
        included: pkg.included || [],
        excluded: pkg.excluded || [],
        itinerary: pkg.itinerary || [],
      });
      setUploadedImages(pkg.images || []);
    } else {
      setEditingPackage(null);
      reset({
        title: "",
        description: "",
        duration: "",
        price: 0,
        location: "",
        featured: false,
        included: [],
        excluded: [],
        itinerary: [],
      });
      setUploadedImages([]);
    }
    setIsModalOpen(true);
  };

  // Image upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await uploadService.uploadImage(file, "packages");
      setUploadedImages((prev) => [...prev, res.data.url]);
      successAlert("Image Uploaded", "Package image added successfully.");
    } catch (err) {
      errorAlert("Upload Failed", err.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeUploadedImage = (urlToRemove) => {
    setUploadedImages((prev) => prev.filter((url) => url !== urlToRemove));
  };

  // Add Item helpers for Lists
  const addIncludedItem = () => {
    if (newIncluded.trim()) {
      setValue("included", [...includedList, newIncluded.trim()]);
      setNewIncluded("");
    }
  };

  const removeIncludedItem = (index) => {
    setValue(
      "included",
      includedList.filter((_, idx) => idx !== index)
    );
  };

  const addExcludedItem = () => {
    if (newExcluded.trim()) {
      setValue("excluded", [...excludedList, newExcluded.trim()]);
      setNewExcluded("");
    }
  };

  const removeExcludedItem = (index) => {
    setValue(
      "excluded",
      excludedList.filter((_, idx) => idx !== index)
    );
  };

  // Delete Handler
  const handleDelete = (id) => {
    confirmDelete("Delete Package", () => {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          successAlert("Package Deleted", "The package has been removed.");
        },
        onError: (err) => {
          errorAlert("Deletion Failed", err.message || "Failed to delete package.");
        },
      });
    });
  };

  // Submit Handler
  const onSubmit = (data) => {
    if (uploadedImages.length === 0) {
      errorAlert("Image Required", "Please upload at least one image for the package.");
      return;
    }

    const payload = {
      ...data,
      images: uploadedImages,
    };

    if (editingPackage) {
      updateMutation.mutate(
        { id: editingPackage._id, data: payload },
        {
          onSuccess: () => {
            successAlert("Package Updated", "Package details saved successfully.");
            setIsModalOpen(false);
          },
          onError: (err) => {
            errorAlert("Update Failed", err.message || "Failed to update package.");
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          successAlert("Package Created", "New tour package added successfully.");
          setIsModalOpen(false);
        },
        onError: (err) => {
          errorAlert("Creation Failed", err.message || "Failed to create package.");
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search packages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-slate-200"
          />
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2 shrink-0">
          <FiPlus className="h-4.5 w-4.5" />
          Add Package
        </Button>
      </div>

      {/* Packages Table/Grid */}
      {isLoading ? (
        <TableSkeleton rows={6} columns={5} />
      ) : isError ? (
        <div className="py-12 text-center text-destructive">
          Failed to load tour packages.
        </div>
      ) : packages.length === 0 ? (
        <NoPackagesFound />
      ) : (
        <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="p-4">Package</th>
                  <th className="p-4">Location & Duration</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {packages.map((pkg) => (
                  <tr key={pkg._id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 overflow-hidden rounded-lg bg-slate-100">
                          {pkg.images?.[0] && (
                            <img
                              src={pkg.images[0]}
                              alt={pkg.title}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="font-semibold text-slate-900">{pkg.title}</div>
                      </div>
                    </td>
                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <FiMapPin className="text-slate-400" />
                        {pkg.location}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <FiClock className="text-slate-400" />
                        {pkg.duration}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-900">
                      {formatCurrency(pkg.price)}
                    </td>
                    <td className="p-4">
                      {pkg.featured ? (
                        <Badge variant="success">Featured</Badge>
                      ) : (
                        <Badge variant="secondary">Standard</Badge>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenModal(pkg)}
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <FiEdit className="h-4.5 w-4.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(pkg._id)}
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

      {/* Modal Popup */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl border border-slate-100 flex flex-col gap-6"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b">
                <h3 className="text-xl font-bold text-slate-900">
                  {editingPackage ? "Edit Package Details" : "Create New Tour Package"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Package Meta Info */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="title" className="text-slate-700 font-semibold">Package Title</Label>
                      <Input id="title" {...register("title")} className="border-slate-200 bg-white text-slate-900 focus-visible:text-slate-900" />
                      {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="duration" className="text-slate-700 font-semibold">Duration (e.g. 3 Days 2 Nights)</Label>
                        <Input id="duration" {...register("duration")} className="border-slate-200 bg-white text-slate-900 focus-visible:text-slate-900" />
                        {errors.duration && <p className="text-xs text-red-500">{errors.duration.message}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="price" className="text-slate-700 font-semibold">Price (BDT)</Label>
                        <Input id="price" type="number" {...register("price")} className="border-slate-200 bg-white text-slate-900 focus-visible:text-slate-900" />
                        {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="location" className="text-slate-700 font-semibold">Location / Departure</Label>
                        <Input id="location" {...register("location")} className="border-slate-200 bg-white text-slate-900 focus-visible:text-slate-900" />
                        {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
                      </div>
                      <div className="flex items-center gap-2 pt-8">
                        <input
                          id="featured"
                          type="checkbox"
                          {...register("featured")}
                          className="h-4.5 w-4.5 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="featured" className="text-slate-700 font-semibold">Feature this package</Label>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="description" className="text-slate-700 font-semibold">Package Description</Label>
                      <Textarea id="description" rows={5} {...register("description")} className="border-slate-200 bg-white text-slate-900 focus-visible:text-slate-900" />
                      {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                    </div>
                  </div>

                  {/* Images & Inclusion Lists */}
                  <div className="space-y-6">
                    {/* Cloudinary Images Upload */}
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold">Package Images</Label>
                      <div className="flex flex-wrap gap-2.5">
                        {uploadedImages.map((url, idx) => (
                          <div key={idx} className="relative h-16 w-20 group rounded-lg overflow-hidden border">
                            <img src={url} className="h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeUploadedImage(url)}
                              className="absolute inset-0 bg-red-600/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200"
                            >
                              <FiTrash2 className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        ))}
                        <label className="flex h-16 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors">
                          <FiUpload className="h-5 w-5 text-slate-400" />
                          <span className="text-[10px] text-slate-400 mt-1">Upload</span>
                          <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                        </label>
                      </div>
                      {isUploading && <p className="text-xs text-slate-500">Uploading image...</p>}
                    </div>

                    {/* Included lists */}
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold">What is Included</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g. Guided boat tour"
                          value={newIncluded}
                          onChange={(e) => setNewIncluded(e.target.value)}
                          className="border-slate-200 bg-white text-slate-900 focus-visible:text-slate-900 h-9"
                        />
                        <Button type="button" size="sm" onClick={addIncludedItem}>
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {includedList.map((item, index) => (
                          <Badge key={index} variant="secondary" className="gap-1 bg-slate-100 text-slate-700 border-slate-200">
                            {item}
                            <button type="button" onClick={() => removeIncludedItem(index)}>
                              <FiX className="h-3 w-3 hover:text-red-500" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Excluded lists */}
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold">What is Excluded</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g. Personal expenses"
                          value={newExcluded}
                          onChange={(e) => setNewExcluded(e.target.value)}
                          className="border-slate-200 bg-white text-slate-900 focus-visible:text-slate-900 h-9"
                        />
                        <Button type="button" size="sm" onClick={addExcludedItem}>
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {excludedList.map((item, index) => (
                          <Badge key={index} variant="secondary" className="gap-1 bg-slate-100 text-slate-700 border-slate-200">
                            {item}
                            <button type="button" onClick={() => removeExcludedItem(index)}>
                              <FiX className="h-3 w-3 hover:text-red-500" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Itinerary Section */}
                <div className="border-t pt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-900 text-sm">Tour Itinerary Planner</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        appendItinerary({
                          day: itineraryFields.length + 1,
                          title: "",
                          description: "",
                        })
                      }
                      className="h-8 text-xs border-slate-200 text-slate-700"
                    >
                      <FiPlus className="mr-1" /> Add Day Plan
                    </Button>
                  </div>

                  {itineraryFields.map((field, index) => (
                    <Card key={field.id} className="border-slate-100 shadow-none bg-slate-50/50 p-4">
                      <div className="flex gap-4">
                        <div className="w-16 shrink-0 space-y-1">
                          <Label className="text-slate-700 font-semibold">Day</Label>
                          <Input
                            type="number"
                            {...register(`itinerary.${index}.day`)}
                            className="border-slate-200 bg-white text-slate-900 focus-visible:text-slate-900 h-9"
                          />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="space-y-1">
                            <Label className="text-slate-700 font-semibold">Day Title</Label>
                            <Input
                              placeholder="e.g. Arrival at Kotka Beach"
                              {...register(`itinerary.${index}.title`)}
                              className="border-slate-200 bg-white text-slate-900 focus-visible:text-slate-900 h-9"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-slate-700 font-semibold">Day Description</Label>
                            <Textarea
                              placeholder="Describe activities, meals, sights..."
                              rows={2}
                              {...register(`itinerary.${index}.description`)}
                              className="border-slate-200 bg-white text-slate-900 focus-visible:text-slate-900"
                            />
                          </div>
                        </div>
                        <div className="pt-7 shrink-0">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItinerary(index)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <FiTrash2 className="h-4.5 w-4.5" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
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
                      "Save Package"
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
