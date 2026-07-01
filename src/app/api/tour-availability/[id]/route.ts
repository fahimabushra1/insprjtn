import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { TourAvailability } from "@/lib/db/models/TourAvailability.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import mongoose from "mongoose";

type RouteParams = { params: Promise<{ id: string }> };

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await verifyAuth(request, ["admin"]);
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id) && !/^\d{4}-\d{2}-\d{2}$/.test(id)) {
      return apiError(400, "Invalid ID format");
    }

    await connectDB();
    
    let availability;
    if (mongoose.Types.ObjectId.isValid(id)) {
      availability = await TourAvailability.findByIdAndDelete(id);
    } else {
      availability = await TourAvailability.findOneAndDelete({ date: id });
    }

    if (!availability) {
      return apiError(404, "Availability record not found");
    }

    return apiResponse(200, null, "Availability deleted successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}

export const dynamic = "force-dynamic";
