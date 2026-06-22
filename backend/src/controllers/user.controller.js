import * as userService from "../services/user.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getUsers = asyncHandler(async (req, res) => {
  const { page, limit, search, sort } = req.validated.query;
  const data = await userService.getUsers({ page, limit, search, sort });
  res.status(200).json(new ApiResponse(200, data, "Users list retrieved successfully"));
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.validated.body;
  const user = await userService.updateUserRole(req.validated.params.id, role);
  res.status(200).json(new ApiResponse(200, user, `User role updated to ${role}`));
});

export const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.validated.params.id);
  res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));
});
