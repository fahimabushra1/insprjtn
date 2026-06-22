import { Gallery } from "../models/Gallery.model.js";
import { ApiError } from "../utils/ApiError.js";
import { sanitizeObject } from "../utils/sanitize.js";

export const getGalleryItems = async ({ page, limit, sort }) => {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Gallery.find({}).sort(sort).skip(skip).limit(limit).lean(),
    Gallery.countDocuments({}),
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

export const createGalleryItem = async (data) => {
  const sanitized = sanitizeObject(data);
  const item = await Gallery.create(sanitized);
  return item;
};

export const deleteGalleryItem = async (id) => {
  const item = await Gallery.findByIdAndDelete(id);
  if (!item) throw new ApiError(404, "Gallery item not found");
  return item;
};
