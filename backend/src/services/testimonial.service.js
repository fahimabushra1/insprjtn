import { Testimonial } from "../models/Testimonial.model.js";
import { ApiError } from "../utils/ApiError.js";
import { sanitizeObject } from "../utils/sanitize.js";

export const getTestimonials = async ({ page, limit, sort }) => {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Testimonial.find({}).sort(sort).skip(skip).limit(limit).lean(),
    Testimonial.countDocuments({}),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const createTestimonial = async (data) => {
  const sanitized = sanitizeObject(data);
  const testimonial = await Testimonial.create(sanitized);
  return testimonial;
};

export const updateTestimonial = async (id, data) => {
  const sanitized = sanitizeObject(data);
  const testimonial = await Testimonial.findByIdAndUpdate(id, sanitized, {
    new: true,
    runValidators: true,
  });

  if (!testimonial) throw new ApiError(404, "Testimonial not found");
  return testimonial;
};

export const deleteTestimonial = async (id) => {
  const testimonial = await Testimonial.findByIdAndDelete(id);
  if (!testimonial) throw new ApiError(404, "Testimonial not found");
  return testimonial;
};
