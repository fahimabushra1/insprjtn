import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Blog } from "@/lib/db/models/Blog.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import { sanitizeObject } from "@/lib/backend/sanitize";
import { slugify } from "@/lib/backend/slugify";
import mongoose from "mongoose";
import { z } from "zod";

const updateBlogSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  titleBn: z.string().max(200).optional(),
  content: z.string().min(10).optional(),
  contentBn: z.string().optional(),
  thumbnail: z.string().url("Thumbnail must be a valid URL").optional(),
  author: z.string().min(2).max(100).optional(),
});

type RouteParams = { params: Promise<{ slugOrId: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slugOrId } = await params;
    await connectDB();

    let blog;
    if (mongoose.Types.ObjectId.isValid(slugOrId)) {
      blog = await Blog.findById(slugOrId).lean();
    } else {
      blog = await Blog.findOne({ slug: slugOrId }).lean();
    }

    if (!blog) {
      return apiError(404, "Blog not found");
    }

    return apiResponse(200, blog, "Blog retrieved successfully");
  } catch (error: any) {
    console.error("Blog GET detail error:", error);
    return apiError(500, error.message || "Internal server error");
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await verifyAuth(request, ["admin"]);
    const { slugOrId } = await params;

    if (!mongoose.Types.ObjectId.isValid(slugOrId)) {
      return apiError(400, "Invalid blog ID for updating");
    }

    const body = await request.json();
    const parseResult = updateBlogSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, parseResult.error.issues[0].message);
    }

    await connectDB();
    const sanitized = sanitizeObject(parseResult.data);
    const updates: any = { ...sanitized };

    if (sanitized.title) {
      updates.slug = slugify(sanitized.title);
    }

    const blog = await Blog.findByIdAndUpdate(
      slugOrId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!blog) {
      return apiError(404, "Blog not found");
    }

    return apiResponse(200, blog, "Blog updated successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await verifyAuth(request, ["admin"]);
    const { slugOrId } = await params;

    if (!mongoose.Types.ObjectId.isValid(slugOrId)) {
      return apiError(400, "Invalid blog ID for deletion");
    }

    await connectDB();
    const blog = await Blog.findByIdAndDelete(slugOrId);
    if (!blog) {
      return apiError(404, "Blog not found");
    }

    return apiResponse(200, null, "Blog deleted successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}
export const dynamic = "force-dynamic";

