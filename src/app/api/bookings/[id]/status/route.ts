import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Booking } from "@/lib/db/models/Booking.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import mongoose from "mongoose";
import { z } from "zod";

const updateBookingStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled"]),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    // Admin only
    await verifyAuth(request, ["admin"]);
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(400, "Invalid booking ID");
    }

    const body = await request.json();
    const parseResult = updateBookingStatusSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, parseResult.error.issues[0].message);
    }

    await connectDB();
    const booking = await Booking.findById(id);

    if (!booking) {
      return apiError(404, "Booking not found");
    }

    booking.bookingStatus = parseResult.data.status;
    await booking.save();

    return apiResponse(200, booking, "Booking status updated successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}
export const dynamic = "force-dynamic";

