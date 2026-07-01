import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Holiday } from "@/lib/db/models/Holiday.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import { sanitizeObject } from "@/lib/backend/sanitize";
import { z } from "zod";

const createHolidaySchema = z.object({
  title: z.string().min(2).max(100),
  titleBn: z.string().optional().default(""),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
  endDate: z.string().optional().default(""),
  type: z.enum(["national", "religious", "festival", "weekend", "long-weekend"]),
  description: z.string().optional().default(""),
  color: z.string().optional().default("#e11d48"),
});

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const holidays = await Holiday.find().sort("date").lean();
    return apiResponse(200, holidays, "Holidays retrieved successfully");
  } catch (error: any) {
    console.error("Holidays GET error:", error);
    return apiError(500, error.message || "Internal server error");
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAuth(request, ["admin"]);
    const body = await request.json();
    const parseResult = createHolidaySchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, parseResult.error.issues[0].message);
    }

    await connectDB();
    const sanitized = sanitizeObject(parseResult.data);
    const holiday = await Holiday.create(sanitized);

    return apiResponse(201, holiday, "Holiday created successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}

export const dynamic = "force-dynamic";
