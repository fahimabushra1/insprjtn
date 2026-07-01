import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { TourAvailability } from "@/lib/db/models/TourAvailability.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import { sanitizeObject } from "@/lib/backend/sanitize";
import { z } from "zod";

const upsertAvailabilitySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
  status: z.enum(["available", "limited", "full", "closed"]),
  remainingSeats: z.coerce.number().int().min(0).max(100).optional().default(50),
  reason: z.string().optional().default(""),
});

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const availabilities = await TourAvailability.find().lean();
    return apiResponse(200, availabilities, "Tour availabilities retrieved successfully");
  } catch (error: any) {
    console.error("Tour availabilities GET error:", error);
    return apiError(500, error.message || "Internal server error");
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAuth(request, ["admin"]);
    const body = await request.json();
    const parseResult = upsertAvailabilitySchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, parseResult.error.issues[0].message);
    }

    await connectDB();
    const sanitized = sanitizeObject(parseResult.data);

    const availability = await TourAvailability.findOneAndUpdate(
      { date: sanitized.date },
      { $set: sanitized },
      { upsert: true, new: true, runValidators: true }
    );

    return apiResponse(200, availability, "Tour availability updated successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}

export const dynamic = "force-dynamic";
