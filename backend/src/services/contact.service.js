import { Contact } from "../models/Contact.model.js";
import { ApiError } from "../utils/ApiError.js";
import { sanitizeObject } from "../utils/sanitize.js";

export const getContactMessages = async ({ page, limit, status, sort }) => {
  const filter = {};
  if (status) {
    filter.status = status;
  }
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Contact.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Contact.countDocuments(filter),
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

export const createContactMessage = async (data) => {
  const sanitized = sanitizeObject(data);
  const contact = await Contact.create({ ...sanitized, status: "pending" });
  return contact;
};

export const updateContactStatus = async (id, status) => {
  const contact = await Contact.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );

  if (!contact) throw new ApiError(404, "Contact message not found");
  return contact;
};

export const deleteContactMessage = async (id) => {
  const contact = await Contact.findByIdAndDelete(id);
  if (!contact) throw new ApiError(404, "Contact message not found");
  return contact;
};
