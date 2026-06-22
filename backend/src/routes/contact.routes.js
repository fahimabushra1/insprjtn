import { Router } from "express";
import * as contactController from "../controllers/contact.controller.js";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken.js";
import { requireRole } from "../middlewares/requireRole.js";
import { validate } from "../middlewares/validate.js";
import {
  createContactSchema,
  updateContactStatusSchema,
  contactIdSchema,
  contactListSchema,
} from "../validators/contact.validator.js";

const router = Router();

// Public submission route
router.post("/", validate(createContactSchema), contactController.createContactMessage);

// Admin-only management routes
router.get(
  "/",
  verifyFirebaseToken,
  requireRole("admin"),
  validate(contactListSchema),
  contactController.getContactMessages
);

router.patch(
  "/:id/status",
  verifyFirebaseToken,
  requireRole("admin"),
  validate(updateContactStatusSchema),
  contactController.updateContactStatus
);

router.delete(
  "/:id",
  verifyFirebaseToken,
  requireRole("admin"),
  validate(contactIdSchema),
  contactController.deleteContactMessage
);

export default router;
