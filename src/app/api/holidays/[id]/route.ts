import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Holiday } from "@/lib/db/models/Holiday.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import { sanitizeObject } from "@/lib/backend/sanitize";
import mongoose from "mongoose";
import { z } from "zod";

const updateHolidaySchema = z.object({
  title: z.string().min(2).max(100).optional(),
  titleBn: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD").optional(),
  endDate: z.string().optional(),
  type: z.enum(["national", "religious", "festival", "weekend", "long-weekend"]).optional(),
  description: z.string().optional(),
  color: z.string().optional(),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await verifyAuth(request, ["admin"]);
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(400, "Invalid holiday ID");
    }

    const body = await request.json();
    const parseResult = updateHolidaySchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, parseResult.error.issues[0].message);
    }

    await connectDB();
    const sanitized = sanitizeObject(parseResult.data);

    const holiday = await Holiday.findByIdAndUpdate(
      id,
      { $set: sanitized },
      { new: true, runValidators: true }
    );

    if (!holiday) {
      return apiError(404, "Holiday not found");
    }

    return apiResponse(200, holiday, "Holiday updated successfully");
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
      return apiError(400, "Invalid holiday ID");
    }

    await connectDB();
    const holiday = await Holiday.findByIdAndDelete(id);

    if (!holiday) {
      return apiError(404, "Holiday not found");
    }

    return apiResponse(200, null, "Holiday deleted successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}

export const dynamic = "force-dynamic";
