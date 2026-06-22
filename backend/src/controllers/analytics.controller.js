import * as analyticsService from "../services/analytics.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAdminStats = asyncHandler(async (req, res) => {
  const stats = await analyticsService.getAdminStats();
  res.status(200).json(new ApiResponse(200, stats, "Admin analytics retrieved successfully"));
});
