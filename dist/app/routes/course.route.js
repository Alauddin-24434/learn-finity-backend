"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const course_controller_1 = require("../controllers/course.controller");
const authenticate_1 = require("../middleware/authenticate");
const cloudinary_1 = require("../lib/cloudinary");
const validateRequest_1 = require("../middleware/validateRequest");
const course_validation_1 = require("../validations/course.validation");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: APIs to manage courses
 */
/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 */
router.post("/", authenticate_1.authenticate, cloudinary_1.upload.fields([{ name: "thumbnail", maxCount: 1 }, { name: "overviewVideo", maxCount: 1 }]), (0, validateRequest_1.validateRequest)(course_validation_1.createCourseZodSchema), course_controller_1.courseController.createCourse);
/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Search by course title or description
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of courses per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sorting order (price-asc, price-desc)
 *     responses:
 *       200:
 *         description: List of courses
 */
router.get("/", course_controller_1.courseController.getAllCourses);
/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 */
router.get("/:id", authenticate_1.authenticate, course_controller_1.courseController.getCourseById);
/**
 * @swagger
 * /api/courses/{id}:
 *   patch:
 *     summary: Update course by ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 */
router.patch("/:id", authenticate_1.authenticate, course_controller_1.courseController.updateCourseById);
/**
 * @swagger
 * /api/courses/author/{authorId}:
 *   get:
 *     summary: Get courses by author ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the author
 *     responses:
 *       200:
 *         description: List of courses by author
 */
router.get("/author/:authorId", authenticate_1.authenticate, course_controller_1.courseController.getCoursesByAuthor);
/**
 * @swagger
 * /api/courses/{id}/delete:
 *   patch:
 *     summary: Soft delete a course by ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 */
router.patch("/:id/delete", authenticate_1.authenticate, course_controller_1.courseController.softDeleteCourseById);
/**
 * @swagger
 * /api/courses/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted course by ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 */
router.patch("/:id/restore", authenticate_1.authenticate, course_controller_1.courseController.restoreCourseById);
exports.courseRoutes = router;
