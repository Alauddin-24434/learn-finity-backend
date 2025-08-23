"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollmentRoutes = void 0;
// routes/enrollment.routes.ts
const express_1 = require("express");
const validateRequest_1 = require("../middleware/validateRequest");
const enrollment_validation_1 = require("../validations/enrollment.validation");
const enrollment_controller_1 = require("../controllers/enrollment.controller");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: APIs to handle course enrollments
 */
/**
 * @swagger
 * /api/enrollments:
 *   post:
 *     summary: Enroll a user in a course
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 */
router.post("/", authenticate_1.authenticate, (0, validateRequest_1.validateRequest)(enrollment_validation_1.enrollmentSchema), enrollment_controller_1.enrollmentController.enrollUser);
/**
 * @swagger
 * /api/enrollments/user/{userId}:
 *   get:
 *     summary: Get all enrollments of a user by user ID
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of enrollments
 */
router.get("/user/:userId", authenticate_1.authenticate, enrollment_controller_1.enrollmentController.getEnrollmentsByUserId);
exports.enrollmentRoutes = router;
