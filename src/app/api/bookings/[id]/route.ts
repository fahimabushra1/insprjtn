import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Booking } from "@/lib/db/models/Booking.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import mongoose from "mongoose";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { user } = await verifyAuth(request);
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(400, "Invalid booking ID");
    }

    await connectDB();

    const booking = await Booking.findById(id)
      .populate("packageId", "title duration price location images slug included excluded itinerary")
      .populate("paymentId")
      .populate("userId", "name email phone");

    if (!booking) {
      return apiError(404, "Booking not found");
    }

    // Check ownership for customer
    if (user.role !== "admin" && booking.userId._id.toString() !== user._id.toString()) {
      return apiError(403, "You do not have permission to view this booking");
    }

    return apiResponse(200, booking, "Booking retrieved successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}
export const dynamic = "force-dynamic";
