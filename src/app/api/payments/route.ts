import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Payment } from "@/lib/db/models/Payment.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";

export async function GET(request: NextRequest) {
  try {
    const { user } = await verifyAuth(request);
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const userIdParam = searchParams.get("userId");

    const filter: any = {};
    if (user.role === "admin") {
      if (userIdParam) {
        filter.userId = userIdParam;
      }
    } else {
      filter.userId = user._id;
    }

    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      Payment.find(filter)
        .populate("bookingId")
        .populate("userId", "name email phone")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Payment.countDocuments(filter),
    ]);

    return apiResponse(
      200,
      {
        items: payments,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      "Payments retrieved successfully"
    );
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}
export const dynamic = "force-dynamic";
