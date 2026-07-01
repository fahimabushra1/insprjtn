import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { User } from "@/lib/db/models/User.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import mongoose from "mongoose";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Admin only
    await verifyAuth(request, ["admin"]);
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(400, "Invalid user ID");
    }

    await connectDB();
    const user = await User.findById(id).lean();

    if (!user) {
      return apiError(404, "User not found");
    }

    return apiResponse(200, user, "User retrieved successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Admin only
    const { user: currentAdmin } = await verifyAuth(request, ["admin"]);
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(400, "Invalid user ID");
    }

    await connectDB();
    const user = await User.findById(id);

    if (!user) {
      return apiError(404, "User not found");
    }

    // Don't allow admins to delete themselves
    if (user._id.toString() === currentAdmin._id.toString()) {
      return apiError(400, "Admins cannot delete their own profiles");
    }

    await User.findByIdAndDelete(id);

    return apiResponse(200, null, "User deleted successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}
export const dynamic = "force-dynamic";
