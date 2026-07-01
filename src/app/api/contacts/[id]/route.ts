import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Contact } from "@/lib/db/models/Contact.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import mongoose from "mongoose";
import { z } from "zod";

const updateContactStatusSchema = z.object({
  status: z.enum(["pending", "read", "resolved"]),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Admin only
    await verifyAuth(request, ["admin"]);
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(400, "Invalid contact ID");
    }

    await connectDB();
    const contact = await Contact.findById(id).lean();

    if (!contact) {
      return apiError(404, "Contact message not found");
    }

    return apiResponse(200, contact, "Contact message retrieved successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    // Admin only
    await verifyAuth(request, ["admin"]);
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(400, "Invalid contact ID");
    }

    const body = await request.json();
    const parseResult = updateContactStatusSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, parseResult.error.issues[0].message);
    }

    await connectDB();
    const contact = await Contact.findByIdAndUpdate(
      id,
      { $set: { status: parseResult.data.status } },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return apiError(404, "Contact message not found");
    }

    return apiResponse(200, contact, "Contact status updated successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Admin only
    await verifyAuth(request, ["admin"]);
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(400, "Invalid contact ID");
    }

    await connectDB();
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return apiError(404, "Contact message not found");
    }

    return apiResponse(200, null, "Contact message deleted successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}
export const dynamic = "force-dynamic";

