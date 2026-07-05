"use client";

import { useEffect, useRef, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiArrowLeft, FiSave, FiBold, FiItalic, FiList, FiLink, FiGlobe, FiClock } from "react-icons/fi";
import Link from "next/link";
import { useAdminLegals, useUpdateLegal } from "@/hooks/useLegals";
import { useSuccessAlert } from "@/hooks/useSuccessAlert";
import { useErrorAlert } from "@/hooks/useErrorAlert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ButtonLoader from "@/components/loaders/ButtonLoader";
import FullPageLoader from "@/components/loaders/FullPageLoader";
import { CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import api from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

const legalFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  content: z.string().min(1, "Content is required"),
  isPublished: z.boolean().default(true),
  seoTitle: z.string().optional().default(""),
  seoDescription: z.string().optional().default(""),
  ogTitle: z.string().optional().default(""),
  ogDescription: z.string().optional().default(""),
  ogImage: z.string().optional().default(""),
  canonicalUrl: z.string().optional().default(""),
});

type Props = { params: Promise<{ id: string }> };

export default function EditLegalPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const successAlert = useSuccessAlert();
  const errorAlert = useErrorAlert();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(false);
  const [autosaveTime, setAutosaveTime] = useState<string | null>(null);
  const [isAutosaving, setIsAutosaving] = useState(false);

  const updateMutation = useUpdateLegal();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(legalFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      isPublished: true,
      seoTitle: "",
      seoDescription: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      canonicalUrl: "",
    },
  });

  const isPublishedVal = watch("isPublished");
  const contentVal = watch("content");
  const formData = watch();

  // 1. Fetch original content
  useEffect(() => {
    async function loadPage() {
      try {
        const response = await api.get(API_ENDPOINTS.LEGALS.ADMIN_BY_ID(id));
        const pData = response.data?.data;
        if (pData) {
          reset({
            title: pData.title,
            slug: pData.slug,
            content: pData.content,
            isPublished: pData.isPublished,
            seoTitle: pData.seoTitle || "",
            seoDescription: pData.seoDescription || "",
            ogTitle: pData.ogTitle || "",
            ogDescription: pData.ogDescription || "",
            ogImage: pData.ogImage || "",
            canonicalUrl: pData.canonicalUrl || "",
          });
        }
        setPageLoading(false);
      } catch (err) {
        console.error("Failed to load legal page:", err);
        setPageError(true);
        setPageLoading(false);
      }
    }
    loadPage();
  }, [id, reset]);

  // Ref tracking current dirty state and form data for autosave closure
  const autosaveStateRef = useRef({ isDirty, formData });
  useEffect(() => {
    autosaveStateRef.current = { isDirty, formData };
  }, [isDirty, formData]);

  // 2. Autosave timer - fires every 30 seconds if changes exist
  useEffect(() => {
    const timer = setInterval(async () => {
      const state = autosaveStateRef.current;
      if (state.isDirty && state.formData.title) {
        try {
          setIsAutosaving(true);
          await api.put(API_ENDPOINTS.LEGALS.ADMIN_BY_ID(id), state.formData);
          // Update the form's dirty state in react-hook-form to match saved values
          reset(state.formData);
          const nowStr = new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
          setAutosaveTime(nowStr);
        } catch (err) {
          console.error("Autosave error:", err);
        } finally {
          setIsAutosaving(false);
        }
      }
    }, 30000);

    return () => clearInterval(timer);
  }, [id, reset]);

  const insertTag = (before: string, after: string = "") => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = before + selected + after;

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    setValue("content", newValue, { shouldValidate: true, shouldDirty: true });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 50);
  };

  const onSubmit = async (data: any) => {
    try {
      await updateMutation.mutateAsync({ id, data });
      successAlert("Page Saved", "Legal page details have been saved successfully.");
      router.push("/admin/legal-pages");
    } catch (err: any) {
      errorAlert("Save Failed", err.message || "Failed to update legal page.");
    }
  };

  if (pageLoading) {
    return <FullPageLoader />;
  }

  if (pageError) {
    return (
      <div className="py-12 text-center text-destructive">
        Failed to load legal page details. Please go back and try again.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-xl border" asChild>
            <Link href="/admin/legal-pages">
              <FiArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Edit Legal Page</h1>
            <p className="text-xs text-muted-foreground">Modify terms, conditions, privacy rules, or cookie guidelines.</p>
          </div>
        </div>

        {/* Autosave Indicator */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-slate-100/80 border px-3 py-1.5 rounded-xl self-start sm:self-auto font-medium">
          <FiClock className="h-3.5 w-3.5 text-emerald-700" />
          {isAutosaving ? (
            <span>Saving draft...</span>
          ) : autosaveTime ? (
            <span>Draft autosaved at {autosaveTime}</span>
          ) : (
            <span>Autosaves draft every 30s</span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="editor" className="space-y-6">
          <TabsList className="bg-slate-100 p-1 rounded-xl">
            <TabsTrigger value="editor" className="rounded-lg">
              Page Content
            </TabsTrigger>
            <TabsTrigger value="seo" className="rounded-lg">
              SEO & Metadata
            </TabsTrigger>
          </TabsList>

          {/* PAGE CONTENT TAB */}
          <TabsContent value="editor">
            <CardContent className="bg-white border rounded-2xl p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Page Title</Label>
                  <Input
                    id="title"
                    className="border-slate-200"
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-xs font-semibold text-destructive">{errors.title.message}</p>
                  )}
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL path)</Label>
                  <div className="flex rounded-lg border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-emerald-700 focus-within:border-emerald-700">
                    <span className="bg-slate-50 border-r px-3 flex items-center text-xs text-muted-foreground font-medium select-none">
                      /
                    </span>
                    <input
                      id="slug"
                      className="flex-1 px-3 py-2 text-sm focus:outline-none bg-slate-50 cursor-not-allowed"
                      readOnly
                      {...register("slug")}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">URL slug cannot be modified for seeded policies to prevent broken routes.</p>
                  {errors.slug && (
                    <p className="text-xs font-semibold text-destructive">{errors.slug.message}</p>
                  )}
                </div>
              </div>

              {/* Rich-Text Toolbar and Content Textarea */}
              <div className="space-y-2">
                <Label htmlFor="content">Rich Content (HTML Format)</Label>

                {/* Toolbar */}
                <div className="flex items-center gap-1.5 p-2 border border-slate-200 border-b-0 rounded-t-xl bg-slate-50/50 flex-wrap">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 font-bold text-xs"
                    onClick={() => insertTag("<h2>", "</h2>")}
                  >
                    H2
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 font-bold text-xs"
                    onClick={() => insertTag("<h3>", "</h3>")}
                  >
                    H3
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-slate-600 font-semibold"
                    onClick={() => insertTag("<strong>", "</strong>")}
                  >
                    <FiBold className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-slate-600 italic font-semibold"
                    onClick={() => insertTag("<em>", "</em>")}
                  >
                    <FiItalic className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-slate-600 font-semibold"
                    onClick={() => insertTag("<p>", "</p>")}
                  >
                    Paragraph
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-slate-600 font-semibold"
                    onClick={() => insertTag("<ul>\n  <li>", "</li>\n  <li></li>\n</ul>")}
                  >
                    <FiList className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-slate-600 font-semibold"
                    onClick={() => insertTag('<a href="#" target="_blank" class="text-primary hover:underline">', "</a>")}
                  >
                    <FiLink className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-slate-600 font-semibold"
                    onClick={() =>
                      insertTag(
                        '<table class="w-full border-collapse border my-4">\n  <thead>\n    <tr class="bg-slate-50">\n      <th class="border p-2">Col 1</th>\n      <th class="border p-2">Col 2</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td class="border p-2">Val 1</td>\n      <td class="border p-2">Val 2</td>\n    </tr>\n  </tbody>\n</table>'
                      )
                    }
                  >
                    Table
                  </Button>
                </div>

                <textarea
                  id="content"
                  ref={(e) => {
                    register("content").ref(e);
                    (contentRef as any).current = e;
                  }}
                  rows={14}
                  className="w-full rounded-b-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm font-mono"
                  onChange={(e) => setValue("content", e.target.value, { shouldValidate: true, shouldDirty: true })}
                  value={contentVal}
                />
                {errors.content && (
                  <p className="text-xs font-semibold text-destructive">{errors.content.message}</p>
                )}
              </div>

              {/* Publish checkbox */}
              <div className="flex items-center gap-2">
                <input
                  id="isPublished"
                  type="checkbox"
                  className="h-4.5 w-4.5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
                  checked={isPublishedVal}
                  onChange={(e) => setValue("isPublished", e.target.checked, { shouldDirty: true })}
                />
                <label htmlFor="isPublished" className="text-sm font-medium text-slate-700 cursor-pointer">
                  Publish this page (visible to public)
                </label>
              </div>
            </CardContent>
          </TabsContent>

          {/* SEO & METADATA TAB */}
          <TabsContent value="seo">
            <CardContent className="bg-white border rounded-2xl p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seoTitle">SEO Meta Title</Label>
                  <Input
                    id="seoTitle"
                    className="border-slate-200"
                    {...register("seoTitle")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="canonicalUrl">Canonical URL</Label>
                  <Input
                    id="canonicalUrl"
                    className="border-slate-200"
                    {...register("canonicalUrl")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO Meta Description</Label>
                <textarea
                  id="seoDescription"
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  {...register("seoDescription")}
                />
              </div>

              <div className="border-t pt-4 mt-4 space-y-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <FiGlobe className="text-emerald-700" /> Open Graph Social Properties
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ogTitle">OG Title</Label>
                    <Input
                      id="ogTitle"
                      className="border-slate-200"
                      {...register("ogTitle")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ogImage">OG Image URL</Label>
                    <Input
                      id="ogImage"
                      className="border-slate-200"
                      {...register("ogImage")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ogDescription">OG Description</Label>
                  <textarea
                    id="ogDescription"
                    rows={2}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    {...register("ogDescription")}
                  />
                </div>
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>

        {/* Actions bar */}
        <div className="flex justify-end gap-3 pt-6 border-t mt-6">
          <Button variant="outline" className="border-slate-200 rounded-xl" asChild>
            <Link href="/admin/legal-pages">Cancel</Link>
          </Button>
          <Button
            type="submit"
            className="bg-emerald-700 text-white hover:bg-emerald-800 rounded-xl gap-2"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <>
                <ButtonLoader /> Saving...
              </>
            ) : (
              <>
                <FiSave className="h-4 w-4" /> Save Page
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
