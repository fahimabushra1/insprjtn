import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

/**
 * Upload a file buffer to Cloudinary
 * @param {Buffer} fileBuffer
 * @param {string} folder
 * @returns {Promise<object>} Cloudinary upload result
 */
export const uploadToCloudinary = (fileBuffer, folder = "insprjtn") => {
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
 * Delete a file from Cloudinary by public ID
 * @param {string} publicId
 * @returns {Promise<object>} Cloudinary destroy result
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
};

/**
 * Extract Cloudinary public ID from its full URL
 * @param {string} url
 * @returns {string|null} public ID or null
 */
export const getPublicIdFromUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  try {
    const parts = url.split("/image/upload/");
    if (parts.length < 2) return null;
    const pathAndVersion = parts[1]; // e.g. "v1234567/folder/public_id.jpg" or "folder/public_id.jpg"
    const pathParts = pathAndVersion.split("/");

    // Shift off version tag if it's present (like "v1624329241")
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
