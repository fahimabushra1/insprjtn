import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { LegalPage } from "@/lib/db/models/LegalPage.model";
import { optionalAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";

type RouteParams = { params: Promise<{ slug: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    await connectDB();

    const legalPage = await LegalPage.findOne({ slug: slug.toLowerCase() }).lean();

    if (!legalPage) {
      return apiError(404, "Legal page not found");
    }

    // If page is not published, only allow admin to view
    if (!legalPage.isPublished) {
      const { user } = await optionalAuth(request);
      if (!user || user.role !== "admin") {
        return apiError(404, "Legal page is currently unpublished");
      }
    }

    return apiResponse(200, legalPage, "Legal page retrieved successfully");
  } catch (error: any) {
    return apiError(500, error.message || "Failed to retrieve legal page");
  }
}

export const dynamic = "force-dynamic";
