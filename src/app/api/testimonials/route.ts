import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Testimonial } from "@/lib/db/models/Testimonial.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import { sanitizeObject } from "@/lib/backend/sanitize";
import { z } from "zod";

const createTestimonialSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  designation: z.string().min(2, "Designation must be at least 2 characters").max(100),
  photo: z.string().url().or(z.string().length(0)).optional().default(""),
  review: z.string().min(10, "Review must be at least 10 characters").max(500),
  rating: z.number().int().min(1).max(5),
});

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Testimonial.find().sort("-createdAt").skip(skip).limit(limit).lean(),
      Testimonial.countDocuments({}),
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
      "Testimonials retrieved successfully"
    );
  } catch (error: any) {
    console.error("Testimonials GET list error:", error);
    return apiError(500, error.message || "Internal server error");
  }
}

export async function POST(request: NextRequest) {
  try {
    // Admin only
    await verifyAuth(request, ["admin"]);

    const body = await request.json();
    const parseResult = createTestimonialSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, parseResult.error.issues[0].message);
    }

    await connectDB();
    const sanitized = sanitizeObject(parseResult.data);

    const testimonial = await Testimonial.create(sanitized);

    return apiResponse(201, testimonial, "Testimonial created successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}
export const dynamic = "force-dynamic";

