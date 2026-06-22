import { Router } from "express";
import authRoutes from "./auth.routes.js";
import packageRoutes from "./package.routes.js";
import bookingRoutes from "./booking.routes.js";
import paymentRoutes from "./payment.routes.js";
import blogRoutes from "./blog.routes.js";
import galleryRoutes from "./gallery.routes.js";
import testimonialRoutes from "./testimonial.routes.js";
import contactRoutes from "./contact.routes.js";
import uploadRoutes from "./upload.routes.js";
import userRoutes from "./user.routes.js";
import analyticsRoutes from "./analytics.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

router.use("/auth", authRoutes);
router.use("/packages", packageRoutes);
router.use("/bookings", bookingRoutes);
router.use("/payments", paymentRoutes);
router.use("/blogs", blogRoutes);
router.use("/gallery", galleryRoutes);
router.use("/testimonials", testimonialRoutes);
router.use("/contacts", contactRoutes);
router.use("/upload", uploadRoutes);
router.use("/users", userRoutes);
router.use("/analytics", analyticsRoutes);

export default router;
