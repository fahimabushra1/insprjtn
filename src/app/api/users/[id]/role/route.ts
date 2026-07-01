import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { User } from "@/lib/db/models/User.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import mongoose from "mongoose";
import { z } from "zod";

const updateRoleSchema = z.object({
  role: z.enum(["admin", "customer"]),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    // Admin only
    await verifyAuth(request, ["admin"]);
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(400, "Invalid user ID");
    }

    const body = await request.json();
    const parseResult = updateRoleSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, parseResult.error.issues[0].message);
    }

    await connectDB();
    const user = await User.findById(id);

    if (!user) {
      return apiError(404, "User not found");
    }

    // Admins cannot change their own roles
    const { user: currentAdmin } = await verifyAuth(request, ["admin"]);
    if (user._id.toString() === currentAdmin._id.toString()) {
      return apiError(400, "Admins cannot modify their own roles");
    }

    user.role = parseResult.data.role;
    await user.save();

    return apiResponse(200, user, "User role updated successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}
export const dynamic = "force-dynamic";

