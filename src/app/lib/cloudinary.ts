import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Image storage config
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "learning/images",
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  } as any,
});

// Video storage config
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "learning/videos",
    resource_type: "video",
    allowed_formats: ["mp4", "mov", "avi", "mkv"],
  } as any,
});

// Export multer uploaders
export const uploadImage = multer({ storage: imageStorage });
export const uploadVideo = multer({ storage: videoStorage });

export { cloudinary };
