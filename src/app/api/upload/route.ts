import { NextRequest } from "next/server";
import { verifyAuth } from "@/lib/backend/auth";
import { uploadToCloudinary } from "@/lib/backend/cloudinary";
import { apiResponse, apiError } from "@/lib/backend/response";

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    await verifyAuth(request);

    const formData = await request.formData();
    const file = formData.get("image") as File | null;
    const folder = (formData.get("folder") as string) || "insprjtn";

    if (!file) {
      return apiError(400, "Please upload an image file");
    }

    if (!file.type.startsWith("image/")) {
      return apiError(400, "Only image files are allowed!");
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    try {
      const result = await uploadToCloudinary(buffer, folder);
      return apiResponse(
        200,
        {
          url: result.secure_url,
          publicId: result.public_id,
        },
        "Image uploaded successfully"
      );
    } catch (error: any) {
      console.warn("Cloudinary upload failed. Falling back to mock URL in development.", error.message);

      if (process.env.NODE_ENV === "development") {
        let mockUrl = "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80";
        const folderLower = folder.toLowerCase();
        
        if (folderLower.includes("package")) {
          mockUrl = "https://images.unsplash.com/photo-1589553416260-178fa4159f6b?auto=format&fit=crop&w=800&q=80";
        } else if (folderLower.includes("blog")) {
          mockUrl = "https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=800&q=80";
        } else if (folderLower.includes("gallery")) {
          mockUrl = "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80";
        } else if (
          folderLower.includes("user") ||
          folderLower.includes("testimonial") ||
          folderLower.includes("profile")
        ) {
          mockUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80";
        }

        const mockPublicId = `mock_${folder}_${Date.now()}`;
        return apiResponse(
          200,
          {
            url: mockUrl,
            publicId: mockPublicId,
            isMock: true,
          },
          "Image upload failed, fallback placeholder returned in dev mode"
        );
      }

      return apiError(500, error.message || "Failed to upload image to Cloudinary");
    }
  } catch (error: any) {
    const [statusStr, message] = error.message.split(": ");
    const status = parseInt(statusStr) || 500;
    return apiError(status, message || error.message);
  }
}
export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow enough execution time for Cloudinary uploads if required
