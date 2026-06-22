import { Router } from "express";
import * as testimonialController from "../controllers/testimonial.controller.js";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken.js";
import { requireRole } from "../middlewares/requireRole.js";
import { validate } from "../middlewares/validate.js";
import {
  createTestimonialSchema,
  updateTestimonialSchema,
  testimonialIdSchema,
  testimonialListSchema,
} from "../validators/testimonial.validator.js";

const router = Router();

router.get("/", validate(testimonialListSchema), testimonialController.getTestimonials);

router.post(
  "/",
  verifyFirebaseToken,
  requireRole("admin"),
  validate(createTestimonialSchema),
  testimonialController.createTestimonial
);

router.patch(
  "/:id",
  verifyFirebaseToken,
  requireRole("admin"),
  validate(updateTestimonialSchema),
  testimonialController.updateTestimonial
);

router.delete(
  "/:id",
  verifyFirebaseToken,
  requireRole("admin"),
  validate(testimonialIdSchema),
  testimonialController.deleteTestimonial
);

export default router;
