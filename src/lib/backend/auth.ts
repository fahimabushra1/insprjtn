import { NextRequest } from "next/server";
import { getFirebaseAuth } from "./firebase";
import { User } from "@/lib/db/models/User.model";
import { connectDB } from "./db";

export interface DecodedFirebaseToken {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
  [key: string]: any;
}

export interface AuthenticatedUser {
  _id: string;
  firebaseUid: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  photo?: string;
  role: "customer" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Validates request Bearer token against Firebase Auth, verifies user in DB, 
 * and optional role restrictions.
 * 
 * @param request The incoming Next.js API request.
 * @param roles Optional list of authorized roles.
 */
export async function verifyAuth(
  request: NextRequest,
  roles?: ("admin" | "customer")[]
): Promise<{ user: AuthenticatedUser; decodedToken: DecodedFirebaseToken }> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    throw new Error("401: Authorization header is missing");
  }
  if (!authHeader.startsWith("Bearer ")) {
    throw new Error("401: Authorization header must use Bearer scheme");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new Error("401: Bearer token is missing");
  }

  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("500: Authentication service unavailable");
  }

  await connectDB();

  let decodedToken: any;
  try {
    decodedToken = await auth.verifyIdToken(token);
  } catch (err: any) {
    if (err.code === "auth/id-token-expired") {
      throw new Error("401: Firebase token has expired");
    }
    throw new Error(`401: Invalid Firebase token - ${err.message}`);
  }

  const user = await User.findOne({ firebaseUid: decodedToken.uid });
  if (!user) {
    throw new Error("401: User not found. Please register first.");
  }

  if (roles && !roles.includes(user.role)) {
    throw new Error("403: Forbidden - Insufficient permissions");
  }

  return { user: user.toObject(), decodedToken };
}

/**
 * Optionally decodes the Firebase Auth Bearer token if present.
 * Does not fail if token is missing or invalid.
 */
export async function optionalAuth(
  request: NextRequest
): Promise<{ user: AuthenticatedUser | null; decodedToken: DecodedFirebaseToken | null }> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { user: null, decodedToken: null };
  }

  try {
    const token = authHeader.split(" ")[1];
    const auth = getFirebaseAuth();
    if (auth) {
      await connectDB();
      const decoded = await auth.verifyIdToken(token);
      const user = await User.findOne({ firebaseUid: decoded.uid });
      if (user) {
        return { user: user.toObject(), decodedToken: decoded };
      }
    }
  } catch {
    // Quietly ignore issues for optional auth
  }

  return { user: null, decodedToken: null };
}
export type admin = any;
