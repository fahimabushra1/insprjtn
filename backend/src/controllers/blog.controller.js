import * as blogService from "../services/blog.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getBlogs = asyncHandler(async (req, res) => {
  const { page, limit, search, sort } = req.validated.query;
  const data = await blogService.getBlogs({ page, limit, search, sort });
  res.status(200).json(new ApiResponse(200, data, "Blogs retrieved successfully"));
});

export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await blogService.getBlogBySlug(req.validated.params.slug);
  res.status(200).json(new ApiResponse(200, blog, "Blog post retrieved successfully"));
});

export const createBlog = asyncHandler(async (req, res) => {
  const blog = await blogService.createBlog(req.validated.body);
  res.status(201).json(new ApiResponse(201, blog, "Blog post created successfully"));
});

export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await blogService.updateBlog(req.validated.params.id, req.validated.body);
  res.status(200).json(new ApiResponse(200, blog, "Blog post updated successfully"));
});

export const deleteBlog = asyncHandler(async (req, res) => {
  await blogService.deleteBlog(req.validated.params.id);
  res.status(200).json(new ApiResponse(200, null, "Blog post deleted successfully"));
});
