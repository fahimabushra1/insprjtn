import { Router } from "express";
import multer from "multer";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new ApiError(400, "Only image files are allowed!"), false);
    }
  },
});

router.post(
  "/",
  verifyFirebaseToken,
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ApiError(400, "Please upload an image file");
    }

    // Determine folder based on request query/role
    const folder = req.query.folder || "insprjtn";
    
    // Upload buffer to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, folder);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          url: result.secure_url,
          publicId: result.public_id,
        },
        "Image uploaded successfully"
      )
    );
  })
);

export default router;
