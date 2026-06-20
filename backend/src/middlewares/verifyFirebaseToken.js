import { getFirebaseAuth } from "../config/firebase.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyFirebaseToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication required");
  }

  const token = authHeader.split(" ")[1];
  const auth = getFirebaseAuth();

  if (!auth) {
    throw new ApiError(500, "Authentication service unavailable");
  }

  const decoded = await auth.verifyIdToken(token);
  const user = await User.findOne({ firebaseUid: decoded.uid });

  if (!user) {
    throw new ApiError(401, "User not found. Please register first.");
  }

  req.firebaseUser = decoded;
  req.user = user;
  next();
});

export const optionalFirebaseToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next();
  }

  try {
    const token = authHeader.split(" ")[1];
    const auth = getFirebaseAuth();
    if (auth) {
      const decoded = await auth.verifyIdToken(token);
      const user = await User.findOne({ firebaseUid: decoded.uid });
      if (user) {
        req.firebaseUser = decoded;
        req.user = user;
      }
    }
  } catch {
    // Optional auth — ignore invalid tokens
  }

  next();
});
