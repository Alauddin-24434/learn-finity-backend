"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lessonRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authenticate_1 = require("../middleware/authenticate");
const validateRequest_1 = require("../middleware/validateRequest");
const lession_validation_1 = require("../validations/lession.validation");
const cloudinary_1 = require("../lib/cloudinary");
const lession_controller_1 = require("../controllers/lession.controller");
const router = express_1.default.Router();
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
router.post("/", authenticate_1.authenticate, cloudinary_1.upload.fields([{ name: "video", maxCount: 1 }]), (0, validateRequest_1.validateRequest)(lession_validation_1.createLessonZodSchema), lession_controller_1.lessonController.createLesson);
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
router.get("/", lession_controller_1.lessonController.getAllLessons);
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
router.get("/:id", authenticate_1.authenticate, lession_controller_1.lessonController.getLessonByCourseId);
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
router.patch("/:id/delete", authenticate_1.authenticate, lession_controller_1.lessonController.softDeleteLessonById);
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
router.patch("/:id/restore", authenticate_1.authenticate, lession_controller_1.lessonController.restoreLessonById);
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
router.patch("/progress", authenticate_1.authenticate, lession_controller_1.lessonController.updateLessonProgress);
exports.lessonRoutes = router;
