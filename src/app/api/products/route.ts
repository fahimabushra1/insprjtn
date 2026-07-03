import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Product } from "@/lib/db/models/Product.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import { sanitizeObject } from "@/lib/backend/sanitize";
import { backendLogger } from "@/lib/backend/logger";
import { z } from "zod";

const createProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  price: z.number().min(0, "Price must be a positive number"),
  images: z.array(z.string().url()).min(1, "At least one valid image URL is required"),
  category: z.string().min(2, "Category is required"),
  stock: z.number().int().min(0).optional().default(10),
});

export async function GET(request: NextRequest) {
  const reqStart = Date.now();
  backendLogger.info("GET /api/products started");
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const filter: any = {};
    if (category && category !== "all") {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const queryStart = Date.now();
    const items = await (Product as any).find(filter).sort("-createdAt").lean();
    backendLogger.info(`MongoDB Product.find took ${Date.now() - queryStart}ms`);

    backendLogger.info(`GET /api/products finished in ${Date.now() - reqStart}ms`);
    return apiResponse(200, items, "Products retrieved successfully");
  } catch (error: any) {
    backendLogger.error("GET /api/products error", error);
    return apiError(500, error.message || "Internal server error");
  }
}

export async function POST(request: NextRequest) {
  const reqStart = Date.now();
  backendLogger.info("POST /api/products started");
  try {
    // Admin only
    await verifyAuth(request, ["admin"]);

    const body = await request.json();
    const parseResult = createProductSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, parseResult.error.issues[0].message);
    }

    await connectDB();
    const sanitized = sanitizeObject(parseResult.data);

    const queryStart = Date.now();
    const product = await (Product as any).create(sanitized);
    backendLogger.info(`MongoDB Product.create took ${Date.now() - queryStart}ms`);

    backendLogger.info(`POST /api/products finished in ${Date.now() - reqStart}ms`);
    return apiResponse(201, product, "Product created successfully");
  } catch (error: any) {
    backendLogger.error("POST /api/products error", error);
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}

export const dynamic = "force-dynamic";
