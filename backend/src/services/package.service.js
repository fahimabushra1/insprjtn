import { Package } from "../models/Package.model.js";
import { ApiError } from "../utils/ApiError.js";
import { slugify } from "../utils/slugify.js";
import { sanitizeObject } from "../utils/sanitize.js";

const buildFilter = ({ featured, search }) => {
  const filter = {};
  if (featured === "true") filter.featured = true;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }
  return filter;
};

export const getPackages = async ({ page, limit, featured, search, sort }) => {
  const filter = buildFilter({ featured, search });
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Package.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Package.countDocuments(filter),
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

export const getFeaturedPackages = async (limit = 6) => {
  return Package.find({ featured: true })
    .sort("-createdAt")
    .limit(limit)
    .lean();
};

export const getPackageBySlug = async (slug) => {
  const pkg = await Package.findOne({ slug }).lean();
  if (!pkg) throw new ApiError(404, "Package not found");
  return pkg;
};

export const createPackage = async (data) => {
  const sanitized = sanitizeObject(data);
  const slug = slugify(sanitized.title);

  const existing = await Package.findOne({ slug });
  if (existing) {
    throw new ApiError(409, "A package with a similar title already exists");
  }

  const pkg = await Package.create({ ...sanitized, slug });
  return pkg;
};

export const updatePackage = async (id, data) => {
  const sanitized = sanitizeObject(data);
  const update = { ...sanitized };

  if (sanitized.title) {
    update.slug = slugify(sanitized.title);
  }

  const pkg = await Package.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });

  if (!pkg) throw new ApiError(404, "Package not found");
  return pkg;
};

export const deletePackage = async (id) => {
  const pkg = await Package.findByIdAndDelete(id);
  if (!pkg) throw new ApiError(404, "Package not found");
  return pkg;
};
