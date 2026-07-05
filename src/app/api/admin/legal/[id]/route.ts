import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { LegalPage } from "@/lib/db/models/LegalPage.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import { sanitizeHtml } from "@/utils/sanitizeHtml";
import mongoose from "mongoose";
import { z } from "zod";

const updateLegalPageSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens").optional(),
  content: z.string().min(1, "Content cannot be empty").optional(),
  isPublished: z.boolean().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  canonicalUrl: z.string().optional(),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await verifyAuth(request, ["admin"]);
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(400, "Invalid legal page ID");
    }

    await connectDB();
    const legalPage = await LegalPage.findById(id).lean();

    if (!legalPage) {
      return apiError(404, "Legal page not found");
    }

    return apiResponse(200, legalPage, "Legal page retrieved successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { user } = await verifyAuth(request, ["admin"]);
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(400, "Invalid legal page ID");
    }

    const body = await request.json();
    const parseResult = updateLegalPageSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, parseResult.error.issues[0].message);
    }

    await connectDB();
    const data = parseResult.data;
    const sanitized: any = {};
    if (data.title !== undefined) sanitized.title = data.title.trim().replace(/[<>]/g, "");
    if (data.slug !== undefined) sanitized.slug = data.slug.trim().toLowerCase();
    if (data.content !== undefined) sanitized.content = sanitizeHtml(data.content);
    if (data.isPublished !== undefined) sanitized.isPublished = data.isPublished;
    if (data.seoTitle !== undefined) sanitized.seoTitle = data.seoTitle.trim().replace(/[<>]/g, "");
    if (data.seoDescription !== undefined) sanitized.seoDescription = data.seoDescription.trim().replace(/[<>]/g, "");
    if (data.ogTitle !== undefined) sanitized.ogTitle = data.ogTitle.trim().replace(/[<>]/g, "");
    if (data.ogDescription !== undefined) sanitized.ogDescription = data.ogDescription.trim().replace(/[<>]/g, "");
    if (data.ogImage !== undefined) sanitized.ogImage = data.ogImage.trim();
    if (data.canonicalUrl !== undefined) sanitized.canonicalUrl = data.canonicalUrl.trim();

    // If slug is changing, check uniqueness
    if (sanitized.slug) {
      const existing = await LegalPage.findOne({
        slug: sanitized.slug,
        _id: { $ne: id },
      });
      if (existing) {
        return apiError(400, "A page with this slug already exists");
      }
    }

    const page = await LegalPage.findByIdAndUpdate(
      id,
      {
        ...sanitized,
        updatedBy: user._id,
      },
      { new: true }
    );

    if (!page) {
      return apiError(404, "Legal page not found");
    }

    return apiResponse(200, page, "Legal page updated successfully");
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
      return apiError(400, "Invalid legal page ID");
    }

    await connectDB();
    const page = await LegalPage.findByIdAndDelete(id);
    if (!page) {
      return apiError(404, "Legal page not found");
    }

    return apiResponse(200, null, "Legal page deleted successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}

export const dynamic = "force-dynamic";
