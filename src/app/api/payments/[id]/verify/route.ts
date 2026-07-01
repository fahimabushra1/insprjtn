import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Payment } from "@/lib/db/models/Payment.model";
import { Booking } from "@/lib/db/models/Booking.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import mongoose from "mongoose";

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    // Admin only
    await verifyAuth(request, ["admin"]);
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(400, "Invalid payment ID");
    }

    await connectDB();
    const payment = await Payment.findById(id);

    if (!payment) {
      return apiError(404, "Payment record not found");
    }

    if (payment.paymentStatus === "paid") {
      return apiError(400, "Payment is already marked as paid");
    }

    // Update payment record
    payment.paymentStatus = "paid";
    payment.verifiedByAdmin = true;
    payment.paidAt = new Date();
    await payment.save();

    // Update associated booking
    const booking = await Booking.findById(payment.bookingId);
    if (booking) {
      booking.paymentStatus = "paid";
      booking.bookingStatus = "confirmed";
      await booking.save();
    }

    return apiResponse(200, payment, "Payment verified successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}
export const dynamic = "force-dynamic";
