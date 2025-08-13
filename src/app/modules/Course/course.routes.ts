
// routes/course.routes.ts
import express from "express";
import { courseController } from "./course.controller";

import { authenticate } from "../../middleware/authenticate";
import { uploadImage } from "../../lib/cloudinary";

const router = express.Router();

router.post("/", uploadImage.single("thumbnail"),courseController.createCourse);
router.get("/", courseController.getAllCourses);
router.get("/my-courses", authenticate , courseController.getMyCourses);
router.get("/:id", courseController.getCourseById);
router.patch("/:id", courseController.updateCourseById);
router.delete("/:id", courseController.deleteCourseById);

export const courseRoutes = router;
