import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { User } from "@/lib/db/models/User.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";

export async function GET(request: NextRequest) {
  try {
    // Admin only
    await verifyAuth(request, ["admin"]);
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      User.find().sort("-createdAt").skip(skip).limit(limit).lean(),
      User.countDocuments({}),
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
      "Users retrieved successfully"
    );
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}
export const dynamic = "force-dynamic";
