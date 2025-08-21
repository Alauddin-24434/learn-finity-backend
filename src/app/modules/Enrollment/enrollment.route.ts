// routes/enrollment.routes.ts
import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { enrollmentSchema } from "./enrollment.validation";
import { enrollmentController } from "./enrollment.controller";
import { authenticate } from "../../middleware/authenticate";

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

export const enrollmentRoutes = router;
