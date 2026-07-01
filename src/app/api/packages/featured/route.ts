import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Package } from "@/lib/db/models/Package.model";
import { apiResponse, apiError } from "@/lib/backend/response";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "6", 10);

    const items = await Package.find({ featured: true })
      .sort("-createdAt")
      .limit(limit)
      .lean();

    return apiResponse(200, items, "Featured packages retrieved successfully");
  } catch (error: any) {
    console.error("Featured packages GET error:", error);
    return apiError(500, error.message || "Internal server error");
  }
}
export const dynamic = "force-dynamic";
