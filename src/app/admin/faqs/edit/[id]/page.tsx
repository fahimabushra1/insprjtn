"use client";

import { useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiArrowLeft, FiSave, FiBold, FiItalic, FiList, FiLink } from "react-icons/fi";
import Link from "next/link";
import { useFaqDetails, useUpdateFaq } from "@/hooks/useFaqs";
import { useSuccessAlert } from "@/hooks/useSuccessAlert";
import { useErrorAlert } from "@/hooks/useErrorAlert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ButtonLoader from "@/components/loaders/ButtonLoader";
import FullPageLoader from "@/components/loaders/FullPageLoader";
import { CardContent } from "@/components/ui/card";

const faqFormSchema = z.object({
  question: z.string().min(3, "Question must be at least 3 characters"),
  answer: z.string().min(5, "Answer must be at least 5 characters"),
  category: z.string().min(1, "Category is required"),
  order: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(true),
});

type Props = { params: Promise<{ id: string }> };

export default function EditFaqPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  
  const successAlert = useSuccessAlert();
  const errorAlert = useErrorAlert();
  const answerRef = useRef<HTMLTextAreaElement>(null);

  const { data: faqRes, isLoading, isError } = useFaqDetails(id);
  const updateMutation = useUpdateFaq();

  const faqData = faqRes?.data;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      question: "",
      answer: "",
      category: "",
      order: 0,
      isPublished: true,
    },
  });

  const selectedCategory = watch("category");
  const isPublishedVal = watch("isPublished");
  const answerVal = watch("answer");

  useEffect(() => {
    if (faqData) {
      reset({
        question: faqData.question,
        answer: faqData.answer,
        category: faqData.category,
        order: faqData.order,
        isPublished: faqData.isPublished,
      });
    }
  }, [faqData, reset]);

  const insertText = (before: string, after: string = "") => {
    const textarea = answerRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = before + selected + after;

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    setValue("answer", newValue, { shouldValidate: true });
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 50);
  };

  const onSubmit = async (data: any) => {
    try {
      await updateMutation.mutateAsync({ id, data });
      successAlert("FAQ Updated", "The FAQ has been saved successfully.");
      router.push("/admin/faqs");
    } catch (err: any) {
      errorAlert("Update Failed", err.message || "Failed to save the FAQ.");
    }
  };

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (isError || !faqData) {
    return (
      <div className="py-12 text-center text-destructive">
        Failed to load FAQ details. Please go back and try again.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="rounded-xl border" asChild>
          <Link href="/admin/faqs">
            <FiArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Edit FAQ</h1>
          <p className="text-xs text-muted-foreground">Modify the question details below.</p>
        </div>
      </div>

      <CardContent className="bg-white border rounded-2xl p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Question */}
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              className="border-slate-200"
              {...register("question")}
            />
            {errors.question && (
              <p className="text-xs font-semibold text-destructive">{errors.question.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={selectedCategory}
              onValueChange={(val) => setValue("category", val, { shouldValidate: true })}
            >
              <SelectTrigger className="border-slate-200">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General & Bookings">General & Bookings</SelectItem>
                <SelectItem value="Travel & Forest Safety">Travel & Forest Safety</SelectItem>
                <SelectItem value="Preparation & Clothing">Preparation & Clothing</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs font-semibold text-destructive">{errors.category.message}</p>
            )}
          </div>

          {/* Answer with Rich Text Toolbar */}
          <div className="space-y-2">
            <Label htmlFor="answer">Answer</Label>
            
            <div className="flex items-center gap-1.5 p-1.5 border border-slate-200 border-b-0 rounded-t-xl bg-slate-50/50 flex-wrap">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-slate-600 font-semibold"
                onClick={() => insertText("<strong>", "</strong>")}
                title="Bold"
              >
                <FiBold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-slate-600 italic font-semibold"
                onClick={() => insertText("<em>", "</em>")}
                title="Italic"
              >
                <FiItalic className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-slate-600 font-semibold"
                onClick={() => insertText("<p>", "</p>")}
                title="Paragraph"
              >
                P
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-slate-600 font-semibold"
                onClick={() => insertText("<ul>\n  <li>", "</li>\n</ul>")}
                title="Bullet List"
              >
                <FiList className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-slate-600 font-semibold"
                onClick={() => insertText('<a href="#" target="_blank" className="text-primary hover:underline">', "</a>")}
                title="Link"
              >
                <FiLink className="h-4 w-4" />
              </Button>
            </div>

            <textarea
              id="answer"
              ref={(e) => {
                register("answer").ref(e);
                (answerRef as any).current = e;
              }}
              rows={6}
              className="w-full rounded-b-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm font-sans"
              onChange={(e) => setValue("answer", e.target.value, { shouldValidate: true })}
              value={answerVal}
            />
            {errors.answer && (
              <p className="text-xs font-semibold text-destructive">{errors.answer.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Sort Order */}
            <div className="space-y-2">
              <Label htmlFor="order">Sort Order</Label>
              <Input
                id="order"
                type="number"
                className="border-slate-200"
                {...register("order")}
              />
              {errors.order && (
                <p className="text-xs font-semibold text-destructive">{errors.order.message}</p>
              )}
            </div>

            {/* Publish Status Toggle */}
            <div className="space-y-2">
              <Label>Publish Status</Label>
              <div className="flex items-center gap-2 pt-2">
                <input
                  id="isPublished"
                  type="checkbox"
                  className="h-4.5 w-4.5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
                  checked={isPublishedVal}
                  onChange={(e) => setValue("isPublished", e.target.checked)}
                />
                <span className="text-sm font-medium text-slate-700">Published</span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" className="border-slate-200 rounded-xl" asChild>
              <Link href="/admin/faqs">Cancel</Link>
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
                  <FiSave className="h-4 w-4" /> Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </div>
  );
}
