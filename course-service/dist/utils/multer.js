"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinnary_1 = __importDefault(require("../config/cloudinnary"));
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinnary_1.default,
    params: async (req, file) => {
        return {
            folder: "learnfinity/courses", // folder name in Cloudinary
            resource_type: "auto", // auto-detect image/video
            public_id: `${Date.now()}-${file.originalname}`,
        };
    },
});
exports.upload = (0, multer_1.default)({ storage });
//# sourceMappingURL=multer.js.map