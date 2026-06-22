"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiX, FiUpload } from "react-icons/fi";
import { useBlogs, useCreateBlog, useUpdateBlog, useDeleteBlog } from "@/hooks/useBlogs";
import { uploadService } from "@/services/upload.service";
import { useSuccessAlert } from "@/hooks/useSuccessAlert";
import { useErrorAlert } from "@/hooks/useErrorAlert";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import NoBlogsFound from "@/components/empty-states/NoBlogsFound";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ButtonLoader from "@/components/loaders/ButtonLoader";
import { formatDate } from "@/utils/format";

const blogFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  author: z.string().min(2, "Author name is required"),
});

export default function AdminBlogsPage() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  // Cover image upload state
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const successAlert = useSuccessAlert();
  const errorAlert = useErrorAlert();
  const confirmDelete = useDeleteConfirmation();

  // Queries & Mutations
  const { data: blogsRes, isLoading, isError } = useBlogs({ search });
  const createMutation = useCreateBlog();
  const updateMutation = useUpdateBlog();
  const deleteMutation = useDeleteBlog();

  const blogs = blogsRes?.data?.items || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      content: "",
      author: "",
    },
  });

  const handleOpenModal = (blog = null) => {
    if (blog) {
      setEditingBlog(blog);
      reset({
        title: blog.title,
        content: blog.content,
        author: blog.author,
      });
      setImageUrl(blog.thumbnail || "");
    } else {
      setEditingBlog(null);
      reset({
        title: "",
        content: "",
        author: "",
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
      const res = await uploadService.uploadImage(file, "blogs");
      setImageUrl(res.data.url);
      successAlert("Image Uploaded", "Blog cover image uploaded successfully.");
    } catch (err) {
      errorAlert("Upload Failed", err.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id) => {
    confirmDelete("Delete Blog Post", () => {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          successAlert("Post Deleted", "The blog post was successfully removed.");
        },
        onError: (err) => {
          errorAlert("Deletion Failed", err.message || "Failed to delete blog post.");
        },
      });
    });
  };

  const onSubmit = (data) => {
    if (!imageUrl) {
      errorAlert("Cover Image Required", "Please upload a thumbnail cover image.");
      return;
    }

    const payload = {
      ...data,
      thumbnail: imageUrl,
    };

    if (editingBlog) {
      updateMutation.mutate(
        { id: editingBlog._id, data: payload },
        {
          onSuccess: () => {
            successAlert("Post Updated", "Blog post updated successfully.");
            setIsModalOpen(false);
          },
          onError: (err) => {
            errorAlert("Update Failed", err.message || "Failed to update blog post.");
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          successAlert("Post Created", "New blog post published successfully.");
          setIsModalOpen(false);
        },
        onError: (err) => {
          errorAlert("Publish Failed", err.message || "Failed to publish blog post.");
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
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-slate-200"
          />
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2 shrink-0">
          <FiPlus className="h-4.5 w-4.5" />
          Add Blog Post
        </Button>
      </div>

      {/* Blogs Table */}
      {isLoading ? (
        <TableSkeleton rows={6} columns={4} />
      ) : isError ? (
        <div className="py-12 text-center text-destructive">
          Failed to load blog posts list data.
        </div>
      ) : blogs.length === 0 ? (
        <NoBlogsFound />
      ) : (
        <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="p-4">Cover</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Author & Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="p-4">
                      <div className="relative h-12 w-20 overflow-hidden rounded-lg bg-slate-100">
                        {blog.thumbnail && (
                          <img
                            src={blog.thumbnail}
                            alt={blog.title}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-900 line-clamp-1">{blog.title}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-slate-700">By {blog.author}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(blog.createdAt)}</div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenModal(blog)}
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <FiEdit className="h-4.5 w-4.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(blog._id)}
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

      {/* CRUD Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl border border-slate-100 space-y-6"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-3 border-b">
                <h3 className="text-lg font-bold text-slate-900">
                  {editingBlog ? "Edit Blog Post Details" : "Create New Blog Post"}
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
                  <Label htmlFor="title">Article Title</Label>
                  <Input id="title" {...register("title")} className="border-slate-200" />
                  {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="author">Author Name</Label>
                  <Input id="author" {...register("author")} className="border-slate-200" />
                  {errors.author && <p className="text-xs text-red-500">{errors.author.message}</p>}
                </div>

                {/* Cover Photo upload */}
                <div className="space-y-2">
                  <Label>Thumbnail Cover Photo</Label>
                  {imageUrl ? (
                    <div className="relative h-32 w-56 group rounded-lg overflow-hidden border">
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
                    <label className="flex h-32 w-56 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors">
                      <FiUpload className="h-6 w-6 text-slate-400" />
                      <span className="text-xs text-slate-400 mt-2">Upload Cover Image</span>
                      <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                    </label>
                  )}
                  {isUploading && <p className="text-xs text-muted-foreground">Uploading image...</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="content">Content</Label>
                  <Textarea id="content" rows={8} {...register("content")} className="border-slate-200" />
                  {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
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
                      "Save Article"
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
