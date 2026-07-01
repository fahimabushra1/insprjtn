import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Blog } from "@/lib/db/models/Blog.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import { sanitizeObject } from "@/lib/backend/sanitize";
import { slugify } from "@/lib/backend/slugify";
import { z } from "zod";

const createBlogSchema = z.object({
  title: z.string().min(3).max(200),
  titleBn: z.string().max(200).optional().default(""),
  content: z.string().min(10),
  contentBn: z.string().optional().default(""),
  thumbnail: z.string().url("Thumbnail must be a valid URL"),
  author: z.string().min(2).max(100),
});

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search");

    const filter: any = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Blog.find(filter).sort("-createdAt").skip(skip).limit(limit).lean(),
      Blog.countDocuments(filter),
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
      "Blogs retrieved successfully"
    );
  } catch (error: any) {
    console.error("Blogs GET list error:", error);
    return apiError(500, error.message || "Internal server error");
  }
}

export async function POST(request: NextRequest) {
  try {
    // Admin only
    await verifyAuth(request, ["admin"]);

    const body = await request.json();
    const parseResult = createBlogSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, parseResult.error.issues[0].message);
    }

    await connectDB();
    const sanitized = sanitizeObject(parseResult.data);
    const slug = slugify(sanitized.title);

    const existing = await Blog.findOne({ slug });
    if (existing) {
      return apiError(409, "A blog with a similar title already exists");
    }

    const blog = await Blog.create({
      ...sanitized,
      slug,
    });

    return apiResponse(201, blog, "Blog created successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}
export const dynamic = "force-dynamic";

