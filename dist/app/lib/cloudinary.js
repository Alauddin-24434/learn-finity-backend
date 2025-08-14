"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = exports.upload = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
// Cloudinary config
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Single storage with dynamic params
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: (req, file) => {
        if (file.fieldname === "avatar" || file.fieldname === "thumbnail") {
            return {
                folder: "learning/images",
                resource_type: "image",
                allowed_formats: ["jpg", "jpeg", "png", "webp"],
                transformation: [{ width: 500, height: 500, crop: "limit" }],
            };
        }
        else if (file.fieldname === "overviewVideo" || file.fieldname === "video") {
            return {
                folder: "learning/videos",
                resource_type: "video",
                allowed_formats: ["mp4", "mov", "avi", "mkv"],
            };
        }
        else {
            throw new Error("Unexpected field");
        }
    },
});
// Single multer instance
exports.upload = (0, multer_1.default)({ storage });
