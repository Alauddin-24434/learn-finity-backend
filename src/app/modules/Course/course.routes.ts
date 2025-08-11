
// routes/course.routes.ts
import express from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { createCourseZodSchema } from "./course.validation";
import { courseController } from "./course.controller";
import { upload } from "../../lib/cloudinary";
import { authenticate } from "../../middleware/authenticate";

const router = express.Router();

router.post("/", upload.single("thumbnail"),courseController.createCourse);
router.get("/", courseController.getAllCourses);
router.get("/my-courses", authenticate , courseController.getMyCourses);
router.get("/:id", courseController.getCourseById);
router.patch("/:id", courseController.updateCourseById);
router.delete("/:id", courseController.deleteCourseById);

export const courseRoutes = router;
