"use client";

import { useState } from "react";
import { FiSearch, FiTrash2, FiMail, FiCheckCircle, FiBookOpen } from "react-icons/fi";
import {
  useContactMessages,
  useUpdateContactStatus,
  useDeleteContactMessage,
} from "@/hooks/useContacts";
import { useSuccessAlert } from "@/hooks/useSuccessAlert";
import { useErrorAlert } from "@/hooks/useErrorAlert";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/format";

export default function AdminContactsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const successAlert = useSuccessAlert();
  const errorAlert = useErrorAlert();
  const confirmDelete = useDeleteConfirmation();

  // Queries & Mutations
  const { data: contactsRes, isLoading, isError } = useContactMessages();
  const updateStatusMutation = useUpdateContactStatus();
  const deleteMutation = useDeleteContactMessage();

  const allContacts = contactsRes?.data?.items || [];

  // Filter messages client-side
  const filteredContacts = allContacts.filter((contact) => {
    const matchesSearch =
      contact.name?.toLowerCase().includes(search.toLowerCase()) ||
      contact.email?.toLowerCase().includes(search.toLowerCase()) ||
      contact.phone?.toLowerCase().includes(search.toLowerCase()) ||
      contact.message?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || contact.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (id, status) => {
    updateStatusMutation.mutate(
      { id, status },
      {
        onSuccess: () => {
          successAlert("Status Updated", `Message marked as ${status}.`);
        },
        onError: (err) => {
          errorAlert("Update Failed", err.message || "Failed to update inquiry status.");
        },
      }
    );
  };

  const handleDelete = (id) => {
    confirmDelete("Delete Contact Message", () => {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          successAlert("Inquiry Removed", "Contact message deleted successfully.");
        },
        onError: (err) => {
          errorAlert("Deletion Failed", err.message || "Failed to delete contact message.");
        },
      });
    });
  };

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search inquiries content or sender..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-slate-200"
          />
        </div>
        <div className="flex gap-2">
          {["all", "pending", "read", "resolved"].map((filter) => (
            <Button
              key={filter}
              variant={statusFilter === filter ? "default" : "outline"}
              onClick={() => setStatusFilter(filter)}
              className="capitalize h-9 text-xs border-slate-200"
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages table list */}
      {isLoading ? (
        <TableSkeleton rows={6} columns={5} />
      ) : isError ? (
        <div className="py-12 text-center text-destructive">
          Failed to load contact messages.
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="py-16 text-center rounded-xl border border-dashed text-muted-foreground">
          No contact messages match your current filters.
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="p-4">Sender Info</th>
                  <th className="p-4">Message</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Received Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredContacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{contact.name}</div>
                      <div className="text-xs text-muted-foreground">{contact.email}</div>
                      <div className="text-xs font-medium text-slate-600 mt-0.5">{contact.phone}</div>
                    </td>
                    <td className="p-4 max-w-sm">
                      <p className="text-slate-700 text-xs leading-relaxed break-words whitespace-pre-wrap">
                        {contact.message}
                      </p>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          contact.status === "resolved"
                            ? "success"
                            : contact.status === "read"
                            ? "secondary"
                            : "warning"
                        }
                        className="capitalize"
                      >
                        {contact.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-slate-500 text-xs">
                      {formatDate(contact.createdAt)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {contact.status === "pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateStatus(contact._id, "read")}
                            className="text-slate-600 hover:text-slate-700 hover:bg-slate-50 h-8 gap-1"
                          >
                            <FiBookOpen className="h-3.5 w-3.5" />
                            Read
                          </Button>
                        )}
                        {contact.status !== "resolved" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateStatus(contact._id, "resolved")}
                            className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 h-8 gap-1"
                          >
                            <FiCheckCircle className="h-3.5 w-3.5" />
                            Resolve
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(contact._id)}
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
    </div>
  );
}
