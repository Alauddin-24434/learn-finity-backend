// routes/overview.route.ts
import express from "express";
import { authenticate } from "../../middleware/authenticate";
import { overviewDashboard } from "./overview.conroller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard overview APIs for admin & user
 */

/**
 * @swagger
 * /api/overviews:
 *   get:
 *     summary: Get dashboard overview (admin & user)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 */
router.get("/", authenticate, overviewDashboard);

export const dashboardRoute = router;
