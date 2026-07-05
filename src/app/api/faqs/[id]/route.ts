import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Faq } from "@/lib/db/models/Faq.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import { sanitizeHtml } from "@/utils/sanitizeHtml";
import mongoose from "mongoose";
import { z } from "zod";

const updateFaqSchema = z.object({
  question: z.string().min(3, "Question must be at least 3 characters").optional(),
  answer: z.string().min(5, "Answer must be at least 5 characters").optional(),
  category: z.string().min(1, "Category is required").optional(),
  order: z.number().int().optional(),
  isPublished: z.boolean().optional(),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(400, "Invalid FAQ ID");
    }

    await connectDB();
    const faq = await Faq.findById(id).lean();

    if (!faq) {
      return apiError(404, "FAQ not found");
    }

    return apiResponse(200, faq, "FAQ retrieved successfully");
  } catch (error: any) {
    return apiError(500, error.message || "Failed to retrieve FAQ");
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await verifyAuth(request, ["admin"]);
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(400, "Invalid FAQ ID");
    }

    const body = await request.json();
    const parseResult = updateFaqSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, parseResult.error.issues[0].message);
    }

    await connectDB();
    const data = parseResult.data;
    const sanitized: any = {};
    if (data.question !== undefined) sanitized.question = data.question.trim().replace(/[<>]/g, "");
    if (data.answer !== undefined) sanitized.answer = sanitizeHtml(data.answer);
    if (data.category !== undefined) sanitized.category = data.category.trim().replace(/[<>]/g, "");
    if (data.order !== undefined) sanitized.order = data.order;
    if (data.isPublished !== undefined) sanitized.isPublished = data.isPublished;

    const faq = await Faq.findByIdAndUpdate(id, sanitized, { new: true });
    if (!faq) {
      return apiError(404, "FAQ not found");
    }

    return apiResponse(200, faq, "FAQ updated successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await verifyAuth(request, ["admin"]);
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(400, "Invalid FAQ ID");
    }

    await connectDB();
    const faq = await Faq.findByIdAndDelete(id);
    if (!faq) {
      return apiError(404, "FAQ not found");
    }

    return apiResponse(200, null, "FAQ deleted successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}

export const dynamic = "force-dynamic";
