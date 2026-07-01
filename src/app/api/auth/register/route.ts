import { NextRequest } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { getFirebaseAuth } from "@/lib/backend/firebase";
import { User } from "@/lib/db/models/User.model";
import { apiResponse, apiError } from "@/lib/backend/response";
import { sanitizeObject } from "@/lib/backend/sanitize";
import { z } from "zod";

const registerBodySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional().default(""),
});

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return apiError(401, "Firebase token required");
    }

    const token = authHeader.split(" ")[1];
    const auth = getFirebaseAuth();
    if (!auth) {
      return apiError(500, "Authentication service unavailable");
    }

    await connectDB();

    let decoded;
    try {
      decoded = await auth.verifyIdToken(token);
    } catch (err: any) {
      return apiError(401, `Invalid Firebase token: ${err.message}`);
    }

    const body = await request.json();
    const parseResult = registerBodySchema.safeParse(body);
    if (!parseResult.success) {
      return apiError(400, parseResult.error.issues[0].message);
    }

    const sanitized = sanitizeObject(parseResult.data);

    let user = await User.findOne({ firebaseUid: decoded.uid });
    if (user) {
      return apiResponse(200, user, "User already registered");
    }

    const existingEmail = await User.findOne({ email: decoded.email });
    if (existingEmail) {
      return apiError(409, "Email already registered with a different account");
    }

    user = await User.create({
      firebaseUid: decoded.uid,
      name: sanitized.name,
      email: decoded.email,
      phone: sanitized.phone,
      photo: decoded.picture || "",
      role: decoded.email === "bushra.arifeen@gmail.com" ? "admin" : "customer",
    });

    return apiResponse(201, user, "Registration successful");
  } catch (error: any) {
    console.error("Auth register route error:", error);
    return apiError(500, error.message || "Internal server error");
  }
}
export const dynamic = "force-dynamic";

