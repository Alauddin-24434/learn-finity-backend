"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseRoutes = void 0;
// routes/course.routes.ts
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middleware/validateRequest");
const course_validation_1 = require("./course.validation");
const course_controller_1 = require("./course.controller");
const cloudinary_1 = require("../../lib/cloudinary");
const router = express_1.default.Router();
router.post("/", cloudinary_1.upload.single("thumbnail"), (0, validateRequest_1.validateRequest)(course_validation_1.createCourseZodSchema), course_controller_1.courseController.createCourse);
router.get("/", course_controller_1.courseController.getAllCourses);
router.get("/:id", course_controller_1.courseController.getCourseById);
router.patch("/:id", course_controller_1.courseController.updateCourseById);
router.delete("/:id", course_controller_1.courseController.deleteCourseById);
exports.courseRoutes = router;
