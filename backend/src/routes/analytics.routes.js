import { Router } from "express";
import * as analyticsController from "../controllers/analytics.controller.js";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken.js";
import { requireRole } from "../middlewares/requireRole.js";

const router = Router();

// Protect all routes to admin only
router.use(verifyFirebaseToken);
router.use(requireRole("admin"));

router.get("/", analyticsController.getAdminStats);

export default router;
