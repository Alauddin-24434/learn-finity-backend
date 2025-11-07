import express, { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { courseController } from "../controllers/course.controllers";
import { authorize } from "../middlewares/authorize";
import { verifyCloudinarySignature } from "../middlewares/verifySignature";

const router :Router= express.Router();

router.post("/courses", verifyCloudinarySignature,  courseController.createCourse);

router.post("/courses/categories",  courseController.createCourseCategory);



router.get("/", courseController.getAllCourses);


// router.get("/:id",  courseController.getCourseById);

// router.patch("/:id", authenticate, courseController.updateCourseById);


// router.get("/author/:authorId", authenticate, courseController.getCoursesByAuthor);



// router.delete("/:id/delete", authenticate, courseController.softDeleteCourseById);


// router.patch("/:id/restore", authenticate, courseController.restoreCourseById);

export const courseRoutes = router;
