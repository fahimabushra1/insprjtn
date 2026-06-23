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
    try {
      const result = await uploadToCloudinary(req.file.buffer, folder);
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            url: result.secure_url,
            publicId: result.public_id,
          },
          "Image uploaded successfully"
        )
      );
    } catch (error) {
      console.warn("Cloudinary upload failed or timed out. Falling back to mock URL.", error.message);
      
      if (process.env.NODE_ENV === "development") {
        // Fallback URLs based on folder name
        let mockUrl = "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80"; // default forest
        
        const folderLower = folder.toLowerCase();
        if (folderLower.includes("package")) {
          mockUrl = "https://images.unsplash.com/photo-1589553416260-178fa4159f6b?auto=format&fit=crop&w=800&q=80"; // mangrove river
        } else if (folderLower.includes("blog")) {
          mockUrl = "https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=800&q=80"; // bengal tiger
        } else if (folderLower.includes("gallery")) {
          mockUrl = "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80"; // nature background
        } else if (folderLower.includes("user") || folderLower.includes("testimonial") || folderLower.includes("profile")) {
          mockUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80"; // avatar
        }

        const mockPublicId = `mock_${folder}_${Date.now()}`;

        return res.status(200).json(
          new ApiResponse(
            200,
            {
              url: mockUrl,
              publicId: mockPublicId,
              isMock: true
            },
            "Image upload timed out/failed, returned a placeholder"
          )
        );
      }
      
      // If not in development mode, rethrow the error
      throw error;
    }
  })
);

export default router;
