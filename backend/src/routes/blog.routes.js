import { Router } from "express";
import * as blogController from "../controllers/blog.controller.js";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken.js";
import { requireRole } from "../middlewares/requireRole.js";
import { validate } from "../middlewares/validate.js";
import {
  createBlogSchema,
  updateBlogSchema,
  blogSlugSchema,
  blogIdSchema,
  blogListSchema,
} from "../validators/blog.validator.js";

const router = Router();

router.get("/", validate(blogListSchema), blogController.getBlogs);
router.get("/:slug", validate(blogSlugSchema), blogController.getBlogBySlug);

router.post(
  "/",
  verifyFirebaseToken,
  requireRole("admin"),
  validate(createBlogSchema),
  blogController.createBlog
);

router.patch(
  "/:id",
  verifyFirebaseToken,
  requireRole("admin"),
  validate(updateBlogSchema),
  blogController.updateBlog
);

router.delete(
  "/:id",
  verifyFirebaseToken,
  requireRole("admin"),
  validate(blogIdSchema),
  blogController.deleteBlog
);

export default router;
