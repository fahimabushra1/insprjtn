import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Gallery } from "@/lib/db/models/Gallery.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import { sanitizeObject } from "@/lib/backend/sanitize";
import { z } from "zod";

const createGallerySchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(100),
  image: z.string().url("Image must be a valid URL"),
});

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Gallery.find().sort("-createdAt").skip(skip).limit(limit).lean(),
      Gallery.countDocuments({}),
    ]);

    return apiResponse(
      200,
      {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      "Gallery retrieved successfully"
    );
  } catch (error: any) {
    console.error("Gallery GET list error:", error);
    return apiError(500, error.message || "Internal server error");
  }
}

export async function POST(request: NextRequest) {
  try {
    // Admin only
    await verifyAuth(request, ["admin"]);

    const body = await request.json();
    const parseResult = createGallerySchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, parseResult.error.issues[0].message);
    }

    await connectDB();
    const sanitized = sanitizeObject(parseResult.data);

    const item = await Gallery.create(sanitized);

    return apiResponse(201, item, "Gallery item created successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}
export const dynamic = "force-dynamic";

