import { Router } from "express";
import * as packageController from "../controllers/package.controller.js";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken.js";
import { requireRole } from "../middlewares/requireRole.js";
import { validate } from "../middlewares/validate.js";
import {
  createPackageSchema,
  updatePackageSchema,
  packageSlugSchema,
  packageIdSchema,
  packageListSchema,
} from "../validators/package.validator.js";

const router = Router();

router.get("/", validate(packageListSchema), packageController.getPackages);
router.get("/featured", packageController.getFeaturedPackages);
router.get("/:slug", validate(packageSlugSchema), packageController.getPackageBySlug);

router.post(
  "/",
  verifyFirebaseToken,
  requireRole("admin"),
  validate(createPackageSchema),
  packageController.createPackage
);

router.patch(
  "/:id",
  verifyFirebaseToken,
  requireRole("admin"),
  validate(updatePackageSchema),
  packageController.updatePackage
);

router.delete(
  "/:id",
  verifyFirebaseToken,
  requireRole("admin"),
  validate(packageIdSchema),
  packageController.deletePackage
);

export default router;
