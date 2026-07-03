"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiX, FiUpload, FiShoppingCart } from "react-icons/fi";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useProducts";
import { uploadService } from "@/services/upload.service";
import { useSuccessAlert } from "@/hooks/useSuccessAlert";
import { useErrorAlert } from "@/hooks/useErrorAlert";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import ButtonLoader from "@/components/loaders/ButtonLoader";
import { formatCurrency } from "@/utils/format";

const productFormSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  category: z.string().min(2, "Category is required"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
});

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Main product photo upload state
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const successAlert = useSuccessAlert();
  const errorAlert = useErrorAlert();
  const confirmDelete = useDeleteConfirmation();

  // Query & Mutations
  const { data: productsRes, isLoading, isError } = useProducts({ search });
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const products = productsRes?.data || [];

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "honey",
      stock: 10,
    },
  });

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
      });
      setImageUrl(product.images?.[0] || "");
    } else {
      setEditingProduct(null);
      reset({
        name: "",
        description: "",
        price: 0,
        category: "honey",
        stock: 10,
      });
      setImageUrl("");
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await uploadService.uploadImage(file, "products");
      setImageUrl(res.data.url);
      successAlert("Image Uploaded", "Product image uploaded successfully.");
    } catch (err: any) {
      errorAlert("Upload Failed", err.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id) => {
    confirmDelete("Delete Product", () => {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          successAlert("Product Deleted", "The product was successfully removed.");
        },
        onError: (err: any) => {
          errorAlert("Deletion Failed", err.message || "Failed to delete product.");
        },
      });
    });
  };

  const onSubmit = (data) => {
    if (!imageUrl) {
      errorAlert("Image Required", "Please upload a product photo.");
      return;
    }

    const payload = {
      ...data,
      images: [imageUrl],
    };

    if (editingProduct) {
      updateMutation.mutate(
        { id: editingProduct._id, data: payload },
        {
          onSuccess: () => {
            successAlert("Product Updated", "Product details updated successfully.");
            setIsModalOpen(false);
          },
          onError: (err: any) => {
            errorAlert("Update Failed", err.message || "Failed to update product.");
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          successAlert("Product Created", "New product created successfully.");
          setIsModalOpen(false);
        },
        onError: (err: any) => {
          errorAlert("Creation Failed", err.message || "Failed to create product.");
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action log bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products by name or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-slate-200 bg-white text-slate-900"
          />
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2 shrink-0">
          <FiPlus className="h-4.5 w-4.5" />
          Add Shop Product
        </Button>
      </div>

      {/* Grid list or Table */}
      {isLoading ? (
        <TableSkeleton rows={6} columns={5} />
      ) : isError ? (
        <div className="py-12 text-center text-destructive">
          Failed to load shop products list.
        </div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center rounded-xl border border-dashed text-muted-foreground max-w-md mx-auto space-y-3">
          <FiShoppingCart className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No Products Found</h3>
          <p className="text-xs text-slate-400">Click the button above to add your first ecotourism shop item.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="p-4">Image</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product: any) => (
                  <tr key={product._id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="p-4">
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-slate-50 border">
                        {product.images?.[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-900 line-clamp-1">{product.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{product.description}</div>
                    </td>
                    <td className="p-4">
                      <Badge className="capitalize bg-slate-100 hover:bg-slate-100 border text-slate-700 text-xs">
                        {product.category}
                      </Badge>
                    </td>
                    <td className="p-4 font-bold text-slate-950">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="p-4">
                      <span className={`font-semibold text-xs ${product.stock > 0 ? "text-emerald-700" : "text-red-600"}`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenModal(product)}
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <FiEdit className="h-4.5 w-4.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product._id)}
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

      {/* Product CRUD Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl border border-slate-100 space-y-6"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-3 border-b">
                <h3 className="text-lg font-bold text-slate-900">
                  {editingProduct ? "Edit Product Details" : "Add New Shop Product"}
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
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-slate-700 font-semibold">Product Name</Label>
                  <Input id="name" {...register("name")} className="border-slate-200 bg-white text-slate-900 focus-visible:text-slate-900 h-9" />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="price" className="text-slate-700 font-semibold">Price (BDT)</Label>
                    <Input id="price" type="number" {...register("price")} className="border-slate-200 bg-white text-slate-900 focus-visible:text-slate-900 h-9" />
                    {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="stock" className="text-slate-700 font-semibold">Stock Quantity</Label>
                    <Input id="stock" type="number" {...register("stock")} className="border-slate-200 bg-white text-slate-900 focus-visible:text-slate-900 h-9" />
                    {errors.stock && <p className="text-xs text-red-500">{errors.stock.message}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="category" className="text-slate-700 font-semibold">Category</Label>
                  <select
                    id="category"
                    {...register("category")}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 h-9 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="honey">Sundarban Honey</option>
                    <option value="gear">Tour Gear</option>
                    <option value="souvenirs">Handicrafts & Souvenirs</option>
                  </select>
                  {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
                </div>

                {/* Photo upload */}
                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold">Product Photo</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-lg overflow-hidden border bg-slate-50 flex items-center justify-center">
                      {imageUrl ? (
                        <img src={imageUrl} className="h-full w-full object-cover" />
                      ) : (
                        <FiShoppingCart className="h-6 w-6 text-slate-300" />
                      )}
                    </div>
                    <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors bg-white">
                      <FiUpload className="h-4 w-4" />
                      Upload Image
                      <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                    </label>
                  </div>
                  {isUploading && <p className="text-xs text-slate-500">Uploading photo...</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="description" className="text-slate-700 font-semibold">Product Description</Label>
                  <Textarea id="description" rows={3} {...register("description")} className="border-slate-200 bg-white text-slate-900 focus-visible:text-slate-900" />
                  {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                </div>

                {/* Footer Submit */}
                <div className="border-t pt-4 flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="border-slate-200 text-slate-700 bg-white hover:bg-slate-50"
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
                      "Save Product"
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
