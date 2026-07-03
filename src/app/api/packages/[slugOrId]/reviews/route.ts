import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Package } from "@/lib/db/models/Package.model";
import { Review } from "@/lib/db/models/Review.model";
import { User } from "@/lib/db/models/User.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import { sanitizeObject } from "@/lib/backend/sanitize";
import { backendLogger } from "@/lib/backend/logger";
import mongoose from "mongoose";
import { z } from "zod";

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().min(5, "Comment must be at least 5 characters"),
});

type RouteParams = { params: Promise<{ slugOrId: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  const reqStart = Date.now();
  backendLogger.info("GET /api/packages/[slugOrId]/reviews started");
  try {
    const { slugOrId } = await params;
    await connectDB();

    // Resolve package id
    let pkg = null;
    if (mongoose.Types.ObjectId.isValid(slugOrId)) {
      pkg = await Package.findById(slugOrId).lean();
    } else {
      pkg = await Package.findOne({ slug: slugOrId }).lean();
    }

    if (!pkg) {
      return apiError(404, "Package not found");
    }

    const queryStart = Date.now();
    const reviews = await (Review as any).find({ packageId: pkg._id })
      .populate("userId", "name photo")
      .sort("-createdAt")
      .lean();
    backendLogger.info(`MongoDB Review.find took ${Date.now() - queryStart}ms`);

    // Calculate average rating
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? parseFloat((reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / totalReviews).toFixed(1))
        : 0;

    backendLogger.info(`GET /api/packages/[slugOrId]/reviews finished in ${Date.now() - reqStart}ms`);
    return apiResponse(
      200,
      {
        reviews,
        averageRating,
        totalReviews,
      },
      "Reviews retrieved successfully"
    );
  } catch (error: any) {
    backendLogger.error("GET /api/packages/[slugOrId]/reviews error", error);
    return apiError(500, error.message || "Internal server error");
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const reqStart = Date.now();
  backendLogger.info("POST /api/packages/[slugOrId]/reviews started");
  try {
    const { user } = await verifyAuth(request);
    const { slugOrId } = await params;

    await connectDB();

    // Resolve package id
    let pkg = null;
    if (mongoose.Types.ObjectId.isValid(slugOrId)) {
      pkg = await Package.findById(slugOrId).lean();
    } else {
      pkg = await Package.findOne({ slug: slugOrId }).lean();
    }

    if (!pkg) {
      return apiError(404, "Package not found");
    }

    const body = await request.json();
    const parseResult = createReviewSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, parseResult.error.issues[0].message);
    }

    const sanitized = sanitizeObject(parseResult.data);

    // Create the review
    const queryStart = Date.now();
    const review = await (Review as any).create({
      userId: user._id,
      packageId: pkg._id,
      rating: sanitized.rating,
      comment: sanitized.comment,
    });
    backendLogger.info(`MongoDB Review.create took ${Date.now() - queryStart}ms`);

    // Populate user info for returning response
    const populatedReview = await (Review as any).findById(review._id)
      .populate("userId", "name photo")
      .lean();

    backendLogger.info(`POST /api/packages/[slugOrId]/reviews finished in ${Date.now() - reqStart}ms`);
    return apiResponse(201, populatedReview, "Review submitted successfully");
  } catch (error: any) {
    backendLogger.error("POST /api/packages/[slugOrId]/reviews error", error);
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}

export const dynamic = "force-dynamic";
