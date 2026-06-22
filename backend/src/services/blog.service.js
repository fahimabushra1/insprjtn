import { Blog } from "../models/Blog.model.js";
import { ApiError } from "../utils/ApiError.js";
import { slugify } from "../utils/slugify.js";
import { sanitizeObject } from "../utils/sanitize.js";

const buildFilter = ({ search }) => {
  const filter = {};
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
      { author: { $regex: search, $options: "i" } },
    ];
  }
  return filter;
};

export const getBlogs = async ({ page, limit, search, sort }) => {
  const filter = buildFilter({ search });
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Blog.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Blog.countDocuments(filter),
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

export const getBlogBySlug = async (slug) => {
  const blog = await Blog.findOne({ slug }).lean();
  if (!blog) throw new ApiError(404, "Blog post not found");
  return blog;
};

export const createBlog = async (data) => {
  const sanitized = sanitizeObject(data);
  const slug = slugify(sanitized.title);

  const existing = await Blog.findOne({ slug });
  if (existing) {
    throw new ApiError(409, "A blog post with a similar title already exists");
  }

  const blog = await Blog.create({ ...sanitized, slug });
  return blog;
};

export const updateBlog = async (id, data) => {
  const sanitized = sanitizeObject(data);
  const update = { ...sanitized };

  if (sanitized.title) {
    update.slug = slugify(sanitized.title);
  }

  const blog = await Blog.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });

  if (!blog) throw new ApiError(404, "Blog post not found");
  return blog;
};

export const deleteBlog = async (id) => {
  const blog = await Blog.findByIdAndDelete(id);
  if (!blog) throw new ApiError(404, "Blog post not found");
  return blog;
};
