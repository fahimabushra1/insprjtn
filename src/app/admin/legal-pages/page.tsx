"use client";

import Link from "next/link";
import { FiPlus, FiEdit2, FiTrash2, FiFileText, FiCheck, FiX, FiExternalLink } from "react-icons/fi";
import { useAdminLegals, useUpdateLegal, useDeleteLegal } from "@/hooks/useLegals";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";
import { useSuccessAlert } from "@/hooks/useSuccessAlert";
import { useErrorAlert } from "@/hooks/useErrorAlert";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function AdminLegalPagesPage() {
  const successAlert = useSuccessAlert();
  const errorAlert = useErrorAlert();
  const confirmDelete = useDeleteConfirmation();

  const { data: legalsRes, isLoading, isError } = useAdminLegals();
  const updateMutation = useUpdateLegal();
  const deleteMutation = useDeleteLegal();

  const allPages = legalsRes?.data?.items || [];

  const handleTogglePublish = async (id: string, currentStatus: boolean, slug: string) => {
    try {
      await updateMutation.mutateAsync({
        id,
        data: { isPublished: !currentStatus, slug },
      });
      toast.success(
        currentStatus ? "Page unpublished successfully" : "Page published successfully"
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to update page status");
    }
  };

  const handleDelete = (id: string) => {
    confirmDelete(
      "Delete Legal Page?",
      async () => {
        try {
          await deleteMutation.mutateAsync(id);
          successAlert("Page Deleted", "The legal page has been deleted successfully.");
        } catch (err: any) {
          errorAlert("Deletion Failed", err.message || "Failed to delete the page.");
        }
      },
      "Are you sure you want to permanently delete this legal page? This cannot be undone."
    );
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your legal documents, privacy terms, refund rules, and cookies.
          </p>
        </div>
        <Button className="bg-emerald-700 hover:bg-emerald-800 text-white gap-2 rounded-xl" asChild>
          <Link href="/admin/legal-pages/new">
            <FiPlus className="h-4 w-4" /> Create Legal Page
          </Link>
        </Button>
      </div>

      {/* Table view */}
      {isLoading ? (
        <TableSkeleton rows={4} columns={5} />
      ) : isError ? (
        <div className="py-12 text-center text-destructive">
          Failed to load legal pages. Please try again.
        </div>
      ) : allPages.length === 0 ? (
        <div className="py-16 text-center rounded-xl border border-dashed text-muted-foreground bg-white">
          <FiFileText className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No Legal Pages Found</h3>
          <p className="text-sm mt-1">Click the button above to create your first page.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="p-4">Title</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Published Status</th>
                  <th className="p-4">Last Updated</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allPages.map((page: any) => (
                  <tr key={page._id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="p-4 font-semibold text-slate-900">{page.title}</td>
                    <td className="p-4">
                      <code className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                        /{page.slug}
                      </code>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleTogglePublish(page._id, page.isPublished, page.slug)}
                        className="focus:outline-none"
                      >
                        <Badge
                          variant={page.isPublished ? "success" : "warning"}
                          className="capitalize flex items-center gap-1 cursor-pointer"
                        >
                          {page.isPublished ? (
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
                    <td className="p-4 text-slate-500 text-xs">
                      {formatDate(page.updatedAt)}
                      {page.updatedBy?.name && (
                        <div className="text-[10px] text-muted-foreground">
                          By: {page.updatedBy.name}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                          asChild
                        >
                          <Link href={`/${page.slug}`} target="_blank">
                            <FiExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                          asChild
                        >
                          <Link href={`/admin/legal-pages/edit/${page._id}`}>
                            <FiEdit2 className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(page._id)}
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
      )}
    </div>
  );
}
