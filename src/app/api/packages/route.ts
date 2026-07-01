import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Package } from "@/lib/db/models/Package.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import { sanitizeObject } from "@/lib/backend/sanitize";
import { slugify } from "@/lib/backend/slugify";
import { z } from "zod";

const createPackageSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  duration: z.string().min(1).max(100),
  price: z.number().min(0),
  location: z.string().min(1).max(200),
  images: z.array(z.string().url()).min(1),
  featured: z.boolean().optional().default(false),
  included: z.array(z.string()).optional().default([]),
  excluded: z.array(z.string()).optional().default([]),
  itinerary: z
    .array(
      z.object({
        day: z.number().int().min(1),
        title: z.string().min(1).max(200),
        description: z.string().min(1).max(1000),
      })
    )
    .optional()
    .default([]),
});

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "-createdAt";

    const filter: any = {};
    if (featured === "true") filter.featured = true;
    if (featured === "false") filter.featured = false;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Package.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Package.countDocuments(filter),
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
      "Packages retrieved successfully"
    );
  } catch (error: any) {
    console.error("Packages GET list error:", error);
    return apiError(500, error.message || "Internal server error");
  }
}

export async function POST(request: NextRequest) {
  try {
    // Admin only
    await verifyAuth(request, ["admin"]);

    const body = await request.json();
    const parseResult = createPackageSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, parseResult.error.issues[0].message);
    }

    await connectDB();

    const sanitized = sanitizeObject(parseResult.data);
    const slug = slugify(sanitized.title);

    const existing = await Package.findOne({ slug });
    if (existing) {
      return apiError(409, "A package with a similar title already exists");
    }

    const pkg = await Package.create({
      ...sanitized,
      slug,
    });

    return apiResponse(201, pkg, "Package created successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}
export const dynamic = "force-dynamic";

