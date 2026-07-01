"use client";

import React, { useState } from "react";
import { 
  useHolidays, useCreateHoliday, useUpdateHoliday, useDeleteHoliday,
  useAnnouncements, useCreateAnnouncement, useUpdateAnnouncement, useDeleteAnnouncement,
  useAvailabilities, useUpsertAvailability, useDeleteAvailability
} from "@/hooks/useCalendar";
import { FiCalendar, FiPlus, FiTrash2, FiEdit, FiAlertOctagon, FiTrendingUp } from "react-icons/fi";
import { useSuccessAlert } from "@/hooks/useSuccessAlert";
import { useErrorAlert } from "@/hooks/useErrorAlert";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";
import FullPageLoader from "@/components/loaders/FullPageLoader";
import ButtonLoader from "@/components/loaders/ButtonLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AdminCalendarPage() {
  const successAlert = useSuccessAlert();
  const errorAlert = useErrorAlert();
  const confirmDelete = useDeleteConfirmation();

  // Active Tab: "holidays" | "announcements" | "availability"
  const [activeTab, setActiveTab] = useState<string>("holidays");

  // Fetch queries
  const { data: holidaysRes, isLoading: holidaysLoading } = useHolidays();
  const { data: announcementsRes, isLoading: announcementsLoading } = useAnnouncements();
  const { data: availabilitiesRes, isLoading: availabilitiesLoading } = useAvailabilities();

  const holidays = holidaysRes?.data || [];
  const announcements = announcementsRes?.data || [];
  const availabilities = availabilitiesRes?.data || [];

  // Mutations
  const createHoliday = useCreateHoliday();
  const updateHoliday = useUpdateHoliday();
  const deleteHoliday = useDeleteHoliday();

  const createAnnouncement = useCreateAnnouncement();
  const updateAnnouncement = useUpdateAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();

  const upsertAvailability = useUpsertAvailability();
  const deleteAvailability = useDeleteAvailability();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form inputs
  const [holidayForm, setHolidayForm] = useState({
    title: "",
    titleBn: "",
    date: "",
    type: "national" as any,
    description: "",
    color: "#e11d48",
  });

  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    priority: "medium" as any,
  });

  const [availabilityForm, setAvailabilityForm] = useState({
    date: "",
    status: "available" as any,
    remainingSeats: 50,
    reason: "",
  });

  const isLoading = holidaysLoading || announcementsLoading || availabilitiesLoading;

  if (isLoading) {
    return <FullPageLoader />;
  }

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setHolidayForm({ title: "", titleBn: "", date: "", type: "national", description: "", color: "#e11d48" });
    setAnnouncementForm({ title: "", description: "", startDate: "", endDate: "", priority: "medium" });
    setAvailabilityForm({ date: "", status: "available", remainingSeats: 50, reason: "" });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    setEditingItem(item);
    if (activeTab === "holidays") {
      setHolidayForm({
        title: item.title,
        titleBn: item.titleBn || "",
        date: item.date,
        type: item.type,
        description: item.description || "",
        color: item.color || "#e11d48",
      });
    } else if (activeTab === "announcements") {
      setAnnouncementForm({
        title: item.title,
        description: item.description,
        startDate: item.startDate,
        endDate: item.endDate,
        priority: item.priority,
      });
    } else if (activeTab === "availability") {
      setAvailabilityForm({
        date: item.date,
        status: item.status,
        remainingSeats: item.remainingSeats ?? 50,
        reason: item.reason || "",
      });
    }
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (id: string) => {
    confirmDelete(
      "Are you absolutely sure?",
      async () => {
        try {
          if (activeTab === "holidays") {
            await deleteHoliday.mutateAsync(id);
          } else if (activeTab === "announcements") {
            await deleteAnnouncement.mutateAsync(id);
          } else if (activeTab === "availability") {
            await deleteAvailability.mutateAsync(id);
          }
          successAlert("Deleted successfully!");
        } catch (err: any) {
          errorAlert(err.message || "Failed to delete");
        }
      },
      "This action cannot be undone and will immediately reflect on the public website calendar."
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === "holidays") {
        if (editingItem) {
          await updateHoliday.mutateAsync({ id: editingItem._id, data: holidayForm });
          successAlert("Holiday updated successfully!");
        } else {
          await createHoliday.mutateAsync(holidayForm);
          successAlert("Holiday added successfully!");
        }
      } else if (activeTab === "announcements") {
        if (editingItem) {
          await updateAnnouncement.mutateAsync({ id: editingItem._id, data: announcementForm });
          successAlert("Announcement updated successfully!");
        } else {
          await createAnnouncement.mutateAsync(announcementForm);
          successAlert("Announcement posted successfully!");
        }
      } else if (activeTab === "availability") {
        // Upsert handles both
        await upsertAvailability.mutateAsync(availabilityForm);
        successAlert("Seating availability configured successfully!");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      errorAlert(err.message || "Operation failed. Check input parameters.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex justify-between items-center bg-white border rounded-2xl p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <FiCalendar className="text-primary" />
            <span>Calendar Coordinator</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Maintain public government holidays, forest department restrictions, and passenger limit notices.
          </p>
        </div>
        <Button onClick={handleOpenAddModal} className="rounded-xl flex items-center gap-1">
          <FiPlus />
          <span>Add Custom Item</span>
        </Button>
      </div>

      {/* Tabs list */}
      <div className="flex gap-2 border-b pb-1">
        {[
          { id: "holidays", label: "Govt Holidays" },
          { id: "announcements", label: "Forest Notices" },
          { id: "availability", label: "Seat Adjustments" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setIsModalOpen(false);
            }}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
              activeTab === tab.id
                ? "border-primary text-primary font-black"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main List Table */}
      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        {activeTab === "holidays" && (
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 border-b text-xs font-bold text-slate-500 uppercase">
              <tr>
                <th className="px-6 py-3">Holiday Date</th>
                <th className="px-6 py-3">Title (EN / BN)</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Color Code</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {holidays.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-muted-foreground">No holidays created. Click Add to insert.</td>
                </tr>
              ) : (
                holidays.map((h: any) => (
                  <tr key={h._id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-black">{h.date}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{h.title}</div>
                      <div className="text-xs text-muted-foreground">{h.titleBn || "No Bangla title"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs uppercase font-bold text-slate-600">
                        {h.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full border shadow-sm inline-block" style={{ backgroundColor: h.color }} />
                      <span className="text-xs uppercase">{h.color}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenEditModal(h)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                          <FiEdit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteItem(h._id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {activeTab === "announcements" && (
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 border-b text-xs font-bold text-slate-500 uppercase">
              <tr>
                <th className="px-6 py-3">Sailing Notice</th>
                <th className="px-6 py-3">Display Duration</th>
                <th className="px-6 py-3">Priority</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {announcements.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-muted-foreground">No forest notices posted.</td>
                </tr>
              ) : (
                announcements.map((a: any) => (
                  <tr key={a._id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{a.title}</div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 max-w-lg">{a.description}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                      {a.startDate} to {a.endDate}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${
                        a.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : a.priority === "medium"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {a.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenEditModal(a)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                          <FiEdit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteItem(a._id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {activeTab === "availability" && (
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 border-b text-xs font-bold text-slate-500 uppercase">
              <tr>
                <th className="px-6 py-3">Calendar Date</th>
                <th className="px-6 py-3">Booking Status</th>
                <th className="px-6 py-3">Seats remaining</th>
                <th className="px-6 py-3">Override Reason</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {availabilities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-muted-foreground">No date overrides registered.</td>
                </tr>
              ) : (
                availabilities.map((v: any) => (
                  <tr key={v._id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-black">{v.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-black uppercase ${
                        v.status === "available"
                          ? "bg-emerald-100 text-emerald-800"
                          : v.status === "limited"
                          ? "bg-amber-100 text-amber-800"
                          : v.status === "full"
                          ? "bg-red-100 text-red-800"
                          : "bg-slate-800 text-white"
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-xs">{v.remainingSeats} Seats</td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">{v.reason || "N/A"}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenEditModal(v)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                          <FiEdit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteItem(v.date)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-emerald-950 text-white p-6">
              <h2 className="text-lg font-black flex items-center gap-2">
                <FiCalendar />
                <span>
                  {editingItem ? "Update Detail Element" : "Insert Custom Detail Block"} ({activeTab})
                </span>
              </h2>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {activeTab === "holidays" && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Holiday Title (English) *</label>
                    <Input
                      required
                      value={holidayForm.title}
                      onChange={(e) => setHolidayForm({ ...holidayForm, title: e.target.value })}
                      placeholder="e.g. Independence Day"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Holiday Title (Bangla)</label>
                    <Input
                      value={holidayForm.titleBn}
                      onChange={(e) => setHolidayForm({ ...holidayForm, titleBn: e.target.value })}
                      placeholder="যেমন: স্বাধীনতা দিবস"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Date *</label>
                      <Input
                        required
                        type="date"
                        value={holidayForm.date}
                        onChange={(e) => setHolidayForm({ ...holidayForm, date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Type *</label>
                      <select
                        value={holidayForm.type}
                        onChange={(e: any) => setHolidayForm({ ...holidayForm, type: e.target.value })}
                        className="w-full border rounded-lg p-2 text-sm bg-white"
                      >
                        <option value="national">National Holiday</option>
                        <option value="religious">Religious Holiday</option>
                        <option value="festival">Festival</option>
                        <option value="weekend">Weekend</option>
                        <option value="long-weekend">Long Weekend</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Hex Color</label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={holidayForm.color}
                          onChange={(e) => setHolidayForm({ ...holidayForm, color: e.target.value })}
                          className="h-10 w-12 p-1"
                        />
                        <Input
                          value={holidayForm.color}
                          onChange={(e) => setHolidayForm({ ...holidayForm, color: e.target.value })}
                          placeholder="#e11d48"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Description</label>
                    <Textarea
                      value={holidayForm.description}
                      onChange={(e) => setHolidayForm({ ...holidayForm, description: e.target.value })}
                      placeholder="Optional information about the celebration"
                    />
                  </div>
                </>
              )}

              {activeTab === "announcements" && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Notice Title *</label>
                    <Input
                      required
                      value={announcementForm.title}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                      placeholder="e.g. Sailing Cancelled at Dublar Char"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Publish Date *</label>
                      <Input
                        required
                        type="date"
                        value={announcementForm.startDate}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, startDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Expiration Date *</label>
                      <Input
                        required
                        type="date"
                        value={announcementForm.endDate}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Priority Level</label>
                    <select
                      value={announcementForm.priority}
                      onChange={(e: any) => setAnnouncementForm({ ...announcementForm, priority: e.target.value })}
                      className="w-full border rounded-lg p-2 text-sm bg-white"
                    >
                      <option value="low">Low (Standard Warning)</option>
                      <option value="medium">Medium (Important)</option>
                      <option value="high">High (Immediate Forest Closure)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Full Description *</label>
                    <Textarea
                      required
                      value={announcementForm.description}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, description: e.target.value })}
                      placeholder="Explain restrictions or weather warning details..."
                      rows={4}
                    />
                  </div>
                </>
              )}

              {activeTab === "availability" && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Calendar Date *</label>
                    <Input
                      required
                      type="date"
                      disabled={!!editingItem} // date is primary key
                      value={availabilityForm.date}
                      onChange={(e) => setAvailabilityForm({ ...availabilityForm, date: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Booking Status *</label>
                      <select
                        value={availabilityForm.status}
                        onChange={(e: any) => setAvailabilityForm({ ...availabilityForm, status: e.target.value })}
                        className="w-full border rounded-lg p-2 text-sm bg-white"
                      >
                        <option value="available">Available (🟢 Green)</option>
                        <option value="limited">Limited Seats (🟡 Yellow)</option>
                        <option value="full">Fully Booked (🔴 Red)</option>
                        <option value="closed">Forest Closed (⚫ Black)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500">Remaining Seats</label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={availabilityForm.remainingSeats}
                        onChange={(e) => setAvailabilityForm({ ...availabilityForm, remainingSeats: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Override Reason / Announcement Note</label>
                    <Textarea
                      value={availabilityForm.reason}
                      onChange={(e) => setAvailabilityForm({ ...availabilityForm, reason: e.target.value })}
                      placeholder="e.g. Fully Booked by group tour, or Forest Department research week"
                    />
                  </div>
                </>
              )}

              {/* Form Buttons */}
              <div className="flex justify-end gap-2 border-t pt-4 mt-6">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {createHoliday.isPending || createAnnouncement.isPending || upsertAvailability.isPending ? (
                    <ButtonLoader />
                  ) : (
                    <span>Save Configuration</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
