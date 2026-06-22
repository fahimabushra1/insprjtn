import { Router } from "express";
import * as galleryController from "../controllers/gallery.controller.js";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken.js";
import { requireRole } from "../middlewares/requireRole.js";
import { validate } from "../middlewares/validate.js";
import {
  createGallerySchema,
  galleryIdSchema,
  galleryListSchema,
} from "../validators/gallery.validator.js";

const router = Router();

router.get("/", validate(galleryListSchema), galleryController.getGalleryItems);

router.post(
  "/",
  verifyFirebaseToken,
  requireRole("admin"),
  validate(createGallerySchema),
  galleryController.createGalleryItem
);

router.delete(
  "/:id",
  verifyFirebaseToken,
  requireRole("admin"),
  validate(galleryIdSchema),
  galleryController.deleteGalleryItem
);

export default router;
