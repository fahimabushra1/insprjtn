import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Route } from "@/lib/db/models/Route.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import { sanitizeObject } from "@/lib/backend/sanitize";
import mongoose from "mongoose";
import { z } from "zod";

const updateRouteSchema = z.object({
  title: z.string().min(2).max(100).optional(),
  startPlace: z.string().min(1).optional(),
  endPlace: z.string().min(1).optional(),
  distance: z.string().optional(),
  estimatedTime: z.string().optional(),
  coordinates: z.array(z.array(z.number())).optional(),
  transportType: z.enum(["boat", "bus", "walk", "car"]).optional(),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await verifyAuth(request, ["admin"]);
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(400, "Invalid route ID format");
    }

    const body = await request.json();
    const parseResult = updateRouteSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, parseResult.error.issues[0].message);
    }

    await connectDB();
    const sanitized = sanitizeObject(parseResult.data);

    const route = await Route.findByIdAndUpdate(
      id,
      { $set: sanitized },
      { new: true, runValidators: true }
    );

    if (!route) {
      return apiError(404, "Route not found");
    }

    return apiResponse(200, route, "Route updated successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await verifyAuth(request, ["admin"]);
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(400, "Invalid route ID format");
    }

    await connectDB();
    const route = await Route.findByIdAndDelete(id);

    if (!route) {
      return apiError(404, "Route not found");
    }

    return apiResponse(200, null, "Route deleted successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}

export const dynamic = "force-dynamic";
