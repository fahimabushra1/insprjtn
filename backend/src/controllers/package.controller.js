import * as packageService from "../services/package.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getPackages = asyncHandler(async (req, res) => {
  const { page, limit, featured, search, sort } = req.validated.query;
  const data = await packageService.getPackages({ page, limit, featured, search, sort });
  res.status(200).json(new ApiResponse(200, data, "Packages retrieved"));
});

export const getFeaturedPackages = asyncHandler(async (req, res) => {
  const items = await packageService.getFeaturedPackages();
  res.status(200).json(new ApiResponse(200, items, "Featured packages retrieved"));
});

export const getPackageBySlug = asyncHandler(async (req, res) => {
  const pkg = await packageService.getPackageBySlug(req.validated.params.slug);
  res.status(200).json(new ApiResponse(200, pkg, "Package retrieved"));
});

export const createPackage = asyncHandler(async (req, res) => {
  const pkg = await packageService.createPackage(req.validated.body);
  res.status(201).json(new ApiResponse(201, pkg, "Package created"));
});

export const updatePackage = asyncHandler(async (req, res) => {
  const pkg = await packageService.updatePackage(req.validated.params.id, req.validated.body);
  res.status(200).json(new ApiResponse(200, pkg, "Package updated"));
});

export const deletePackage = asyncHandler(async (req, res) => {
  await packageService.deletePackage(req.validated.params.id);
  res.status(200).json(new ApiResponse(200, null, "Package deleted"));
});
