import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";


// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Single storage with dynamic params
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    if (file.fieldname === "avatar" || file.fieldname === "thumbnail") {
      return {
        folder: "learning/images",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 500, height: 500, crop: "limit" }],
      };
    } else if (file.fieldname === "overviewVideo" || file.fieldname === "video") {
      return {
        folder: "learning/videos",
        resource_type: "video",
        allowed_formats: ["mp4", "mov", "avi", "mkv"],
      };
    } else {
      throw new Error("Unexpected field");
    }
  },
});

// Single multer instance
export const upload = multer({ storage });



export { cloudinary };
