import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Testimonial } from "@/lib/db/models/Testimonial.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import { sanitizeObject } from "@/lib/backend/sanitize";
import mongoose from "mongoose";
import { z } from "zod";

const updateTestimonialSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  designation: z.string().min(2).max(100).optional(),
  photo: z.string().url().or(z.string().length(0)).optional(),
  review: z.string().min(10).max(500).optional(),
  rating: z.number().int().min(1).max(5).optional(),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(400, "Invalid testimonial ID");
    }

    await connectDB();
    const testimonial = await Testimonial.findById(id).lean();

    if (!testimonial) {
      return apiError(404, "Testimonial not found");
    }

    return apiResponse(200, testimonial, "Testimonial retrieved successfully");
  } catch (error: any) {
    console.error("Testimonial GET error:", error);
    return apiError(500, error.message || "Internal server error");
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await verifyAuth(request, ["admin"]);
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(400, "Invalid testimonial ID");
    }

    const body = await request.json();
    const parseResult = updateTestimonialSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, parseResult.error.issues[0].message);
    }

    await connectDB();
    const sanitized = sanitizeObject(parseResult.data);

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { $set: sanitized },
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return apiError(404, "Testimonial not found");
    }

    return apiResponse(200, testimonial, "Testimonial updated successfully");
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
      return apiError(400, "Invalid testimonial ID");
    }

    await connectDB();
    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) {
      return apiError(404, "Testimonial not found");
    }

    return apiResponse(200, null, "Testimonial deleted successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}
export const dynamic = "force-dynamic";

