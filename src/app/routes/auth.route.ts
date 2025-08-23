import { Router } from "express"
import { AuthController } from "../controllers/auth.controller"
import { validateRequest } from "../middleware/validateRequest"
import { loginValidationSchema, registerValidationSchema } from "../validations/auth.validation"
import { upload } from "../lib/cloudinary"

const router = Router()

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               avatar: { type: string, format: binary }
 *     responses:
 *       201: { description: User registered successfully }
 *       400: { description: Validation error }
 */
router.post(
  "/signup",
  upload.single("avatar"),                     // Handle optional avatar upload
  validateRequest(registerValidationSchema),   // Validate request body
  AuthController.register                      // Call controller
)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user and get access/refresh tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: User logged in successfully }
 *       400: { description: Validation error or invalid credentials }
 */
router.post(
  "/login",
  validateRequest(loginValidationSchema),   // Validate credentials
  AuthController.login                      // Call controller
)

/**
 * @swagger
 * /api/auth/refresh-token:
 *   get:
 *     summary: Refresh access token using refresh token
 *     tags: [Auth]
 *     responses:
 *       200: { description: Access token refreshed successfully }
 *       401: { description: Invalid or expired refresh token }
 */
router.post("/refresh-token", AuthController.refreshAccessToken)

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout a user and clear refresh token
 *     tags: [Auth]
 *     responses:
 *       200: { description: User logged out successfully }
 *       401: { description: User not authenticated }
 */
router.post("/logout", AuthController.logout)

export const authRoutes = router
