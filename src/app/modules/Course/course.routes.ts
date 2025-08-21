
// routes/course.routes.ts
import express from "express";
import { courseController } from "./course.controller";

import { authenticate } from "../../middleware/authenticate";
import { upload } from "../../lib/cloudinary";
import { validateRequest } from "../../middleware/validateRequest";
import { createCourseZodSchema } from "./course.validation";

const router = express.Router();

router.post("/", upload.fields([{ name: "thumbnail", maxCount: 1 },
{ name: "overviewVideo", maxCount: 1 },]), validateRequest(createCourseZodSchema), courseController.createCourse);
router.get("/", courseController.getAllCourses);
router.get("/my-courses", authenticate, courseController.getMyCourses);
router.get("/:id", authenticate, courseController.getCourseById);
router.patch("/:id", courseController.updateCourseById);
router.delete("/:id", courseController.deleteCourseById);

export const courseRoutes = router;
