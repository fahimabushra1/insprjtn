import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Route } from "@/lib/db/models/Route.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import { sanitizeObject } from "@/lib/backend/sanitize";
import { z } from "zod";

const createRouteSchema = z.object({
  title: z.string().min(2).max(100),
  startPlace: z.string().min(1),
  endPlace: z.string().min(1),
  distance: z.string().optional().default(""),
  estimatedTime: z.string().optional().default(""),
  coordinates: z.array(z.array(z.number())),
  transportType: z.enum(["boat", "bus", "walk", "car"]),
});

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const routes = await Route.find().lean();
    return apiResponse(200, routes, "Routes retrieved successfully");
  } catch (error: any) {
    console.error("Routes GET error:", error);
    return apiError(500, error.message || "Internal server error");
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAuth(request, ["admin"]);
    const body = await request.json();
    const parseResult = createRouteSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, parseResult.error.issues[0].message);
    }

    await connectDB();
    const sanitized = sanitizeObject(parseResult.data);
    const route = await Route.create(sanitized);

    return apiResponse(201, route, "Route created successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}

export const dynamic = "force-dynamic";
