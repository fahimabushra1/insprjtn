import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Payment } from "@/lib/db/models/Payment.model";
import { Booking } from "@/lib/db/models/Booking.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import { sanitizeObject } from "@/lib/backend/sanitize";
import { z } from "zod";

const submitPaymentSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  paymentMethod: z.enum(["bkash", "nagad", "rocket", "bank"]),
  transactionId: z
    .string()
    .min(6, "Transaction ID is too short")
    .max(30, "Transaction ID is too long")
    .regex(/^[a-zA-Z0-9]+$/, "Transaction ID must only contain alphanumeric characters"),
});

export async function POST(request: NextRequest) {
  try {
    const { user } = await verifyAuth(request);
    const body = await request.json();

    const parseResult = submitPaymentSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, parseResult.error.issues[0].message);
    }

    await connectDB();
    const sanitized = sanitizeObject(parseResult.data);

    // Verify booking details
    const booking = await Booking.findById(sanitized.bookingId);
    if (!booking) {
      return apiError(404, "Booking not found");
    }

    if (booking.userId.toString() !== user._id.toString()) {
      return apiError(403, "You do not own this booking");
    }

    if (booking.paymentStatus === "paid") {
      return apiError(400, "This booking has already been paid");
    }

    if (booking.bookingStatus === "cancelled") {
      return apiError(400, "Cannot submit payment for a cancelled booking");
    }

    // Check unique transaction ID
    const existingTx = await Payment.findOne({ transactionId: sanitized.transactionId });
    if (existingTx) {
      return apiError(400, "Transaction ID has already been used");
    }

    // Create the payment record
    const payment = await Payment.create({
      userId: user._id,
      bookingId: sanitized.bookingId,
      amount: booking.totalPrice,
      paymentMethod: sanitized.paymentMethod,
      transactionId: sanitized.transactionId,
      paymentStatus: "pending",
      verifiedByAdmin: false,
    });

    // Link payment status to booking
    booking.paymentId = payment._id;
    booking.paymentStatus = "pending";
    await booking.save();

    return apiResponse(201, payment, "Payment transaction submitted successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}
export const dynamic = "force-dynamic";

