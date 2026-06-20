import * as authService from "../services/auth.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const register = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new ApiError(401, "Firebase token required");
  }

  const token = authHeader.split(" ")[1];
  const { name, phone } = req.validated.body;
  const user = await authService.registerUser(token, { name, phone });

  res.status(201).json(
    new ApiResponse(201, user, "Registration successful")
  );
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getUserByFirebaseUid(req.firebaseUser.uid);
  res.status(200).json(new ApiResponse(200, user, "User profile retrieved"));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateUserProfile(req.user._id, req.validated.body);
  res.status(200).json(new ApiResponse(200, user, "Profile updated successfully"));
});
