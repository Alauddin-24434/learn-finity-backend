import express from "express";
import { authenticate } from "../middleware/authenticate";
import { validateRequest } from "../middleware/validateRequest";
import { createLessonZodSchema } from "../validations/lession.validation";
import { upload } from "../lib/cloudinary";
import { lessonController } from "../controllers/lession.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Lessons
 *   description: APIs to manage lessons
 */

/**
 * @swagger
 * /api/lessons:
 *   post:
 *     summary: Create a new lesson
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               courseId:
 *                 type: string
 *               duration:
 *                 type: string
 *               video:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Lesson created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authenticate,
  upload.fields([{ name: "video", maxCount: 1 }]),
  validateRequest(createLessonZodSchema),
  lessonController.createLesson
);

/**
 * @swagger
 * /api/lessons:
 *   get:
 *     summary: Get all lessons (excluding soft deleted)
 *     tags: [Lessons]
 *     responses:
 *       200:
 *         description: List of lessons
 */
router.get("/", lessonController.getAllLessons);

/**
 * @swagger
 * /api/lessons/{id}:
 *   get:
 *     summary: Get lessons by course ID
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Lessons for the course
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", authenticate, lessonController.getLessonByCourseId);

/**
 * @swagger
 * /api/lessons/{id}/delete:
 *   patch:
 *     summary: Soft delete a lesson by ID
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lesson ID
 *     responses:
 *       204:
 *         description: Lesson soft deleted
 *       401:
 *         description: Unauthorized
 */
router.patch("/:id/delete", authenticate, lessonController.softDeleteLessonById);

/**
 * @swagger
 * /api/lessons/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted lesson by ID
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lesson ID
 *     responses:
 *       200:
 *         description: Lesson restored successfully
 *       401:
 *         description: Unauthorized
 */
router.patch("/:id/restore", authenticate, lessonController.restoreLessonById);

/**
 * @swagger
 * /api/lessons/progress:
 *   patch:
 *     summary: Update lesson progress for a user
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lessonId:
 *                 type: string
 *               courseId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lesson progress updated
 *       401:
 *         description: Unauthorized
 */
router.patch("/progress", authenticate, lessonController.updateLessonProgress);

export const lessonRoutes = router;
