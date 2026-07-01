import { NextRequest } from "next/server";
import { verifyAuth } from "@/lib/backend/auth";
import { apiResponse, apiError } from "@/lib/backend/response";

export async function GET(request: NextRequest) {
  try {
    const { user } = await verifyAuth(request);
    return apiResponse(200, user, "User profile retrieved");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}
export const dynamic = "force-dynamic";
