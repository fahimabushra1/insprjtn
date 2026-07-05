"use client";

import { useState } from "react";
import Link from "next/link";
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiHelpCircle, FiCheck, FiX, FiArrowUp, FiArrowDown } from "react-icons/fi";
import { useFaqs, useUpdateFaq, useDeleteFaq } from "@/hooks/useFaqs";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";
import { useSuccessAlert } from "@/hooks/useSuccessAlert";
import { useErrorAlert } from "@/hooks/useErrorAlert";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function AdminFaqsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);

  const successAlert = useSuccessAlert();
  const errorAlert = useErrorAlert();
  const confirmDelete = useDeleteConfirmation();

  const { data: faqsRes, isLoading, isError } = useFaqs({
    page,
    limit: 10,
    search,
    category: categoryFilter,
  });

  const updateMutation = useUpdateFaq();
  const deleteMutation = useDeleteFaq();

  const allFaqs = faqsRes?.data?.items || [];
  const pagination = faqsRes?.data?.pagination || { page: 1, totalPages: 1, total: 0 };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await updateMutation.mutateAsync({
        id,
        data: { isPublished: !currentStatus },
      });
      toast.success(
        currentStatus ? "FAQ unpublished successfully" : "FAQ published successfully"
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to update FAQ status");
    }
  };

  const handleUpdateOrder = async (id: string, currentOrder: number, change: number) => {
    const newOrder = currentOrder + change;
    try {
      await updateMutation.mutateAsync({
        id,
        data: { order: newOrder },
      });
      toast.success("Order updated");
    } catch (err: any) {
      toast.error("Failed to update order");
    }
  };

  const handleDelete = (id: string) => {
    confirmDelete(
      "Delete FAQ?",
      async () => {
        try {
          await deleteMutation.mutateAsync(id);
          successAlert("FAQ Deleted", "The FAQ has been deleted successfully.");
        } catch (err: any) {
          errorAlert("Deletion Failed", err.message || "Failed to delete the FAQ.");
        }
      },
      "Are you sure you want to permanently delete this FAQ item?"
    );
  };

  const categories = ["all", "General & Bookings", "Travel & Forest Safety", "Preparation & Clothing"];

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your customer support questions, answers, and sort order.
          </p>
        </div>
        <Button className="bg-emerald-700 hover:bg-emerald-800 text-white gap-2 rounded-xl" asChild>
          <Link href="/admin/faqs/new">
            <FiPlus className="h-4 w-4" /> Add FAQ
          </Link>
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl border">
        <div className="relative max-w-sm flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search questions or answers..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 border-slate-200"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={categoryFilter === cat ? "default" : "outline"}
              onClick={() => {
                setCategoryFilter(cat);
                setPage(1);
              }}
              className="capitalize h-9 text-xs border-slate-200"
            >
              {cat === "all" ? "All Categories" : cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Table view */}
      {isLoading ? (
        <TableSkeleton rows={5} columns={5} />
      ) : isError ? (
        <div className="py-12 text-center text-destructive">
          Failed to load FAQs data. Please try again.
        </div>
      ) : allFaqs.length === 0 ? (
        <div className="py-16 text-center rounded-xl border border-dashed text-muted-foreground bg-white">
          <FiHelpCircle className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No FAQs Found</h3>
          <p className="text-sm mt-1">Try adjusting your filters or search keywords.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="p-4 w-[40%]">Question</th>
                    <th className="p-4">Category</th>
                    <th className="p-4 text-center">Order</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allFaqs.map((faq: any) => (
                    <tr key={faq._id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-slate-900 line-clamp-2">{faq.question}</div>
                        <div
                          className="text-xs text-muted-foreground mt-1 line-clamp-1 prose max-w-none"
                          dangerouslySetInnerHTML={{ __html: faq.answer }}
                        />
                      </td>
                      <td className="p-4">
                        <span className="text-xs font-medium bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full">
                          {faq.category}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-500 hover:bg-slate-100"
                            onClick={() => handleUpdateOrder(faq._id, faq.order, -1)}
                          >
                            <FiArrowDown className="h-3.5 w-3.5" />
                          </Button>
                          <span className="font-bold text-slate-900 w-6 text-center">{faq.order}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-500 hover:bg-slate-100"
                            onClick={() => handleUpdateOrder(faq._id, faq.order, 1)}
                          >
                            <FiArrowUp className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleTogglePublish(faq._id, faq.isPublished)}
                          className="focus:outline-none"
                        >
                          <Badge
                            variant={faq.isPublished ? "success" : "warning"}
                            className="capitalize flex items-center gap-1 cursor-pointer"
                          >
                            {faq.isPublished ? (
                              <>
                                <FiCheck className="h-3 w-3" /> Published
                              </>
                            ) : (
                              <>
                                <FiX className="h-3 w-3" /> Draft
                              </>
                            )}
                          </Badge>
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50" asChild>
                            <Link href={`/admin/faqs/edit/${faq._id}`}>
                              <FiEdit2 className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(faq._id)}
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border text-sm">
              <span className="text-muted-foreground">
                Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total items)
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
