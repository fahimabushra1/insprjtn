import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Product } from "@/lib/db/models/Product.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import { sanitizeObject } from "@/lib/backend/sanitize";
import { backendLogger } from "@/lib/backend/logger";
import mongoose from "mongoose";
import { z } from "zod";

const updateProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters").optional(),
  description: z.string().min(5, "Description must be at least 5 characters").optional(),
  price: z.number().min(0, "Price must be positive").optional(),
  images: z.array(z.string().url()).min(1, "At least one valid image is required").optional(),
  category: z.string().min(2, "Category is required").optional(),
  stock: z.number().int().min(0).optional(),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  const reqStart = Date.now();
  backendLogger.info("GET /api/products/[id] started");
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(400, "Invalid product ID");
    }

    await connectDB();
    const queryStart = Date.now();
    const product = await (Product as any).findById(id).lean();
    backendLogger.info(`MongoDB Product.findById took ${Date.now() - queryStart}ms`);

    if (!product) {
      return apiError(404, "Product not found");
    }

    backendLogger.info(`GET /api/products/[id] finished in ${Date.now() - reqStart}ms`);
    return apiResponse(200, product, "Product retrieved successfully");
  } catch (error: any) {
    backendLogger.error("GET /api/products/[id] error", error);
    return apiError(500, error.message || "Internal server error");
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const reqStart = Date.now();
  backendLogger.info("PATCH /api/products/[id] started");
  try {
    // Admin only
    await verifyAuth(request, ["admin"]);
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(400, "Invalid product ID");
    }

    const body = await request.json();
    const parseResult = updateProductSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, parseResult.error.issues[0].message);
    }

    await connectDB();
    const sanitized = sanitizeObject(parseResult.data);

    const queryStart = Date.now();
    const product = await (Product as any).findByIdAndUpdate(id, sanitized, { new: true });
    backendLogger.info(`MongoDB Product.findByIdAndUpdate took ${Date.now() - queryStart}ms`);

    if (!product) {
      return apiError(404, "Product not found");
    }

    backendLogger.info(`PATCH /api/products/[id] finished in ${Date.now() - reqStart}ms`);
    return apiResponse(200, product, "Product updated successfully");
  } catch (error: any) {
    backendLogger.error("PATCH /api/products/[id] error", error);
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const reqStart = Date.now();
  backendLogger.info("DELETE /api/products/[id] started");
  try {
    // Admin only
    await verifyAuth(request, ["admin"]);
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(400, "Invalid product ID");
    }

    await connectDB();
    const queryStart = Date.now();
    const product = await (Product as any).findByIdAndDelete(id);
    backendLogger.info(`MongoDB Product.findByIdAndDelete took ${Date.now() - queryStart}ms`);

    if (!product) {
      return apiError(404, "Product not found");
    }

    backendLogger.info(`DELETE /api/products/[id] finished in ${Date.now() - reqStart}ms`);
    return apiResponse(200, null, "Product deleted successfully");
  } catch (error: any) {
    backendLogger.error("DELETE /api/products/[id] error", error);
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}

export const dynamic = "force-dynamic";
