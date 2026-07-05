import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Payment } from "@/lib/db/models/Payment.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import { backendLogger } from "@/lib/backend/logger";

export async function GET(request: NextRequest) {
  const reqStart = Date.now();
  backendLogger.info("GET /api/payments started");
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

    const queryStart = Date.now();
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
    backendLogger.info(`MongoDB Payment query took ${Date.now() - queryStart}ms`);

    // Map payments to ensure nested populated objects are never null
    const sanitizedPayments = payments.map((payment: any) => ({
      ...payment,
      userId: payment.userId || {
        _id: "deleted-user",
        name: "Deleted User",
        email: "deleted@insprjtn.com",
        phone: "N/A"
      },
      bookingId: payment.bookingId || {
        _id: "deleted-booking",
        packageId: { title: "Deleted Package" },
        bookingStatus: "cancelled",
        paymentStatus: "failed"
      }
    }));

    backendLogger.info(`GET /api/payments finished in ${Date.now() - reqStart}ms`);
    return apiResponse(
      200,
      {
        items: sanitizedPayments,
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
    backendLogger.error("GET /api/payments error", error);
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}
export const dynamic = "force-dynamic";
