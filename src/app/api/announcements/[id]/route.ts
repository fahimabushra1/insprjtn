import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Announcement } from "@/lib/db/models/Announcement.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import { sanitizeObject } from "@/lib/backend/sanitize";
import mongoose from "mongoose";
import { z } from "zod";

const updateAnnouncementSchema = z.object({
  title: z.string().min(2).max(150).optional(),
  description: z.string().min(5).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD").optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD").optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await verifyAuth(request, ["admin"]);
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(400, "Invalid announcement ID");
    }

    const body = await request.json();
    const parseResult = updateAnnouncementSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, parseResult.error.issues[0].message);
    }

    await connectDB();
    const sanitized = sanitizeObject(parseResult.data);

    const announcement = await Announcement.findByIdAndUpdate(
      id,
      { $set: sanitized },
      { new: true, runValidators: true }
    );

    if (!announcement) {
      return apiError(404, "Announcement not found");
    }

    return apiResponse(200, announcement, "Announcement updated successfully");
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
      return apiError(400, "Invalid announcement ID");
    }

    await connectDB();
    const announcement = await Announcement.findByIdAndDelete(id);

    if (!announcement) {
      return apiError(404, "Announcement not found");
    }

    return apiResponse(200, null, "Announcement deleted successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}

export const dynamic = "force-dynamic";
