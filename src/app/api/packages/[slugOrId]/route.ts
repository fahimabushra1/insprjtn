import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Package } from "@/lib/db/models/Package.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import { sanitizeObject } from "@/lib/backend/sanitize";
import { slugify } from "@/lib/backend/slugify";
import mongoose from "mongoose";
import { z } from "zod";

const updatePackageSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).optional(),
  duration: z.string().min(1).max(100).optional(),
  price: z.number().min(0).optional(),
  location: z.string().min(1).max(200).optional(),
  images: z.array(z.string().url()).min(1).optional(),
  featured: z.boolean().optional(),
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  itinerary: z
    .array(
      z.object({
        day: z.number().int().min(1),
        title: z.string().min(1).max(200),
        description: z.string().min(1).max(1000),
      })
    )
    .optional(),
});

type RouteParams = { params: Promise<{ slugOrId: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slugOrId } = await params;
    await connectDB();

    let pkg;
    if (mongoose.Types.ObjectId.isValid(slugOrId)) {
      pkg = await Package.findById(slugOrId).lean();
    } else {
      pkg = await Package.findOne({ slug: slugOrId }).lean();
    }

    if (!pkg) {
      return apiError(404, "Package not found");
    }

    return apiResponse(200, pkg, "Package retrieved successfully");
  } catch (error: any) {
    console.error("Package GET by slug/id error:", error);
    return apiError(500, error.message || "Internal server error");
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await verifyAuth(request, ["admin"]);
    const { slugOrId } = await params;

    if (!mongoose.Types.ObjectId.isValid(slugOrId)) {
      return apiError(400, "Invalid package ID for updating");
    }

    const body = await request.json();
    const parseResult = updatePackageSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, parseResult.error.issues[0].message);
    }

    await connectDB();
    const sanitized = sanitizeObject(parseResult.data);
    const updates: any = { ...sanitized };

    if (sanitized.title) {
      updates.slug = slugify(sanitized.title);
    }

    const pkg = await Package.findByIdAndUpdate(
      slugOrId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!pkg) {
      return apiError(404, "Package not found");
    }

    return apiResponse(200, pkg, "Package updated successfully");
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
      return apiError(400, "Invalid package ID for deletion");
    }

    await connectDB();
    const pkg = await Package.findByIdAndDelete(slugOrId);
    if (!pkg) {
      return apiError(404, "Package not found");
    }

    return apiResponse(200, null, "Package deleted successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}
export const dynamic = "force-dynamic";

