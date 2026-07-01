import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Announcement } from "@/lib/db/models/Announcement.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import { sanitizeObject } from "@/lib/backend/sanitize";
import { z } from "zod";

const createAnnouncementSchema = z.object({
  title: z.string().min(2).max(150),
  description: z.string().min(5),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
  priority: z.enum(["low", "medium", "high"]),
});

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const announcements = await Announcement.find().sort("-createdAt").lean();
    return apiResponse(200, announcements, "Announcements retrieved successfully");
  } catch (error: any) {
    console.error("Announcements GET error:", error);
    return apiError(500, error.message || "Internal server error");
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAuth(request, ["admin"]);
    const body = await request.json();
    const parseResult = createAnnouncementSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, parseResult.error.issues[0].message);
    }

    await connectDB();
    const sanitized = sanitizeObject(parseResult.data);
    const announcement = await Announcement.create(sanitized);

    return apiResponse(201, announcement, "Announcement created successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}

export const dynamic = "force-dynamic";
