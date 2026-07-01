"use client";

import React, { useState } from "react";
import { usePlaces, useCreatePlace, useUpdatePlace, useDeletePlace } from "@/hooks/useMap";
import { FiCompass, FiPlus, FiTrash2, FiEdit, FiMapPin, FiAnchor } from "react-icons/fi";
import { useSuccessAlert } from "@/hooks/useSuccessAlert";
import { useErrorAlert } from "@/hooks/useErrorAlert";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";
import FullPageLoader from "@/components/loaders/FullPageLoader";
import ButtonLoader from "@/components/loaders/ButtonLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AdminMapPage() {
  const successAlert = useSuccessAlert();
  const errorAlert = useErrorAlert();
  const confirmDelete = useDeleteConfirmation();

  // Queries
  const { data: placesRes, isLoading } = usePlaces();
  const places = placesRes?.data || [];

  // Mutations
  const createPlace = useCreatePlace();
  const updatePlace = useUpdatePlace();
  const deletePlace = useDeletePlace();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<any>(null);

  // Form State
  const [form, setForm] = useState({
    name: "",
    nameBn: "",
    latitude: 22.0,
    longitude: 89.6,
    category: "spot" as any,
    description: "",
    history: "",
    featuredImage: "",
    gallery: [] as string[],
    bestSeason: "November to February",
    travelTime: "6 hours from Mongla",
    distance: "80 km",
    boatTime: "6 hours",
    wildlife: {
      tiger: 0,
      deer: 0,
      crocodile: 0,
      dolphin: 0,
      birds: 0,
    },
    tips: [] as string[],
    featured: false,
  });

  const [rawTips, setRawTips] = useState("");
  const [rawGallery, setRawGallery] = useState("");

  if (isLoading) {
    return <FullPageLoader />;
  }

  const handleOpenAddModal = () => {
    setEditingPlace(null);
    setForm({
      name: "",
      nameBn: "",
      latitude: 22.0,
      longitude: 89.6,
      category: "spot",
      description: "",
      history: "",
      featuredImage: "",
      gallery: [],
      bestSeason: "November to February",
      travelTime: "6 hours from Mongla",
      distance: "80 km",
      boatTime: "6 hours",
      wildlife: { tiger: 0, deer: 0, crocodile: 0, dolphin: 0, birds: 0 },
      tips: [],
      featured: false,
    });
    setRawTips("");
    setRawGallery("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (place: any) => {
    setEditingPlace(place);
    setForm({
      name: place.name,
      nameBn: place.nameBn,
      latitude: place.latitude,
      longitude: place.longitude,
      category: place.category,
      description: place.description,
      history: place.history || "",
      featuredImage: place.featuredImage || "",
      gallery: place.gallery || [],
      bestSeason: place.bestSeason || "",
      travelTime: place.travelTime || "",
      distance: place.distance || "",
      boatTime: place.boatTime || "",
      wildlife: {
        tiger: place.wildlife?.tiger ?? 0,
        deer: place.wildlife?.deer ?? 0,
        crocodile: place.wildlife?.crocodile ?? 0,
        dolphin: place.wildlife?.dolphin ?? 0,
        birds: place.wildlife?.birds ?? 0,
      },
      tips: place.tips || [],
      featured: place.featured || false,
    });
    setRawTips((place.tips || []).join("\n"));
    setRawGallery((place.gallery || []).join("\n"));
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    confirmDelete(
      "Remove Destination?",
      async () => {
        try {
          await deletePlace.mutateAsync(id);
          successAlert("Destination deleted successfully!");
        } catch (err: any) {
          errorAlert(err.message || "Failed to delete spot");
        }
      },
      "Are you sure you want to delete this place? It will be removed from the interactive map routes immediately."
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse arrays
    const parsedTips = rawTips.split("\n").map(t => t.trim()).filter(Boolean);
    const parsedGallery = rawGallery.split("\n").map(g => g.trim()).filter(Boolean);

    const submissionData = {
      ...form,
      tips: parsedTips,
      gallery: parsedGallery,
    };

    try {
      if (editingPlace) {
        await updatePlace.mutateAsync({ id: editingPlace._id, data: submissionData });
        successAlert("Destination updated successfully!");
      } else {
        await createPlace.mutateAsync(submissionData);
        successAlert("Destination created successfully!");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      errorAlert(err.message || "Operation failed. Check coordinate fields.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex justify-between items-center bg-white border rounded-2xl p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <FiCompass className="text-primary" />
            <span>Map Coordinates Coordinator</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Configure map gateway positions, wildlife chances, historical notices, and tour spot highlights.
          </p>
        </div>
        <Button onClick={handleOpenAddModal} className="rounded-xl flex items-center gap-1">
          <FiPlus />
          <span>Add Custom Spot</span>
        </Button>
      </div>

      {/* Destinations List */}
      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50 border-b text-xs font-bold text-slate-500 uppercase">
            <tr>
              <th className="px-6 py-3">Destination Stop</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">GPS Coordinates</th>
              <th className="px-6 py-3">Travel Specs</th>
              <th className="px-6 py-3">Tigers</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {places.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-muted-foreground">No destinations found. Seed the database first.</td>
              </tr>
            ) : (
              places.map((place: any) => (
                <tr key={place._id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {place.featuredImage && (
                        <img src={place.featuredImage} alt={place.name} className="h-10 w-14 object-cover rounded border" />
                      )}
                      <div>
                        <div className="font-bold text-slate-800 flex items-center gap-1">
                          <span>{place.name}</span>
                          {place.featured && <span className="text-[9px] bg-primary/10 text-primary px-1 rounded">Featured</span>}
                        </div>
                        <div className="text-xs text-muted-foreground">{place.nameBn}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                      place.category === "gateway" ? "bg-emerald-100 text-emerald-800 font-bold" : "bg-slate-100 text-slate-700"
                    }`}>
                      {place.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-600">
                    {place.latitude}, {place.longitude}
                  </td>
                  <td className="px-6 py-4 text-xs font-medium">
                    <div>📍 {place.distance}</div>
                    <div className="text-muted-foreground mt-0.5">⏱ {place.travelTime}</div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-red-600">
                    {"★".repeat(place.wildlife?.tiger ?? 0)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleOpenEditModal(place)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <FiEdit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(place._id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-emerald-950 text-white p-6">
              <h2 className="text-lg font-black flex items-center gap-2">
                <FiCompass />
                <span>
                  {editingPlace ? "Modify Spot Specs" : "Add Custom Destination Spot"}
                </span>
              </h2>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Destination Name (English) *</label>
                  <Input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Katka Watchtower"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Destination Name (Bangla) *</label>
                  <Input
                    required
                    value={form.nameBn}
                    onChange={(e) => setForm({ ...form, nameBn: e.target.value })}
                    placeholder="যেমন: কটকা ওয়াচ টাওয়ার"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Latitude Coordinates *</label>
                  <Input
                    required
                    type="number"
                    step="0.0001"
                    value={form.latitude}
                    onChange={(e) => setForm({ ...form, latitude: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Longitude Coordinates *</label>
                  <Input
                    required
                    type="number"
                    step="0.0001"
                    value={form.longitude}
                    onChange={(e) => setForm({ ...form, longitude: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e: any) => setForm({ ...form, category: e.target.value })}
                    className="w-full border rounded-lg p-2 text-sm bg-white h-10"
                  >
                    <option value="spot">Tourist Spot</option>
                    <option value="gateway">Entry Gateway</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Distance Description</label>
                  <Input
                    value={form.distance}
                    onChange={(e) => setForm({ ...form, distance: e.target.value })}
                    placeholder="e.g. 80 km from Khulna"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Travel Time Description</label>
                  <Input
                    value={form.travelTime}
                    onChange={(e) => setForm({ ...form, travelTime: e.target.value })}
                    placeholder="e.g. 6 hours from Mongla"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t pt-4 border-slate-100">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Featured Image URL</label>
                  <Input
                    value={form.featuredImage}
                    onChange={(e) => setForm({ ...form, featuredImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Best Season Visit</label>
                  <Input
                    value={form.bestSeason}
                    onChange={(e) => setForm({ ...form, bestSeason: e.target.value })}
                    placeholder="e.g. November to February"
                  />
                </div>
              </div>

              <div className="space-y-1 border-t pt-4 border-slate-100">
                <label className="text-xs font-bold text-slate-500">Description *</label>
                <Textarea
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Primary visitor description..."
                  rows={3}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Historical / UNESCO details</label>
                <Textarea
                  value={form.history}
                  onChange={(e) => setForm({ ...form, history: e.target.value })}
                  placeholder="History of Khan Jahan Ali or spot background..."
                  rows={2}
                />
              </div>

              {/* Wildlife ratings slider-like inputs */}
              <div className="border-t pt-4 border-slate-100 space-y-2">
                <label className="text-xs font-black uppercase text-slate-700">Wildlife Sighting Ratings (0-5 Stars)</label>
                <div className="grid grid-cols-5 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-500 block mb-1">🐅 Tigers</label>
                    <Input
                      type="number"
                      min={0}
                      max={5}
                      value={form.wildlife.tiger}
                      onChange={(e) => setForm({ ...form, wildlife: { ...form.wildlife, tiger: parseInt(e.target.value) || 0 } })}
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-500 block mb-1">Deer</label>
                    <Input
                      type="number"
                      min={0}
                      max={5}
                      value={form.wildlife.deer}
                      onChange={(e) => setForm({ ...form, wildlife: { ...form.wildlife, deer: parseInt(e.target.value) || 0 } })}
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-500 block mb-1">Croc</label>
                    <Input
                      type="number"
                      min={0}
                      max={5}
                      value={form.wildlife.crocodile}
                      onChange={(e) => setForm({ ...form, wildlife: { ...form.wildlife, crocodile: parseInt(e.target.value) || 0 } })}
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-500 block mb-1">Dolphins</label>
                    <Input
                      type="number"
                      min={0}
                      max={5}
                      value={form.wildlife.dolphin}
                      onChange={(e) => setForm({ ...form, wildlife: { ...form.wildlife, dolphin: parseInt(e.target.value) || 0 } })}
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-500 block mb-1">Birds</label>
                    <Input
                      type="number"
                      min={0}
                      max={5}
                      value={form.wildlife.birds}
                      onChange={(e) => setForm({ ...form, wildlife: { ...form.wildlife, birds: parseInt(e.target.value) || 0 } })}
                    />
                  </div>
                </div>
              </div>

              {/* Multiple Lines Inputs */}
              <div className="grid grid-cols-2 gap-4 border-t pt-4 border-slate-100">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Travel Tips (One tip per line)</label>
                  <Textarea
                    value={rawTips}
                    onChange={(e) => setRawTips(e.target.value)}
                    placeholder="e.g. Hire forest guard with arms&#10;Bring sand shoes"
                    rows={3}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Gallery Image Links (One URL per line)</label>
                  <Textarea
                    value={rawGallery}
                    onChange={(e) => setRawGallery(e.target.value)}
                    placeholder="https://images.unsplash.com/img1&#10;https://images.unsplash.com/img2"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-2 items-center border-t pt-4">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="rounded text-primary focus:ring-primary border-slate-300"
                />
                <label htmlFor="featured" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Feature this place on the Homepage Map preview widget
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 border-t pt-4 mt-6">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {createPlace.isPending || updatePlace.isPending ? <ButtonLoader /> : <span>Save Destination</span>}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
