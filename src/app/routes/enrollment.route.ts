// routes/enrollment.routes.ts
import { Router } from "express";
import { validateRequest } from "../middleware/validateRequest";
import { enrollmentSchema } from "../validations/enrollment.validation";
import { enrollmentController } from "../controllers/enrollment.controller";
import { authenticate } from "../middleware/authenticate";

const router = Router();

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
router.post("/", authenticate, validateRequest(enrollmentSchema), enrollmentController.enrollUser);

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
router.get("/user/:userId", authenticate, enrollmentController.getEnrollmentsByUserId);

export const enrollmentRoutes = router;
