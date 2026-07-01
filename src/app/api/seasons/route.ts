import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { TravelSeason } from "@/lib/db/models/TravelSeason.model";
import { apiResponse, apiError } from "@/lib/backend/response";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const seasons = await TravelSeason.find().sort("month").lean();
    return apiResponse(200, seasons, "Travel seasons retrieved successfully");
  } catch (error: any) {
    console.error("Travel seasons GET error:", error);
    return apiError(500, error.message || "Internal server error");
  }
}

export const dynamic = "force-dynamic";
