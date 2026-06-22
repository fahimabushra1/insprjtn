import * as galleryService from "../services/gallery.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getGalleryItems = asyncHandler(async (req, res) => {
  const { page, limit, sort } = req.validated.query;
  const data = await galleryService.getGalleryItems({ page, limit, sort });
  res.status(200).json(new ApiResponse(200, data, "Gallery items retrieved successfully"));
});

export const createGalleryItem = asyncHandler(async (req, res) => {
  const item = await galleryService.createGalleryItem(req.validated.body);
  res.status(201).json(new ApiResponse(201, item, "Gallery item created successfully"));
});

export const deleteGalleryItem = asyncHandler(async (req, res) => {
  await galleryService.deleteGalleryItem(req.validated.params.id);
  res.status(200).json(new ApiResponse(200, null, "Gallery item deleted successfully"));
});
