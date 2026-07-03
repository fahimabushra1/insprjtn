import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Booking } from "@/lib/db/models/Booking.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import { backendLogger } from "@/lib/backend/logger";
import mongoose from "mongoose";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  const reqStart = Date.now();
  backendLogger.info("GET /api/bookings/[id] started");
  try {
    const { user } = await verifyAuth(request);
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(400, "Invalid booking ID");
    }

    await connectDB();

    const queryStart = Date.now();
    const rawBooking = await Booking.findById(id)
      .populate("packageId", "title duration price location images slug included excluded itinerary")
      .populate("paymentId")
      .populate("userId", "name email phone")
      .lean();
    backendLogger.info(`MongoDB Booking.findById query took ${Date.now() - queryStart}ms`);

    if (!rawBooking) {
      return apiError(404, "Booking not found");
    }

    // Handle deleted user / package gracefully
    const booking = {
      ...rawBooking,
      userId: rawBooking.userId || {
        _id: "deleted-user",
        name: "Deleted User",
        email: "deleted@insprjtn.com",
        phone: "N/A"
      },
      packageId: rawBooking.packageId || {
        _id: "deleted-package",
        title: "Deleted Package",
        duration: "N/A",
        price: 0,
        location: "N/A",
        images: [],
        slug: "",
        included: [],
        excluded: [],
        itinerary: []
      }
    };

    // Check ownership for customer safely
    const bookingUserId = booking.userId?._id?.toString() || booking.userId?.toString();
    if (user.role !== "admin" && bookingUserId !== user._id.toString()) {
      return apiError(403, "You do not have permission to view this booking");
    }

    backendLogger.info(`GET /api/bookings/[id] finished in ${Date.now() - reqStart}ms`);
    return apiResponse(200, booking, "Booking retrieved successfully");
  } catch (error: any) {
    backendLogger.error("GET /api/bookings/[id] error", error);
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}
export const dynamic = "force-dynamic";
