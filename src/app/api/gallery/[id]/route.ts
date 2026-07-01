import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Gallery } from "@/lib/db/models/Gallery.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import mongoose from "mongoose";

type RouteParams = { params: Promise<{ id: string }> };

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await verifyAuth(request, ["admin"]);
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(400, "Invalid gallery item ID");
    }

    await connectDB();
    const item = await Gallery.findByIdAndDelete(id);
    if (!item) {
      return apiError(404, "Gallery item not found");
    }

    return apiResponse(200, null, "Gallery item deleted successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}
export const dynamic = "force-dynamic";
