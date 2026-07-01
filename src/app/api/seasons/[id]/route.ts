import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { TravelSeason } from "@/lib/db/models/TravelSeason.model";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";
import { sanitizeObject } from "@/lib/backend/sanitize";
import mongoose from "mongoose";
import { z } from "zod";

const updateSeasonSchema = z.object({
  temperature: z.string().optional(),
  humidity: z.string().optional(),
  rainfall: z.string().optional(),
  riverCondition: z.string().optional(),
  weather: z.string().optional(),
  tourRecommendation: z.string().optional(),
  birdWatching: z.number().min(1).max(5).optional(),
  tigerActivity: z.number().min(1).max(5).optional(),
  photography: z.number().min(1).max(5).optional(),
  crowdLevel: z.string().optional(),
  mosquitoLevel: z.string().optional(),
  forestCondition: z.string().optional(),
  recommendedClothing: z.string().optional(),
  recommendedEquipment: z.string().optional(),
  summary: z.string().optional(),
  bestTimeScore: z.number().min(1).max(5).optional(),
  bestTimeReason: z.string().optional(),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await verifyAuth(request, ["admin"]);
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiError(400, "Invalid season ID");
    }

    const body = await request.json();
    const parseResult = updateSeasonSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, parseResult.error.issues[0].message);
    }

    await connectDB();
    const sanitized = sanitizeObject(parseResult.data);

    const season = await TravelSeason.findByIdAndUpdate(
      id,
      { $set: sanitized },
      { new: true, runValidators: true }
    );

    if (!season) {
      return apiError(404, "Travel season record not found");
    }

    return apiResponse(200, season, "Travel season details updated successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}

export const dynamic = "force-dynamic";
