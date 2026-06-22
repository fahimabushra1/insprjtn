import * as contactService from "../services/contact.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getContactMessages = asyncHandler(async (req, res) => {
  const { page, limit, status, sort } = req.validated.query;
  const data = await contactService.getContactMessages({ page, limit, status, sort });
  res.status(200).json(new ApiResponse(200, data, "Contact messages retrieved successfully"));
});

export const createContactMessage = asyncHandler(async (req, res) => {
  const contact = await contactService.createContactMessage(req.validated.body);
  res.status(201).json(new ApiResponse(201, contact, "Contact message submitted successfully"));
});

export const updateContactStatus = asyncHandler(async (req, res) => {
  const { status } = req.validated.body;
  const contact = await contactService.updateContactStatus(req.validated.params.id, status);
  res.status(200).json(new ApiResponse(200, contact, `Contact message status updated to ${status}`));
});

export const deleteContactMessage = asyncHandler(async (req, res) => {
  await contactService.deleteContactMessage(req.validated.params.id);
  res.status(200).json(new ApiResponse(200, null, "Contact message deleted successfully"));
});
