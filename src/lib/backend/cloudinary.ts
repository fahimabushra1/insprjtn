import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file buffer directly to Cloudinary.
 * 
 * @param fileBuffer The file buffer to upload.
 * @param folder The folder to store the image in Cloudinary.
 */
export const uploadToCloudinary = (fileBuffer: Buffer, folder = "insprjtn"): Promise<any> => {
  return new Promise((resolve, reject) => {
    let active = true;
    const timeoutId = setTimeout(() => {
      if (active) {
        active = false;
        reject(new Error("Cloudinary upload request timed out after 8000ms"));
      }
    }, 8000);

    try {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          clearTimeout(timeoutId);
          if (!active) return;
          active = false;
          if (error) return reject(error);
          resolve(result);
        }
      );

      uploadStream.on("error", (err) => {
        clearTimeout(timeoutId);
        if (!active) return;
        active = false;
        reject(err);
      });

      uploadStream.end(fileBuffer);
    } catch (err) {
      clearTimeout(timeoutId);
      if (!active) return;
      active = false;
      reject(err);
    }
  });
};

/**
 * Deletes a file from Cloudinary using its public ID.
 * 
 * @param publicId Public ID of the image on Cloudinary.
 */
export const deleteFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
};

/**
 * Extracts the public ID from a Cloudinary URL.
 * 
 * @param url Cloudinary secure image URL.
 */
export const getPublicIdFromUrl = (url: string): string | null => {
  if (!url || typeof url !== "string") return null;
  try {
    const parts = url.split("/image/upload/");
    if (parts.length < 2) return null;
    const pathAndVersion = parts[1];
    const pathParts = pathAndVersion.split("/");

    // Shift off version tag (e.g. "v1624329241") if present
    if (pathParts[0].match(/^v\d+$/)) {
      pathParts.shift();
    }

    const fullPath = pathParts.join("/");
    const dotIndex = fullPath.lastIndexOf(".");
    return dotIndex === -1 ? fullPath : fullPath.substring(0, dotIndex);
  } catch (e) {
    console.error("Error parsing Cloudinary URL public ID:", e);
    return null;
  }
};
