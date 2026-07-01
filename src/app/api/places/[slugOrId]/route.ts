import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Place } from "@/lib/db/models/Place.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import { sanitizeObject } from "@/lib/backend/sanitize";
import { slugify } from "@/lib/backend/slugify";
import mongoose from "mongoose";
import { z } from "zod";

const updatePlaceSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  nameBn: z.string().min(2).max(100).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  category: z.enum(["gateway", "spot"]).optional(),
  description: z.string().min(5).optional(),
  history: z.string().optional(),
  featuredImage: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
  wildlife: z.object({
    tiger: z.number().min(0).max(5).optional(),
    deer: z.number().min(0).max(5).optional(),
    crocodile: z.number().min(0).max(5).optional(),
    dolphin: z.number().min(0).max(5).optional(),
    birds: z.number().min(0).max(5).optional(),
    reptiles: z.number().min(0).max(5).optional(),
  }).optional(),
  bestSeason: z.string().optional(),
  travelTime: z.string().optional(),
  distance: z.string().optional(),
  boatTime: z.string().optional(),
  tourPackages: z.array(z.string()).optional(),
  tips: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
});

type RouteParams = { params: Promise<{ slugOrId: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slugOrId } = await params;
    await connectDB();

    let place;
    if (mongoose.Types.ObjectId.isValid(slugOrId)) {
      place = await Place.findById(slugOrId).lean();
    } else {
      place = await Place.findOne({ slug: slugOrId }).lean();
    }

    if (!place) {
      return apiError(404, "Place not found");
    }

    return apiResponse(200, place, "Place details retrieved successfully");
  } catch (error: any) {
    console.error("Place details GET error:", error);
    return apiError(500, error.message || "Internal server error");
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await verifyAuth(request, ["admin"]);
    const { slugOrId } = await params;

    if (!mongoose.Types.ObjectId.isValid(slugOrId)) {
      return apiError(400, "Invalid place ID format for update");
    }

    const body = await request.json();
    const parseResult = updatePlaceSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, parseResult.error.issues[0].message);
    }

    await connectDB();
    const sanitized = sanitizeObject(parseResult.data);
    const updates: any = { ...sanitized };

    if (sanitized.name) {
      updates.slug = slugify(sanitized.name);
    }

    const place = await Place.findByIdAndUpdate(
      slugOrId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!place) {
      return apiError(404, "Place not found");
    }

    return apiResponse(200, place, "Place updated successfully");
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
      return apiError(400, "Invalid place ID format for deletion");
    }

    await connectDB();
    const place = await Place.findByIdAndDelete(slugOrId);

    if (!place) {
      return apiError(404, "Place not found");
    }

    return apiResponse(200, null, "Place deleted successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}

export const dynamic = "force-dynamic";
