"use client";

import { useState } from "react";
import { FiSearch, FiShield, FiTrash2, FiUser } from "react-icons/fi";
import { useUsers, useUpdateUserRole, useDeleteUser } from "@/hooks/useUsers";
import { useAuth } from "@/hooks/useAuth";
import { useSuccessAlert } from "@/hooks/useSuccessAlert";
import { useErrorAlert } from "@/hooks/useErrorAlert";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/format";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const { user: currentUser } = useAuth();
  
  const successAlert = useSuccessAlert();
  const errorAlert = useErrorAlert();
  const confirmDelete = useDeleteConfirmation();

  // Queries & Mutations
  const { data: usersRes, isLoading, isError } = useUsers({ search });
  const updateRoleMutation = useUpdateUserRole();
  const deleteMutation = useDeleteUser();

  const users = usersRes?.data?.items || [];

  const handleToggleRole = (user) => {
    if (user._id === currentUser?._id) {
      errorAlert("Action Forbidden", "You cannot modify your own administrator role!");
      return;
    }

    const newRole = user.role === "admin" ? "customer" : "admin";
    updateRoleMutation.mutate(
      { id: user._id, role: newRole },
      {
        onSuccess: () => {
          successAlert("Role Updated", `${user.name} is now marked as ${newRole}.`);
        },
        onError: (err) => {
          errorAlert("Role Update Failed", err.message || "Failed to toggle user role.");
        },
      }
    );
  };

  const handleDeleteUser = (user) => {
    if (user._id === currentUser?._id) {
      errorAlert("Action Forbidden", "You cannot delete your own account!");
      return;
    }

    confirmDelete("Delete User Account", () => {
      deleteMutation.mutate(user._id, {
        onSuccess: () => {
          successAlert("Account Deleted", "The user profile has been removed.");
        },
        onError: (err) => {
          errorAlert("Deletion Failed", err.message || "Failed to remove user account.");
        },
      });
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-sm">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 border-slate-200"
        />
      </div>

      {/* Users table */}
      {isLoading ? (
        <TableSkeleton rows={6} columns={5} />
      ) : isError ? (
        <div className="py-12 text-center text-destructive">
          Failed to load users database records.
        </div>
      ) : users.length === 0 ? (
        <div className="py-16 text-center rounded-xl border border-dashed text-muted-foreground">
          No users match your criteria.
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Registered Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((userItem) => (
                  <tr key={userItem._id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-emerald-600/10">
                          <AvatarImage src={userItem.photo} alt={userItem.name} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            <FiUser />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-slate-900">
                            {userItem.name}{" "}
                            {userItem._id === currentUser?._id && (
                              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-medium ml-1.5">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">{userItem.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-700 font-medium">
                      {userItem.phone || <span className="text-slate-400">N/A</span>}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={userItem.role === "admin" ? "success" : "secondary"}
                        className="capitalize"
                      >
                        {userItem.role}
                      </Badge>
                    </td>
                    <td className="p-4 text-slate-500 text-xs">
                      {formatDate(userItem.createdAt)}
                    </td>
                    <td className="p-4 text-right">
                      {userItem._id !== currentUser?._id ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleRole(userItem)}
                            className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 h-8 gap-1"
                          >
                            <FiShield className="h-3.5 w-3.5" />
                            Toggle Role
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteUser(userItem)}
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <FiTrash2 className="h-4.5 w-4.5" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium pr-4">Admin Self</span>
                      )}
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
