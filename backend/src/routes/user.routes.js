import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken.js";
import { requireRole } from "../middlewares/requireRole.js";
import { validate } from "../middlewares/validate.js";
import {
  updateRoleSchema,
  userIdSchema,
  userListSchema,
} from "../validators/user.validator.js";

const router = Router();

// Protect all routes to admin only
router.use(verifyFirebaseToken);
router.use(requireRole("admin"));

router.get("/", validate(userListSchema), userController.getUsers);
router.patch("/:id/role", validate(updateRoleSchema), userController.updateUserRole);
router.delete("/:id", validate(userIdSchema), userController.deleteUser);

export default router;
