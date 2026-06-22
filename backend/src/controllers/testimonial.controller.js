import * as testimonialService from "../services/testimonial.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getTestimonials = asyncHandler(async (req, res) => {
  const { page, limit, sort } = req.validated.query;
  const data = await testimonialService.getTestimonials({ page, limit, sort });
  res.status(200).json(new ApiResponse(200, data, "Testimonials retrieved successfully"));
});

export const createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await testimonialService.createTestimonial(req.validated.body);
  res.status(201).json(new ApiResponse(201, testimonial, "Testimonial created successfully"));
});

export const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await testimonialService.updateTestimonial(req.validated.params.id, req.validated.body);
  res.status(200).json(new ApiResponse(200, testimonial, "Testimonial updated successfully"));
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
  await testimonialService.deleteTestimonial(req.validated.params.id);
  res.status(200).json(new ApiResponse(200, null, "Testimonial deleted successfully"));
});
