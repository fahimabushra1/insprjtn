import { NextRequest } from "next/server";
import { verifyAuth } from "@/lib/backend/auth";
import { User } from "@/lib/db/models/User.model";
import { apiResponse, apiError } from "@/lib/backend/response";
import { sanitizeObject } from "@/lib/backend/sanitize";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  photo: z.string().url("Photo must be a valid URL").or(z.string().length(0)).optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    const { user } = await verifyAuth(request);

    const body = await request.json();
    const parseResult = updateProfileSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, parseResult.error.issues[0].message);
    }

    const sanitizedUpdates = sanitizeObject(parseResult.data);

    const updatedUser = await User.findByIdAndUpdate(
      user._id as any,
      { $set: sanitizedUpdates } as any,
      { new: true, runValidators: true } as any
    );

    if (!updatedUser) {
      return apiError(404, "User not found");
    }

    return apiResponse(200, updatedUser, "Profile updated successfully");
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}
export const dynamic = "force-dynamic";

